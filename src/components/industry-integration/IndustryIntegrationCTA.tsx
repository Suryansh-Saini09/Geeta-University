
import React from "react";
import { ArrowRight, PhoneCall } from "lucide-react";

export default function IndustryIntegrationCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1F44] via-[#1A3A6B] to-[#0A1F44] py-12 text-white md:py-16">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#E8871A]/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#2C5282]/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md md:flex-row md:p-12">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="font-serif text-3xl font-extrabold text-white sm:text-4xl">
              Ready to Accelerate Your Career with <span className="text-[#E8871A]">Industry-Linked Programs</span>?
            </h2>
            <p className="mt-3 text-base text-slate-300 sm:text-lg font-sans">
              Connect with our admissions & corporate integration cell to explore degree options, scholarships, and industry certifications.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
            <a
              href="https://admissions.geetauniversity.edu.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E8871A] px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-[#F5A623] hover:shadow-amber-500/25 active:scale-95"
            >
              <span>Apply Now</span>
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="tel:+919278768000"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
            >
              <PhoneCall className="h-5 w-5 text-[#E8871A]" />
              <span>Call +91 92787 68000</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
