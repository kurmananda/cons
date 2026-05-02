import { NextResponse } from 'next/server';
import { Cashfree } from 'cashfree-pg';

Cashfree.XClientId =
  "TEST1105651582cfb10e91fe60700a9251565011";

Cashfree.XClientSecret =
  "cfsk_ma_test_06d40c64041ccdcb81008ad536f5586a_3e340568";

Cashfree.XEnvironment = 0;

export async function POST(req) {

  try {

    const body = await req.json();

    const {
      customer_id,
      customer_phone,
      customer_email,
      customer_name,
      order_amount,
      metadata
    } = body;

    const order_id =
      `order_${Date.now()}`;

    const requestData = {

      order_amount,

      order_currency: 'INR',

      order_id,

      customer_details: {

        customer_id:
          String(customer_id),

        customer_name:
          String(customer_name),

        customer_email:
          String(customer_email),

        customer_phone:
          String(customer_phone)
      },

      order_meta: {

        return_url:
          `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment-success?order_id={order_id}`
      },

      order_tags: metadata
    };

    let response;

    if (
      typeof Cashfree.PGCreateOrder
      === 'function'
    ) {

      response =
        await Cashfree.PGCreateOrder(
          '2023-08-01',
          requestData
        );

    } else {

      const url =
        Cashfree.XEnvironment === 0
          ? 'https://sandbox.cashfree.com/pg/orders'
          : 'https://api.cashfree.com/pg/orders';

      const res = await fetch(url, {

        method: 'POST',

        headers: {

          'x-client-id':
            Cashfree.XClientId,

          'x-client-secret':
            Cashfree.XClientSecret,

          'x-api-version':
            '2023-08-01',

          'Content-Type':
            'application/json'
        },

        body: JSON.stringify(
          requestData
        )
      });

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.message ||
          'Cashfree API Error'
        );
      }

      response = { data };
    }

    return NextResponse.json({

      ...response.data,

      order_id
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message:
          error.message ||
          'Payment initiation failed'
      },
      { status: 500 }
    );
  }
}