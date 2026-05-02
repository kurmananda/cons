import { NextResponse } from 'next/server';

export async function GET(req) {

  try {

    const { searchParams } = new URL(req.url);

    const order_id = searchParams.get('order_id');

    const response = await fetch(
      `https://sandbox.cashfree.com/pg/orders/${order_id}`,
      {
        method: 'GET',

        headers: {
          'x-client-id':
            'TEST1105651582cfb10e91fe60700a9251565011',

          'x-client-secret':
            'cfsk_ma_test_06d40c64041ccdcb81008ad536f5586a_3e340568',

          'x-api-version': '2023-08-01',
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data);

  } catch (err) {

    return NextResponse.json(
      {
        message: err.message,
      },
      {
        status: 500,
      }
    );
  }
}