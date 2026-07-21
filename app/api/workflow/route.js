import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAgentById } from '@/lib/agents';
import fs from 'fs';
import path from 'path';

const SYSTEM_PROMPT = `Bạn là Senior UI/UX Designer chuyên nghiệp, chuyên tạo workflow diagram đẹp mắt cho doanh nghiệp Việt Nam.

Nhiệm vụ: Tạo HTML workflow diagram CHUYÊN NGHIỆP với icons minh họa cho TỪNG BƯỚC.

QUAN TRỌNG: Có 6 PHONG CÁCH DESIGN mẫu dưới đây. Bạn sẽ được cung cấp HTML TEMPLATE đầy đủ của phong cách được chọn. Hãy:
1. ĐỌC kỹ template
2. THAY THẾ nội dung bằng quy trình được yêu cầu
3. GIỮ NGUYÊN cấu trúc CSS và design
4. SỬ DỤNG icon SVG phù hợp cho từng bước

YÊU CẦU ICON (dùng SVG inline, viewBox="0 0 24 24"):
- Tài liệu/phiếu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
- Tìm kiếm: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
- Duyệt: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
- Tiền: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
- Hợp đồng: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
- Check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
- Người: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
- Đồng hồ: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>

QUAN TRỌNG NHẤT:
- CHỈ trả về HTML thuần túy (không markdown, không giải thích)
- Phải có DOCTYPE, html, head, body đầy đủ
- Dùng cấu trúc từ TEMPLATE được cung cấp
- Thay text bằng nội dung quy trình
- Mỗi bước có icon SVG phù hợp
- Đảm bảo responsive, font Inter/Plus Jakarta Sans/Be Vietnam Pro`;

const STYLE_TEMPLATES = {
  'Corporate Blueprint': 'style-1-corporate-horizontal',
  'Modern Flat': 'style-2-modern-minimal',
  'Vietnamese Heritage': 'style-3-vietnamese-heritage',
  'Creative Canvas': 'style-4-creative-gradient',
  'Technical Flow': 'style-5-technical-flow',
  'Pastel Soft': 'style-6-pastel-cards',
};

async function callOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      max_tokens: 16000,
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error('OpenAI API error: ' + response.status);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

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

    const processName = formData.process_name || 'Quy Trình';
    const steps = formData.steps || '';
    const actors = formData.actors || '';
    const style = formData.style || 'Corporate Blueprint';

    // Load template HTML
    const templateFile = STYLE_TEMPLATES[style] || 'style-1-corporate-horizontal';
    let templateHtml = '';
    try {
      const templatePath = path.join(process.cwd(), 'public', 'templates', templateFile + '.html');
      templateHtml = fs.readFileSync(templatePath, 'utf8');
    } catch (e) {
      templateHtml = 'Template không tìm thấy';
    }

    const userPrompt = 'Tạo workflow diagram với phong cách "' + style + '" cho quy trình sau:\n\n' +
      'TÊN QUY TRÌNH: ' + processName + '\n\n' +
      'CÁC BƯỚC:\n' + steps + '\n\n' +
      (actors ? 'NGƯỜI THỰC HIỆN: ' + actors + '\n' : '') +
      '\n\nDƯỚI ĐÂY LÀ HTML TEMPLATE MẪU của phong cách này. Hãy thay thế nội dung bằng quy trình trên, GIỮ NGUYÊN cấu trúc CSS và design:\n\n' +
      '```html\n' + templateHtml + '\n```\n\n' +
      'Hãy trả về HTML hoàn chỉnh với nội dung quy trình đã được thay thế. CHỈ trả về HTML, không markdown, không giải thích.';

    const html = await callOpenAI(userPrompt);

    let cleanHtml = html.replace(/^```(?:html)?\s*/i, '').replace(/\s*```\s*$/, '').trim();

    if (!cleanHtml.includes('<html') && !cleanHtml.includes('<!DOCTYPE') && !cleanHtml.includes('<div') && !cleanHtml.includes('<svg')) {
      return NextResponse.json({ error: 'AI did not return valid HTML', raw: cleanHtml.slice(0, 500) }, { status: 500 });
    }

    return NextResponse.json({ 
      html: cleanHtml, 
      title: processName,
      style: style 
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
