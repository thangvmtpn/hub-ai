import { NextResponse } from 'next/server';
import { getSession, getUsers } from '@/lib/auth';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';

const USERS_FILE = join(process.cwd(), 'users.json');

function saveUsers(users) {
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// GET — list all users (admin only)
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const users = getUsers().map(({ password, ...u }) => u); // strip password
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
  const users = getUsers();
  if (users.find(u => u.username === username)) {
    return NextResponse.json({ error: 'Tên đăng nhập đã tồn tại' }, { status: 400 });
  }
  const hashed = await bcrypt.hash(password, 12);
  const newUser = { username, password: hashed, name, role: 'user', department: department || 'hr', position: position || '', allowedAgents };
  users.push(newUser);
  saveUsers(users);
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
  const users = getUsers();
  const idx = users.findIndex(u => u.username === username);
  if (idx === -1) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if (users[idx].username === 'admin' && username === 'admin') {
    // allow updating admin but keep role
  }
  if (name) users[idx].name = name;
  if (department) users[idx].department = department;
  if (position !== undefined) users[idx].position = position;
  if (allowedAgents !== undefined) users[idx].allowedAgents = allowedAgents;
  if (newPassword) users[idx].password = await bcrypt.hash(newPassword, 12);
  saveUsers(users);
  const { password: _, ...safe } = users[idx];
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
  const users = getUsers().filter(u => u.username !== username);
  saveUsers(users);
  return NextResponse.json({ ok: true });
}
