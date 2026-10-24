"use client";

import React from "react";
import { gutsScholarshipSlabs, gutsExamPattern } from "@/data/gutsData";
import { Clock, FileText, CheckCircle2 } from "lucide-react";

export interface GutsScholarshipSlabsProps {
  data?: {
    title?: string;
    slabs?: Array<{
      scoreCriteria: string;
      scholarshipPercentage: string;
    }>;
    examPattern?: {
      totalQuestions?: string;
      duration?: string;
      sections?: Array<{ name: string; questions: string }>;
    };
  };
}

export default function GutsScholarshipSlabs({ data }: GutsScholarshipSlabsProps = {}) {
  const slabs = data?.slabs && data.slabs.length > 0 ? data.slabs : gutsScholarshipSlabs;
  return (
    <section id="scholarship-slabs" className="w-full bg-[#F3F5F6] py-14 sm:py-18 md:py-22 border-b border-[#E2E8F0]">
      <div className="gu-container">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10 items-stretch">
          {/* Left Column: Scholarship Slabs Based on GUTS Score */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-[22px] bg-white p-7 sm:p-9 border border-[#E2E8F0] shadow-sm">
            <div>
              <h2 className="font-serif text-[28px] sm:text-[34px] font-black text-[#0A1F44] leading-tight">
                Scholarship Slabs <br />
                <span className="text-[#E8871A]">Based on GUTS Score</span>
              </h2>

              {/* Slabs Grid / Table */}
              <div className="mt-6 overflow-hidden rounded-[16px] border border-[#E2E8F0]">
                <div className="grid grid-cols-2 bg-[#0E385D] px-5 py-3.5 text-white font-serif font-bold text-[15px]">
                  <div>GUTS Score / Criteria</div>
                  <div className="text-right sm:text-left">Scholarship Offered in Tuition Fees</div>
                </div>

                <div className="divide-y divide-[#E2E8F0] bg-white text-[15px]">
                  {slabs.map((slab, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-2 px-5 py-3.5 items-center hover:bg-[#F8FAFC] transition-colors"
                    >
                      <div className="font-semibold text-[#0A1F44] flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />
                        <span>{slab.scoreCriteria}</span>
                      </div>
                      <div className="text-right sm:text-left font-bold text-[#E8871A]">
                        {slab.scholarshipPercentage}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: GUTS Syllabus & Exam Pattern */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-[22px] bg-white p-7 sm:p-9 border border-[#E2E8F0] shadow-sm">
            <div>
              <h2 className="font-serif text-[28px] sm:text-[34px] font-black text-[#0A1F44] leading-tight">
                GUTS Syllabus &amp; Exam Pattern
              </h2>

              {/* Exam Info Pill Highlights */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[14px] font-semibold text-[#475569]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F5F9] px-3.5 py-1 text-[#0A1F44]">
                  <FileText className="h-4 w-4 text-[#E8871A]" />
                  Total: 60 Questions
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F5F9] px-3.5 py-1 text-[#0A1F44]">
                  <Clock className="h-4 w-4 text-[#E8871A]" />
                  Duration: 60 Minutes
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F5F9] px-3.5 py-1 text-[#0A1F44]">
                  <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                  Mode: Online AI-Proctored
                </span>
              </div>

              {/* Exam Pattern Table */}
              <div className="mt-6 overflow-hidden rounded-[16px] border border-[#E2E8F0]">
                <div className="grid grid-cols-12 bg-[#0E385D] px-5 py-3.5 text-white font-serif font-bold text-[15px]">
                  <div className="col-span-5 sm:col-span-4">Qualification Stream</div>
                  <div className="col-span-7 sm:col-span-8">Key Subjects Covered</div>
                </div>

                <div className="divide-y divide-[#E2E8F0] bg-white text-[14.5px]">
                  {gutsExamPattern.map((pat, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 px-5 py-3.5 items-center hover:bg-[#F8FAFC] transition-colors"
                    >
                      <div className="col-span-5 sm:col-span-4 font-bold text-[#0A1F44]">
                        {pat.qualification}
                      </div>
                      <div className="col-span-7 sm:col-span-8 text-[#475569] leading-snug">
                        {pat.keySubjects}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
