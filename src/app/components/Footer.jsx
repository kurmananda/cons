"use client";

const Footer = () => {
  return (
    <footer className="bg-black py-12 px-6 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* BRAND */}
        <div className="flex items-center gap-2">
          <span className="text-white font-black uppercase tracking-tighter text-lg italic">
            Conscientia<span className="text-yellow-600">.</span>
          </span>
          <span className="text-neutral-300 text-[10px] font-bold uppercase tracking-widest ml-2">
            Research Initiative
          </span>
        </div>

        {/* INFO */}
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] text-center">
          © 2026 • Indian Institute of Space Science and Technology • Dept. of Space, Govt. of India
        </p>

        {/* STATUS */}
        <div className="flex gap-6">
          <span className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest">
            Tech fest 2026
          </span>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;