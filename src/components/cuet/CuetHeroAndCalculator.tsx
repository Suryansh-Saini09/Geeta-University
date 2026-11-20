"use client";

import React from "react";
import Image from "next/image";
import ScholarshipCalculator from "@/components/scholarship-predictor/ScholarshipCalculator";

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

      {/* 2. Interactive Calculator Section */}
      <div className="gu-container py-12 sm:py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto">
          <ScholarshipCalculator
            mode="cuet"
            variant="cuet-hero"
            programsData={programsData}
            cuetData={cuetData}
          />
        </div>
      </div>
    </section>
  );
}
