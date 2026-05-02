import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://aeytetacgdmxtsotjfti.supabase.co',
  'sb_publishable_waq7AxdRDLcOndA5NF5vKg_HSr9IAn8'
);

export async function POST(req) {
  try {
    const body = await req.json();

    console.log('SAVE BODY:', body);

    const email = body.email || '';

    const newWorkshopIds = body.workshop_ids || '';

    const details = body.details || {};

    const payment_id = body.payment_id || '';

    const order_id = body.order_id || '';

    const amount = body.amount || 0;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email missing'
        },
        { status: 400 }
      );
    }

    // =========================================
    // FETCH EXISTING USER
    // =========================================

    const { data: existingUser } = await supabase
      .from('registrations')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    // =========================================
    // EXISTING WORKSHOPS
    // =========================================

    let existingIds = [];

    if (existingUser?.workshop_ids) {
      existingIds = Array.isArray(existingUser.workshop_ids)
        ? existingUser.workshop_ids
        : [];
    }

    // =========================================
    // NEW WORKSHOPS
    // =========================================

    const incomingIds = Array.isArray(newWorkshopIds)
      ? newWorkshopIds
      : String(newWorkshopIds)
          .split(',')
          .map(id => id.trim())
          .filter(Boolean);

    // =========================================
    // MERGE + REMOVE DUPLICATES
    // =========================================

    const finalWorkshopIds = [
      ...new Set([
        ...existingIds,
        ...incomingIds
      ])
    ];

    // =========================================
    // UPSERT USER
    // =========================================

    const { data, error } = await supabase
      .from('registrations')
      .upsert(
        [
          {
            email: email.toLowerCase(),

            workshop_ids: finalWorkshopIds,

            details,

            payment_id,

            order_id,

            amount,

            status: 'confirmed',

            payment_status: 'paid',

            updated_at: new Date().toISOString()
          }
        ],
        {
          onConflict: 'email'
        }
      )
      .select();

    if (error) {
      console.log(error);

      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (err) {
    console.log(err);

    return NextResponse.json(
      {
        success: false,
        message: err.message
      },
      { status: 500 }
    );
  }
}