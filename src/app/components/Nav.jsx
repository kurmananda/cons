"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Bodoni_Moda, Inter } from "next/font/google";
import Link from "next/link";
import DecryptedText from "../ui/decrypt_text";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu } from "lucide-react";
import Threads from "../ui/threads";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/lightswind/avatar";
import TargetCursor from "../ui/target_cursor";

/**
 * Main Navigation Component
 * Handles the floating navbar and the full-screen overlay menu.
 */
const Nav = () => {
  // --- State & Handlers ---
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle scroll effect for navbar resizing
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <TargetCursor />

      {/* --- Floating Navbar --- */}
      <nav
        className={`fixed left-1/2 -translate-x-1/2 transition-all duration-500 w-[95%] max-w-[1024px] rounded-[1.5rem] flex items-center justify-between px-3 md:px-5 z-[60] ${scrolled ? "top-2 md:top-4 h-[65px]" : "top-4 md:top-6 h-[75px]"
          } ${isMenuOpen
            ? "opacity-0 pointer-events-none"
            : "backdrop-blur-xl bg-grey border border-slate-700 border-[1.5px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-100"
          }`}>
        
        {/* Left Section: Logo */}
        <div className="flex items-center z-50">
          <Link href="/" string="magnetic" className="cursor-target pointer-events-auto transition-transform hover:scale-110 duration-200 shrink-0">
            <Image src="/assets/logo.webp" alt="Logo" width={55} height={55} className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
          </Link>
        </div>

        {/* Center Section: Branding Text */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 whitespace-nowrap pointer-events-none">
          <Link href="/" className="cursor-target pointer-events-auto relative flex items-center no-underline px-2 py-1">
            <DecryptedText
              text="CONSCIENTIA 2k26"
              animateOn="view"
              revealDirection="center"
              sequential={true}
              loop={true}
              pauseTime={1000}
              speed={50}
              className="font-syncopate text-sm sm:text-lg md:text-xl lg:text-2xl tracking-widest uppercase text-white"
              encryptedClassName="font-syncopate text-sm sm:text-lg md:text-xl lg:text-2xl tracking-widest uppercase text-cyan/70"
            />
          </Link>
        </div>

        {/* Right Section: Utility Icons & Menu Toggle */}
        <div className="flex items-center gap-1 md:gap-2 z-50">
          {/* Profile */}
          <Link
            href="/profile"
            className="cursor-target text-white hover:text-white transition-colors p-1 md:p-1.5 hover:bg-white/10 rounded-full">
            <Avatar className="w-6 h-6 md:w-7.5 md:h-7.5 bg-white/20">
              <AvatarImage src="" />
              <AvatarFallback className="text-[10px] bg-transparent text-white font-black">
                U
              </AvatarFallback>
            </Avatar>
          </Link>
          
          {/* Store */}
          <Link
            href="/store"
            string="magnetic"
            className="cursor-target relative group overflow-hidden rounded-lg p-1.5 flex items-center justify-center">
            <span className="absolute inset-0 w-full h-full bg-cyan-400 transform -translate-y-[101%] group-hover:translate-y-0 transition-transform duration-[400ms] ease-out rounded-lg" />
            <ShoppingBag
              className="relative z-10 w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-black transition-colors duration-300"
              strokeWidth={2}
            />
          </Link>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            string="magnetic"
            className="cursor-target relative group overflow-hidden rounded-lg p-1.5 focus:outline-none flex flex-col justify-center items-center w-10 h-10">
            <span className="absolute inset-0 w-full h-full bg-cyan-400 transform -translate-y-[101%] group-hover:translate-y-0 transition-transform duration-[400ms] ease-out rounded-lg" />
            {isMenuOpen ? (
              <>
                <div className="h-[2.5px] w-6 md:w-7 bg-white group-hover:bg-black transition-colors duration-300 absolute rotate-45 relative z-10" />
                <div className="h-[2.5px] w-6 md:w-7 bg-white group-hover:bg-black transition-colors duration-300 absolute -rotate-45 relative z-10" />
              </>
            ) : (
              <>
                <div className="h-[2.5px] w-6 md:w-7 bg-white group-hover:bg-black transition-colors duration-300 mb-1.5 relative z-10" />
                <div className="h-[2.5px] w-6 md:w-7 bg-white group-hover:bg-black transition-colors duration-300 mb-1.5 relative z-10" />
                <div className="h-[2.5px] w-6 md:w-7 bg-white group-hover:bg-black transition-colors duration-300 relative z-10" />
              </>
            )}
          </button>
        </div>
      </nav>

      {/* --- Full-Screen Overlay Menu --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 w-full h-[100dvh] bg-[#050505] z-[45] flex flex-col md:flex-row pointer-events-auto overflow-hidden">
            
            {/* Background Animation */}
            <div className="absolute inset-0 w-full h-full z-0 opacity-60 pointer-events-auto rotate-180 scale-150 overflow-hidden">
              <Threads
                color={[0.0, 0.5, 0.5]}
                amplitude={2}
                distance={0.4}
                enableMouseInteraction={true}
              />
            </div>

            {/* Back Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="cursor-target absolute top-6 left-6 md:top-10 md:left-10 z-[100] flex items-center gap-2 text-white/60 hover:text-white font-syncopate tracking-[0.3em] text-xs uppercase transition-all duration-300 group cursor-pointer">
              <span className="text-lg leading-none transition-transform duration-300 group-hover:-translate-x-1">
                &larr;
              </span>
              <span>BACK</span>
            </button>

            {/* Content Container */}
            <div className="relative z-10 w-full min-h-full flex flex-col justify-center px-8 md:px-[10vw] pt-24 md:pt-0 pointer-events-none [&>*]:pointer-events-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between w-full mt-10 mb-10">
                
                {/* Visual Accent: Large Logo */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="hidden md:flex w-1/2 justify-start pb-4">
                  <Image
                    src="/assets/logo.webp"
                    alt="Logo"
                    width={280}
                    height={280}
                    className="md:w-[280px] md:h-[280px] object-contain opacity-80 mix-blend-screen"
                  />
                </motion.div>

                {/* Primary Navigation Links */}
                <div className="w-full md:w-[70%] flex flex-col items-center md:items-end gap-3 md:gap-4 lg:gap-5">
                  {[
                    { label: "ABOUT", path: "/about" },
                    { label: "WORKSHOPS", path: "/online-workshops" },
                    { label: "EVENTS", path: "/events" },
                    { label: "ACCOMMODATION", path: "/accommodation" },
                    { label: "CONTACT US", path: "/contact-us" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.1 + i * 0.05,
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                      className="w-full flex justify-end">
                      <Link
                        href={item.path}
                        string="magnetic"
                        onClick={() => setIsMenuOpen(false)}
                        className="cursor-target relative px-4 md:px-6 py-3 flex justify-end font-syncopate font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-lg uppercase rounded-xl">

                        {/* Staggered Character Animation on Hover */}
                        <motion.div
                          className="relative z-10 flex justify-end"
                          whileHover="hovered"
                          initial="initial"
                        >
                          {item.label.split("").map((char, index) => (
                            <div
                              key={index}
                              className="relative overflow-hidden h-[1.1em] inline-block"
                            >
                              {/* Slide-out State */}
                              <motion.span
                                custom={index}
                                variants={{
                                  initial: (i) => ({
                                    y: 0,
                                    opacity: 1,
                                    transition: {
                                      delay: i * 0.03,
                                      duration: 0.35,
                                      ease: [0.76, 0, 0.24, 1],
                                    },
                                  }),
                                  hovered: (i) => ({
                                    y: "-110%",
                                    opacity: 0,
                                    transition: {
                                      delay: i * 0.03,
                                      duration: 0.35,
                                      ease: [0.76, 0, 0.24, 1],
                                    },
                                  }),
                                }}
                                className="absolute inset-0 flex items-center justify-center text-white"
                              >
                                {char === " " ? "\u00A0" : char}
                              </motion.span>
                              {/* Slide-in State (Cyan/Yellow) */}
                              <motion.span
                                custom={index}
                                variants={{
                                  initial: (i) => ({
                                    y: "110%",
                                    opacity: 0,
                                    transition: {
                                      delay: i * 0.03,
                                      duration: 0.35,
                                      ease: [0.76, 0, 0.24, 1],
                                    },
                                  }),
                                  hovered: (i) => ({
                                    y: 0,
                                    opacity: 1,
                                    transition: {
                                      delay: i * 0.03,
                                      duration: 0.35,
                                      ease: [0.76, 0, 0.24, 1],
                                    },
                                  }),
                                }}
                                className="relative flex items-center justify-center text-yellow-500"
                              >
                                {char === " " ? "\u00A0" : char}
                              </motion.span>
                            </div>
                          ))}
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mobile Decorative Logo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex md:hidden items-center justify-center w-full mt-12">
                <Image
                  src="/assets/logo.webp"
                  alt="Logo"
                  width={120}
                  height={120}
                  className="w-24 h-24 object-contain opacity-80 mix-blend-screen"
                />
              </motion.div>

              {/* Social Media Footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center md:items-end gap-3 md:gap-4 w-full mt-2 md:mt-5">
                <span className="font-karla uppercase tracking-[0.3em] text-[9px] md:text-[10px] text-white/50 mb-1">
                  Follow Us
                </span>
                <div className="flex items-center justify-center md:justify-end gap-5 md:gap-7 w-full">
                  <Link
                    href="#"
                    className="cursor-target w-9 h-9 md:w-11 md:h-11 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer opacity-90 hover:opacity-100">
                    <Image
                      src="/assets/instagram.png"
                      alt="Instagram"
                      width={40}
                      height={40}
                      className="object-contain rounded-lg"
                    />
                  </Link>
                  <Link
                    href="#"
                    className="cursor-target w-9 h-9 md:w-11 md:h-11 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer opacity-90 hover:opacity-100">
                    <Image
                      src="/assets/youtube.png"
                      alt="YouTube"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </Link>
                  <Link
                    href="#"
                    className="cursor-target w-9 h-9 md:w-11 md:h-11 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer opacity-90 hover:opacity-100">
                    <Image
                      src="/assets/linkedin.png"
                      alt="LinkedIn"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </Link>
                  <Link
                    href="#"
                    className="cursor-target w-9 h-9 md:w-11 md:h-11 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer opacity-90 hover:opacity-100 rounded-full overflow-hidden">
                    <Image
                      src="/assets/X.jpg"
                      alt="X"
                      width={40}
                      height={40}
                      className="object-cover rounded-full"
                    />
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
