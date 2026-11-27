"use client";

import React from "react";
import { Globe, Sparkles, ArrowRight } from "lucide-react";
import MerittoEnquiryWidget from "@/components/integrations/MerittoEnquiryWidget";
import { useMerittoStore } from "@/components/integrations/merittoStore";

export interface InternationalEnquiryFormProps {
  data?: {
    title?: string;
    subtitle?: string;
  };
}

export default function InternationalEnquiryForm({ data }: InternationalEnquiryFormProps = {}) {
  const { activeSlot, openDrawer } = useMerittoStore();
  const title = data?.title || "International Student Admission Enquiry";
  const subtitle =
    data?.subtitle ||
    "Ready to join a vibrant community of scholars from 30+ nations? Share your details with our Admissions Office for curriculum guidance, visa assistance, and merit scholarships.";

  return (
    <section id="enquiry-form" className="scroll-mt-24 py-16 md:py-24 bg-[#F7F9FC] border-b border-[#E2E8F0]">
      <div className="gu-container max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E0F0FF] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0A5A8A] mb-3">
            <Globe className="h-4 w-4 text-[#E8871A]" />
            Global Admissions Desk
          </div>
          <h2 className="font-serif text-[32px] sm:text-[40px] font-black text-[#0A1F44] tracking-tight">
            {title}
          </h2>
          <p className="mt-3 text-base text-[#64748B] max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Standardized Official Meritto Enquiry Widget Card */}
        <div className="w-full max-w-[440px] mx-auto rounded-3xl border border-white/60 bg-[#F4F6F9]/95 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300">
          {/* Top Saffron / Orange Accent Bar matching Website Theme */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#E8871A] via-[#F04F23] to-[#E8871A]" />

          <div className="px-5 sm:px-6 pt-5 pb-1">
            <h3 className="font-serif text-2xl font-bold tracking-tight text-[#0A1F44]">
              Enquire Now
            </h3>
          </div>

          {activeSlot === "drawer" ? (
            <div className="px-6 py-16 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-[#E8871A]/10 text-[#E8871A] flex items-center justify-center mb-3">
                <Sparkles className="h-6 w-6 text-[#E8871A]" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#0A1F44]">
                Enquiry Form Open in Drawer
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-[220px] leading-relaxed">
                The admissions desk is currently open in the sidebar panel.
              </p>
              <button
                type="button"
                onClick={openDrawer}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#0A1F44] px-4 py-2 text-xs font-semibold text-white hover:bg-[#E8871A] transition-colors cursor-pointer"
              >
                <span>View Active Form</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="px-1.5 sm:px-2.5 pb-2.5">
              <MerittoEnquiryWidget height="600px" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
