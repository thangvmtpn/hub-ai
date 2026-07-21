import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAgentById, buildPrompt } from '@/lib/agents';
import { getAgentTraining } from '@/lib/training';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Bạn là chuyên gia thiết kế thuyết trình. Khi được yêu cầu tạo slide, hãy tạo ra một file HTML hoàn chỉnh, đẹp mắt và chuyên nghiệp với các yêu cầu sau:

1. Tự chứa hoàn toàn (không cần CDN, dùng Google Fonts qua @import trong <style>)
2. Dùng Google Fonts (Inter, Poppins hoặc Be Vietnam Pro cho tiếng Việt)
3. Thiết kế đẹp với gradient, typography tốt, spacing cân đối
4. Có navigation: nút Trước/Tiếp, phím mũi tên, click để chuyển slide
5. Hiển thị số slide và progress bar
6. Mỗi slide là một section riêng, chỉ hiện 1 slide tại 1 thời điểm
7. Slide đầu tiên là trang bìa nổi bật
8. Dùng SVG shapes/icons thay ảnh (không dùng <img> từ internet)
9. Animation chuyển slide mượt mà (fade hoặc slide)
10. Responsive, hoạt động tốt trong iframe
11. Màu sắc nhất quán, có thể dùng dark theme sang trọng hoặc light theme hiện đại
12. Chỉ trả về code HTML thuần túy, không giải thích thêm, không bọc trong markdown code block`;

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { agentId, formData } = await request.json();

    const agent = getAgentById(agentId);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    if (session.department !== 'all' && session.department !== agent.department) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const userPrompt = buildPrompt(agent, formData);
    const training = getAgentTraining(agentId);

    const systemContent = training?.systemPrompt
      ? `${training.systemPrompt}\n\n${SYSTEM_PROMPT}`
      : SYSTEM_PROMPT;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 16000,
      system: systemContent,
      messages: [{ role: 'user', content: userPrompt }],
    });

    let html = response.content[0]?.text || '';

    // Strip markdown code fences if Claude added them
    html = html.replace(/^```(?:html)?\s*/i, '').replace(/\s*```\s*$/, '').trim();

    if (!html.includes('<html') && !html.includes('<!DOCTYPE')) {
      return NextResponse.json({ error: 'Claude did not return valid HTML', raw: html.slice(0, 300) }, { status: 500 });
    }

    return NextResponse.json({ html, title: formData.topic || 'Presentation' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
