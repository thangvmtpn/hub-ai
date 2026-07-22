import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file tải lên' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate clean filename
    const ext = path.extname(file.name) || '.png';
    const cleanExt = ext.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif|svg)/) ? ext.toLowerCase() : '.png';
    const filename = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${cleanExt}`;

    // Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Write file to disk
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl, filename });
  } catch (error) {
    console.error('[UPLOAD ERROR]', error);
    return NextResponse.json({ error: 'Lỗi tải ảnh lên: ' + error.message }, { status: 500 });
  }
}
