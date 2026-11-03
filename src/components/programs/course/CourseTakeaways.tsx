
import React from "react";
import { CheckCircle2 } from "lucide-react";

interface CourseTakeawaysProps {
  takeaways: string[];
}

export default function CourseTakeaways({ takeaways }: CourseTakeawaysProps) {
  if (!takeaways || takeaways.length === 0) return null;

  return (
    <section className="w-full bg-white py-10 md:py-14 border-t border-slate-100">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold">
            Key Highlights
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0A1F44] mt-1">
            Important Takeaways
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {takeaways.map((point, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-5 rounded-lg bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-slate-800 text-sm md:text-base font-medium leading-relaxed">
                {point}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
