"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const DarkVeil = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="absolute inset-0 bg-[#050505] pointer-events-none" />;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#050505] z-0">
      {/* Static mesh noise texture (optional but adds grit) */}
      <div 
        className="absolute inset-0 opacity-[0.03] z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main blurred gradient overlay */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 40%, rgba(34, 197, 94, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 80% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 50% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 60%)
          `,
          filter: "blur(60px)",
        }}
      />

      {/* Moving blobs for dynamic veil effect */}
      <motion.div 
        animate={{ 
          rotate: 360, 
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[100px]" 
      />
      
      <motion.div 
        animate={{ 
          rotate: -360, 
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-900/10 rounded-full blur-[100px]" 
      />

      <motion.div 
        animate={{ 
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-green-900/5 rounded-[100%] blur-[120px]" 
      />
    </div>
  );
};

export default DarkVeil;
