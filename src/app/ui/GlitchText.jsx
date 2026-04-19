"use client";
import React from 'react';

const GlitchText = ({ text, className = '', continuous = false }) => {
  return (
    <div className={`relative inline-block ${className} ${!continuous ? 'group' : ''}`}>
      {/* Base Text */}
      <span className="relative z-10 block">{text}</span>
      
      {/* Red Channel Glitch */}
      <span 
        className={`absolute top-0 left-0 -translate-x-[2px] translate-y-[2px] text-[#EF4444] opacity-70 mix-blend-screen z-0 block
          ${continuous ? 'animate-[pulse_0.4s_infinite]' : 'animate-[pulse_2s_infinite] group-hover:animate-[ping_0.6s_infinite]'}`}
        aria-hidden="true"
      >
        {text}
      </span>
      
      {/* Blue Channel Glitch */}
      <span 
        className={`absolute top-0 left-0 translate-x-[2px] -translate-y-[2px] text-[#3B82F6] opacity-70 mix-blend-screen z-0 block
          ${continuous ? 'animate-[pulse_0.6s_infinite]' : 'animate-[pulse_3s_infinite]'}`}
        style={{ animationDelay: '0.1s' }}
        aria-hidden="true"
      >
        {text}
      </span>

      {/* Green Channel Glitch */}
      <span 
        className={`absolute top-0 left-0 translate-x-[0px] translate-y-[0px] text-[#22C55E] mix-blend-screen z-0 block
          ${continuous ? 'opacity-60 animate-[pulse_0.3s_infinite]' : 'opacity-0 group-hover:opacity-60 group-hover:animate-[pulse_0.2s_infinite]'}`}
        style={{ animationDelay: '0.2s' }}
        aria-hidden="true"
      >
        {text}
      </span>
    </div>
  );
};

export default GlitchText;
