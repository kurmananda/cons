'use client';

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

const FAILED_STATUSES = new Set(['failed', 'cancelled', 'canceled', 'expired']);

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Poll TiQR until confirmed, failed, or timeout. */
async function verifyTiqrWithRetries(uid, maxAttempts = 6) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const res = await fetch(
      `/api/tiqr/verify-booking?uid=${encodeURIComponent(uid)}`
    );
    const json = await res.json().catch(() => ({}));

    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Could not verify payment with TiQR');
    }

    const status = String(json.status || '').toLowerCase();

    if (json.confirmed || status === 'confirmed') {
      return json;
    }

    if (FAILED_STATUSES.has(status)) {
      return { ...json, failed: true };
    }

    if (attempt < maxAttempts - 1) {
      await wait(2000);
    }
  }

  return { failed: false, pending: true, status: 'pending_payment' };
}

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams(window.location.search);

        const booking_uid =
          params.get('booking_uid') ||
          params.get('uid') ||
          params.get('bookingUid') ||
          params.get('booking_id');

        const order_id = params.get('order_id');
        const amount_param = params.get('amount');

        const tiqrBookingUid =
          booking_uid || localStorage.getItem('tiqr_booking_uid');

        const tiqrBookingId = localStorage.getItem('tiqr_booking_id');

        const tiqrParticipantIdentificationId = localStorage.getItem(
          'tiqr_participant_identification_id'
        );

        const isTiqrFlow = Boolean(tiqrBookingUid);

        if (!isTiqrFlow && !order_id) {
          setMessage('Booking or Order ID missing');
          setLoading(false);
          return;
        }

        let verifyData = null;

        if (!isTiqrFlow) {
          const verifyResponse = await fetch(
            `/api/verify-payment?order_id=${order_id}`
          );

          verifyData = await verifyResponse.json();

          if (verifyData.order_status !== 'PAID') {
            setMessage('Payment was not completed. No registration was saved.');
            setLoading(false);
            return;
          }
        } else {
          setMessage('Confirming payment with TiQR...');

          const tiqrResult = await verifyTiqrWithRetries(tiqrBookingUid);

          if (tiqrResult.failed) {
            setMessage(
              `Payment was not successful (status: ${tiqrResult.status || 'failed'}). Your registration was not saved.`
            );
            setLoading(false);
            return;
          }

          if (tiqrResult.pending) {
            setMessage(
              'Payment is still processing. If money was deducted, wait a few minutes and contact support with booking id: ' +
                tiqrBookingUid
            );
            setLoading(false);
            return;
          }
        }

        setMessage('Saving registration...');

        let email = localStorage.getItem('registration_email');
        let workshopIds = localStorage.getItem('selected_workshops') || '';

        let detailsParsed = {};
        try {
          detailsParsed = JSON.parse(
            localStorage.getItem('registration_details') || '{}'
          );
        } catch {
          detailsParsed = {};
        }

        if (!email) {
          setMessage(
            'Payment confirmed but we could not link your session. Email support with booking id: ' +
              (tiqrBookingUid || 'unknown')
          );
          setLoading(false);
          return;
        }

        const saveResponse = await fetch('/api/save-registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            workshop_ids: workshopIds,
            details: {
              ...detailsParsed,
              tiqr_booking_uid: tiqrBookingUid || undefined,
              tiqr_booking_id: tiqrBookingId || undefined,
              tiqr_participant_identification_id:
                tiqrParticipantIdentificationId || undefined,
            },
            payment_id: isTiqrFlow ? tiqrBookingUid : verifyData?.cf_payment_id,
            order_id: isTiqrFlow ? '' : order_id,
            amount: amount_param || verifyData?.order_amount || 0,
          }),
        });

        const saveData = await saveResponse.json();

        if (!saveResponse.ok) {
          throw new Error(saveData.message || 'Failed to save registration');
        }

        const workshops = workshopIds || '';

        localStorage.setItem('last_active_email', email);

        if (workshops) {
          localStorage.setItem(
            `purchase_${email}`,
            JSON.stringify(workshops.split(',').filter(Boolean))
          );
        }

        localStorage.setItem(
          `profile_${email}`,
          JSON.stringify(detailsParsed)
        );

        setSuccess(true);
        setMessage('Payment successful — registration saved.');

        setTimeout(() => {
          window.location.href = '/online-workshops';
        }, 2000);
      } catch (err) {
        console.error(err);
        setMessage(
          err instanceof Error
            ? err.message
            : 'Verification failed. Registration was not saved.'
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 text-center">
      {loading ? (
        <Loader2 className="animate-spin text-[#3b82f6]" size={50} />
      ) : success ? (
        <CheckCircle2 className="text-green-500" size={60} />
      ) : (
        <XCircle className="text-red-500" size={60} />
      )}

      <p className="mt-6 text-xl font-bold max-w-lg">{message}</p>
    </div>
  );
}
