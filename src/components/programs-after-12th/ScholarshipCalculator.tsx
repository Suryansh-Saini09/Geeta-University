"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Award, TrendingDown } from "lucide-react";
import {
  programsFeeData,
  scholarshipRulesData,
} from "@/data/programsAfter12";

// Program level detection
function detectLevel(name: string): "UG" | "PG" | "Diploma" | "Ph.D" {
  if (/ph\.?d/i.test(name)) return "Ph.D";
  if (/^m\.|mba|mca|m\.tech|m\.sc|ll\.m/i.test(name)) return "PG";
  if (/diploma|d\.pharm/i.test(name)) return "Diploma";
  return "UG";
}

export default function ScholarshipCalculator() {
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedProgramIdx, setSelectedProgramIdx] = useState<string>("");
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>("");
  const [selectedSubcategoryIdx, setSelectedSubcategoryIdx] = useState<string>("");
  const [selectedSlabPercent, setSelectedSlabPercent] = useState<string>("");

  // Complete 12 areas
  const areaOptions = useMemo(() => Object.keys(programsFeeData), []);

  const programOptions = useMemo(() => {
    if (!selectedArea || !programsFeeData[selectedArea]) return [];
    return programsFeeData[selectedArea].programs;
  }, [selectedArea]);

  const currentProgram = useMemo(() => {
    if (selectedProgramIdx === "" || !programOptions[Number(selectedProgramIdx)]) {
      return null;
    }
    return programOptions[Number(selectedProgramIdx)];
  }, [selectedProgramIdx, programOptions]);

  const programLevel = useMemo(() => {
    if (!currentProgram) return "UG";
    return currentProgram.level || detectLevel(currentProgram.program);
  }, [currentProgram]);

  const availableCategories = useMemo(() => {
    if (!currentProgram) return [];
    const area = selectedArea;

    return Object.entries(scholarshipRulesData).filter(([key, rule]) => {
      if (rule.exclude_groups?.includes(area)) return false;
      if (rule.eligible_groups && !rule.eligible_groups.includes(area)) return false;
      if (rule.level_applicability && !rule.level_applicability.includes(programLevel)) {
        return false;
      }
      // GUTS is strictly for UG programs and never for PG, Pharmacy, or Ph.D
      if (key === "GUTS") {
        if (programLevel !== "UG") return false;
        if (area === "Pharmacy") return false;
        if (/pharm|ph\.?d/i.test(currentProgram.program)) return false;
      }
      return true;
    });
  }, [currentProgram, selectedArea, programLevel]);

  // Defensive cleanup to avoid stale selections
  useEffect(() => {
    if (selectedCategoryKey && !availableCategories.some(([k]) => k === selectedCategoryKey)) {
      setSelectedCategoryKey("");
      setSelectedSubcategoryIdx("");
      setSelectedSlabPercent("");
    }
  }, [availableCategories, selectedCategoryKey]);

  const currentRule = useMemo(() => {
    if (!selectedCategoryKey || !scholarshipRulesData[selectedCategoryKey]) return null;
    return scholarshipRulesData[selectedCategoryKey];
  }, [selectedCategoryKey]);

  const subcategoryOptions = useMemo(() => {
    if (!currentRule || !currentRule.subcategories) return [];
    return currentRule.subcategories;
  }, [currentRule]);

  const slabOptions = useMemo(() => {
    if (selectedSubcategoryIdx === "" || !subcategoryOptions[Number(selectedSubcategoryIdx)]) {
      return [];
    }
    return subcategoryOptions[Number(selectedSubcategoryIdx)].slabs;
  }, [selectedSubcategoryIdx, subcategoryOptions]);

  // Handle cascading changes
  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArea(e.target.value);
    setSelectedProgramIdx("");
    setSelectedCategoryKey("");
    setSelectedSubcategoryIdx("");
    setSelectedSlabPercent("");
  };

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProgramIdx(e.target.value);
    setSelectedCategoryKey("");
    setSelectedSubcategoryIdx("");
    setSelectedSlabPercent("");
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryKey(e.target.value);
    setSelectedSubcategoryIdx("");
    setSelectedSlabPercent("");
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubcategoryIdx(e.target.value);
    setSelectedSlabPercent("");
  };

  const handleSlabChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSlabPercent(e.target.value);
  };

  // Calculations
  const calculations = useMemo(() => {
    if (!currentProgram) {
      return {
        feePerSem: 0,
        tuitionFee: 0,
        scholarshipAmount: 0,
        applicableFee: 0,
        percent: 0,
        hasProgram: false,
        hasCalculated: false,
      };
    }

    const feePerSem = currentProgram.prog_fee_per_sem;
    const tuitionFee = currentProgram.tuition_fee;
    const percent = selectedSlabPercent !== "" ? Number(selectedSlabPercent) : 0;

    const scholarshipAmount = Math.round((tuitionFee * percent) / 100);
    const applicableFee = Math.round(feePerSem - scholarshipAmount);

    return {
      feePerSem,
      tuitionFee,
      scholarshipAmount,
      applicableFee,
      percent,
      hasProgram: true,
      hasCalculated: selectedSlabPercent !== "",
    };
  }, [currentProgram, selectedSlabPercent]);

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(10,31,68,0.06)]">
      {/* Header */}
      <div className="mb-6 text-center">
        <h3 className="font-serif text-[22px] sm:text-[24px] font-black text-[#0A1F44] leading-tight">
          Know Your Fees &amp; Scholarship
        </h3>
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        {/* 1. Area of Interest */}
        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
            Area of Interest <span className="text-[#E8871A]">*</span>
          </label>
          <select
            value={selectedArea}
            onChange={handleAreaChange}
            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[14.5px] font-medium text-[#1A1A2E] outline-none transition-all duration-200 focus:border-[#E8871A] focus:ring-2 focus:ring-[#E8871A]/20"
          >
            <option value="">Select Area of Interest</option>
            {areaOptions.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Program */}
        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
            Program <span className="text-[#E8871A]">*</span>
          </label>
          <select
            value={selectedProgramIdx}
            onChange={handleProgramChange}
            disabled={!selectedArea}
            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[14.5px] font-medium text-[#1A1A2E] outline-none transition-all duration-200 focus:border-[#E8871A] focus:ring-2 focus:ring-[#E8871A]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:opacity-60"
          >
            <option value="">
              {selectedArea ? "Select Program" : "Select an Area First"}
            </option>
            {programOptions.map((p, idx) => (
              <option key={idx} value={idx}>
                {p.program}
              </option>
            ))}
          </select>
        </div>

        {/* 3 & 4. Scholarship Category & Scholarship Subcategory (Side by Side) */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {/* Scholarship Category */}
          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
              Scholarship Category
            </label>
            <select
              value={selectedCategoryKey}
              onChange={handleCategoryChange}
              disabled={!currentProgram}
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[14px] font-medium text-[#1A1A2E] outline-none transition-all duration-200 focus:border-[#E8871A] focus:ring-2 focus:ring-[#E8871A]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:opacity-60"
            >
              <option value="">
                {currentProgram ? "Select Category" : "Select Program First"}
              </option>
              {availableCategories.map(([key, rule]) => (
                <option key={key} value={key}>
                  {rule.label}
                </option>
              ))}
            </select>
          </div>

          {/* Scholarship Subcategory */}
          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
              Scholarship Subcategory
            </label>
            <select
              value={selectedSubcategoryIdx}
              onChange={handleSubcategoryChange}
              disabled={!selectedCategoryKey || subcategoryOptions.length === 0}
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[14px] font-medium text-[#1A1A2E] outline-none transition-all duration-200 focus:border-[#E8871A] focus:ring-2 focus:ring-[#E8871A]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:opacity-60"
            >
              <option value="">
                {selectedCategoryKey ? "Select Subcategory" : "Select Category First"}
              </option>
              {subcategoryOptions.map((sub, idx) => (
                <option key={idx} value={idx}>
                  {sub.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Scholarship Slab */}
        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
            Scholarship Slab
          </label>
          <select
            value={selectedSlabPercent}
            onChange={handleSlabChange}
            disabled={selectedSubcategoryIdx === "" || slabOptions.length === 0}
            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[14.5px] font-semibold text-[#0A1F44] outline-none transition-all duration-200 focus:border-[#E8871A] focus:ring-2 focus:ring-[#E8871A]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:opacity-60"
          >
            <option value="">
              {selectedSubcategoryIdx !== "" ? "Select Slab / Score" : "Select Subcategory First"}
            </option>
            {slabOptions.map((slab, idx) => (
              <option key={idx} value={slab.percent}>
                {slab.label} — {slab.percent}%
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calculation Result Box — Brand Color Scheme */}
      <div className="mt-6">
        <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#0A1F44] via-[#0D2857] to-[#1A3A6B] p-5 sm:p-6 text-white shadow-xl">
          <div className="space-y-3 text-[14.5px]">
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
              <span className="text-white/80 font-medium">Fee Per Semester</span>
              <span className="font-mono text-[16.5px] font-bold text-white">
                {calculations.hasProgram ? `₹ ${calculations.feePerSem.toLocaleString("en-IN")}` : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
              <span className="text-white/80 font-medium">Tuition Fee</span>
              <span className="font-mono text-[16.5px] font-bold text-white">
                {calculations.hasProgram ? `₹ ${calculations.tuitionFee.toLocaleString("en-IN")}` : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
              <span className="text-white/80 font-medium flex items-center gap-1.5">
                <Award size={15} className="text-[#E8871A]" />
                Scholarship Amount
              </span>
              <span className="font-mono text-[16.5px] font-bold text-[#4ADE80]">
                {calculations.hasCalculated
                  ? `- ₹ ${calculations.scholarshipAmount.toLocaleString("en-IN")}`
                  : calculations.hasProgram
                  ? "Select Slab"
                  : "—"}
              </span>
            </div>
          </div>

          {/* Applicable Net Fee */}
          <div className="mt-5 rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm border border-white/10">
            <div className="text-[12px] font-bold uppercase tracking-wider text-[#E8871A]">
              Applicable Fee
            </div>
            <div className="mt-1 font-serif text-[28px] sm:text-[32px] font-black text-white leading-tight">
              {calculations.hasCalculated
                ? `₹ ${calculations.applicableFee.toLocaleString("en-IN")}`
                : calculations.hasProgram
                ? `₹ ${calculations.feePerSem.toLocaleString("en-IN")}`
                : "₹ —"}
            </div>
            {calculations.hasCalculated && calculations.percent > 0 && (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#4ADE80]/15 px-3 py-0.5 text-[12px] font-bold text-[#4ADE80]">
                <TrendingDown size={13} />
                You save ₹ {calculations.scholarshipAmount.toLocaleString("en-IN")} ({calculations.percent}% on Tuition)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
