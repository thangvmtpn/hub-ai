import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { readFileSync } from 'fs';
import { join } from 'path';
import { streamLLM } from '@/lib/llm';

function loadFaq() {
  try { return JSON.parse(readFileSync(join(process.cwd(), 'faq.json'), 'utf-8')); } catch { return []; }
}

function buildFaqContext(items) {
  if (!items.length) return 'Chưa có dữ liệu FAQ.';
  const byCategory = {};
  for (const item of items) {
    if (!byCategory[item.category]) byCategory[item.category] = [];
    byCategory[item.category].push(item);
  }
  const lines = [];
  for (const [cat, catItems] of Object.entries(byCategory)) {
    lines.push(`\n## ${cat}`);
    for (const item of catItems) {
      lines.push(`\nCâu hỏi: ${item.question}`);
      lines.push(`Trả lời: ${item.answer}`);
    }
  }
  return lines.join('\n');
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { question } = await request.json();
  if (!question?.trim()) return NextResponse.json({ error: 'Câu hỏi không được để trống' }, { status: 400 });

  const faqItems = loadFaq();
  const faqContext = buildFaqContext(faqItems);

  const systemPrompt = `Bạn là trợ lý hỗ trợ nhân sự kinh doanh của Công ty TNHH Trà Dược Việt Nam.

NHIỆM VỤ: Trả lời câu hỏi dựa trên DỮ LIỆU NỘI BỘ bên dưới. Nếu câu hỏi không có trong dữ liệu, hãy nói rõ "Thông tin này chưa có trong cơ sở dữ liệu nội bộ" và gợi ý liên hệ bộ phận liên quan.

QUY TẮC:
- Trả lời ngắn gọn, rõ ràng, dễ hiểu
- Ưu tiên thông tin chính xác từ dữ liệu nội bộ
- Nếu câu hỏi liên quan đến nhiều mục, tổng hợp đầy đủ
- Ngôn ngữ thân thiện, chuyên nghiệp
- Có thể gợi ý câu trả lời sẵn sàng để nhân sự dùng trả lời khách hàng (nếu phù hợp)

DỮ LIỆU NỘI BỘ:
${faqContext}`;

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
