
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const batchId = searchParams.get('batch_id');

  if (!batchId) {
    return NextResponse.json({ error: 'batch_id is required' }, { status: 400 });
  }

  try {
    // Parallel queries for performance
    const [summaryRes, postsRes, strategyRes] = await Promise.all([
      pool.query('SELECT * FROM analysis_batches WHERE batch_id = $1', [batchId]),
      pool.query('SELECT * FROM proposed_kpis WHERE batch_id = $1 ORDER BY scheduled_time DESC', [batchId]),
      pool.query('SELECT * FROM proposed_breakdowns WHERE batch_id = $1', [batchId]),
    ]);

    if (!summaryRes.rows.length) {
      return NextResponse.json({
        error: 'Batch not found. It may not have been inserted or n8n workflow has not started yet.',
        exists: false,
      }, { status: 404 });
    }

    return NextResponse.json({
      summary: summaryRes.rows[0] || {},
      posts: postsRes.rows,
      strategy: strategyRes.rows,
      exists: true,
    });
  } catch (error: any) {
    console.error('Database query failed:', error);
    return NextResponse.json({
      error: 'Failed to fetch campaign data',
      detail: error.message,
      code: error.code,
      hint: 'Verify DB credentials, network access, and that schema tables exist.'
    }, { status: 500 });
  }
}
