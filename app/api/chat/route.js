import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAgentById, buildPrompt } from '@/lib/agents';
import { getAgentTraining } from '@/lib/training';
import { streamLLM } from '@/lib/llm';

export async function POST(request) {
  // Auth check
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { agentId, formData } = await request.json();

    // Validate agent
    const agent = getAgentById(agentId);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Department access check
    if (session.department !== 'all' && session.department !== agent.department) {
      return NextResponse.json({ error: 'Access denied for this department' }, { status: 403 });
    }

    // Build prompt
    const prompt = buildPrompt(agent, formData);
    
    // Fetch system prompt and relevant knowledge from database
    const { query: dbQuery } = require('@/lib/db');
    const trainingRes = await dbQuery('SELECT system_prompt FROM agent_training WHERE agent_id = $1', [agentId]);
    const systemPromptBase = trainingRes.rows[0]?.system_prompt || '';

    // Collect all text from formData for searching
    const searchTerms = Object.values(formData || {})
      .filter(v => typeof v === 'string' && v.trim().length > 2)
      .join(' ');
    
    let knowledgeContext = '';
    if (searchTerms.trim()) {
      const searchTermLike = `%${searchTerms.substring(0, 50)}%`;
      const knowledgeRes = await dbQuery(
        `SELECT title, content FROM knowledge_documents 
         WHERE is_active = true 
           AND (title ILIKE $1 OR content ILIKE $1)
         LIMIT 3`,
        [searchTermLike]
      );
      if (knowledgeRes.rows.length > 0) {
        knowledgeContext = "\n\nDỮ LIỆU KIẾN THỨC NỘI BỘ LIÊN QUAN ĐỂ THAM KHẢO:\n" + 
          knowledgeRes.rows.map(r => `[Tài liệu: ${r.title}]\n${r.content}`).join('\n\n');
      }
    }

    const finalSystemPrompt = `${systemPromptBase}\n${knowledgeContext}`.trim();

    // Call LLM with streaming (Claude with OpenAI fallback)
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await streamLLM({
            systemPrompt: finalSystemPrompt,
            userPrompt: prompt,
            onChunk(chunk) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
            },
            onComplete() {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            },
            onError(err) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`));
              controller.close();
            }
          });
        } catch (err) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
