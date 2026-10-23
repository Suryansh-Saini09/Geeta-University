"use client";

import React from "react";
import { cuetTimelineSteps } from "@/data/cuetData";
import { ArrowRight } from "lucide-react";

interface CuetAdmissionProcessProps {
  data?: {
    title?: string;
    steps?: Array<{
      stepNumber?: number;
      title: string;
      description: string;
      isHighlight?: boolean;
    }>;
  };
}

export default function CuetAdmissionProcess({ data }: CuetAdmissionProcessProps = {}) {
  const steps = data?.steps !== undefined ? data.steps : cuetTimelineSteps;
  const title = data?.title || "CUET Admission Process at Geeta University";

  if (data?.steps && data.steps.length === 0) {
    return null;
  }

  return (
    <section id="cuet-process" className="w-full bg-[#F9F6F2] py-14 sm:py-18 md:py-22 border-b border-[#E8E8E9]">
      <div className="gu-container">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="font-serif text-[30px] sm:text-[38px] md:text-[44px] font-black text-[#0A1F44] leading-tight">
            {title}
          </h2>
        </div>

        {/* Timeline Grid */}
        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, idx) => {
              const isHighlight = step.isHighlight;
              const stepNum = step.stepNumber !== undefined ? step.stepNumber : idx + 1;
              return (
                <div
                  key={step.title || idx}
                  className={`rounded-[20px] p-6 sm:p-7 transition-all duration-300 ${
                    isHighlight
                      ? "bg-white border-2 border-[#E8871A] shadow-[0_10px_30px_rgba(232,135,26,0.15)]"
                      : "bg-white border border-[#E2E8F0] shadow-sm hover:border-[#CBD5E1]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-extrabold uppercase tracking-wider ${
                        isHighlight ? "text-[#E8871A]" : "text-[#64748B]"
                      }`}
                    >
                      Step {stepNum < 10 ? `0${stepNum}` : stepNum}
                    </span>
                  </div>

                  <h3 className="font-serif text-[20px] font-bold text-[#0A1F44] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[14.5px] leading-relaxed text-[#475569]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 text-center">
          <a
            href="#enquire"
            className="inline-flex items-center gap-2 rounded-full bg-[#E8871A] px-8 py-3.5 text-sm font-bold !text-white shadow-md transition-all hover:bg-[#D47309] hover:shadow-lg active:scale-95"
          >
            <span>Start CUET Application</span>
            <ArrowRight className="h-4 w-4 text-white" />
          </a>
        </div>
      </div>
    </section>
  );
}
