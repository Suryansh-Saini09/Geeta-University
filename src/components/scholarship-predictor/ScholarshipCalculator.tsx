"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Award, CheckCircle2, Info, AlertTriangle, Sparkles } from "lucide-react";
import {
  PROGRAMS_DATA,
  RULES_DATA,
  ProgramItem,
  RuleCategory,
  detectLevel,
} from "@/data/scholarshipPredictorData";

interface ScholarshipCalculatorProps {
  data?: {
    title?: string;
    instructionText?: string;
  };
}

export default function ScholarshipCalculator({ data }: ScholarshipCalculatorProps = {}) {
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedProgramJson, setSelectedProgramJson] = useState<string>("");
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>("");
  const [selectedSubCategoryIndex, setSelectedSubCategoryIndex] = useState<string>("");
  const [selectedSlabPercent, setSelectedSlabPercent] = useState<number | null>(null);

  // Parsed selected program object
  const currentProgram = useMemo<ProgramItem | null>(() => {
    if (!selectedProgramJson) return null;
    try {
      return JSON.parse(selectedProgramJson) as ProgramItem;
    } catch {
      return null;
    }
  }, [selectedProgramJson]);

  // Available programs for chosen Area
  const availablePrograms = useMemo<ProgramItem[]>(() => {
    if (!selectedArea || !PROGRAMS_DATA[selectedArea]) return [];
    return PROGRAMS_DATA[selectedArea].programs;
  }, [selectedArea]);

  // Available Categories based on Program and Area rules
  const availableCategories = useMemo<{ key: string; rule: RuleCategory }[]>(() => {
    if (!currentProgram || !selectedArea) return [];
    if (currentProgram.scholarship_allowed === false) return [];

    const programLevel = detectLevel(currentProgram.program);

    return Object.entries(RULES_DATA)
      .filter(([_, rule]) => {
        // Exclusions by Area
        if (rule.exclude_groups?.includes(selectedArea)) return false;
        // Eligibility by Area
        if (rule.eligible_groups && !rule.eligible_groups.includes(selectedArea)) return false;
        // Applicability by Level (UG, PG, Diploma)
        if (rule.level_applicability && !rule.level_applicability.includes(programLevel)) return false;
        return true;
      })
      .map(([key, rule]) => ({ key, rule }));
  }, [currentProgram, selectedArea]);

  // Selected Rule object
  const currentRule = useMemo<RuleCategory | null>(() => {
    if (!selectedCategoryKey || !RULES_DATA[selectedCategoryKey]) return null;
    return RULES_DATA[selectedCategoryKey];
  }, [selectedCategoryKey]);

  // Available Subcategories
  const availableSubCategories = useMemo(() => {
    if (!currentRule) return [];
    return currentRule.subcategories || [];
  }, [currentRule]);

  // Available Slabs
  const availableSlabs = useMemo(() => {
    if (!currentRule) return [];

    if (currentRule.percent !== undefined && selectedSubCategoryIndex === "direct") {
      return [{ label: `Direct ${currentRule.percent}% Waiver`, percent: currentRule.percent }];
    }

    if (selectedSubCategoryIndex !== "" && selectedSubCategoryIndex !== "direct") {
      const idx = parseInt(selectedSubCategoryIndex, 10);
      const sub = availableSubCategories[idx];
      if (sub && sub.slabs) {
        return sub.slabs;
      }
      if (sub && sub.percent !== undefined) {
        return [{ label: `${sub.label} (${sub.percent}%)`, percent: sub.percent }];
      }
    }
    return [];
  }, [currentRule, selectedSubCategoryIndex, availableSubCategories]);

  // Handle Area Selection Change
  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArea(e.target.value);
    setSelectedProgramJson("");
    setSelectedCategoryKey("");
    setSelectedSubCategoryIndex("");
    setSelectedSlabPercent(null);
  };

  // Handle Program Selection Change
  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProgramJson(e.target.value);
    setSelectedCategoryKey("");
    setSelectedSubCategoryIndex("");
    setSelectedSlabPercent(null);
  };

  // Handle Category Selection Change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryKey(e.target.value);
    setSelectedSubCategoryIndex("");
    setSelectedSlabPercent(null);
  };

  // Handle SubCategory Selection Change
  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedSubCategoryIndex(val);
    setSelectedSlabPercent(null);
  };

  // Handle Slab Change
  const handleSlabChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "") {
      setSelectedSlabPercent(null);
    } else {
      setSelectedSlabPercent(parseFloat(val));
    }
  };

  // Calculations
  const calculations = useMemo(() => {
    if (!currentProgram || selectedSlabPercent === null) {
      return {
        feePerSem: currentProgram ? currentProgram.prog_fee_per_sem : 0,
        tuitionFee: currentProgram ? currentProgram.tuition_fee : 0,
        scholarshipAmount: 0,
        payableFee: currentProgram ? currentProgram.prog_fee_per_sem : 0,
      };
    }

    const feePerSem = currentProgram.prog_fee_per_sem;
    const tuitionFee = currentProgram.tuition_fee;
    const scholarshipAmount = Math.round((tuitionFee * selectedSlabPercent) / 100);
    const payableFee = Math.round(feePerSem - scholarshipAmount);

    return { feePerSem, tuitionFee, scholarshipAmount, payableFee };
  }, [currentProgram, selectedSlabPercent]);

  return (
    <section id="scholarship-calculator-section" className="scroll-mt-20 bg-white py-12 md:py-16 border-t border-[#E2E8F0]">
      <div className="gu-container">
        {/* Section Title */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="font-serif text-[36px] font-black text-[#0A1F44] sm:text-[44px]">
            {data?.title || (
              <>
                Scholarship <span className="text-[#066191]">Calculator</span>
              </>
            )}
          </h2>
          <p className="mt-3 text-[16px] leading-[1.7] text-[#64748B]">
            {data?.instructionText || "Select your discipline, academic program, and qualifying eligibility category to view your custom semester fee breakdown and tuition scholarship."}
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_20px_50px_rgba(10,31,68,0.08)]">
          {/* Top Decorative Banner */}
          <div className="bg-[#066191] px-8 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="h-7 w-7 text-[#E8871A]" />
                <h3 className="font-serif text-[22px] font-bold">
                  Geeta University Scholarship Estimator
                </h3>
              </div>
              {/* <span className="hidden text-[12px] font-semibold text-white/80 sm:block">
                Session 2026-2027
              </span> */}
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
              {/* LEFT FORM FIELDS (8 cols) */}
              <div className="space-y-6 lg:col-span-7">
                {/* 1. Area of Interest */}
                <div>
                  <label className="mb-1.5 block text-[13.5px] font-bold text-[#0A1F44]">
                    Area of Interest <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedArea}
                    onChange={handleAreaChange}
                    className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#066191] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#066191]/20"
                  >
                    <option value="">Select Discipline / Area</option>
                    {Object.keys(PROGRAMS_DATA).map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Program Selection */}
                <div>
                  <label className="mb-1.5 block text-[13.5px] font-bold text-[#0A1F44]">
                    Program <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedProgramJson}
                    onChange={handleProgramChange}
                    disabled={!selectedArea}
                    className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#066191] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#066191]/20 disabled:opacity-60"
                  >
                    <option value="">
                      {selectedArea ? "Select Academic Program" : "Select Area of Interest First"}
                    </option>
                    {availablePrograms.map((p) => (
                      <option key={p.program} value={JSON.stringify(p)}>
                        {p.program} ({p.level})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Scholarship Category */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[13.5px] font-bold text-[#0A1F44]">
                      Scholarship Category
                    </label>
                    <select
                      value={selectedCategoryKey}
                      onChange={handleCategoryChange}
                      disabled={!selectedProgramJson || currentProgram?.scholarship_allowed === false}
                      className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#066191] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#066191]/20 disabled:opacity-60"
                    >
                      <option value="">
                        {!selectedProgramJson
                          ? "Select Program First"
                          : currentProgram?.scholarship_allowed === false
                          ? "No Scholarship Available"
                          : "Select Scholarship Category"}
                      </option>
                      {availableCategories.map(({ key, rule }) => (
                        <option key={key} value={key}>
                          {rule.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Subcategory */}
                  <div>
                    <label className="mb-1.5 block text-[13.5px] font-bold text-[#0A1F44]">
                      Scholarship Subcategory
                    </label>
                    <select
                      value={selectedSubCategoryIndex}
                      onChange={handleSubCategoryChange}
                      disabled={!selectedCategoryKey}
                      className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#066191] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#066191]/20 disabled:opacity-60"
                    >
                      <option value="">
                        {selectedCategoryKey ? "Select Subcategory" : "Select Category First"}
                      </option>
                      {currentRule?.percent !== undefined ? (
                        <option value="direct">Direct {currentRule.percent}%</option>
                      ) : (
                        availableSubCategories.map((sub, i) => (
                          <option key={i} value={i.toString()}>
                            {sub.label}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* 5. Scholarship Slab */}
                <div>
                  <label className="mb-1.5 block text-[13.5px] font-bold text-[#0A1F44]">
                    Scholarship Slab / Criteria
                  </label>
                  <select
                    value={selectedSlabPercent === null ? "" : selectedSlabPercent.toString()}
                    onChange={handleSlabChange}
                    disabled={selectedSubCategoryIndex === ""}
                    className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#066191] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#066191]/20 disabled:opacity-60"
                  >
                    <option value="">
                      {selectedSubCategoryIndex !== "" ? "Select Score / Percentage Slab" : "Select Subcategory First"}
                    </option>
                    {availableSlabs.map((s, idx) => (
                      <option key={idx} value={s.percent}>
                        {s.label} — {s.percent}% Scholarship
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* RIGHT RESULT CARD (5 cols) */}
              <div className="flex flex-col justify-between rounded-[20px] bg-gradient-to-b from-[#0a8ac7] to-[#066191] p-6 text-white shadow-lg lg:col-span-5">
                <div>
                  <div className="mb-6 flex items-center justify-between border-b border-white/20 pb-4">
                    <span className="text-[13px] font-bold uppercase tracking-[1.5px] text-white/80">
                      Calculation Breakdown
                    </span>
                  </div>

                  {/* Fee Per Semester */}
                  <div className="mb-4 flex items-center justify-between border-b border-white/15 pb-3">
                    <span className="text-[14.5px] font-medium text-white/90">
                      Fee Per Semester
                    </span>
                    <span className="font-serif text-[18px] font-bold text-white">
                      {currentProgram ? `₹ ${calculations.feePerSem.toLocaleString("en-IN")}` : "₹ 0"}
                    </span>
                  </div>

                  {/* Tuition Fee */}
                  <div className="mb-4 flex items-center justify-between border-b border-white/15 pb-3">
                    <span className="text-[14.5px] font-medium text-white/90">
                      Tuition Fee Component
                    </span>
                    <span className="font-serif text-[18px] font-bold text-white">
                      {currentProgram ? `₹ ${calculations.tuitionFee.toLocaleString("en-IN")}` : "₹ 0"}
                    </span>
                  </div>

                  {/* Scholarship Amount */}
                  <div className="mb-6 flex items-center justify-between border-b border-white/15 pb-3">
                    <span className="text-[14.5px] font-semibold text-emerald-200">
                      Scholarship Amount ({selectedSlabPercent ?? 0}%)
                    </span>
                    <span className="font-serif text-[20px] font-extrabold text-green-300">
                      - ₹ {calculations.scholarshipAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Payable Fee After Scholarship Box */}
                <div className="rounded-[16px] bg-white/10 p-5 text-center backdrop-blur-md">
                  <p className="text-[13px] font-semibold uppercase tracking-[1px] text-white/90">
                    Payable Fee After Scholarship
                  </p>
                  <p className="mt-1 font-serif text-[32px] font-black text-white sm:text-[36px]">
                    ₹ {calculations.payableFee.toLocaleString("en-IN")}
                  </p>
                  <p className="mt-1 text-[11.5px] text-white/70">
                    * Per semester applicable fee
                  </p>
                </div>
              </div>
            </div>

            {/* Note Footnote */}
            <div className="mt-8 flex items-center justify-center gap-2 rounded-[12px] bg-[#FFFBF0] p-4 text-center text-[#92400E] border border-[#FDE68A]">
              <Info className="h-5 w-5 shrink-0 text-[#D97706]" />
              <p className="text-[13.5px] font-medium">
                <strong>Note:</strong> GUTS Scholarship is not valid for Pharmacy, Nursing, and Postgraduate (PG) / Ph.D. Programs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
