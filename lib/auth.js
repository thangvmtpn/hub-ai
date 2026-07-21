import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { readFileSync } from 'fs';
import { join } from 'path';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-dev-secret-change-me');
const COOKIE_NAME = 'hub_session';

export function getUsers() {
  try {
    const filePath = process.env.USERS_FILE || join(process.cwd(), 'users.json');
    const data = readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function createToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSessionCookie(token) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearSession() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}
