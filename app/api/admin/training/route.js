import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAgentTraining, saveAgentTraining } from '@/lib/training';

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

  const training = getAgentTraining(agentId);
  return NextResponse.json({ systemPrompt: training?.systemPrompt || '' });
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

  saveAgentTraining(agentId, systemPrompt);
  return NextResponse.json({ ok: true });
}
