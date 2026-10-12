"use client";

import React, { useState } from "react";
import Image from "next/image";

const PROGRAM_FEES_DB: Record<string, { programs: string[]; defaultFee: number; tuitionFee: number }> = {
  "Computer Science & Engineering": {
    programs: [
      "B.Tech. (Hons.) CSE",
      "B.Tech CSE (AI & Machine Learning)",
      "B.Tech CSE (Cybersecurity)",
      "B.Tech CSE (Data Science & Analytics)",
      "B.Tech CSE (Full Stack Development)",
    ],
    defaultFee: 95000,
    tuitionFee: 85000,
  },
  "Computer Applications": {
    programs: [
      "BCA (Hons.) Computer Applications",
      "BCA (AI & Machine Learning)",
      "BCA (Cybersecurity)",
      "BCA (Data Science & Analytics)",
    ],
    defaultFee: 65000,
    tuitionFee: 55000,
  },
  "Commerce & Business Management": {
    programs: [
      "BBA (Hons.) Business Administration",
      "BBA (FinTech)",
      "BBA (Digital Marketing)",
      "B.Com. (Hons.) Bachelor of Commerce",
      "B.Com (Auditing & Taxation)",
    ],
    defaultFee: 60000,
    tuitionFee: 50000,
  },
  "SP Bansal School of Business": {
    programs: ["BBA Global Business", "BBA Entrepreneurship & Family Business"],
    defaultFee: 75000,
    tuitionFee: 65000,
  },
  "Pharmacy": {
    programs: ["B.Pharm (Bachelor of Pharmacy)", "D.Pharm (Diploma in Pharmacy)"],
    defaultFee: 70000,
    tuitionFee: 60000,
  },
  "Agricultural Sciences": {
    programs: ["B.Sc. (Hons.) Agriculture"],
    defaultFee: 65000,
    tuitionFee: 55000,
  },
  "Law": {
    programs: ["BA LL.B (Hons.) 5 Years", "BBA LL.B (Hons.) 5 Years"],
    defaultFee: 75000,
    tuitionFee: 65000,
  },
  "Hospitality & Hotel Management": {
    programs: ["B.Sc. (Hons.) Hotel Management", "Diploma in Hotel Management"],
    defaultFee: 55000,
    tuitionFee: 45000,
  },
  "Allied Health Sciences": {
    programs: ["B.Sc. (Hons.) Nutrition & Dietetics", "B.Sc Medical Lab Technology"],
    defaultFee: 55000,
    tuitionFee: 45000,
  },
  "Humanities & Social Sciences": {
    programs: ["B.Sc. (Hons.) Psychology", "B.A. (Hons.) Political Science", "B.A. (Hons.) Economics"],
    defaultFee: 45000,
    tuitionFee: 38000,
  },
  "Forensic Sciences": {
    programs: ["B.Sc. (Hons.) Forensic Sciences"],
    defaultFee: 60000,
    tuitionFee: 50000,
  },
  "Nursing": {
    programs: ["B.Sc Nursing (4 Years)", "GNM (General Nursing)"],
    defaultFee: 70000,
    tuitionFee: 60000,
  },
};

const CUET_SLABS = [
  { label: "95% and above (100% Tuition Waiver)", percent: 100 },
  { label: "90% – 94.9% (50% Tuition Waiver)", percent: 50 },
  { label: "80% – 89.9% (40% Tuition Waiver)", percent: 40 },
  { label: "70% – 79.9% (30% Tuition Waiver)", percent: 30 },
  { label: "60% – 69.9% (10% Tuition Waiver)", percent: 10 },
];

interface CuetHeroAndCalculatorProps {
  data?: {
    title?: string;
    subtitle?: string;
    bannerImage?: string;
  };
}

