"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";

interface GutsHeroProps {
  data?: {
    title?: string;
    subtitle?: string;
    bannerImage?: string;
    applyUrl?: string;
  };
}

export default function GutsHero({ data }: GutsHeroProps) {
  const title = data?.title || "GUTS – Geeta University Test of Scholarship";
  const subtitle = data?.subtitle || "GUTS is Geeta University's in-house scholarship test to identify students' capability and interest to excel academically. Depending on how well they perform in the test, students can pursue their dream of acquiring higher education with 0 tuition fees.";
  const bannerImage = data?.bannerImage || "https://geetauniversity.edu.in/uploads/all/1912/Guts_banner.jpg";

  return (
    <section className="w-full bg-white">
      {/* 1. Large Top Hero Banner Image */}
      <div className="relative w-full overflow-hidden bg-[#0A1F44]">
        <div className="relative h-[220px] sm:h-[320px] md:h-[420px] lg:h-[500px] xl:h-[560px] w-full">
          <Image
            src={bannerImage}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* 2. Hero Content */}
      <div className="gu-container py-12 sm:py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="font-serif text-[34px] sm:text-[44px] md:text-[50px] font-black text-[#0A1F44] leading-[1.15] tracking-[-1px]">
            {title}
          </h1>

          <p className="text-[16.5px] sm:text-[18px] leading-[1.8] text-[#334155]">
            {subtitle}
          </p>

          {/* Benefits Box */}
          <div className="rounded-[20px] bg-[#F8FAFC] border border-[#E2E8F0] p-6 sm:p-8 space-y-4">
            <h3 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#0A1F44]">
              GUTS Key Benefits
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-[12px] bg-white p-4 border border-[#E2E8F0]">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ECFDF5] text-[#10B981] shrink-0 mt-0.5">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <div className="text-[15.5px] font-medium text-[#1E293B] leading-snug">
                  <strong>Enhance Your Scholarship:</strong> Increase your existing scholarship amount on admission.
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-[12px] bg-white p-4 border border-[#E2E8F0]">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ECFDF5] text-[#10B981] shrink-0 mt-0.5">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <div className="text-[15.5px] font-medium text-[#1E293B] leading-snug">
                  <strong>Up to 100% Tuition Waiver:</strong> Avail up to 100% scholarship through GUTS score, even if you are not eligible for any other GU scholarship.
                </div>
              </div>
            </div>
          </div>

          {/* Metric counters - Normal level styling */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2">
            <div className="rounded-[16px] bg-[#FFF8F2] border border-[#FFD9B3] p-4 text-center">
              <div className="text-[26px] sm:text-[32px] font-extrabold text-[#E8871A]">100%</div>
              <div className="text-[12px] sm:text-[13px] font-semibold text-[#8C4300] mt-0.5">Max Tuition Waiver</div>
            </div>
            <div className="rounded-[16px] bg-[#EFF6FF] border border-[#BFDBFE] p-4 text-center">
              <div className="text-[26px] sm:text-[32px] font-extrabold text-[#0284C7]">60 Min</div>
              <div className="text-[12px] sm:text-[13px] font-semibold text-[#0369A1] mt-0.5">Online Exam</div>
            </div>
            <div className="rounded-[16px] bg-[#F0FDF4] border border-[#BBF7D0] p-4 text-center">
              <div className="text-[26px] sm:text-[32px] font-extrabold text-[#16A34A]">60 Qs</div>
              <div className="text-[12px] sm:text-[13px] font-semibold text-[#15803D] mt-0.5">Aptitude &amp; Subject</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
