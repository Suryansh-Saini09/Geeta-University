"use client";

import React from "react";
import { BookOpen, Clock, Award } from "lucide-react";
import type { CourseQuickInfo as CourseQuickInfoType } from "@/data/programs/courses/types";

interface CourseQuickInfoProps {
  quickInfo: CourseQuickInfoType;
}

export default function CourseQuickInfo({ quickInfo }: CourseQuickInfoProps) {
  return (
    <section className="w-full bg-[#FFFFFF] border-b border-slate-200/80 py-7 md:py-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Program Card */}
          <div className="flex items-start gap-4 pt-4 md:pt-0 md:pr-6">
            <div className="w-12 h-12 rounded-xl bg-[#0A1F44]/5 text-[#0A1F44] flex items-center justify-center shrink-0 mt-0.5 border border-[#0A1F44]/10">
              <BookOpen size={22} className="text-[#0A1F44]" />
            </div>
            <div>
              <span className="block text-xs uppercase tracking-widest text-[#E8871A] font-extrabold mb-1">
                Program
              </span>
              <h2 className="text-lg md:text-xl font-bold text-[#0A1F44] leading-snug">
                {quickInfo.program}
              </h2>
            </div>
          </div>

          {/* Duration Card */}
          <div className="flex items-start gap-4 pt-4 md:pt-0 md:px-6">
            <div className="w-12 h-12 rounded-xl bg-[#E8871A]/10 text-[#E8871A] flex items-center justify-center shrink-0 mt-0.5 border border-[#E8871A]/20">
              <Clock size={22} className="text-[#E8871A]" />
            </div>
            <div>
              <span className="block text-xs uppercase tracking-widest text-[#E8871A] font-extrabold mb-1">
                Duration
              </span>
              <p className="text-lg md:text-xl font-bold text-[#0A1F44]">
                {quickInfo.duration}
              </p>
            </div>
          </div>

          {/* Eligibility Card */}
          <div className="flex items-start gap-4 pt-4 md:pt-0 md:pl-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60">
              <Award size={22} className="text-emerald-700" />
            </div>
            <div>
              <span className="block text-xs uppercase tracking-widest text-[#E8871A] font-extrabold mb-1">
                Eligibility
              </span>
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-medium">
                {quickInfo.eligibility}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
