
import React from "react";
import type { CourseCTAData } from "@/data/programs/courses/types";

interface CourseCTAProps {
  cta: CourseCTAData;
}

export default function CourseCTA({ cta }: CourseCTAProps) {
  if (!cta) return null;

  return (
    <section className="w-full bg-[#0A1F44] text-white py-12 md:py-16">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 text-center">
        <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-4">
          {cta.title}
        </h2>
        {cta.description && (
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            {cta.description}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {cta.applyUrl && (
            <a
              href={cta.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-3.5 rounded-full text-base transition-colors shadow-lg"
            >
              Apply Now
            </a>
          )}
          {cta.brochureUrl && (
            <a
              href={cta.brochureUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-full text-base border border-white/20 transition-colors"
            >
              Download Brochure
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
