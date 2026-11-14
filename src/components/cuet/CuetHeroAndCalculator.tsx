"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { PROGRAMS_DATA, ProgramItem } from "@/data/scholarshipPredictorData";

const CUET_SLABS = [
  { label: "95% and above (100% Tuition Waiver)", percent: 100 },
  { label: "90% – 94.99% (50% Tuition Waiver)", percent: 50 },
  { label: "80% – 89.99% (40% Tuition Waiver)", percent: 40 },
  { label: "70% – 79.99% (30% Tuition Waiver)", percent: 30 },
  { label: "60% – 69.99% (10% Tuition Waiver)", percent: 10 },
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
  const bannerImage = data?.bannerImage || "/uploads/all/2540/cuet.jpeg";

  // Calculator States
  const availableAreas = useMemo(() => Object.keys(PROGRAMS_DATA), []);
  const [selectedArea, setSelectedArea] = useState<string>("Computer Science & Engineering");

  const availablePrograms = useMemo<ProgramItem[]>(() => {
    if (!selectedArea || !PROGRAMS_DATA[selectedArea]) return [];
    // Prioritize UG programs for CUET-UG, but allow all programs if none match
    const ugOnly = PROGRAMS_DATA[selectedArea].programs.filter((p) => p.level === "UG");
    return ugOnly.length > 0 ? ugOnly : PROGRAMS_DATA[selectedArea].programs;
  }, [selectedArea]);

  const [selectedProgram, setSelectedProgram] = useState<string>("B.Tech in CSE");
  const [selectedSlabIdx, setSelectedSlabIdx] = useState<number>(0);

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const area = e.target.value;
    setSelectedArea(area);
    const progs = PROGRAMS_DATA[area]?.programs.filter((p) => p.level === "UG") || PROGRAMS_DATA[area]?.programs || [];
    setSelectedProgram(progs[0]?.program || "");
  };

  // Resolve current active program fees
  const currentProgram = useMemo<ProgramItem | null>(() => {
    return availablePrograms.find((p) => p.program === selectedProgram) || availablePrograms[0] || null;
  }, [availablePrograms, selectedProgram]);

  const feePerSem = currentProgram?.prog_fee_per_sem ?? 0;
  const tuitionFee = currentProgram?.tuition_fee ?? 0;
  const slab = CUET_SLABS[selectedSlabIdx] || CUET_SLABS[0];
  const scholarshipAmount = Math.round((tuitionFee * slab.percent) / 100);
  const netPayable = Math.max(0, feePerSem - scholarshipAmount);

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
                  <label htmlFor="cuet-calc-area" className="block text-[12px] font-bold uppercase tracking-wider text-[#0A1F44] mb-1.5">
                    Area of Interest
                  </label>
                  <select
                    id="cuet-calc-area"
                    aria-label="Area of Interest"
                    value={selectedArea}
                    onChange={handleAreaChange}
                    className="w-full rounded-[10px] border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[14.5px] font-semibold text-[#0A1F44] focus:border-[#E8871A] focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                  >
                    {availableAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="cuet-calc-program" className="block text-[12px] font-bold uppercase tracking-wider text-[#0A1F44] mb-1.5">
                    Program / Course
                  </label>
                  <select
                    id="cuet-calc-program"
                    aria-label="Program / Course"
                    value={currentProgram?.program || selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="w-full rounded-[10px] border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[14.5px] font-semibold text-[#0A1F44] focus:border-[#E8871A] focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                  >
                    {availablePrograms.map((prog, idx) => (
                      <option key={idx} value={prog.program}>
                        {prog.program} ({prog.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="cuet-calc-slab" className="block text-[12px] font-bold uppercase tracking-wider text-[#0A1F44] mb-1.5">
                    CUET Score Slab
                  </label>
                  <select
                    id="cuet-calc-slab"
                    aria-label="CUET Score Slab"
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
                      <span className="font-bold">₹{feePerSem.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-white/80">Tuition Fee:</span>
                      <span className="font-bold">₹{tuitionFee.toLocaleString("en-IN")}</span>
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
