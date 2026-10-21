"use client";

import React, { useState } from "react";
import Image from "next/image";
import { gutsFaqsData } from "@/data/gutsData";
import { Play, ChevronDown, Phone } from "lucide-react";
import VideoModal from "@/components/campus-life/VideoModal";

export default function GutsFaqAndVideo() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const toggleAccordion = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="guts-faqs" className="w-full bg-white py-14 sm:py-18 md:py-22 border-b border-[#E2E8F0]">
      <div className="gu-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: FAQ Accordion */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-[2px] w-8 bg-[#E8871A]" />
                <span className="text-[12px] font-extrabold uppercase tracking-[3px] text-[#E8871A]">
                  Common Inquiries
                </span>
              </div>
              <h2 className="font-serif text-[30px] sm:text-[36px] font-black text-[#0A1F44]">
                Frequently Asked Questions (FAQs)
              </h2>
            </div>

            <div className="space-y-3">
              {gutsFaqsData.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-[#FFFFFF] transition-all"
                  >
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="flex w-full items-center justify-between p-4.5 sm:p-5 text-left transition-colors hover:bg-[#F8FAFC]"
                    >
                      <span className="font-serif text-[16.5px] sm:text-[17.5px] font-bold text-[#0E395C] leading-snug">
                        {faq.q}
                      </span>
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full bg-[#F1F5F9] text-[#0A1F44] transition-transform duration-200 shrink-0 ml-3 ${
                          isOpen ? "rotate-180 bg-[#E8871A] text-white" : ""
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-[#F1F5F9] bg-[#FAFBFD] p-5 text-[15px] leading-relaxed text-[#475569]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: GUTS Video Trigger Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <div
                onClick={() => setIsVideoModalOpen(true)}
                className="group relative h-[360px] sm:h-[420px] w-full overflow-hidden rounded-[24px] border border-[#E2E8F0] shadow-xl cursor-pointer bg-[#0A1F44]"
              >
                <Image
                  src="/uploads/all/1839/guts_final.jpg"
                  alt="Watch GUTS Video"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/30" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E8871A] text-white shadow-2xl transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-8 w-8 fill-current translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Help contact pill */}
              <div className="mt-4 rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0E385D] text-white">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs text-[#64748B] font-semibold">Have Questions?</div>
                    <a href="tel:7082200908" className="text-sm font-bold text-[#0A1F44] hover:text-[#E8871A]">
                      +91 70822 00908
                    </a>
                  </div>
                </div>
                <a
                  href="#enquire"
                  className="rounded-full bg-[#E8871A] px-5 py-2 text-xs font-bold !text-white shadow-sm transition-all hover:bg-[#D47309] hover:shadow"
                >
                  Enquire Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Component */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoId="szoudqHWtkc"
        title="GUTS - Geeta University Test of Scholarship"
      />
    </section>
  );
}
