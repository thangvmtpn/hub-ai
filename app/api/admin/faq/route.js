import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const FAQ_FILE = join(process.cwd(), 'faq.json');

function loadFaq() {
  try { return JSON.parse(readFileSync(FAQ_FILE, 'utf-8')); } catch { return []; }
}
function saveFaq(data) {
  writeFileSync(FAQ_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ items: loadFaq() });
}

export async function POST(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const { category, question, answer, tags = [] } = body;
  if (!category || !question || !answer) return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });
  const items = loadFaq();
  const id = `faq_${Date.now()}`;
  items.push({ id, category, question, answer, tags });
  saveFaq(items);
  return NextResponse.json({ item: { id, category, question, answer, tags } });
}

export async function PUT(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const items = loadFaq();
  const idx = items.findIndex(i => i.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  items[idx] = { ...items[idx], ...body };
  saveFaq(items);
  return NextResponse.json({ item: items[idx] });
}

export async function DELETE(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await request.json();
  const items = loadFaq().filter(i => i.id !== id);
  saveFaq(items);
  return NextResponse.json({ ok: true });
}
