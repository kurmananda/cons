'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Rocket, Cpu, Satellite, Brain, Info, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
// Replace these with your actual Supabase URL and Anon Key from Project Settings > API
const supabase = createClient(
  'https://jkhtiojmdbvqutikiogt.supabase.co', 
  'sb_publishable_PtVeTAmuW3ldu6PIVgkMIg_iRB3ajyd'
);

export default function WorkshopRegistration() {
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({ 
    email: '', 
    name: '', 
    class: '', 
    schoolId: '', 
    college: '', 
    city: '', 
    phone: '' 
  });

  const workshops = [
    { id: '1', name: 'Satellite Workshop', price: 999, desc: 'Advanced orbital mechanics and nano-satellite design.', icon: <Satellite size={20} /> },
    { id: '2', name: 'Launch Vehicle Workshop', price: 999, desc: 'Aerodynamics and propulsion system implementation.', icon: <Rocket size={20} /> },
    { id: '3', name: 'Python ML for Space', price: 1299, desc: 'Predictive modeling for celestial navigation.', icon: <Brain size={20} /> },
    { id: '4', name: 'Agentic AI', price: 1499, desc: 'Autonomous reasoning for deep space robotics.', icon: <Cpu size={20} /> },
  ];

  const combos = [
    { id: 'c1', name: 'Combo', ids: ['1', '2'], price: 1599, desc: 'Hardware & Propulsion Track' },
    { id: 'c2', name: 'Combo', ids: ['3', '4'], price: 2199, desc: 'AI & Data Science Track' },
  ];

  useEffect(() => {
    const lastEmail = localStorage.getItem('last_active_email');
    if (lastEmail) {
      const purchases = localStorage.getItem(`purchase_${lastEmail}`);
      const profile = localStorage.getItem(`profile_${lastEmail}`);
      if (purchases) {
        setFormData(profile ? JSON.parse(profile) : { email: lastEmail });
        setStep(4);
      } else if (profile) {
        setFormData(JSON.parse(profile));
        setStep(3);
      }
    }
    setLoading(false);
  }, []);

  const activeCombo = combos.find(c => c.ids.every(id => selectedItems.includes(id)));

  const calculateTotal = () => {
    if (activeCombo) {
      const nonComboItems = workshops.filter(w => selectedItems.includes(w.id) && !activeCombo.ids.includes(w.id));
      const extraPrice = nonComboItems.reduce((acc, curr) => acc + curr.price, 0);
      return activeCombo.price + extraPrice;
    }
    return workshops.filter(w => selectedItems.includes(w.id)).reduce((acc, curr) => acc + curr.price, 0);
  };

  const selectCombo = (ids) => {
    setSelectedItems(prev => Array.from(new Set([...prev, ...ids])));
  };

  const toggleSelection = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const isStep2Valid = Object.values(formData).every(val => val.trim() !== '');
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleEmailCheck = async () => {
    if (!isEmailValid) return;
    setIsChecking(true);
    try {
      const { data: user, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('email', formData.email.toLowerCase())
        .single();

      if (user) {
        localStorage.setItem('last_active_email', user.email);
        localStorage.setItem(`profile_${user.email}`, JSON.stringify(user.details));
        localStorage.setItem(`purchase_${user.email}`, JSON.stringify(user.workshops));
        setFormData(user.details);
        setStep(4);
      } else {
        localStorage.setItem('last_active_email', formData.email.toLowerCase());
        setStep(2);
      }
    } catch (err) {
      localStorage.setItem('last_active_email', formData.email.toLowerCase());
      setStep(2);
    } finally {
      setIsChecking(false);
    }
  };

  const handlePayment = async () => {
    if (selectedItems.length === 0) return;
    setIsChecking(true);
    const workshopNames = workshops.filter(w => selectedItems.includes(w.id)).map(w => w.name);
    
    const { error } = await supabase.from('registrations').insert([{
      email: formData.email.toLowerCase(),
      name: formData.name,
      details: formData,
      workshops: workshopNames,
      total_paid: calculateTotal()
    }]);

    if (!error) {
      localStorage.setItem(`purchase_${formData.email}`, JSON.stringify(workshopNames));
      localStorage.setItem(`profile_${formData.email}`, JSON.stringify(formData));
      setStep(4);
    } else {
      alert("Registration failed: " + error.message);
    }
    setIsChecking(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('last_active_email');
    window.location.reload();
  };

  if (loading) return <div className="min-h-screen bg-[#0a0a0a]" />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-yellow-500/30 flex flex-col items-center">
      <nav className="pb-5 border-b border-white/5 flex w-full items-center justify-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex gap-3 pt-5">
          {[1, 2, 3].map(i => (
            <motion.div 
              key={i} 
              animate={{ width: step === i ? 40 : 12, backgroundColor: step >= i ? '#eab308' : '#262626' }}
              className="h-1.5 rounded-full" 
            />
          ))}
        </div>
      </nav>

      <main className="max-w-5xl w-full mx-auto p-6 pt-12 pb-40">
        {step < 4 && (
          <div className="mb-8 flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
            <Info className="text-yellow-500 shrink-0" size={20} />
            <p className="text-[11px] font-bold uppercase tracking-wider text-yellow-500/80 leading-relaxed">
              Note: Confirmation and meeting links will be sent exclusively to your registered email address.
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-md mx-auto space-y-8 mt-12">
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-black uppercase tracking-tighter italic">Workshop Registration<span className="text-yellow-500">.</span></h1>
                <p className="text-neutral-500 text-sm font-bold tracking-widest uppercase">Enter email to proceed</p>
              </div>
              <div className="space-y-4">
                <input 
                  type="email" placeholder="student@university.edu" 
                  value={formData.email}
                  className="w-full bg-neutral-900 border border-neutral-800 p-5 rounded-2xl focus:border-yellow-500 outline-none transition-all text-white"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <button 
                  onClick={handleEmailCheck}
                  disabled={!isEmailValid || isChecking}
                  className="w-full bg-yellow-500 text-black p-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isChecking ? <Loader2 className="animate-spin" size={18} /> : "Verify Credentials"}
                  {!isChecking && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
              <div className="text-center">
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">Details Required<span className="text-yellow-500 text-6xl leading-none">.</span></h1>
                <p className="text-neutral-500 text-sm font-black uppercase tracking-[0.2em] mt-2">All fields are mandatory for certification</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['name', 'class', 'schoolId', 'college', 'city', 'phone'].map(field => {
                  const displayLabels = {
                    college: 'School / College',
                    schoolId: 'ID Number / Roll No',
                    name: 'Full Name',
                    class: 'Grade / Year'
                  };
                  return (
                    <div key={field} className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-[0.3em] text-yellow-500 ml-2">{displayLabels[field] || field} *</label>
                      <input 
                        placeholder={`Enter ${displayLabels[field] || field}`}
                        value={formData[field]}
                        className="w-full bg-neutral-900 border border-neutral-800 p-4 rounded-xl focus:border-yellow-500 outline-none"
                        onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                      />
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setStep(3)} disabled={!isStep2Valid} className="w-full bg-white text-black p-5 rounded-2xl font-black uppercase tracking-widest text-sm disabled:opacity-30">Proceed to Selection</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <div>
                <span className="text-yellow-500 text-[10px] font-black tracking-[0.4em] uppercase">Curated Packages</span>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter mt-2">Exclusive Combos<span className="text-yellow-500">.</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                  {combos.map(combo => (
                    <motion.div key={combo.id} whileHover={{ y: -5 }} className="p-8 rounded-[2rem] bg-neutral-900 border border-neutral-800 relative overflow-hidden group">
                      <h3 className="text-xl font-black italic uppercase tracking-tighter">{combo.name}</h3>
                      <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider mt-1">{combo.desc}</p>
                      <div className="mt-6 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-yellow-500">₹{combo.price}</span>
                      </div>
                      <button onClick={() => selectCombo(combo.ids)} className="mt-6 w-full py-3 bg-neutral-800 hover:bg-yellow-500 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Apply Combo</button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-neutral-500 text-[10px] font-black tracking-[0.4em] uppercase">Core Subjects</span>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter mt-2">Individual Tracks<span className="text-yellow-500">.</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {workshops.map(ws => (
                    <div 
                      key={ws.id} 
                      onClick={() => toggleSelection(ws.id)}
                      className={`group cursor-pointer p-6 rounded-[1.5rem] bg-neutral-900/50 border-2 transition-all relative ${selectedItems.includes(ws.id) ? 'border-yellow-500 bg-neutral-900' : 'border-neutral-800'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`p-3 rounded-xl ${selectedItems.includes(ws.id) ? 'bg-yellow-500 text-black' : 'bg-neutral-800'}`}>{ws.icon}</div>
                        {selectedItems.includes(ws.id) && <Check size={20} className="text-yellow-500" />}
                      </div>
                      <h3 className="mt-4 font-black italic uppercase text-lg tracking-tighter">{ws.name}</h3>
                      <p className="text-neutral-500 text-xs mt-1 leading-relaxed">{ws.desc}</p>
                      <div className="mt-6 flex justify-between items-center">
                        <span className="font-black">₹{ws.price}</span>
                        <span className="text-[10px] font-black uppercase text-neutral-600 tracking-widest">Details</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-20 text-center space-y-10 w-full">
              <div className="w-24 h-24 bg-yellow-500 text-black rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(234,179,8,0.3)]">
                <Check size={48} strokeWidth={4} />
              </div>
              <div className="space-y-2">
                <h1 className="text-6xl font-black uppercase italic tracking-tighter">Registered<span className="text-yellow-500">.</span></h1>
                <p className="text-neutral-500 font-bold tracking-widest uppercase text-xs">Access sequence initiated</p>
              </div>

              <div className="max-w-md mx-auto bg-neutral-900 p-8 rounded-[2rem] border border-neutral-800 text-left space-y-6">
                <div>
                  <span className="text-[10px] font-black text-yellow-500 tracking-[0.3em] uppercase block mb-4">Enrolled Tracks</span>
                  <div className="space-y-3">
                    {JSON.parse(localStorage.getItem(`purchase_${formData.email}`) || '[]').map(name => (
                      <div key={name} className="flex items-center gap-3 text-sm font-bold uppercase italic tracking-tight">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" /> {name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <span className="text-[10px] font-black text-neutral-500 tracking-[0.3em] uppercase block mb-2">Access Instructions</span>
                  <p className="text-xs text-neutral-400 leading-relaxed font-medium italic">
                    Meeting links and session credentials have been sent to <span className="text-white">{formData.email}</span>. 
                    Links will also appear <span className="text-yellow-500">right here</span> on the scheduled date of the workshop.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 max-w-xs mx-auto">
                 <button onClick={() => window.location.reload()} className="px-12 py-5 bg-white text-black rounded-full font-black uppercase tracking-widest text-xs hover:bg-neutral-200 transition-all">Refresh Status</button>
                 <button onClick={handleLogout} className="text-neutral-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Switch Account</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {step === 3 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-black/80 backdrop-blur-2xl border border-white/10 p-6 rounded-[2.5rem] flex justify-between items-center z-[70] space-x-10 shadow-2xl">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Total Amount</span>
                {activeCombo && <span className="bg-yellow-500/10 text-yellow-500 text-[8px] font-black uppercase px-2 py-1 rounded-md border border-yellow-500/20">{activeCombo.name}</span>}
              </div>
              <p className="text-3xl font-black italic tracking-tighter mt-1">₹{calculateTotal()}</p>
            </div>
            <button 
              disabled={selectedItems.length === 0 || isChecking}
              onClick={handlePayment} 
              className="bg-yellow-500 text-black px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-yellow-400 disabled:bg-neutral-800 transition-all"
            >
              {isChecking ? <Loader2 className="animate-spin" size={18} /> : "Confirm & Pay"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}