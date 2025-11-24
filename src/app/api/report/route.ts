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
    // Get campaign report
    const reportQuery = await pool.query(
      'SELECT * FROM campaign_reports WHERE batch_id = $1 ORDER BY created_at DESC LIMIT 1',
      [batchId]
    );

    if (!reportQuery.rows.length) {
      return NextResponse.json({
        error: 'Report not found. Campaign may still be generating content.',
        exists: false,
      }, { status: 404 });
    }

    const report = reportQuery.rows[0];
    
    // Extract data from report_json JSONB column
    const reportData = report.report_json;
    
    // Calculate platform breakdown from the data
    const platformBreakdown: Record<string, any> = {};
    const platformsUsed: string[] = [];
    
    if (reportData.platform_breakdown) {
      const platforms = typeof reportData.platform_breakdown === 'string' 
        ? JSON.parse(reportData.platform_breakdown)
        : reportData.platform_breakdown;
      
      platforms.forEach((p: any) => {
        if (!platformsUsed.includes(p.platform)) {
          platformsUsed.push(p.platform);
        }
        platformBreakdown[p.platform] = {
          total_posts: p.posts || 0,
          published_posts: p.posts || 0, // Assume all published when report generated
          pending_posts: 0,
          avg_reach: parseInt(p.avg_reach) || 0,
          avg_engagement: parseInt(p.avg_engagement) || 0,
        };
      });
    }
    
    return NextResponse.json({
      report_id: report.report_id,
      batch_id: report.batch_id,
      report_data: {
        batch_id: reportData.batch_id,
        report_date: new Date(report.created_at).toLocaleDateString(),
        total_posts: reportData.total_posts || 0,
        published_posts: reportData.total_posts || 0,
        pending_posts: 0,
        platforms_used: platformsUsed,
        platform_breakdown: platformBreakdown,
        total_estimated_reach: reportData.total_reach || 0,
        total_estimated_engagement: reportData.total_engagement || 0,
        generated_at: report.created_at,
      },
      summary: report.report_summary || reportData.executive_summary,
      generated_at: report.created_at,
      exists: true,
    });
  } catch (error: any) {
    console.error('Failed to fetch report:', error);
    return NextResponse.json({
      error: 'Failed to fetch campaign report',
      detail: error.message,
    }, { status: 500 });
  }
}
