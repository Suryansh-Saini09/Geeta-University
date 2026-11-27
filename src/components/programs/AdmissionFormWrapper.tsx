"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import MerittoEnquiryWidget from "@/components/integrations/MerittoEnquiryWidget";
import { useMerittoStore } from "@/components/integrations/merittoStore";

interface AdmissionFormWrapperProps {
  initialDiscipline?: string;
  initialCourse?: string;
  className?: string;
}

export default function AdmissionFormWrapper({
  initialDiscipline,
  initialCourse,
  className = "",
}: AdmissionFormWrapperProps) {
  const { activeSlot, openDrawer } = useMerittoStore();

  return (
    <div
      id="enquiry-form"
      className={`relative w-full max-w-[420px] mx-auto rounded-3xl border border-slate-200/90 bg-[#F4F6F9]/95 shadow-[0_12px_36px_rgba(10,31,68,0.08)] backdrop-blur-xl overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Top Saffron / Orange Accent Bar matching Geeta University Theme */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#E8871A] via-[#F04F23] to-[#E8871A]" />

      {/* Card Header matching Website Design System */}
      <div className="px-5 sm:px-6 pt-5 pb-1">
        <h3 className="font-serif text-2xl font-bold tracking-tight text-[#0A1F44]">
          Enquire Now
        </h3>
        {(initialCourse || initialDiscipline) && (
          <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
            {initialCourse || initialDiscipline}
          </p>
        )}
      </div>

      {/* When Drawer is Open: Render placeholder to avoid duplicate .npf_wgts instances */}
      {activeSlot === "drawer" ? (
        <div className="px-6 py-16 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-full bg-[#E8871A]/10 text-[#E8871A] flex items-center justify-center mb-3">
            <Sparkles className="h-6 w-6 text-[#E8871A]" />
          </div>
          <h4 className="font-serif text-lg font-bold text-[#0A1F44]">
            Enquiry Form Open in Drawer
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-[220px] leading-relaxed">
            The admissions form is active in the sidebar panel.
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
        /* Default: Official Meritto (NoPaperForms) Enquiry Widget */
        <div className="px-1.5 sm:px-2.5 pb-2.5">
          <MerittoEnquiryWidget height="600px" />
        </div>
      )}
    </div>
  );
}
