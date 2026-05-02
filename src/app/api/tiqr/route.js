import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch('https://api.tiqr.events/v1/bookings/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // DOUBLE CHECK THESE NAMES IN YOUR TIQR DASHBOARD
        'Authorization': `Token ${process.env.TIQR_API_KEY}`, 
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Backend Fetch Error:", error);
    return NextResponse.json({ message: 'Server Connection Error' }, { status: 500 });
  }
}