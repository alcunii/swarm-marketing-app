
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaign_name, campaign_goal, duration_days, target_audience, brand_name } = body;

    if (!campaign_name || !campaign_goal || !duration_days || !target_audience || !brand_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const batch_id = uuidv4();
    const goal_id = uuidv4();

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL_1;
    if (!n8nWebhookUrl) {
        console.error('N8N_WEBHOOK_URL_1 is not defined');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Ensure a batch row exists so dashboard can load immediately
    // Create initial parent row in analysis_batches with robust fallbacks for differing column names
    try {
      // Attempt 1: schema with batch_name + goal_id
      await pool.query(
        `INSERT INTO analysis_batches (batch_id, batch_name, brand_name, target_audience, status, created_at, goal_id)
         VALUES ($1, $2, $3, $4, 'pending_strategy', NOW(), $5)
         ON CONFLICT (batch_id) DO NOTHING`,
        [batch_id, campaign_name, brand_name, target_audience, goal_id]
      );
    } catch (err1: any) {
      // If undefined column (e.g., batch_name not present), try campaign_name variant
      const code = err1?.code;
      const msg = err1?.message || '';
      if (code === '42703' || /batch_name/.test(msg)) {
        try {
          await pool.query(
            `INSERT INTO analysis_batches (batch_id, campaign_name, brand_name, target_audience, status, created_at, goal_id)
             VALUES ($1, $2, $3, $4, 'pending_strategy', NOW(), $5)
             ON CONFLICT (batch_id) DO NOTHING`,
            [batch_id, campaign_name, brand_name, target_audience, goal_id]
          );
        } catch (err2: any) {
          // If goal_id also doesn't exist, attempt without goal_id entirely
          const msg2 = err2?.message || '';
          if (err2?.code === '42703' || /goal_id/.test(msg2)) {
            try {
              await pool.query(
                `INSERT INTO analysis_batches (batch_id, campaign_name, brand_name, target_audience, status, created_at)
                 VALUES ($1, $2, $3, $4, 'pending_strategy', NOW())
                 ON CONFLICT (batch_id) DO NOTHING`,
                [batch_id, campaign_name, brand_name, target_audience]
              );
            } catch (err3: any) {
              console.error('Failed to insert initial batch row (no-goal_id fallback):', err3?.message || err3);
              return NextResponse.json({ error: `DB insert failed: ${err3?.message || err3}` }, { status: 500 });
            }
          } else {
            console.error('Failed to insert initial batch row (campaign_name variant):', err2?.message || err2);
            return NextResponse.json({ error: `DB insert failed: ${err2?.message || err2}` }, { status: 500 });
          }
        }
      } else {
        console.error('Failed to insert initial batch row (batch_name variant):', err1?.message || err1);
        return NextResponse.json({ error: `DB insert failed: ${err1?.message || err1}` }, { status: 500 });
      }
    }

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        campaign_name,
        campaign_goal,
        duration_days,
        target_audience,
        brand_name,
        batch_id,
        goal_id,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to trigger n8n workflow:', errorText);
      return NextResponse.json({ error: 'Failed to start campaign' }, { status: 500 });
    }

    return NextResponse.json({ batch_id });
  } catch (error) {
    console.error('Campaign creation failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
