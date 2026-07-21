import { NextResponse } from 'next/server';
import { getSession, getUsers, getUserByUsername, createUser, updateUser, deleteUser } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// GET — list all users (admin only)
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const users = (await getUsers()).map(({ password, ...u }) => u); // strip password
  return NextResponse.json({ users });
}

// POST — create user
export async function POST(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { username, password, name, department, position, allowedAgents = [] } = body;
  if (!username || !password || !name) {
    return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
  }
  
  const existing = await getUserByUsername(username);
  if (existing) {
    return NextResponse.json({ error: 'Tên đăng nhập đã tồn tại' }, { status: 400 });
  }
  const hashed = await bcrypt.hash(password, 12);
  const newUser = await createUser({ username, password: hashed, name, role: 'user', department: department || 'hr', position: position || '', allowedAgents });
  const { password: _, ...safe } = newUser;
  return NextResponse.json({ user: safe });
}

// PUT — update user
export async function PUT(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { username, name, department, position, allowedAgents, newPassword } = body;
  
  const existing = await getUserByUsername(username);
  if (!existing) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  
  const updateData = { username };
  if (name) updateData.name = name;
  if (department) updateData.department = department;
  if (position !== undefined) updateData.position = position;
  if (allowedAgents !== undefined) updateData.allowedAgents = allowedAgents;
  if (newPassword) updateData.password = await bcrypt.hash(newPassword, 12);
  
  const updatedUser = await updateUser(updateData);
  const { password: _, ...safe } = updatedUser;
  return NextResponse.json({ user: safe });
}

// DELETE — delete user
export async function DELETE(request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { username } = await request.json();
  if (username === 'admin') return NextResponse.json({ error: 'Không thể xóa tài khoản admin' }, { status: 400 });
  
  await deleteUser(username);
  return NextResponse.json({ ok: true });
}
