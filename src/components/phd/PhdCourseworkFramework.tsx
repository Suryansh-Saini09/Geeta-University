"use client";

import React from "react";
import { Calendar, FileCheck2, CheckCircle2, Globe2, Check } from "lucide-react";

export interface PhdCourseworkFrameworkProps {
  data?: {
    title?: string;
    description?: string;
    stipendText?: string;
    weekendClassesText?: string;
  };
}

export default function PhdCourseworkFramework({ data }: PhdCourseworkFrameworkProps = {}) {
  return (
    <section id="coursework-framework" className="w-full bg-[#F8FAFC] py-14 sm:py-18 md:py-22 border-b border-[#E2E8F0]">
      <div className="gu-container space-y-16">
        {/* Top Header & 4 Cards */}
        <div>
          <h2 className="font-serif text-[30px] sm:text-[38px] md:text-[44px] font-black text-[#0A1F44] leading-tight">
            Ph.D. Coursework Framework for Part-Time &amp; International Scholars
          </h2>

          <p className="mt-4 text-[16px] sm:text-[17.5px] leading-[1.8] text-[#475569] max-w-4xl">
            Geeta University recognizes the growing need to promote research among working professionals,
            academicians, and industry practitioners. The coursework framework for Part-Time Scholars,
            International Scholars, and Scholars from Industry backgrounds is designed to ensure academic rigor,
            research integrity, and flexibility without compromising the quality of doctoral training.
          </p>

          {/* 4 Cards Grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Structure & Schedule */}
            <div className="rounded-[20px] bg-white p-6 sm:p-8 border-l-[6px] border-l-[#0E395C] border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0E395C]/10 text-[#0E395C]">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-[20px] sm:text-[22px] font-bold text-[#0E395C]">
                    Structure &amp; Schedule
                  </h3>
                </div>

                <ul className="space-y-2.5 text-[15px] text-[#334155]">
                  <li>
                    <strong className="text-[#0A1F44]">Duration:</strong> 6 Months (includes compulsory &amp; discipline-specific courses)
                  </li>
                  <li>
                    <strong className="text-[#0A1F44]">Mode of Delivery:</strong> Hybrid (Online + Offline)
                  </li>
                  <li>
                    <strong className="text-[#0A1F44]">Attendance:</strong> Minimum 75% in each course
                  </li>
                  <li>
                    <strong className="text-[#0A1F44]">Class Schedule:</strong> Weekend Classes (Saturday &amp; Sunday)
                  </li>
                  <li>
                    <strong className="text-[#0A1F44]">Class Timings:</strong>
                    <div className="mt-1 rounded-lg bg-[#F8FAFC] p-2.5 text-[13.5px] text-[#64748B]">
                      • Saturday: 9:00 AM – 5:00 PM<br />
                      • Sunday: 9:00 AM – 5:00 PM
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F1F5F9] text-[13px] text-[#64748B] leading-relaxed">
                Classes include lectures, discussions, presentations, research exercises, and guided sessions. Detailed timetable is circulated by the Ph.D. Cell.
              </div>
            </div>

            {/* Card 2: Assessment & Evaluation */}
            <div className="rounded-[20px] bg-white p-6 sm:p-8 border-l-[6px] border-l-[#FF5F19] border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF5F19]/10 text-[#FF5F19]">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-[20px] sm:text-[22px] font-bold text-[#0E395C]">
                    Assessment &amp; Evaluation
                  </h3>
                </div>

                <ul className="space-y-4 text-[15px] text-[#334155]">
                  <li>
                    <strong className="text-[#0A1F44] block">Continuous Assessments:</strong>
                    <div className="flex gap-2 mt-1.5">
                      <span className="rounded-md bg-[#F1F5F9] px-2.5 py-1 text-xs font-bold text-[#475569]">Assessment 1</span>
                      <span className="rounded-md bg-[#F1F5F9] px-2.5 py-1 text-xs font-bold text-[#475569]">Assessment 2</span>
                    </div>
                  </li>
                  <li>
                    <strong className="text-[#0A1F44] block">Mid-Term Examination (Hybrid):</strong>
                    <span className="text-[13.5px] text-[#64748B] mt-0.5 block">
                      Conducted on campus at Geeta University. Schedule notified in advance to plan travel.
                    </span>
                  </li>
                  <li>
                    <strong className="text-[#0A1F44] block">End-Term Examination (Offline - Mandatory):</strong>
                    <span className="text-[13.5px] text-[#64748B] mt-0.5 block">
                      The coursework final examination is conducted in offline mode only over a period of three days.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 3: Completion & General Rules */}
            <div className="rounded-[20px] bg-white p-6 sm:p-8 border-l-[6px] border-l-[#10B981] border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10B981]/10 text-[#10B981]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-[20px] sm:text-[22px] font-bold text-[#0E395C]">
                    Completion &amp; General Rules
                  </h3>
                </div>

                <p className="text-[14.5px] text-[#334155] mb-3">
                  Scholars must pass all coursework papers with the minimum qualifying marks as prescribed in the Ph.D. Regulations.
                </p>

                <strong className="text-[14px] uppercase font-bold text-[#0A1F44] block mb-2">
                  Successful completion is mandatory for:
                </strong>
                <ul className="space-y-1.5 pl-4 list-disc text-[14px] text-[#475569]">
                  <li>Registration confirmation</li>
                  <li>Progression to doctoral research work</li>
                  <li>Submission of research synopsis</li>
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F1F5F9] text-[12.5px] text-[#64748B] leading-relaxed">
                • Deviations require prior University approval.<br />
                • The University reserves the right to modify schedule or assessment pattern as per academic norms.
              </div>
            </div>

            {/* Card 4: International Scholars */}
            <div className="rounded-[20px] bg-white p-6 sm:p-8 border-l-[6px] border-l-[#0284C7] border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0284C7]/10 text-[#0284C7]">
                    <Globe2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-[20px] sm:text-[22px] font-bold text-[#0E395C]">
                    International Scholars Guidelines
                  </h3>
                </div>

                <ul className="space-y-2 text-[13.5px] text-[#475569] leading-relaxed">
                  <li>• Admission and orientation conducted online by the Registrar Office and International Help Desk.</li>
                  <li>• Must visit the University campus for <strong>3 - 4 weeks</strong> towards the end of the semester to complete coursework modules &amp; exams.</li>
                  <li>• Two DRC meetings annually; physical presence mandatory for at least one meeting.</li>
                  <li>• Entrance Test Exemption: Score <strong>IELTS ≥ 5</strong>, <strong>TOEFL ≥ 60</strong>, <strong>GRE ≥ 150-154</strong>, or <strong>GMAT ≥ 600</strong>.</li>
                  <li>• Compliance with visa and FRRO residency norms.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Time Scholarship Stipend Banner */}
        <div className="rounded-[24px] bg-[#0A1F44] p-8 sm:p-10 text-white shadow-xl">
          <h3 className="font-serif text-[28px] sm:text-[34px] font-bold text-white">
            Scholarship &amp; Stipend for Full-Time Ph.D. Scholars
          </h3>
          <div className="mt-4 space-y-2.5 text-[15px] sm:text-[16px] text-[#E2E8F0] max-w-3xl">
            {data?.stipendText && (
              <p className="text-amber-400 font-bold mb-3 text-base">
                {data.stipendText}
              </p>
            )}
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-[#E8871A] mt-2 shrink-0" />
              <p>
                <strong className="text-white">₹40,000 stipend per month:</strong> For postgraduate scholars who have completed their Master’s degree from IITs / IIMs / NITs, based on academic merit and selection performance.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-[#E8871A] mt-2 shrink-0" />
              <p>
                <strong className="text-white">Up to ₹30,000 stipend per month:</strong> For postgraduate scholars from other recognized institutions, based on academic merit and performance in the selection process.
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column: Program Duration & Why Choose Geeta University */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-[20px] bg-white p-6 sm:p-8 border border-[#E2E8F0] shadow-sm">
            <h3 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#0A1F44] mb-4">
              Program Duration
            </h3>
            <p className="text-[15.5px] leading-relaxed text-[#334155]">
              The Ph.D. Program shall be for a minimum duration of <strong>three (3) years</strong>, including coursework, and a maximum duration of <strong>six (6) years</strong> from the date of admission to the doctoral program.
            </p>
          </div>

          <div className="rounded-[20px] bg-white p-6 sm:p-8 border border-[#E2E8F0] shadow-sm">
            <h3 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#0A1F44] mb-4">
              Why Choose Geeta University for Ph.D.?
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[14.5px] text-[#334155]">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#10B981] shrink-0" />
                <span>Experienced Faculty</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#10B981] shrink-0" />
                <span>Smart Research Facilities</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#10B981] shrink-0" />
                <span>Centers of Excellence</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#10B981] shrink-0" />
                <span>Patents &amp; IPR Guidance</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#10B981] shrink-0" />
                <span>Multidisciplinary Culture</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#10B981] shrink-0" />
                <span>Global Collaborations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
