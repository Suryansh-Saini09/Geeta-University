
import React from "react";
import {
  FileText,
  ShieldCheck,
  Key,
  EyeOff,
  BookMarked,
  AlertTriangle,
  Calendar,
  Send,
  type LucideIcon,
} from "lucide-react";
import { cfpGuidelines, importantDates } from "@/data/icnfprData";

const iconMap: Record<string, LucideIcon> = {
  FileText,
  ShieldCheck,
  Key,
  EyeOff,
  BookMarked,
  AlertTriangle,
};

export default function IcnfprCfp() {
  return (
    <section id="cfp" className="py-20 lg:py-24 bg-white text-[#0A1F44]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center justify-center gap-2 mb-3 text-[#E8871A] font-extrabold text-xs tracking-widest uppercase">
            <Send size={16} />
            <span>Submit Your Research</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A1F44] tracking-tight">
            Call for <span className="text-[#E8871A]">Papers</span>
          </h2>
          <p className="mt-3 text-[#475569] text-sm sm:text-base leading-relaxed">
            Submit your research and be part of the scholarly discourse shaping pharmaceutical innovation and healthcare.
          </p>
        </div>

        {/* 6 Guidelines Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cfpGuidelines.map((item, idx) => {
            const Icon = iconMap[item.iconName] || FileText;
            return (
              <div
                key={idx}
                className="bg-[#F8FAFC] rounded-3xl p-7 border border-slate-200/90 hover:border-[#E8871A]/50 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 text-[#E8871A] flex items-center justify-center mb-5 group-hover:bg-[#E8871A] group-hover:text-white transition-colors">
                  <Icon size={22} />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#0A1F44] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-[#334155] leading-relaxed flex-1 text-justify">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Important Dates Highlight Panel */}
        <div className="mt-14 bg-[#FDF1D6] rounded-3xl p-8 sm:p-10 border border-[#E8871A]/30 shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 text-[#E8871A] font-extrabold text-xs uppercase tracking-widest mb-2">
              <Calendar size={16} />
              <span>Mark Your Calendar</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-[#0A1F44]">
              Important Deadlines &amp; Dates
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {importantDates.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col justify-center"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  {item.label}
                </p>
                <p className="font-serif text-xl sm:text-2xl font-black text-[#E8871A]">
                  {item.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
