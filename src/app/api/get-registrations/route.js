// /api/get-registration/route.js

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://aeytetacgdmxtsotjfti.supabase.co',
  'sb_publishable_waq7AxdRDLcOndA5NF5vKg_HSr9IAn8'
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (error) {
    return NextResponse.json({ success: false, message: error.message });
  }

  return NextResponse.json({ success: true, data });
}