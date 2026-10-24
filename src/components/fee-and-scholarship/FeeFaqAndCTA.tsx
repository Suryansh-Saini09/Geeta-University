"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, PhoneCall, ArrowRight, ShieldCheck } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "How do I apply for a scholarship at Geeta University?",
    answer:
      "You can apply for scholarships during your online application submission. You will need to upload your qualifying marksheet, entrance test scorecard (GUTS, CUET, JEE, NEET, etc.), or relevant category certificates (defense, sports, domicile). The scholarship committee evaluates documents and applies the fee waiver immediately in your provisional admission letter.",
  },
  {
    question: "Is the scholarship applicable for all semesters of my program?",
    answer:
      "Yes, the scholarship awarded at the time of admission continues for subsequent academic years, provided the student maintains the minimum prescribed CGPA (typically >= 7.5) with no backlogs and follows the university's code of academic discipline.",
  },
  {
    question: "Can I combine two different scholarships?",
    answer:
      "Students are eligible to avail the single highest scholarship category for which they qualify (e.g., between Qualifying Merit, GUTS, CUET, or Sports). Multiple percentage waivers cannot be clubbed together on tuition fee.",
  },
  {
    question: "Does Geeta University offer Education Loan assistance?",
    answer:
      "Yes. Geeta University has formal tie-ups with leading nationalized and private banks (including SBI, PNB, HDFC, ICICI, and Axis Bank) as well as NBFCs to facilitate fast-track educational loan approvals with subsidized student interest rates.",
  },
  {
    question: "What amenities are included in the hostel fee?",
    answer:
      "Hostel charges include fully furnished AC/Non-AC accommodation, 4-time nutritious meals (breakfast, lunch, evening snacks, and dinner), 24x7 high-speed Wi-Fi, laundry facilities, 24/7 security with CCTV surveillance, medical emergency assistance, and gymnasium access.",
  },
  {
    question: "What is the fee refund policy in case of withdrawal?",
    answer:
      "Geeta University strictly adheres to the UGC fee refund guidelines. Full refund (with minimal nominal processing deduction) is provided within the UGC-stipulated admission closure window.",
  },
];

interface FeeFaqAndCTAProps {
  data?: {
    title?: string;
    supportEmail?: string;
    supportPhone?: string;
    items?: FaqItem[];
  };
}

export default function FeeFaqAndCTA({ data }: FeeFaqAndCTAProps = {}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqs = (data?.items && data.items.length > 0) ? data.items : FAQS;
  const ctaTitle = data?.title || "Ready to Begin Your Journey at Geeta University?";
  const supportPhone = data?.supportPhone || "+91-7082200908";

  const toggleFaq = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="w-full bg-[#FAF7F2] py-12 md:py-16">
      <div className="gu-container">
        {/* FAQs Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-serif text-[30px] sm:text-[38px] md:text-[44px] font-black text-[#0A1F44]">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-[16px] sm:text-[18px] text-[#475569]">
            Everything you need to know about fee schedules, scholarship criteria, and payment methods.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl mx-auto space-y-4 mb-16">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-[16px] bg-white border border-[#E2E8F0] overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left font-serif text-[17px] sm:text-[19px] font-bold text-[#06355F] hover:bg-[#F8FAFC] transition-colors"
                >
                  <span>{faq.question}</span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAF7F2] text-[#06355F] transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[#E8871A] text-white" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-[#F1F5F9] px-5 sm:px-6 py-4 sm:py-5 text-[15px] sm:text-[16px] leading-[1.75] text-[#475569]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-[24px] bg-gradient-to-r from-[#06355F] via-[#0A1F44] to-[#06355F] p-8 sm:p-12 md:p-14 text-white shadow-xl text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="inline-block rounded-full bg-[#E8871A] px-4 py-1 text-xs font-black uppercase tracking-wider text-white">
              Admissions Open
            </span>

            <h3 className="font-serif text-[28px] sm:text-[36px] md:text-[42px] font-black text-white leading-tight">
              {ctaTitle}
            </h3>

            <p className="text-[16px] sm:text-[18px] text-white/80 leading-relaxed max-w-2xl mx-auto">
              Secure your early decision scholarship benefits today and take the first step towards a rewarding global career.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="https://admissions.geetauniversity.edu.in/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#E8871A] px-8 py-3.5 text-[16px] font-bold text-white shadow-lg hover:bg-[#D47309] transition-all"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="h-5 w-5" />
              </a>

              <a
                href={`tel:${supportPhone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 rounded-[10px] border-2 border-white/40 bg-white/10 backdrop-blur-md px-7 py-3 text-[16px] font-bold text-white hover:bg-white hover:text-[#0A1F44] transition-all"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Call Admission Helpline ({supportPhone})</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
