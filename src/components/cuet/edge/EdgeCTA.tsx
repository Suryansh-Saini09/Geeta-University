"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Phone, MapPin, Sparkles } from "lucide-react";
import type { EdgeCTASection } from "@/data/edge/types";

interface EdgeCTAProps {
  cta: EdgeCTASection;
}

export default function EdgeCTA({ cta }: EdgeCTAProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#06355F] via-[#0A1F44] to-[#041228] py-12 md:py-16 text-white">
      {/* Glow shapes */}
      <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-[#E8871A]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-[#1E4E8C]/30 blur-3xl pointer-events-none" />

      <div className="gu-container relative z-10 text-center max-w-4xl mx-auto">
        
        {cta.subtitle && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#E8871A]/15 px-4 py-1.5 border border-[#E8871A]/30">
            <Sparkles size={14} className="text-[#E8871A]" />
            <span className="text-xs font-bold uppercase tracking-[2px] text-[#E8871A]">
              {cta.subtitle}
            </span>
          </div>
        )}

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
          {cta.heading}
        </h2>

        {cta.description && (
          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {cta.description}
          </p>
        )}

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={cta.buttonLink}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-8 py-4 text-base font-bold text-white shadow-xl shadow-[#E8871A]/30 transition-all hover:bg-[#c9710f] hover:shadow-2xl hover:translate-y-[-2px]"
          >
            <span>{cta.buttonText}</span>
            <ArrowRight size={18} />
          </Link>

          {cta.secondaryButtonText && cta.secondaryButtonLink && (
            <Link
              href={cta.secondaryButtonLink}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40"
            >
              <span>{cta.secondaryButtonText}</span>
            </Link>
          )}
        </div>

        {/* Helpline & Location Footer */}
        {(cta.helpline || cta.campusAddress) && (
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm text-slate-300">
            {cta.helpline && (
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-[#E8871A]" />
                <span>Admissions Helpline: <strong>{cta.helpline}</strong></span>
              </div>
            )}

            {cta.campusAddress && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#E8871A]" />
                <span>{cta.campusAddress}</span>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
