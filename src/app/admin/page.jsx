'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Search, X, ChevronRight } from 'lucide-react';

const WORKSHOP_LABELS = {
  '1': 'Cube Sat Workshop',
  '2': 'Launch Vehicle Workshop',
  '3': 'Agentic AI Workshop',
  '4': 'Python ML Workshop',
  '5': 'Space Merch',
  c1: 'Space Combo',
  c2: 'AI Combo',
  c3: 'Mega Combo',
  c4: 'Ultimate Combo',
};

const STATUS_FILTERS = [
  { value: 'all', label: 'All statuses' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending_payment', label: 'Pending payment' },
];

const PAYMENT_FILTERS = [
  { value: 'all', label: 'All payments' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
];

const ADMIN_PASSWORD = 'jobless';

function normalizeRow(row) {
  const details =
    row.details && typeof row.details === 'object' ? row.details : {};
  const workshopIds = Array.isArray(row.workshop_ids)
    ? row.workshop_ids
    : String(row.workshop_ids || '')
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);

  return {
    ...row,
    details,
    workshopIds,
    name: details.name || '—',
    phone: details.phone || '—',
    status: row.status || '—',
    payment_status: row.payment_status || '—',
  };
}

function statusBadgeClass(status) {
  if (status === 'confirmed') {
    return 'bg-green-500/15 text-green-400 border-green-500/30';
  }
  if (status === 'pending_payment') {
    return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  }
  return 'bg-neutral-500/15 text-neutral-400 border-neutral-500/30';
}

export default function AdminPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      sessionStorage.getItem('admin_unlocked') === '1'
    ) {
      setIsUnlocked(true);
    }
  }, []);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/registrations');
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to load registrations');
      }
      setRows((json.data || []).map(normalizeRow));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load failed');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isUnlocked) fetchRows();
  }, [isUnlocked, fetchRows]);

  const handleUnlock = (e) => {
    e.preventDefault();
    setLoginError('');
    const trimmed = passwordInput.trim();
    if (!trimmed) return;
    if (trimmed !== ADMIN_PASSWORD) {
      setLoginError('Incorrect password');
      return;
    }
    sessionStorage.setItem('admin_unlocked', '1');
    setIsUnlocked(true);
    setPasswordInput('');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_unlocked');
    setIsUnlocked(false);
    setRows([]);
    setSelected(null);
    setLoginError('');
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) {
        return false;
      }
      if (paymentFilter !== 'all' && row.payment_status !== paymentFilter) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        row.name,
        row.email,
        row.phone,
        row.status,
        row.payment_status,
        row.workshopIds.join(' '),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [rows, search, statusFilter, paymentFilter]);

  if (!isUnlocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <form
          onSubmit={handleUnlock}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900/80 p-8 space-y-5"
        >
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">
            Admin<span className="text-[#3b82f6]">.</span>
          </h1>
          <p className="text-sm text-neutral-400">Enter admin password to continue.</p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Password"
            className="w-full bg-black border border-neutral-700 rounded-xl p-4 outline-none focus:border-[#3b82f6]"
          />
          {loginError && (
            <p className="text-red-400 text-sm font-semibold">{loginError}</p>
          )}
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-[#3b82f6] text-black font-black uppercase tracking-widest text-sm hover:bg-white transition-colors"
          >
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">
            Registrations<span className="text-[#3b82f6]">.</span>
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            {filtered.length} of {rows.length} records
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="self-start sm:self-auto px-4 py-2 rounded-xl border border-white/15 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white"
        >
          Lock admin
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone, status..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-[#3b82f6] outline-none text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-[#3b82f6] outline-none text-white min-w-[160px]"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-[#3b82f6] outline-none text-white min-w-[160px]"
        >
          {PAYMENT_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => fetchRows()}
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#3b82f6] disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="mb-4 text-red-400 text-sm font-semibold">{error}</p>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#3b82f6]" size={40} />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-neutral-500 py-16">No registrations match.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((row) => (
            <li key={row.email}>
              <button
                type="button"
                onClick={() => setSelected(row)}
                className="w-full text-left rounded-2xl border border-white/10 bg-neutral-900/60 hover:border-[#3b82f6]/40 hover:bg-neutral-900 p-4 sm:p-5 transition-colors group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-neutral-500 mb-0.5">
                        Name
                      </p>
                      <p className="font-bold truncate">{row.name}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-neutral-500 mb-0.5">
                        Email
                      </p>
                      <p className="text-sm truncate text-neutral-300">{row.email}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-neutral-500 mb-0.5">
                        Phone
                      </p>
                      <p className="text-sm truncate">{row.phone}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-neutral-500 mb-0.5">
                        Status
                      </p>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusBadgeClass(row.status)}`}
                      >
                        {row.status}
                      </span>
                      <span className="ml-2 text-[10px] text-neutral-500 uppercase">
                        {row.payment_status}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="hidden sm:block shrink-0 text-neutral-600 group-hover:text-[#3b82f6]" />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-[140] bg-black/75 backdrop-blur-sm flex items-start justify-center p-3 pt-24 sm:pt-28"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl border border-white/10 bg-[#0f0f10] p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">
                  {selected.name}
                </h2>
                <p className="text-neutral-400 text-sm mt-1">{selected.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-2 rounded-xl border border-white/15 hover:bg-white/10"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 text-sm">
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3b82f6] mb-3">
                  Contact
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    ['Phone', selected.phone],
                    ['Class', selected.details.class],
                    ['School / College', selected.details.college],
                    ['City', selected.details.city],
                    ['School ID', selected.details.schoolId],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-black/40 border border-white/5 p-3">
                      <dt className="text-[9px] uppercase tracking-widest text-neutral-500">
                        {label}
                      </dt>
                      <dd className="mt-1 font-medium break-words">
                        {value || '—'}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3b82f6] mb-3">
                  Payment
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    ['Status', selected.status],
                    ['Payment status', selected.payment_status],
                    ['Amount', selected.amount != null ? `₹${selected.amount}` : '—'],
                    ['Payment ID', selected.payment_id],
                    ['Order ID', selected.order_id],
                    ['Updated', selected.updated_at],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-black/40 border border-white/5 p-3">
                      <dt className="text-[9px] uppercase tracking-widest text-neutral-500">
                        {label}
                      </dt>
                      <dd className="mt-1 font-medium break-all">{value || '—'}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3b82f6] mb-3">
                  Workshops / Items
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {selected.workshopIds.length === 0 ? (
                    <li className="text-neutral-500">None</li>
                  ) : (
                    selected.workshopIds.map((id) => (
                      <li
                        key={id}
                        className="px-3 py-1.5 rounded-full bg-[#3b82f6]/15 border border-[#3b82f6]/30 text-[11px] font-bold uppercase"
                      >
                        {WORKSHOP_LABELS[id] || id}
                      </li>
                    ))
                  )}
                </ul>
              </section>

              {(selected.details.merch_size ||
                selected.details.merch_address ||
                selected.details.merch_house_number) && (
                <section>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3b82f6] mb-3">
                    Merch delivery
                  </h3>
                  <dl className="grid grid-cols-1 gap-3">
                    {[
                      ['Size', selected.details.merch_size],
                      ['House', selected.details.merch_house_number],
                      ['Lane', selected.details.merch_lane_name],
                      ['Landmark', selected.details.merch_landmark],
                      ['City', selected.details.merch_city],
                      ['Pincode', selected.details.merch_pincode],
                      ['Full address', selected.details.merch_address],
                    ]
                      .filter(([, v]) => v)
                      .map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-xl bg-black/40 border border-white/5 p-3"
                        >
                          <dt className="text-[9px] uppercase tracking-widest text-neutral-500">
                            {label}
                          </dt>
                          <dd className="mt-1 break-words">{value}</dd>
                        </div>
                      ))}
                  </dl>
                </section>
              )}

              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3b82f6] mb-3">
                  TiQR / Raw
                </h3>
                <pre className="text-xs overflow-x-auto rounded-xl bg-black/50 border border-white/5 p-4 text-neutral-400">
                  {JSON.stringify(selected.details, null, 2)}
                </pre>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
