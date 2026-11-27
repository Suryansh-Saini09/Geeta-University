"use client";

import React from "react";
import Image from "next/image";
import ScholarshipCalculator from "@/components/scholarship-predictor/ScholarshipCalculator";
import AdmissionFormWrapper from "@/components/programs/AdmissionFormWrapper";

interface CuetHeroAndCalculatorProps {
  data?: {
    title?: string;
    subtitle?: string;
    bannerImage?: string;
  };
  programsData?: Record<string, any>;
  cuetData?: any;
}

export default function CuetHeroAndCalculator({
  data,
  programsData,
  cuetData,
}: CuetHeroAndCalculatorProps) {
  const title = data?.title || "CUET UG 2026 Admissions & Merit Scholarships at GU";
  const bannerImage = data?.bannerImage || "/uploads/all/2540/cuet.jpeg";

  return (
    <section className="w-full bg-white">
      {/* 1. Hero Banner Image */}
      <div className="relative w-full overflow-hidden bg-[#0A1F44]">
        <div className="relative h-[220px] sm:h-[340px] md:h-[440px] lg:h-[500px] w-full">
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

      {/* 2. Interactive Calculator & Meritto Enquiry Section (2-Column Desktop Grid) */}
      <div className="gu-container py-12 sm:py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-start">
          {/* Left Column: CUET Scholarship Calculator (~65%) */}
          <div className="lg:col-span-7 xl:col-span-7">
            <ScholarshipCalculator
              mode="cuet"
              variant="cuet-hero"
              programsData={programsData}
              cuetData={cuetData}
            />
          </div>

          {/* Right Column: Sticky Meritto Enquiry Card (~35%) */}
          <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-28 flex justify-center lg:justify-end">
            <AdmissionFormWrapper initialDiscipline="CUET UG Admissions" />
          </div>
        </div>
      </div>
    </section>
  );
}
