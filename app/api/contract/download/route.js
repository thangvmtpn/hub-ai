import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { buildContractDocx } from '@/lib/contract-docx';

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { cccd = {}, contract = {}, duties = [] } = await request.json();
    const buffer = await buildContractDocx({ cccd, contract, duties });
    const name = (cccd?.ho_ten || 'nhan-vien').replace(/\s+/g, '_');
    const year = new Date().getFullYear();
    const fileName = `HDLD_${name}_${year}.docx`;

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
