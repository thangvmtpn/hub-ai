import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const result = await query('SELECT * FROM faqs ORDER BY created_at DESC');
  return NextResponse.json({ items: result.rows });
}

export async function POST(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { category, question, answer, tags = [] } = await request.json();
  if (!category || !question || !answer) return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });
  
  const result = await query(
    'INSERT INTO faqs (category, question, answer, tags) VALUES ($1, $2, $3, $4) RETURNING *',
    [category, question, answer, tags]
  );
  return NextResponse.json({ item: result.rows[0] });
}

export async function PUT(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const body = await request.json();
  const result = await query(
    'UPDATE faqs SET category = COALESCE($2, category), question = COALESCE($3, question), answer = COALESCE($4, answer), tags = COALESCE($5, tags) WHERE id = $1 RETURNING *',
    [body.id, body.category, body.question, body.answer, body.tags]
  );
  if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ item: result.rows[0] });
}

export async function DELETE(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { id } = await request.json();
  await query('DELETE FROM faqs WHERE id = $1', [id]);
  return NextResponse.json({ ok: true });
}
