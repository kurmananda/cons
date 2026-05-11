'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ArrowRight,
  Rocket,
  Cpu,
  Satellite,
  Brain,
  Info,
  Loader2,
  Sparkles,
  ShoppingCart,
  Lock,
  ChevronRight,
} from 'lucide-react';

import { createClient } from '@supabase/supabase-js';
import { details } from 'framer-motion/client';



// --- INITIALIZE SUPABASE ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default function WorkshopRegistration() {

  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const [step, setStep] = useState(1);

  const [selectedItems, setSelectedItems] = useState([]);
  const [registeredItems, setRegisteredItems] = useState([]);

  const [comboApplied, setComboApplied] = useState(false);

  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const detailsRef = useRef(null);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    class: '',
    schoolId: '',
    college: '',
    city: '',
    phone: '',
  });

  useEffect(() => {
    if (selectedWorkshop && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedWorkshop]);

  // --- WORKSHOP DATA ---
  const workshops = [
    {
      id: '1',
      name: 'Cube Sat Workshop',
      price: 349,
      desc: 'Hand on experience with multiple subsystems of sattelite design and operation.',
      details : ['1. End to end concepts of Cubesat design', '2. Learn from experts who have worked on in-flight satellites.', '3. Understand mission design and space fundamentals'],
      icon: <Satellite size={20} />,
    },
    {
      id: '2',
      name: 'Launch Vehicle Workshop',
      price: 349,
      desc: 'Deep understanding of launch vehicle dynamics and mission design.',
      details : ['1. End to end concepts of Launch Vehicles', '2. Understand mission design and space fundamentals', '3. Explore propulsion, staging, and flight dynamics basics'],
      icon: <Rocket size={20} />,
    },
    {
      id: '3',
      name: 'Agentic AI Workshop',
      price: 299,
      desc: 'Explore the fundamentals of agentic AI and its applications.',
      details : ['1. Explore the basics of prompt engineering', '2. Optimize AI usage for maximum productivity', '3. Hands on learning with AI agents.'],
      icon: <Cpu size={20} />,
    },
    {
      id: '4',
      name: 'Python ML Workshop',
      price: 299,
      desc: 'Training a real world model with Python and machine learning.',
      details : ['1. Explore the basics of python and machine learning', '2. Understand concepts with application focused learning', '3. Develop industry focused skills.'],
      icon: <Brain size={20} />,
    },
  ];

  const merchItem = {
    id: '5',
    name: 'Space Merch',
    price: 599,
    desc: 'Official Conscientia 2026 exclusive merchandise.',
  };

  const combos = [
    { id: 'c1', name: 'Space Combo', ids: ['1', '2'], price: 649 },
    { id: 'c2', name: 'AI Combo', ids: ['3', '4'], price: 549 },
    { id: 'c3', name: 'Mega Combo', ids: ['1', '2', '3', '4'], price: 1149 },
    { id: 'c4', name: 'Ultimate Combo', ids: ['1', '2', '3', '4', '5'], price: 1699 },
  ];

  // --- VALIDATIONS ---
  const isPhoneValid =
    formData.phone.replace(/\D/g, '').length >= 10;

  const isEmailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const isStep2Valid =
    Object.values(formData).every(
      (val) => val.trim() !== ''
    );

  // --- COMBO LOGIC ---
  const qualifyingCombo = useMemo(() => {
    const sortedCombos = [...combos].sort(
      (a, b) => b.ids.length - a.ids.length
    );

    return sortedCombos.find((c) =>
      c.ids.every((id) =>
        [...selectedItems, ...registeredItems].includes(id)
      )
    );
  }, [selectedItems, registeredItems]);

  const activeCombo = comboApplied
    ? qualifyingCombo
    : null;

  const totalAmount = useMemo(() => {

    const allPossibleItems = [
      ...workshops,
      merchItem,
    ];

    const itemsToPayFor = selectedItems.filter(
      (id) => !registeredItems.includes(id)
    );

    if (activeCombo) {

      const nonComboItems = allPossibleItems.filter(
        (w) =>
          itemsToPayFor.includes(w.id) &&
          !activeCombo.ids.includes(w.id)
      );

      const extraPrice = nonComboItems.reduce(
        (acc, curr) => acc + curr.price,
        0
      );

      return activeCombo.price + extraPrice;
    }

    return allPossibleItems
      .filter((w) => itemsToPayFor.includes(w.id))
      .reduce((acc, curr) => acc + curr.price, 0);

  }, [selectedItems, registeredItems, activeCombo]);

  // --- SELECTION HANDLERS ---
  const toggleSelection = (id) => {

    if (registeredItems.includes(id)) return;

    setSelectedItems((prev) => {

      const isSelected = prev.includes(id);

      const newItems = isSelected
        ? prev.filter((i) => i !== id)
        : [...prev, id];

      if (
        isSelected &&
        activeCombo?.ids.includes(id)
      ) {
        setComboApplied(false);
      }

      return newItems;
    });
  };

  const selectCombo = (ids) => {

    const freshIds = ids.filter(
      (id) => !registeredItems.includes(id)
    );

    setSelectedItems((prev) =>
      Array.from(new Set([...prev, ...freshIds]))
    );

    setComboApplied(true);
  };

  // --- PERSISTENCE ---
  useEffect(() => {

    const fetchUserData = async () => {
      const lastEmail =
        localStorage.getItem('last_active_email');

      if (lastEmail) {
        try {
          const { data } = await supabase
            .from('registrations')
            .select('*')
            .eq('email', lastEmail.toLowerCase().trim())
            .maybeSingle();

          if (data && data.status === 'confirmed') {
            const paidWorkshopIds = Array.isArray(data.workshop_ids)
              ? data.workshop_ids
              : typeof data.workshop_ids === 'string'
                ? data.workshop_ids.split(',').map(id => id.trim())
                : [];

            setRegisteredItems(paidWorkshopIds);
            setFormData(
              data.details || {
                email: data.email,
                name: '',
                class: '',
                schoolId: '',
                college: '',
                city: '',
                phone: '',
              }
            );
            setStep(4);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }

      setLoading(false);
    };

    fetchUserData();

  }, []);

  // --- EMAIL CHECK ---
  const handleEmailCheck = async () => {

    if (!isEmailValid) return;

    setIsChecking(true);

    try {

      const { data } = await supabase
        .from('registrations')
        .select('*')
        .eq(
          'email',
          formData.email.toLowerCase().trim()
        )
        .maybeSingle();

      if (data && data.status === 'confirmed') {

        const paidWorkshopIds = Array.isArray(data.workshop_ids)
          ? data.workshop_ids
          : typeof data.workshop_ids === 'string'
            ? data.workshop_ids.split(',').map(id => id.trim())
            : [];

        setRegisteredItems(paidWorkshopIds);

        setFormData(
          data.details || {
            ...formData,
            email: data.email,
          }
        );

        localStorage.setItem(
          'last_active_email',
          data.email
        );

        setStep(4);

      } else {

        localStorage.setItem(
          'last_active_email',
          formData.email.toLowerCase()
        );

        setStep(2);
      }

    } catch (err) {

      console.error(err);

      setStep(2);

    } finally {

      setIsChecking(false);
    }
  };

  // =========================================================
  // ================= PAYMENT FUNCTION FIX ==================
  // =========================================================

  const handlePayment = async () => {
  if (selectedItems.length === 0) return;

  setIsChecking(true);

  try {
    // Mapping of your local IDs to TiQR Ticket IDs
    const TICKET_MAPPING = {
      '1': 3046, // Cube Sat
      '2': 3045, // Launch Vehicle
      '3': 3043, // Agentic AI
      '4': 3044, // Python ML
      '5': 3049, // Space Merch
      'c1': 3048, // Space Combo
      'c2': 3047, // AI Combo
      'c3': 3042, // Mega Combo
      'c4': 3050  // Ultimate Combo
    };

    // FILTER ONLY NEW ITEMS
    const payableItems = selectedItems.filter(
      (id) => !registeredItems.includes(id)
    );

    if (payableItems.length === 0) {
      alert('You already own these modules');
      setIsChecking(false);
      return;
    }

    // DETERMINE TICKET ID AND QUANTITY
    let finalTicketId;
    let finalQuantity = "1";

    if (activeCombo) {
      // Use the specific Ticket ID for the Bundle
      finalTicketId = TICKET_MAPPING[activeCombo.id];
      finalQuantity = "1";
    } else {
      // If multiple individual workshops are selected (without a combo)
      // and you want to process them in one transaction, 
      // check if your TiQR event setup allows multiple workshops under one ticket
      // Otherwise, we default to the first selected item or a generic workshop ticket
      finalTicketId = TICKET_MAPPING[payableItems[0]];
      finalQuantity = String(payableItems.length);
    }

    // SAVE TO LOCALSTORAGE (TEMPORARY FOR PAYMENT FLOW)
    localStorage.setItem(
      'registration_email',
      formData.email.toLowerCase().trim()
    );

    localStorage.setItem(
      'selected_workshops',
      payableItems.join(',')
    );

    localStorage.setItem(
      'registration_details',
      JSON.stringify(formData)
    );

    const baseUrl = window.location.origin;

    // CREATE BOOKING WITH TIQR
    const response = await fetch('/api/tiqr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: formData.name.split(' ')[0] || '',
        last_name: formData.name.split(' ').slice(1).join(' ') || '',
        phone_number: `+91${formData.phone.replace(/\D/g, '').slice(-10)}`,
        email: formData.email.toLowerCase().trim(),
        ticket: finalTicketId, // DYNAMIC TICKET ID
        quantity: finalQuantity,
        meta_data: {
          workshop_ids: payableItems.join(','),
          college: formData.college,
          is_new_registration: registeredItems.length === 0 ? 'true' : 'false',
          is_combo: activeCombo ? 'true' : 'false',
          combo_name: activeCombo ? activeCombo.name : 'none'
        },
        callback_url: `${baseUrl}/payment-success`,
      }),
    });

    const bookingData = await response.json();

    if (!response.ok) {
      const bookingError =
        bookingData.message ||
        bookingData.detail ||
        (Array.isArray(bookingData.non_field_errors)
          ? bookingData.non_field_errors.join(', ')
          : undefined) ||
        (typeof bookingData.error === 'string'
          ? bookingData.error
          : undefined);

      throw new Error(bookingError || 'Booking creation failed');
    }

    localStorage.setItem('tiqr_booking_id', String(bookingData.booking?.id || ''));
    localStorage.setItem('tiqr_booking_uid', bookingData.booking?.uid || '');
    localStorage.setItem(
      'tiqr_participant_identification_id',
      bookingData.booking?.participant_identification_id || ''
    );
    localStorage.setItem(
      'tiqr_booking_payment_url',
      bookingData.payment?.url_to_redirect || ''
    );

    if (bookingData.payment?.url_to_redirect) {
      window.location.href = bookingData.payment.url_to_redirect;
    } else {
      window.location.href = `/payment-success?booking_uid=${encodeURIComponent(
        bookingData.booking?.uid || ''
      )}&amount=${totalAmount}`;
    }
  } catch (err) {
    console.error(err);
    alert(`Booking Error: ${err.message}`);
  } finally {
    setIsChecking(false);
  }
};

  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]" />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#3b82f6]/30 flex flex-col items-center">

      <nav className="pb-5 border-b border-white/5 flex w-full items-center justify-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex gap-3 pt-5">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{
                width: step === i ? 40 : 12,
                backgroundColor:
                  step >= i
                    ? '#3b82f6'
                    : '#262626',
              }}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>
      </nav>
      <main className="max-w-5xl w-full mx-auto p-6 pt-12 pb-40">
        {step < 4 && (
          <div className="mb-8 flex items-center gap-3 p-4 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-2xl">
            <Info className="text-[#3b82f6] shrink-0" size={20} />
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#3b82f6]/80 leading-relaxed">
              Note: Confirmation and meeting links will be sent exclusively to your registered email address.
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: EMAIL */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-md mx-auto space-y-8 mt-12">
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-black uppercase tracking-tighter italic">Workshop Registration<span className="text-[#3b82f6]">.</span></h1>
                <p className="text-neutral-500 text-sm font-bold tracking-widest uppercase">Enter email to proceed</p>
              </div>
              <div className="space-y-4">
                <input
                  type="email" placeholder="student@university.edu" value={formData.email}
                  className="w-full bg-neutral-900 border border-neutral-800 p-5 rounded-2xl focus:border-[#3b82f6] outline-none text-white transition-all"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <button
                  onClick={handleEmailCheck} disabled={!isEmailValid || isChecking}
                  className="w-full bg-[#3b82f6] text-black p-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isChecking ? <Loader2 className="animate-spin" size={18} /> : "Verify Credentials"}
                  {!isChecking && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PROFILE DETAILS */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
              <div className="text-center">
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">Details Required<span className="text-[#3b82f6] text-6xl leading-none">.</span></h1>
                <p className="text-neutral-500 text-sm font-black uppercase tracking-[0.2em] mt-2">All fields are mandatory for certification</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['name', 'class', 'schoolId', 'college', 'city', 'phone'].map(field => {
                  const displayLabels = { college: 'School / College', schoolId: 'ID Number / Roll No', name: 'Full Name', class: 'Grade / Year', phone: 'WhatsApp Number' };
                  return (
                    <div key={field} className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3b82f6] ml-2 flex items-center gap-2">
                        {displayLabels[field] || field}
                      </label>
                      <input
                        placeholder={field === 'phone' ? '91XXXXXXXXXX' : `Enter ${displayLabels[field] || field}`}
                        value={formData[field]}
                        className="w-full bg-neutral-900 border border-neutral-800 p-4 rounded-xl focus:border-[#3b82f6] outline-none text-white transition-all"
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      />
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => isPhoneValid ? setStep(3) : alert("Valid WhatsApp number required")}
                disabled={!isStep2Valid}
                className="w-full bg-white text-black p-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#3b82f6] transition-all disabled:opacity-30"
              >
                Proceed to Selection
              </button>
            </motion.div>
          )}

          {/* STEP 3: WORKSHOP SELECTION */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-20">
              {/* MERCH SECTION */}
              <section>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-6">Space Merch<span className="text-[#3b82f6]">.</span></h2>
                <div className={`relative overflow-hidden rounded-[2.5rem] border-2 transition-all duration-500 ${registeredItems.includes('5') ? 'border-green-500/50 bg-green-500/5 shadow-none' : selectedItems.includes('5') ? 'border-[#3b82f6] bg-[#3b82f6]/5 shadow-[0_0_50px_rgba(59,130,246,0.1)]' : 'border-white/5 bg-neutral-900/40'}`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-12">
                    <div className="flex gap-4 h-64 md:h-80">
                      <div className="flex-1 relative rounded-2xl overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center text-[10px] font-black text-white/10 uppercase tracking-widest">Front View</div>
                      <div className="flex-1 relative rounded-2xl overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center text-[10px] font-black text-white/10 uppercase tracking-widest">Back View</div>
                    </div>
                    <div className="flex flex-col justify-center space-y-6">
                      <div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">{merchItem.name}</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">{merchItem.desc}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-3xl font-black text-[#3b82f6]">₹{merchItem.price}</div>
                        <button
                          onClick={() => toggleSelection('5')}
                          disabled={registeredItems.includes('5')}
                          className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${registeredItems.includes('5') ? 'bg-green-500/20 text-green-500' : selectedItems.includes('5') ? 'bg-[#3b82f6] text-black' : 'bg-white text-black hover:bg-[#3b82f6]'}`}
                        >
                          {registeredItems.includes('5') ? <Lock size={18} /> : selectedItems.includes('5') ? <Check size={18} /> : <ShoppingCart size={18} />}
                          {registeredItems.includes('5') ? 'Purchased' : selectedItems.includes('5') ? 'Remove' : 'Add to Kit'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* COMBOS */}
              <section>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Bundles<span className="text-[#3b82f6]">.</span></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {combos.map(combo => {
                    const alreadyOwnsAll = combo.ids.every(id => registeredItems.includes(id));
                    return (
                      <div key={combo.id} className="p-6 rounded-[2rem] bg-neutral-900 border border-white/5 flex flex-col justify-between hover:border-[#3b82f6]/40 transition-colors">
                        <h4 className="font-black italic uppercase tracking-tighter text-lg">{combo.name}</h4>
                        <div className="mt-6">
                          <div className="text-[#3b82f6] font-black text-xl mb-3">₹{combo.price}</div>
                          <button
                            disabled={alreadyOwnsAll}
                            onClick={() => selectCombo(combo.ids)}
                            className="w-full py-2.5 bg-neutral-800 disabled:opacity-20 hover:bg-[#3b82f6] hover:text-black rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                          >
                            {alreadyOwnsAll ? 'Owned' : 'Apply Combo'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* INDIVIDUAL */}
              <section>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">Workshops<span className="text-[#3b82f6]">.</span></h2>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-4">(Click on the workshop to expand details below)</p>
                <h1 className="text-xl uppercase mb-8"></h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {workshops.map(ws => {
                    const isRegistered = registeredItems.includes(ws.id);
                    const isOpen = selectedWorkshop?.id === ws.id;
                    return (
                      <div
                        key={ws.id}
                        onClick={() => setSelectedWorkshop(isOpen ? null : ws)}
                        className={`cursor-pointer p-6 rounded-[2rem] border-2 transition-all ${isRegistered ? 'border-green-500/20 bg-green-500/5 shadow-[0_0_35px_rgba(34,197,94,0.25)]' : isOpen ? 'border-[#3b82f6] bg-[#3b82f6]/10 shadow-[0_0_40px_rgba(59,130,246,0.3)]' : selectedItems.includes(ws.id) ? 'border-[#3b82f6] bg-[#3b82f6]/5' : 'border-white/5 bg-neutral-900/40'}`}
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className={`p-3 rounded-xl ${isRegistered ? 'bg-green-500/20 text-green-500' : isOpen ? 'bg-[#3b82f6] text-black shadow-[0_0_20px_rgba(59,130,246,0.3)]' : selectedItems.includes(ws.id) ? 'bg-[#3b82f6] text-black' : 'bg-neutral-800'}`}>{ws.icon}</div>
                          {isRegistered ? <Lock size={18} className="text-green-500" /> : selectedItems.includes(ws.id) && <Check size={18} className="text-[#3b82f6]" />}
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-4">{isOpen ? 'Details open' : '(Details below)'}</p>
                        <h3 className="font-black italic uppercase tracking-tighter text-lg mb-1">{ws.name}</h3>
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs font-black text-neutral-500 uppercase">{isRegistered ? 'Enrolled' : `₹${ws.price}`}</div>
                          {isOpen && <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3b82f6]">Details Open</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* WORKSHOP DETAILS */}
                <AnimatePresence>
                  {selectedWorkshop && (
                    <motion.div
                      ref={detailsRef}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-8 p-8 bg-neutral-900/50 rounded-[2rem] border border-white/5"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="p-4 bg-[#3b82f6] text-black rounded-2xl">{selectedWorkshop.icon}</div>
                          <div>
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">{selectedWorkshop.name}</h3>
                            <p className="text-neutral-400 text-sm mt-1 leading-relaxed">{selectedWorkshop.desc}</p>
                          </div>
                        </div>
                        <button onClick={() => setSelectedWorkshop(null)} className="text-neutral-500 hover:text-white text-2xl leading-none">×</button>
                      </div>
                         { selectedWorkshop.details.map((detail, index) => (
                            <p className="text-neutral-400 text-sm mt-1 ml-4 leading-relaxed" key={index}>
                              {detail}
                            </p>
                          ))}
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-black text-[#3b82f6]">₹{selectedWorkshop.price}</div>
                        <button
                          onClick={() => { toggleSelection(selectedWorkshop.id); setSelectedWorkshop(null); }}
                          disabled={registeredItems.includes(selectedWorkshop.id)}
                          className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${registeredItems.includes(selectedWorkshop.id) ? 'bg-green-500/20 text-green-500 border border-green-500/20' : selectedItems.includes(selectedWorkshop.id) ? 'bg-red-500 text-white' : 'bg-[#3b82f6] text-black hover:bg-white'}`}
                        >
                          {registeredItems.includes(selectedWorkshop.id) ? 'Enrolled' : selectedItems.includes(selectedWorkshop.id) ? 'Remove' : 'Select Workshop'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </motion.div>
          )}

          {/* STEP 4: REGISTRATION DASHBOARD */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-12 space-y-12 w-full max-w-2xl mx-auto">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-green-500 text-black rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                  <Check size={40} strokeWidth={3} />
                </div>
                <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-tight">Registration Active<span className="text-green-500">.</span></h1>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 bg-neutral-900 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-400 border border-white/5">{formData.email}</span>
                </div>
              </div>

              <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3b82f6]">Your Dashboard</h3>
                <div className="space-y-3">
                  {[...workshops, merchItem].filter(item => registeredItems.includes(item.id)).map(item => (
                    <div key={item.id} className="flex justify-between items-center p-5 bg-black/40 rounded-2xl border border-white/5 group hover:border-green-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="font-black uppercase italic tracking-tighter text-lg">{item.name}</span>
                      </div>
                      <span className="text-[10px] bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full font-black uppercase tracking-widest border border-green-500/20">Active</span>
                    </div>
                  ))}
                  {registeredItems.length === 0 && <p className="text-neutral-600 italic text-center py-4 uppercase text-[10px] tracking-widest">No Active Modules Found</p>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setStep(3)} className="px-10 py-5 bg-[#3b82f6] text-black rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all">Buy More Modules</button>
                <button
                  onClick={() => {
                    setRegisteredItems([]);
                    setSelectedItems([]);
                    setFormData({
                      email: '',
                      name: '',
                      class: '',
                      schoolId: '',
                      college: '',
                      city: '',
                      phone: ''
                    });

                    setStep(1);
                  }}
                  className="px-10 py-5 bg-neutral-900 text-white border border-white/5 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:border-red-500 transition-all"
                >
                  Logout / Switch Account
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- FLOATING CHECKOUT --- */}
      <AnimatePresence>
        {step === 3 && selectedItems.filter(id => !registeredItems.includes(id)).length > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-black/80 backdrop-blur-2xl border border-white/10 p-6 rounded-[2.5rem] flex justify-between items-center z-[70] shadow-2xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Total Payable</span>
                {activeCombo && <span className="bg-[#3b82f6]/20 text-[#3b82f6] text-[8px] font-black uppercase px-2 py-0.5 rounded border border-[#3b82f6]/20">{activeCombo.name}</span>}
              </div>
              <p className="text-4xl font-black italic tracking-tighter">₹{totalAmount}</p>
              {!activeCombo && qualifyingCombo && (
                <button onClick={() => setComboApplied(true)} className="mt-1 flex items-center gap-1.5 text-[#3b82f6] text-[9px] font-black uppercase tracking-tighter group">
                  <Sparkles size={10} className="group-hover:rotate-12 transition-transform" /> Optimize for {qualifyingCombo.name}?
                </button>
              )}
            </div>
            <button
              disabled={isChecking}
              onClick={handlePayment}
              className="bg-[#3b82f6] text-black px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-white transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {isChecking ? <Loader2 className="animate-spin" size={18} /> : <>Checkout <ChevronRight size={18} /></>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}