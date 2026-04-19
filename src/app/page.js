'use client'
import { useEffect } from 'react';



export default function HomePage() {
  useEffect(() => {
    window.location.href = "/online-workshops";
  }, []);
  return (
    <div className="bg-[#FDFDFD] selection:bg-yellow-100">
      
    </div>
  );
}