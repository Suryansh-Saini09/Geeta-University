"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { CAREER_FAQS } from "@/data/careers";

interface CareersFAQProps {
  faqs?: {
    title?: string;
    subtitle?: string;
    faqs?: Array<{
      question: string;
      answer: string;
    }>;
  } | null;
}

export default function CareersFAQ({ faqs }: CareersFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const sectionTitle = faqs?.title || "Frequently Asked Questions";
  const sectionSubtitle =
    faqs?.subtitle ||
    "Find quick answers to common queries regarding recruitment, eligibility, and working at Geeta University.";
  const faqList = faqs?.faqs && faqs.faqs.length > 0 ? faqs.faqs : CAREER_FAQS;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#F8FAFC] py-10 md:py-14 border-t border-[#E2E8F0]">
      <div className="gu-container">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center justify-center gap-2.5 rounded-full border border-[#E8871A]/30 bg-[#E8871A]/10 px-4 py-1.5">
            <HelpCircle className="h-4 w-4 text-[#E8871A]" />
            <span className="text-[12px] font-bold uppercase tracking-[2px] text-[#E8871A]">
              Got Questions?
            </span>
          </div>
          <h2 className="font-serif text-[36px] font-black text-[#0A1F44] sm:text-[44px]">
            {sectionTitle.includes("Questions") ? (
              <>
                {sectionTitle.replace("Questions", "").trim()}{" "}
                <span className="text-[#E8871A]">Questions</span>
              </>
            ) : (
              sectionTitle
            )}
          </h2>
          <p className="mt-3 text-[16px] text-[#64748B]">
            {sectionSubtitle}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mx-auto max-w-4xl space-y-4">
          {faqList.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_4px_15px_rgba(10,31,68,0.03)] transition-all duration-200 hover:border-[#E8871A]/40"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[#F8FAFC]"
                >
                  <span className="font-serif text-[17px] font-bold text-[#0A1F44] sm:text-[19px]">
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F1F5F9] text-[#0A1F44] transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[#E8871A] text-white" : ""
                    }`}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="border-t border-[#F1F5F9] px-6 py-5 text-[15px] leading-[1.7] text-[#475569]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
