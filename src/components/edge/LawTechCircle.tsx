"use client";

import React from "react";
import { motion } from "framer-motion";

export default function LawTechCircle() {
  return (
    <div className="relative flex items-center justify-center p-6 sm:p-10 select-none">
      {/* Glow Backdrop */}
      <div className="absolute inset-0 m-auto h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-[#00d4ff]/15 blur-3xl pointer-events-none" />

      {/* Main Circle Graphic Container */}
      <div className="relative h-[320px] w-[320px] sm:h-[400px] sm:w-[400px] md:h-[460px] md:w-[460px] flex items-center justify-center">
        
        {/* 1. Outer Spinning Dashed Ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-dashed border-[#00d4ff]/40 animate-[spin_60s_linear_infinite]"
          style={{ animationDuration: "50s" }}
        />

        {/* 2. Middle Static Ring */}
        <div className="absolute inset-[15%] rounded-full border border-[#00d4ff]/30" />

        {/* 3. Center Glowing Core (Scale of Justice) */}
        <motion.div
          animate={{
            boxShadow: [
              "0 0 25px rgba(0,212,255,0.25), inset 0 0 15px rgba(0,212,255,0.15)",
              "0 0 45px rgba(0,212,255,0.45), inset 0 0 25px rgba(0,212,255,0.25)",
              "0 0 25px rgba(0,212,255,0.25), inset 0 0 15px rgba(0,212,255,0.15)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[32%] rounded-full border-2 border-[#00d4ff] bg-radial from-[#00d4ff]/20 via-[#00d4ff]/5 to-transparent flex items-center justify-center backdrop-blur-sm z-10"
        >
          <svg
            viewBox="0 0 64 64"
            fill="none"
            className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Base beam */}
            <line
              x1="12"
              y1="52"
              x2="52"
              y2="52"
              stroke="#00d4ff"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Pole */}
            <line
              x1="32"
              y1="14"
              x2="32"
              y2="52"
              stroke="#00d4ff"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Cross beam */}
            <line
              x1="14"
              y1="22"
              x2="50"
              y2="22"
              stroke="#00d4ff"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Left chain */}
            <line
              x1="14"
              y1="22"
              x2="10"
              y2="38"
              stroke="#00d4ff"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Left pan */}
            <path
              d="M6 38 Q10 44 14 38"
              stroke="#00d4ff"
              strokeWidth="2"
              fill="rgba(0,212,255,0.12)"
              strokeLinecap="round"
            />
            {/* Right chain */}
            <line
              x1="50"
              y1="22"
              x2="54"
              y2="38"
              stroke="#00d4ff"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Right pan */}
            <path
              d="M50 38 Q54 44 58 38"
              stroke="#00d4ff"
              strokeWidth="2"
              fill="rgba(0,212,255,0.12)"
              strokeLinecap="round"
            />
            {/* Top circle */}
            <circle
              cx="32"
              cy="13"
              r="3.5"
              stroke="#00d4ff"
              strokeWidth="2"
              fill="rgba(0,212,255,0.2)"
            />
          </svg>
        </motion.div>

        {/* 4. 8 Orbit Icon Nodes */}

        {/* Top: People/Group */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-11 w-11 sm:h-13 sm:w-13 md:h-14 md:w-14 rounded-full border-2 border-[#00d4ff] bg-[#041941] shadow-[0_0_18px_rgba(0,212,255,0.5)] flex items-center justify-center z-20 transition-transform hover:scale-110">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.6" className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>

        {/* Top-right: Document check */}
        <div className="absolute top-[14.6%] right-[14.6%] translate-x-1/2 -translate-y-1/2 h-11 w-11 sm:h-13 sm:w-13 md:h-14 md:w-14 rounded-full border-2 border-[#00d4ff] bg-[#041941] shadow-[0_0_18px_rgba(0,212,255,0.5)] flex items-center justify-center z-20 transition-transform hover:scale-110">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.6" className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <polyline points="9 15 11 17 15 13" />
          </svg>
        </div>

        {/* Right: Magnifier */}
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 h-11 w-11 sm:h-13 sm:w-13 md:h-14 md:w-14 rounded-full border-2 border-[#00d4ff] bg-[#041941] shadow-[0_0_18px_rgba(0,212,255,0.5)] flex items-center justify-center z-20 transition-transform hover:scale-110">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.6" className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Bottom-right: Lock/Shield */}
        <div className="absolute bottom-[14.6%] right-[14.6%] translate-x-1/2 translate-y-1/2 h-11 w-11 sm:h-13 sm:w-13 md:h-14 md:w-14 rounded-full border-2 border-[#00d4ff] bg-[#041941] shadow-[0_0_18px_rgba(0,212,255,0.5)] flex items-center justify-center z-20 transition-transform hover:scale-110">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.6" className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        {/* Bottom: Building/Court */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-11 w-11 sm:h-13 sm:w-13 md:h-14 md:w-14 rounded-full border-2 border-[#00d4ff] bg-[#041941] shadow-[0_0_18px_rgba(0,212,255,0.5)] flex items-center justify-center z-20 transition-transform hover:scale-110">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.6" className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg">
            <line x1="3" y1="22" x2="21" y2="22" />
            <line x1="6" y1="18" x2="6" y2="11" />
            <line x1="10" y1="18" x2="10" y2="11" />
            <line x1="14" y1="18" x2="14" y2="11" />
            <line x1="18" y1="18" x2="18" y2="11" />
            <polygon points="12 2 20 7 4 7" />
          </svg>
        </div>

        {/* Bottom-left: Briefcase */}
        <div className="absolute bottom-[14.6%] left-[14.6%] -translate-x-1/2 translate-y-1/2 h-11 w-11 sm:h-13 sm:w-13 md:h-14 md:w-14 rounded-full border-2 border-[#00d4ff] bg-[#041941] shadow-[0_0_18px_rgba(0,212,255,0.5)] flex items-center justify-center z-20 transition-transform hover:scale-110">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.6" className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>

        {/* Left: Gavel/Hammer */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 h-11 w-11 sm:h-13 sm:w-13 md:h-14 md:w-14 rounded-full border-2 border-[#00d4ff] bg-[#041941] shadow-[0_0_18px_rgba(0,212,255,0.5)] flex items-center justify-center z-20 transition-transform hover:scale-110">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.6" className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.5 2.5l7 7-9.5 9.5-7-7 9.5-9.5z" />
            <line x1="3" y1="21" x2="9" y2="15" />
          </svg>
        </div>

        {/* Top-left: Chat/Speech */}
        <div className="absolute top-[14.6%] left-[14.6%] -translate-x-1/2 -translate-y-1/2 h-11 w-11 sm:h-13 sm:w-13 md:h-14 md:w-14 rounded-full border-2 border-[#00d4ff] bg-[#041941] shadow-[0_0_18px_rgba(0,212,255,0.5)] flex items-center justify-center z-20 transition-transform hover:scale-110">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.6" className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>

      </div>
    </div>
  );
}
