import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get('agentId');
  if (!agentId) {
    return NextResponse.json({ error: 'agentId required' }, { status: 400 });
  }

  const result = await query('SELECT system_prompt FROM agent_training WHERE agent_id = $1', [agentId]);
  return NextResponse.json({ systemPrompt: result.rows[0]?.system_prompt || '' });
}

export async function POST(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { agentId, systemPrompt } = await request.json();
  if (!agentId) {
    return NextResponse.json({ error: 'agentId required' }, { status: 400 });
  }

  if (systemPrompt?.trim()) {
    await query(
      `INSERT INTO agent_training (agent_id, system_prompt, updated_at) 
       VALUES ($1, $2, NOW()) 
       ON CONFLICT (agent_id) DO UPDATE SET system_prompt = $2, updated_at = NOW()`,
      [agentId, systemPrompt.trim()]
    );
  } else {
    await query('DELETE FROM agent_training WHERE agent_id = $1', [agentId]);
  }

  return NextResponse.json({ ok: true });
}
