import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUsers, createToken, setSessionCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const users = await getUsers();
    const user = users.find((u) => u.username === username);

    if (!user) {
      return NextResponse.json({ error: 'Sai tài khoản hoặc mật khẩu' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Sai tài khoản hoặc mật khẩu' }, { status: 401 });
    }

    const token = await createToken({
      username: user.username,
      name: user.name,
      role: user.role,
      department: user.department,
      position: user.position || '',
      allowedAgents: user.allowedAgents || [],
    });

    await setSessionCookie(token);

    return NextResponse.json({
      user: { name: user.name, role: user.role, department: user.department, position: user.position || '', allowedAgents: user.allowedAgents || [] },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
