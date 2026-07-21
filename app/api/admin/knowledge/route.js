import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;

  let sql = 'SELECT * FROM knowledge_documents WHERE 1=1';
  const params = [];
  let paramIdx = 1;

  if (search) {
    sql += ` AND (title ILIKE $${paramIdx} OR content ILIKE $${paramIdx})`;
    params.push(`%${search}%`);
    paramIdx++;
  }
  if (category) {
    sql += ` AND category = $${paramIdx}`;
    params.push(category);
    paramIdx++;
  }

  sql += ' ORDER BY updated_at DESC';
  sql += ` LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`;
  params.push(limit, offset);

  const result = await query(sql, params);

  // Count total
  let countSql = 'SELECT COUNT(*) as total FROM knowledge_documents WHERE 1=1';
  const countParams = [];
  let cIdx = 1;
  if (search) {
    countSql += ` AND (title ILIKE $${cIdx} OR content ILIKE $${cIdx})`;
    countParams.push(`%${search}%`);
    cIdx++;
  }
  if (category) {
    countSql += ` AND category = $${cIdx}`;
    countParams.push(category);
  }
  const countResult = await query(countSql, countParams);

  // Get categories
  const catResult = await query('SELECT DISTINCT category FROM knowledge_documents ORDER BY category');

  return NextResponse.json({
    items: result.rows,
    total: parseInt(countResult.rows[0].total),
    categories: catResult.rows.map(r => r.category),
    page,
    limit,
  });
}

export async function POST(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, category, content, tags = [], agent_ids = [] } = body;

  if (!title || !content) {
    return NextResponse.json({ error: 'Tiêu đề và nội dung là bắt buộc' }, { status: 400 });
  }

  const result = await query(
    `INSERT INTO knowledge_documents (title, category, content, tags, agent_ids) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, category || 'general', content, tags, agent_ids]
  );

  return NextResponse.json({ item: result.rows[0] });
}

export async function PUT(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, title, category, content, tags, agent_ids, is_active } = body;

  if (!id) {
    return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
  }

  const result = await query(
    `UPDATE knowledge_documents 
     SET title = COALESCE($2, title), 
         category = COALESCE($3, category), 
         content = COALESCE($4, content),
         tags = COALESCE($5, tags),
         agent_ids = COALESCE($6, agent_ids),
         is_active = COALESCE($7, is_active),
         updated_at = NOW()
     WHERE id = $1 RETURNING *`,
    [id, title, category, content, tags, agent_ids, is_active]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 });
  }

  return NextResponse.json({ item: result.rows[0] });
}

export async function DELETE(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();
  await query('DELETE FROM knowledge_documents WHERE id = $1', [id]);
  return NextResponse.json({ ok: true });
}
