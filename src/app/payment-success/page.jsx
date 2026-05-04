'use client';

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function PaymentSuccessPage() {

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState(
    'Verifying payment...'
  );

  useEffect(() => {

    const verifyPayment = async () => {

      try {

        const params = new URLSearchParams(
          window.location.search
        );

        const order_id = params.get('order_id');

        if (!order_id) {
          setMessage('Order ID missing');
          setLoading(false);
          return;
        }

        // VERIFY PAYMENT
        const verifyResponse = await fetch(
          `/api/verify-payment?order_id=${order_id}`
        );

        const verifyData =
          await verifyResponse.json();

        console.log(verifyData);

        if (
          verifyData.order_status !== 'PAID'
        ) {
          setMessage('Payment not completed');
          setLoading(false);
          return;
        }

        setMessage('Saving registration...');

        // SAVE REGISTRATION
        const saveResponse = await fetch(
          '/api/save-registration',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json'
            },

            body: JSON.stringify({

              email:
                localStorage.getItem(
                  'registration_email'
                ),

              workshop_ids:
                localStorage.getItem(
                  'selected_workshops'
                ),

              details: JSON.parse(
                localStorage.getItem(
                  'registration_details'
                ) || '{}'
              ),

              payment_id:
                verifyData.cf_payment_id,

              order_id,

              amount:
                verifyData.order_amount
            })
          }
        );

        const saveData =
          await saveResponse.json();

        console.log(saveData);

        if (!saveResponse.ok) {
          throw new Error(
            saveData.message ||
            'Failed to save registration'
          );
        }

        // SAVE LOCAL DASHBOARD DATA
        const email =
          localStorage.getItem(
            'registration_email'
          );

        const workshops =
          localStorage.getItem(
            'selected_workshops'
          );

        const details =
          localStorage.getItem(
            'registration_details'
          );

        localStorage.setItem(
          'last_active_email',
          email
        );

        localStorage.setItem(
          `purchase_${email}`,
          JSON.stringify(
            workshops.split(',')
          )
        );

        localStorage.setItem(
          `profile_${email}`,
          details
        );

        setMessage('Payment successful');

        // REDIRECT TO ONLINE WORKSHOPS
        setTimeout(() => {
          window.location.href = '/online-workshops';
        }, 2000);

      } catch (err) {

        console.log(err);

        setMessage(err.message);

      } finally {

        setLoading(false);

      }
    };

    verifyPayment();

  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center">

      {loading ? (
        <Loader2
          className="animate-spin text-[#3b82f6]"
          size={50}
        />
      ) : (
        <CheckCircle2
          className="text-green-500"
          size={60}
        />
      )}

      <p className="mt-6 text-xl font-bold">
        {message}
      </p>

    </div>
  );
}