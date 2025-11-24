import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const version = await pool.query('show server_version');
    const now = await pool.query('select now() as now, current_database() as db, inet_server_addr() as host');

    // check required tables
    const tables = await pool.query(`
      select table_name from information_schema.tables 
      where table_schema='public' and table_name in ('analysis_batches','ai_recommended_roles','proposed_breakdowns','proposed_kpis')
      order by table_name;
    `);

    return NextResponse.json({
      ok: true,
      server_version: version.rows?.[0]?.server_version,
      info: now.rows?.[0],
      required_tables_present: tables.rows.map(r => r.table_name),
      ssl_mode: process.env.POSTGRES_SSL || 'disable',
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message, code: error.code }, { status: 500 });
  }
}
