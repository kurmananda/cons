'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://aeytetacgdmxtsotjfti.supabase.co',
  'sb_publishable_waq7AxdRDLcOndA5NF5vKg_HSr9IAn8'
);

export default function PaymentStatus() {
  const searchParams = useSearchParams();

  const [status, setStatus] = useState('Checking payment...');

  useEffect(() => {
    const verify = async () => {
      try {
        const orderId = searchParams.get('order_id');

        const res = await fetch(`/api/verify-payment?order_id=${orderId}`);

        const data = await res.json();

        if (data.order_status === 'PAID') {
          const pending = JSON.parse(
            localStorage.getItem('pending_registration')
          );

          if (!pending) return;

          const existing = await supabase
            .from('registrations')
            .select('*')
            .eq('email', pending.formData.email)
            .single();

          let mergedWorkshops = pending.selectedItems;

          if (existing.data?.workshop_ids) {
            mergedWorkshops = [
              ...new Set([
                ...existing.data.workshop_ids,
                ...pending.selectedItems,
              ]),
            ];
          }

          await supabase.from('registrations').upsert({
            email: pending.formData.email,
            name: pending.formData.name,
            class: pending.formData.class,
            school_id: pending.formData.schoolId,
            college: pending.formData.college,
            city: pending.formData.city,
            phone: pending.formData.phone,

            workshop_ids: mergedWorkshops,

            cashfree_order_id: data.order_id,
            payment_status: data.order_status,
          });

          localStorage.setItem(
            'last_active_email',
            pending.formData.email
          );

          localStorage.removeItem('pending_registration');

          setStatus('Payment Successful');

          setTimeout(() => {
            window.location.href = '/online-workshops';
          }, 2000);
        } else {
          setStatus('Payment Failed');
        }
      } catch (err) {
        console.log(err);
        setStatus('Verification Failed');
      }
    };

    verify();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center text-4xl font-bold">
      {status}
    </div>
  );
}