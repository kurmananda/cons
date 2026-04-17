"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { X, Menu, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [hidden, setHidden] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
      setIsOpen(false);
    } else {
      setHidden(false);
    }
  });

  const navLinks = [
    { name: 'Results', href: '#stats' },
    { name: 'Prof', href: '#professor' },
    { name: 'Thanks', href: '#thanks' },
  ];

  const teamMembers = [
    { name: "ATCHYUTA", role: "Research", img: "https://www.iist.ac.in/sites/default/files/profile_photos/profile_SC24B088.jpg" },
    { name: "VEDANATHAN", role: "Analysis", img: "https://www.iist.ac.in/sites/default/files/profile_photos/profile_SC24B133.jpg" },
    { name: "KURMANANDA", role: "Developer", img: "https://www.iist.ac.in/sites/default/files/profile_photos/profile_SC24B144.jpg" },
    { name: "NISH", role: "Data and Insights", img: "https://www.iist.ac.in/sites/default/files/profile_photos/profile_SC24B107.jpg" },
  ];

  const menuVariants = {
    closed: { x: "100%", transition: { type: "spring", damping: 30, stiffness: 300 } },
    open: { x: 0, transition: { type: "spring", damping: 30, stiffness: 300 } }
  };

  const linkVariants = {
    closed: { opacity: 0, x: 20 },
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.1 + i * 0.1, duration: 0.4 }
    })
  };

  return (
    <>
      <motion.div
        variants={{ visible: { y: 0 }, hidden: { y: "-120%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="fixed h-[10vh] top-0 w-full flex justify-center pt-6 z-[70] px-4"
      >
        <nav className="w-full max-w-5xl bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-6 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.7)]">

          {/* LEFT: Logo & Name */}
          <div className="flex-1 flex items-center gap-3 z-[80]">
            <Link href="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.15, rotate: -8 }}
                className="w-10 h-10 relative rounded-xl overflow-hidden bg-yellow-500"
              >
                <Image
                  src="/assets/image1.png"
                  alt="Logo"
                  fill
                  priority // This handles the 'eager' loading and LCP warning
                  sizes="40px" // Tells the browser the exact size since it's in a w-10 h-10 (40px) div
                  className="object-contain"
                />
              </motion.div>
              <span className="text-white font-black uppercase tracking-tighter text-sm">Conscientia</span>
            </Link>
          </div>

          <div className="flex-1 flex justify-end items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = './online-workshops'}
              className="group flex relative overflow-hidden bg-yellow-500 px-8 py-2.5 rounded-xl border border-yellow-500 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)]"
            >
              <span className="absolute inset-0 w-full h-full bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative z-10 text-black group-hover:text-yellow-400 font-black text-xs uppercase tracking-tighter flex items-center gap-2 transition-colors duration-300">
                Register
              </span>
              <div className="absolute inset-0 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.button>

          </div>
        </nav>
      </motion.div>


    </>
  );
  // return (
  //   <>
  //     <motion.div
  //       variants={{ visible: { y: 0 }, hidden: { y: "-120%" } }}
  //       animate={hidden ? "hidden" : "visible"}
  //       transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
  //       className="fixed h-[10vh] top-0 w-full flex justify-center pt-6 z-[70] px-4"
  //     >
  //       <nav className="w-full max-w-5xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-6 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.7)]">

  //         {/* LEFT: Logo & Name */}
  //         <div className="flex-1 flex items-center gap-3 z-[80]">
  //           <Link href="/" className="flex items-center gap-3">
  //             <motion.div
  //               whileHover={{ scale: 1.15, rotate: -8 }}
  //               className="w-10 h-10 relative rounded-lg overflow-hidden bg-yellow-500"
  //             >
  //               <Image
  //                 src="/assets/image.png"
  //                 alt="Logo"
  //                 fill
  //                 priority // This handles the 'eager' loading and LCP warning
  //                 sizes="40px" // Tells the browser the exact size since it's in a w-10 h-10 (40px) div
  //                 className="object-contain"
  //               />
  //             </motion.div>
  //             <span className="text-white font-black uppercase tracking-tighter text-sm">Conscientia</span>
  //           </Link>
  //         </div>

  //         {/* MIDDLE: PC Links */}
  //         <div className="flex-[2] hidden md:flex items-center justify-center space-x-3">
  //           {navLinks.map((link) => (
  //             <a
  //               key={link.name}
  //               href={link.href}
  //               className="relative px-7 py-3 overflow-hidden rounded-xl group border border-white/5 hover:border-yellow-400/30 transition-colors duration-500"
  //             >
  //               <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/10 blur-xl transition-all duration-500" />
  //               <span className="absolute inset-0 w-full h-full bg-yellow-400 transform -translate-y-[101%] group-hover:translate-y-0 transition-transform duration-[400ms]" />
  //               <div className="relative z-10 h-4 overflow-hidden">
  //                 <span className="flex flex-col transition-transform duration-500 group-hover:-translate-y-1/2">
  //                   <span className="text-white/80 font-bold tracking-[0.2em] text-[11px] uppercase h-4 flex items-center justify-center italic">{link.name}</span>
  //                   <span className="text-black font-black tracking-[0.2em] text-[11px] uppercase h-4 flex items-center justify-center italic">{link.name}</span>
  //                 </span>
  //               </div>
  //             </a>
  //           ))}
  //           <button
  //             onClick={() => setShowTeam(true)}
  //             className="px-7 py-3 text-white font-bold tracking-[0.2em] text-[11px] uppercase hover:text-yellow-400 bg-black/40 rounded-lg hover:bg-black/60 transition-colors italic duration-100"
  //           >
  //             Team
  //           </button>
  //         </div>

  //         {/* RIGHT: High-Impact Profile Button */}
  //         <div className="flex-1 flex justify-end items-center gap-3">
  //           <motion.button
  //             whileHover={{ scale: 1.05 }}
  //             whileTap={{ scale: 0.95 }}
  //             onClick={() => document.getElementById('swiper')?.scrollIntoView({ behavior: 'smooth' })}
  //             className="group hidden md:flex relative overflow-hidden bg-yellow-500 px-8 py-2.5 rounded-xl border border-yellow-500 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)]"
  //           >
  //             <span className="absolute inset-0 w-full h-full bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
  //             <span className="relative z-10 text-black group-hover:text-yellow-400 font-black text-xs uppercase tracking-tighter flex items-center gap-2 transition-colors duration-300">
  //               Survey
  //             </span>
  //             <div className="absolute inset-0 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
  //           </motion.button>

  //           <button onClick={() => setIsOpen(!isOpen)} className="md:hidden z-[80] p-2 text-white">
  //             <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
  //               {isOpen ? <X size={28} /> : <Menu size={28} />}
  //             </motion.div>
  //           </button>
  //         </div>
  //       </nav>
  //     </motion.div>

  //     {/* MOBILE OVERLAY */}
  //     <AnimatePresence>
  //       {isOpen && (
  //         <motion.div
  //           variants={menuVariants}
  //           initial="closed"
  //           animate="open"
  //           exit="closed"
  //           className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl flex flex-col p-10 pt-40 md:hidden"
  //         >
  //           <div className="flex flex-col gap-10">
  //             {navLinks.map((link, i) => (
  //               <motion.a
  //                 custom={i}
  //                 variants={linkVariants}
  //                 initial="closed"
  //                 animate="open"
  //                 key={link.name}
  //                 href={link.href}
  //                 onClick={() => setIsOpen(false)}
  //                 className="text-white text-6xl font-black uppercase tracking-tighter italic flex items-center justify-between"
  //               >
  //                 {link.name} <ArrowRight className="text-yellow-500" size={32} />
  //               </motion.a>
  //             ))}

  //             <motion.button
  //               custom={3}
  //               variants={linkVariants}
  //               initial="closed"
  //               animate="open"
  //               onClick={() => { setShowTeam(true); setIsOpen(false); }}
  //               className="text-white text-6xl font-black uppercase tracking-tighter italic text-left"
  //             >
  //               Team
  //             </motion.button>
  //           </div>

  //           <motion.button
  //             initial={{ opacity: 0, y: 20 }}
  //             animate={{ opacity: 1, y: 0 }}
  //             transition={{ delay: 0.5 }}
  //             onClick={() => { document.getElementById('swiper')?.scrollIntoView({ behavior: 'smooth' }); setIsOpen(false); }}
  //             className="mt-auto w-full bg-yellow-500 py-6 rounded-3xl text-black font-black uppercase tracking-widest text-lg"
  //           >
  //             Take Survey
  //           </motion.button>
  //         </motion.div>
  //       )}
  //     </AnimatePresence>

  //     {/* TEAM POPUP */}
  //     <AnimatePresence>
  //       {showTeam && (
  //         <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
  //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTeam(false)} className="absolute inset-0 bg-black/70 backdrop-blur-xl" />
  //           <motion.div
  //             initial={{ y: "100%" }}
  //             animate={{ y: 0 }}
  //             exit={{ y: "100%" }}
  //             transition={{ type: "spring", damping: 25, stiffness: 200 }}
  //             className="relative bg-white border border-neutral-200 rounded-t-[3rem] md:rounded-[3rem] p-10 md:p-12 max-w-2xl w-full h-[85vh] md:h-auto overflow-hidden"
  //           >
  //             <button onClick={() => setShowTeam(false)} className="absolute top-8 right-8 text-neutral-400 hover:text-black transition-all">
  //               <X size={28} />
  //             </button>
  //             <div className="mb-10">
  //               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-600 block mb-2">Contributors</span>
  //               <h3 className="text-4xl font-black uppercase tracking-tighter italic text-neutral-900">The Team<span className="text-yellow-600">.</span></h3>
  //             </div>
  //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 overflow-y-auto max-h-[55vh] pr-2 pb-10">
  //               {teamMembers.map((m, i) => (
  //                 <motion.div
  //                   key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
  //                   className="flex items-center gap-5 p-4 rounded-3xl border border-neutral-100 bg-neutral-50/50"
  //                 >
  //                   <img src={m.img} className="w-16 h-16 rounded-2xl object-cover" alt={m.name} />
  //                   <div className="text-left">
  //                     <p className="text-sm font-black uppercase text-neutral-900 leading-none mb-1">{m.name}</p>
  //                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{m.role}</p>
  //                   </div>
  //                 </motion.div>
  //               ))}
  //             </div>
  //           </motion.div>
  //         </div>
  //       )}
  //     </AnimatePresence>
  //   </>
  // );
};

export default Navbar;