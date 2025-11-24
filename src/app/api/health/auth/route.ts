import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  const connectionString = process.env.POSTGRES_URL;
  const sslMode = (process.env.POSTGRES_SSL || 'disable').toLowerCase();

  const client = new Client({
    connectionString,
    ssl: sslMode === 'require' ? { rejectUnauthorized: false } : undefined,
  });

  try {
    await client.connect();
    const res = await client.query('SELECT current_user as user, current_database() as db, inet_server_addr() as host');
    return NextResponse.json({ ok: true, info: res.rows?.[0] });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message, code: error.code, detail: error.detail }, { status: 500 });
  } finally {
    try { await client.end(); } catch {}
  }
}
