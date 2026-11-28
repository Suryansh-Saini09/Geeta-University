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
      className={`relative w-full max-w-[430px] mx-auto rounded-3xl border border-slate-200/90 bg-white shadow-[0_24px_60px_-18px_rgba(16,32,58,0.2),0_2px_6px_rgba(16,32,58,0.06)] overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* When Drawer is Open: Render placeholder to avoid duplicate widget instances */}
      {activeSlot === "drawer" ? (
        <div className="px-6 py-16 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-full bg-[#E8871A]/10 text-[#E8871A] flex items-center justify-center mb-3">
            <Sparkles className="h-6 w-6 text-[#E8871A]" />
          </div>
          <h4 className="font-serif text-lg font-bold text-[#0A1F44]">
            Application Form Open in Drawer
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-[220px] leading-relaxed">
            The admissions portal is active in the sidebar panel.
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
        /* Default: Official Enrolyx Student Enquiry Widget */
        <MerittoEnquiryWidget />
      )}
    </div>
  );
}
