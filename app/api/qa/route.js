import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { streamLLM } from '@/lib/llm';
import { query } from '@/lib/db';

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { question } = await request.json();
  if (!question?.trim()) return NextResponse.json({ error: 'Câu hỏi không được để trống' }, { status: 400 });

  // 1. Search matching FAQs
  const faqLike = `%${question.substring(0, 50)}%`;
  const faqRes = await query(
    `SELECT question, answer FROM faqs 
     WHERE is_active = true 
       AND (question ILIKE $1 OR answer ILIKE $1)
     LIMIT 5`,
    [faqLike]
  );

  // 2. Search matching general knowledge documents
  const knowledgeRes = await query(
    `SELECT title, content FROM knowledge_documents 
     WHERE is_active = true 
       AND (title ILIKE $1 OR content ILIKE $1)
     LIMIT 3`,
    [faqLike]
  );

  // 3. Build context
  const lines = [];
  
  if (faqRes.rows.length > 0) {
    lines.push('CÂU HỎI THƯỜNG GẶP (FAQ) LIÊN QUAN:');
    for (const item of faqRes.rows) {
      lines.push(`Hỏi: ${item.question}`);
      lines.push(`Đáp: ${item.answer}\n`);
    }
  }

  if (knowledgeRes.rows.length > 0) {
    lines.push('TÀI LIỆU KIẾN THỨC NỘI BỘ LIÊN QUAN:');
    for (const item of knowledgeRes.rows) {
      lines.push(`--- ${item.title} ---`);
      lines.push(`${item.content}\n`);
    }
  }

  const combinedContext = lines.join('\n') || 'Chưa có dữ liệu FAQ hay tài liệu nội bộ nào liên quan trực tiếp.';

  const systemPrompt = `Bạn là trợ lý hỗ trợ nhân sự kinh doanh của Công ty TNHH Trà Dược Việt Nam.

NHIỆM VỤ: Trả lời câu hỏi dựa trên DỮ LIỆU NỘI BỘ bên dưới. Nếu câu hỏi không thể trả lời dựa trên dữ liệu này, hãy nói rõ "Thông tin này chưa có trong cơ sở dữ liệu nội bộ" và gợi ý liên hệ bộ phận liên quan.

QUY TẮC:
- Trả lời ngắn gọn, rõ ràng, dễ hiểu
- Ưu tiên thông tin chính xác từ dữ liệu nội bộ
- Nếu câu hỏi liên quan đến nhiều mục, tổng hợp đầy đủ
- Ngôn ngữ thân thiện, chuyên nghiệp
- Có thể gợi ý câu trả lời sẵn sàng để nhân sự dùng trả lời khách hàng (nếu phù hợp)

DỮ LIỆU NỘI BỘ:
${combinedContext}`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        await streamLLM({
          systemPrompt,
          userPrompt: question,
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
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
  });
}
