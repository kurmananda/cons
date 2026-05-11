import { NextResponse } from 'next/server';

const TIQR_SINGLE = 'https://api.tiqr.events/participant/booking/';
/** Trailing slash matters: without it Django often 301s to `/bulk/` and fetch may retry as GET → 405. */
const TIQR_BULK = 'https://api.tiqr.events/participant/booking/bulk/';

/**
 * POST without following redirects as GET. Re-POSTs to `Location` on 301/302/307/308
 * so the body is not dropped (avoids upstream "Method GET not allowed").
 */
async function postTiqr(url, payload) {
  const body = JSON.stringify(payload);
  const headers = { 'Content-Type': 'application/json' };
  const init = { method: 'POST', headers, body, redirect: 'manual' };

  let currentUrl = url;
  for (let hop = 0; hop < 5; hop += 1) {
    const res = await fetch(currentUrl, { ...init, body });
    if (res.status < 300 || res.status >= 400) {
      return res;
    }
    const loc = res.headers.get('location');
    if (!loc) {
      return res;
    }
    currentUrl = new URL(loc, currentUrl).href;
  }
  return fetch(currentUrl, { ...init, body });
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (process.env.NODE_ENV !== 'production') {
      console.log('[TiQR] proxy request', {
        hasBookings: Array.isArray(body?.bookings),
        bookingCount: body?.bookings?.length,
      });
    }

    let tiqrUrl = TIQR_SINGLE;
    let tiqrPayload = body;

    if (Array.isArray(body.bookings) && body.bookings.length > 0) {
      const { callback_url, bookings } = body;
      if (bookings.length > 1) {
        tiqrUrl = TIQR_BULK;
        tiqrPayload = { bookings, callback_url };
      } else {
        tiqrPayload = { ...bookings[0], callback_url };
      }
    }

    const response = await postTiqr(tiqrUrl, tiqrPayload);

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
      console.error('[TiQR] upstream error', response.status, data);
      return NextResponse.json(data, { status: response.status });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('[TiQR] upstream ok', {
        keys: data && typeof data === 'object' ? Object.keys(data) : [],
      });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Backend Fetch Error:", error);
    return NextResponse.json(
      { message: 'Server Connection Error', error: error.message }, 
      { status: 500 }
    );
  }
}