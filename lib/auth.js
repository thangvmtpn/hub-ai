import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { readFileSync } from 'fs';
import { join } from 'path';
import pool from './db';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-dev-secret-change-me');
const COOKIE_NAME = 'hub_session';

function getUsersFromFile() {
  try {
    const file = join(process.cwd(), 'users.json');
    return JSON.parse(readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

export async function getUsers() {
  try {
    const res = await pool.query('SELECT * FROM users ORDER BY username ASC');
    if (res.rows.length === 0) return getUsersFromFile();
    return res.rows.map(row => ({
      username: row.username,
      password: row.password,
      name: row.name,
      role: row.role,
      department: row.department,
      position: row.position,
      allowedAgents: row.allowed_agents || []
    }));
  } catch (err) {
    return getUsersFromFile();
  }
}

export async function getUserByUsername(username) {
  try {
    const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (res.rows.length === 0) {
      const users = getUsersFromFile();
      return users.find(u => u.username === username) || null;
    }
    const row = res.rows[0];
    return {
      username: row.username,
      password: row.password,
      name: row.name,
      role: row.role,
      department: row.department,
      position: row.position,
      allowedAgents: row.allowed_agents || []
    };
  } catch (err) {
    const users = getUsersFromFile();
    return users.find(u => u.username === username) || null;
  }
}

export async function createUser({ username, password, name, role, department, position, allowedAgents }) {
  const res = await pool.query(
    'INSERT INTO users (username, password, name, role, department, position, allowed_agents) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [username, password, name, role, department, position, allowedAgents]
  );
  const row = res.rows[0];
  return {
    username: row.username,
    name: row.name,
    role: row.role,
    department: row.department,
    position: row.position,
    allowedAgents: row.allowed_agents || []
  };
}

export async function updateUser(updateData) {
  const { username } = updateData;
  const current = await getUserByUsername(username);
  if (!current) throw new Error('User not found');
  
  const name = updateData.name !== undefined ? updateData.name : current.name;
  const department = updateData.department !== undefined ? updateData.department : current.department;
  const position = updateData.position !== undefined ? updateData.position : current.position;
  const allowed_agents = updateData.allowedAgents !== undefined ? updateData.allowedAgents : current.allowedAgents;
  const password = updateData.password !== undefined ? updateData.password : current.password;

  const res = await pool.query(
    'UPDATE users SET name=$1, department=$2, position=$3, allowed_agents=$4, password=$5 WHERE username=$6 RETURNING *',
    [name, department, position, allowed_agents, password, username]
  );
  const row = res.rows[0];
  return {
    username: row.username,
    name: row.name,
    role: row.role,
    department: row.department,
    position: row.position,
    allowedAgents: row.allowed_agents || []
  };
}

export async function deleteUser(username) {
  await pool.query('DELETE FROM users WHERE username = $1', [username]);
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
