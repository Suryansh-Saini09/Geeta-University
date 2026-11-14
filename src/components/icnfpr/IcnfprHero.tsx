"use client";

import React from "react";
import Image from "next/image";
import { Calendar, MapPin, Sparkles, ArrowRight, FileText } from "lucide-react";

export default function IcnfprHero() {
  return (
    <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-[#0A1F44] text-white pt-28 pb-20">
      {/* Background Banner Image with High-Contrast Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/uploads/all/2008/conversions/hero-full.webp"
          alt="ICNFPR 2026 Conference Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-25 brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071733]/90 via-[#0A1F44]/80 to-[#0A1F44]" />
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#E8871A]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Conference Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FDBA74] font-bold text-xs sm:text-sm uppercase tracking-widest mb-6 shadow-md">
          <Sparkles size={16} className="text-[#E8871A]" />
          <span>Geeta Institute of Pharmacy &amp; IPA Haryana Branch</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-6 drop-shadow-md">
          <span className="text-[#E8871A]">3</span>
          <sup className="text-xl sm:text-2xl font-normal">rd</sup> International Conference on New Frontiers of Pharmaceutical Research -{" "}
          <span className="text-[#E8871A]">2026</span> (ICNFPR)
        </h1>

        {/* Theme Box */}
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 sm:p-7 shadow-2xl mb-8">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-[#FCD34D] font-bold mb-2">
            Conference Theme
          </p>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white leading-snug">
            Pharma <span className="text-[#E8871A]">5.0</span>: Artificial Intelligence, Precision Medicine &amp; Sustainable Therapeutics
          </h2>
        </div>

        {/* Dates and Venue Strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base text-slate-100 mb-10 font-semibold">
          <div className="flex items-center gap-2.5 bg-white/10 px-5 py-2.5 rounded-xl backdrop-blur-md border border-white/15 shadow-sm">
            <Calendar size={18} className="text-[#E8871A]" />
            <span>1st – 2nd May 2026</span>
          </div>
          <div className="flex items-center gap-2.5 bg-white/10 px-5 py-2.5 rounded-xl backdrop-blur-md border border-white/15 shadow-sm">
            <MapPin size={18} className="text-[#E8871A]" />
            <span>Geeta University, Naultha, Panipat, Haryana</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://forms.gle/uFAwmSXBCNWdaSpy6"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px 32px",
              borderRadius: "14px",
              background: "#E8871A",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: "16px",
              textDecoration: "none",
              boxShadow: "0 8px 25px rgba(232, 135, 26, 0.35)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#d47813";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#E8871A";
              e.currentTarget.style.transform = "translateY(0px)";
            }}
          >
            <span style={{ color: "#FFFFFF" }}>Register Now</span>
            <ArrowRight size={18} style={{ color: "#FFFFFF" }} />
          </a>

          <a
            href="#cfp"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px 32px",
              borderRadius: "14px",
              background: "rgba(255, 255, 255, 0.15)",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "16px",
              textDecoration: "none",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.transform = "translateY(0px)";
            }}
          >
            <FileText size={18} style={{ color: "#FFFFFF" }} />
            <span style={{ color: "#FFFFFF" }}>Call for Papers</span>
          </a>

          <a
            href="#schedule"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "16px 24px",
              borderRadius: "14px",
              background: "transparent",
              color: "#E2E8F0",
              fontWeight: 600,
              fontSize: "16px",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#E2E8F0")}
          >
            <span>View Schedule</span>
          </a>
        </div>
      </div>
    </section>
  );
}
