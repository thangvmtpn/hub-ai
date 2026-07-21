import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { initDatabase } from '@/lib/migrations';

let dbInitialized = false;

export async function GET() {
  if (!dbInitialized) {
    dbInitialized = true;
    initDatabase().catch(err => {
      console.error('[DB] Auto-migration error:', err);
    });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({
    user: {
      name: session.name,
      role: session.role,
      department: session.department,
      position: session.position || '',
      allowedAgents: session.allowedAgents || [],
    },
  });
}