export default function CuetHeroAndCalculator({ data }: CuetHeroAndCalculatorProps) {
  const title = data?.title || "CUET UG 2026 Admissions & Merit Scholarships at GU";
  const bannerImage = data?.bannerImage || "https://geetauniversity.edu.in/uploads/all/2540/cuet.jpeg";

  // Calculator States
  const [selectedArea, setSelectedArea] = useState<string>("Computer Science & Engineering");
  const [selectedProgram, setSelectedProgram] = useState<string>("B.Tech. (Hons.) CSE");
  const [selectedSlabIdx, setSelectedSlabIdx] = useState<number>(0);

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const area = e.target.value;
    setSelectedArea(area);
    if (PROGRAM_FEES_DB[area]) {
      setSelectedProgram(PROGRAM_FEES_DB[area].programs[0] || "");
    }
  };

  // Calculate fees
  const areaData = PROGRAM_FEES_DB[selectedArea] || { defaultFee: 60000, tuitionFee: 50000, programs: [] };
  const slab = CUET_SLABS[selectedSlabIdx] || CUET_SLABS[0];
  const scholarshipAmount = Math.round((areaData.tuitionFee * slab.percent) / 100);
  const netPayable = Math.max(0, areaData.defaultFee - scholarshipAmount);

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
          {/* CUET Scholarship Calculator */}
          <div className="rounded-[24px] bg-gradient-to-br from-[#F0F7FF] to-[#FFF8F4] border border-[#CBD5E1] p-6 sm:p-8 shadow-sm">
            <div className="mb-6 pb-4 border-b border-[#E2E8F0]">
              <h2 className="font-serif text-[22px] sm:text-[26px] font-black text-[#0A1F44] leading-snug">
                {title}
              </h2>
            </div>

            {/* Calculator Inputs & Result Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-stretch">
              {/* Inputs */}
              <div className="sm:col-span-7 space-y-4">
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#0A1F44] mb-1.5">
                    Area of Interest
                  </label>
                  <select
                    value={selectedArea}
                    onChange={handleAreaChange}
                    className="w-full rounded-[10px] border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[14.5px] font-semibold text-[#0A1F44] focus:border-[#E8871A] focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                  >
                    {Object.keys(PROGRAM_FEES_DB).map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#0A1F44] mb-1.5">
                    Program / Course
                  </label>
                  <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="w-full rounded-[10px] border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[14.5px] font-semibold text-[#0A1F44] focus:border-[#E8871A] focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                  >
                    {areaData.programs.map((prog, idx) => (
                      <option key={idx} value={prog}>
                        {prog}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#0A1F44] mb-1.5">
                    CUET Score Slab
                  </label>
                  <select
                    value={selectedSlabIdx}
                    onChange={(e) => setSelectedSlabIdx(Number(e.target.value))}
                    className="w-full rounded-[10px] border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[14.5px] font-semibold text-[#0A1F44] focus:border-[#E8871A] focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                  >
                    {CUET_SLABS.map((sl, idx) => (
                      <option key={idx} value={idx}>
                        {sl.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Result Card */}
              <div className="sm:col-span-5 flex flex-col justify-between rounded-[18px] bg-gradient-to-br from-[#0B3D6B] via-[#0A5A8A] to-[#0A8AC7] p-5 text-white shadow-md">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-white/70 mb-3">
                    Fee Breakdown
                  </div>

                  <div className="space-y-2 text-[13.5px]">
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-white/80">Fee Per Sem:</span>
                      <span className="font-bold">₹{areaData.defaultFee.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-white/80">Tuition Fee:</span>
                      <span className="font-bold">₹{areaData.tuitionFee.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-white/80">Scholarship:</span>
                      <span className="font-bold text-[#86EFAC]">-₹{scholarshipAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-[12px] bg-[#E8871A]/20 border border-[#E8871A]/40 p-3 text-center">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                    You Pay (Per Sem)
                  </div>
                  <div className="font-serif text-[24px] font-black text-white mt-0.5">
                    ₹{netPayable.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
