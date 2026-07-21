import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const cccdFile  = formData.get('cccd');
    const position  = formData.get('position') || '';
    const department = formData.get('department') || '';
    const salary    = formData.get('salary') || '';
    const contractType = formData.get('contract_type') || 'Xác định thời hạn 1 năm';
    const startDate = formData.get('start_date') || '';
    const jdContent = formData.get('jd_content') || '';

    // ── 1. Trích xuất CCCD bằng Claude Vision ──────────────────────────────
    let cccdInfo = { ho_ten: '', ngay_sinh: '', gioi_tinh: '', que_quan: '', noi_thuong_tru: '', so_cccd: '', ngay_cap: '', noi_cap: '' };
    if (cccdFile && cccdFile.size > 0) {
      const base64 = Buffer.from(await cccdFile.arrayBuffer()).toString('base64');
      const visionRes = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 512,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: cccdFile.type || 'image/jpeg', data: base64 } },
            { type: 'text', text: 'Trích xuất thông tin CCCD/CMND. Trả về JSON thuần không markdown:\n{"ho_ten":"","ngay_sinh":"DD/MM/YYYY","gioi_tinh":"","que_quan":"","noi_thuong_tru":"","so_cccd":"","ngay_cap":"DD/MM/YYYY","noi_cap":""}' },
          ],
        }],
      });
      try {
        const raw = visionRes.content[0].text.replace(/```json|```/gi, '').trim();
        cccdInfo = { ...cccdInfo, ...JSON.parse(raw) };
      } catch { /* giữ default */ }
    }

    // ── 2. AI tóm tắt nhiệm vụ từ JD ──────────────────────────────────────
    let duties = [];
    if (jdContent.trim()) {
      const dutyRes = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: `Từ mô tả JD sau, hãy liệt kê 5-8 nhiệm vụ chính của vị trí "${position}" dưới dạng JSON array của các string ngắn gọn (mỗi mục tối đa 100 ký tự). Trả về JSON thuần:\n["nhiệm vụ 1","nhiệm vụ 2",...]\n\nJD:\n${jdContent.slice(0, 2000)}`,
        }],
      });
      try {
        const raw = dutyRes.content[0].text.replace(/```json|```/gi, '').trim();
        duties = JSON.parse(raw);
      } catch { duties = []; }
    }
    if (!duties.length) {
      duties = [
        `Thực hiện các nhiệm vụ thuộc vị trí ${position} theo phân công của cấp trên`,
        'Phối hợp với các phòng ban liên quan để hoàn thành mục tiêu công việc',
        'Báo cáo tiến độ và kết quả công việc định kỳ cho cấp quản lý',
        'Tuân thủ nội quy, quy trình và các quy định của Công ty',
        'Thực hiện các nhiệm vụ khác theo yêu cầu của Công ty',
      ];
    }

    // ── 3. Tính ngày kết thúc hợp đồng ────────────────────────────────────
    let endDate = '';
    if (startDate) {
      try {
        const [d, m, y] = startDate.split('/').map(Number);
        const start = new Date(y, m - 1, d);
        if (contractType.includes('Thử việc')) {
          start.setMonth(start.getMonth() + 2);
        } else if (contractType.includes('1 năm')) {
          start.setFullYear(start.getFullYear() + 1);
        } else if (contractType.includes('2 năm')) {
          start.setFullYear(start.getFullYear() + 2);
        }
        if (!contractType.includes('Không xác định')) {
          endDate = start.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
      } catch { /* ignore */ }
    }

    return NextResponse.json({
      cccd: cccdInfo,
      contract: { position, department, salary, contractType, startDate, endDate },
      duties,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
