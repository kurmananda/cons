import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    console.log('TiQR Request Body:', JSON.stringify(body, null, 2));

    const response = await fetch('https://api.tiqr.events/participant/booking/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('TiQR API returned non-JSON response:', text.substring(0, 500));
      return NextResponse.json(
        { 
          message: 'TiQR API returned invalid response',
          status: response.status,
          details: text.substring(0, 500)
        }, 
        { status: response.status }
      );
    }

    if (!response.ok) {
      console.error('TiQR API Error:', JSON.stringify(data, null, 2));
      return NextResponse.json(data, { status: response.status });
    }

    console.log('TiQR Response Success:', JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Backend Fetch Error:", error);
    return NextResponse.json(
      { message: 'Server Connection Error', error: error.message }, 
      { status: 500 }
    );
  }
}