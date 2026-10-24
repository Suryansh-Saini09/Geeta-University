"use client";

import React from "react";
import { gutsAdmissionSteps } from "@/data/gutsData";

export interface GutsAdmissionProcessProps {
  data?: {
    title?: string;
    steps?: Array<{
      stepNumber?: number | string;
      title: string;
      description: string;
    }>;
  };
}

export default function GutsAdmissionProcess({ data }: GutsAdmissionProcessProps = {}) {
  const steps = data?.steps && data.steps.length > 0 ? data.steps : gutsAdmissionSteps;
  return (
    <section id="admission-process" className="w-full bg-[#F8FAFC] py-14 sm:py-18 md:py-22 border-b border-[#E2E8F0]">
      <div className="gu-container space-y-12">
        {/* Section Header */}
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-[#E8871A]" />
          </div>
          <h2 className="font-serif text-[30px] sm:text-[38px] md:text-[44px] font-black text-[#0A1F44]">
            GUTS: Exam Details &amp; Admission Process
          </h2>
          <p className="mt-2 text-[16px] text-[#64748B]">
            Step-by-Step Admission Flow
          </p>
        </div>

        {/* 6-Step Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step) => {
            return (
              <div
                key={step.stepNumber}
                className="rounded-[20px] bg-white border border-[#E2E8F0] p-6 shadow-sm flex flex-col justify-between transition-all hover:border-[#E8871A]/50"
              >
                <div>
                  <h3 className="font-serif text-[18px] sm:text-[19px] font-bold text-[#0A1F44] mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-[14.5px] leading-relaxed text-[#475569]">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mode, Timing & Instructions Dual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Card 1: Mode, Timing & Platform */}
          <div className="rounded-[22px] bg-white p-7 sm:p-9 border border-[#E2E8F0] shadow-sm">
            <div className="mb-5 pb-3 border-b border-[#F1F5F9]">
              <h3 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#0A1F44]">
                Mode, Timing &amp; Platform
              </h3>
            </div>

            <ul className="space-y-3.5 text-[15px] text-[#334155]">
              <li className="flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-[#E8871A] mt-2 shrink-0" />
                <div>
                  <strong>Mode:</strong> 100% Online from anywhere in India.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-[#E8871A] mt-2 shrink-0" />
                <div>
                  <strong>Test Timing:</strong> Scheduled test timing slot will be conveyed via <span className="font-semibold text-[#0A1F44]">Email / WhatsApp</span>.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-[#E8871A] mt-2 shrink-0" />
                <div>
                  <strong>Login Credentials:</strong> Login ID is your registered email address. Password will be shared through official communication.
                </div>
              </li>
            </ul>
          </div>

          {/* Card 2: Important Exam-Day Instructions */}
          <div className="rounded-[22px] bg-white p-7 sm:p-9 border border-[#E2E8F0] shadow-sm">
            <div className="mb-5 pb-3 border-b border-[#F1F5F9]">
              <h3 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#0A1F44]">
                Exam-Day Instructions
              </h3>
            </div>

            <ul className="space-y-3 text-[14.5px] text-[#334155]">
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#FF5F19] mt-2 shrink-0" />
                <span>Join the exam using a <strong>laptop or desktop only</strong> with a functional webcam.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#FF5F19] mt-2 shrink-0" />
                <span>The exam is AI-proctored and monitored via <strong>camera, audio, and browser activity</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#FF5F19] mt-2 shrink-0" />
                <span>Ensure stable internet connectivity and disable pop-up blockers before starting.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#FF5F19] mt-2 shrink-0" />
                <span>Sit alone in a quiet, well-lit room without secondary screens or headphones.</span>
              </li>
            </ul>

            <div className="mt-5 rounded-[12px] bg-[#FFF8F2] p-3 text-[13.5px] text-[#8C4300] border border-[#FFD9B3] flex items-center justify-between">
              <span className="font-medium">Technical Support:</span>
              <a href="tel:+917082200908" className="font-bold text-[#0A1F44] hover:text-[#E8871A]">
                +91-7082200908 (Call/WhatsApp)
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
