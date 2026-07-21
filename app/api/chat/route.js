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
    const training = getAgentTraining(agentId);

    // Call LLM with streaming (Claude with OpenAI fallback)
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await streamLLM({
            systemPrompt: training?.systemPrompt || '',
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
