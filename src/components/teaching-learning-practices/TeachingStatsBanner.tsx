
import React from "react";
import { teachingStats } from "@/data/teachingLearningPractices";

export default function TeachingStatsBanner() {
  return (
    <section className="w-full bg-[#0A1F44] py-12 text-white border-y border-amber-500/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {teachingStats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-[#E8871A]/40"
            >
              <div className="font-serif text-3xl font-extrabold text-[#E8871A] sm:text-4xl md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 font-serif text-base font-bold text-white sm:text-lg">
                {stat.label}
              </div>
              <p className="mt-1 text-xs text-slate-300 sm:text-sm max-w-[200px]">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
