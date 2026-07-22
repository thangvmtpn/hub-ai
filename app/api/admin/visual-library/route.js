import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productLine = searchParams.get('product_line') || '';
  const search = searchParams.get('search') || '';

  let sql = 'SELECT * FROM visual_assets WHERE 1=1';
  const params = [];
  let pIdx = 1;

  if (productLine) {
    sql += ` AND (product_line = $${pIdx} OR product_line = 'general')`;
    params.push(productLine);
    pIdx++;
  }
  if (search) {
    sql += ` AND (title ILIKE $${pIdx} OR visual_description ILIKE $${pIdx})`;
    params.push(`%${search}%`);
    pIdx++;
  }

  sql += ' ORDER BY id DESC';

  try {
    const result = await query(sql, params);
    return NextResponse.json({ items: result.rows });
  } catch (err) {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    title,
    product_line = 'general',
    category = 'product_shot',
    image_url,
    visual_description = '',
    suggested_prompt = '',
    color_palette = ''
  } = body;

  if (!title || !image_url) {
    return NextResponse.json({ error: 'Tên ảnh và URL ảnh là bắt buộc' }, { status: 400 });
  }

  const result = await query(
    `INSERT INTO visual_assets (title, product_line, category, image_url, visual_description, suggested_prompt, color_palette)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [title, product_line, category, image_url, visual_description, suggested_prompt, color_palette]
  );

  return NextResponse.json({ item: result.rows[0] });
}

export async function PUT(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, title, product_line, category, image_url, visual_description, suggested_prompt, color_palette, is_active } = body;

  if (!id) {
    return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
  }

  const result = await query(
    `UPDATE visual_assets
     SET title = COALESCE($2, title),
         product_line = COALESCE($3, product_line),
         category = COALESCE($4, category),
         image_url = COALESCE($5, image_url),
         visual_description = COALESCE($6, visual_description),
         suggested_prompt = COALESCE($7, suggested_prompt),
         color_palette = COALESCE($8, color_palette),
         is_active = COALESCE($9, is_active)
     WHERE id = $1 RETURNING *`,
    [id, title, product_line, category, image_url, visual_description, suggested_prompt, color_palette, is_active]
  );

  return NextResponse.json({ item: result.rows[0] });
}

export async function DELETE(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();
  await query('DELETE FROM visual_assets WHERE id = $1', [id]);
  return NextResponse.json({ ok: true });
}
