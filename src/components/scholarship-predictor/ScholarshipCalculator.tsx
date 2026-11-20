"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Award, Info, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import {
  PROGRAMS_DATA,
  RULES_DATA,
  detectLevel,
} from "@/data/scholarshipPredictorData";
import { calculateScholarshipEligibility } from "@/lib/scholarship/calculator";

export interface CuetSlabOption {
  id?: string;
  label: string;
  percent: number;
}

export interface ScholarshipCalculatorProps {
  data?: {
    title?: string;
    subtitle?: string;
    instructionText?: string;
  };
  programsData?: Record<string, any>;
  rulesData?: Record<string, any>;
  cuetData?: {
    ug?: {
      id?: string;
      label?: string;
      slabs: CuetSlabOption[];
    };
    pg?: {
      id?: string;
      label?: string;
      slabs: CuetSlabOption[];
    };
  };
  settings?: any;
  academicYear?: string;
  scheduleTitle?: string;
  mode?: "standard" | "cuet";
  variant?: "full" | "card" | "cuet-hero";
  lockedLevel?: "UG" | "PG" | "Diploma" | "Ph.D" | "ALL";
  defaultSchool?: string;
  defaultProgram?: string;
  showTitle?: boolean;
}

const DEFAULT_CUET_UG_SLABS: CuetSlabOption[] = [
  { id: "ug-1", label: ">=95% (100% Tuition Waiver)", percent: 100 },
  { id: "ug-2", label: "90–94.99% (50% Tuition Waiver)", percent: 50 },
  { id: "ug-3", label: "80–89.99% (40% Tuition Waiver)", percent: 40 },
  { id: "ug-4", label: "70–79.99% (30% Tuition Waiver)", percent: 30 },
  { id: "ug-5", label: "60–69.99% (10% Tuition Waiver)", percent: 10 },
];

const DEFAULT_CUET_PG_SLABS: CuetSlabOption[] = [
  { id: "pg-1", label: "Score >=270 (100% Tuition Waiver)", percent: 100 },
  { id: "pg-2", label: "210–269 (50% Tuition Waiver)", percent: 50 },
  { id: "pg-3", label: "150–209 (30% Tuition Waiver)", percent: 30 },
  { id: "pg-4", label: "120–149 (10% Tuition Waiver)", percent: 10 },
];

export default function ScholarshipCalculator({
  data,
  programsData: dbProgramsData,
  rulesData: dbRulesData,
  cuetData,
  settings,
  academicYear,
  scheduleTitle,
  mode = "standard",
  variant = "full",
  lockedLevel = "ALL",
  defaultSchool = "",
  defaultProgram = "",
  showTitle = true,
}: ScholarshipCalculatorProps = {}) {
  // 1. Resolve Data Sources (Database-first with bundled static fallback)
  const programsSource = useMemo(() => {
    if (dbProgramsData && Object.keys(dbProgramsData).length > 0) {
      return dbProgramsData;
    }
    return PROGRAMS_DATA;
  }, [dbProgramsData]);

  const rulesSource = useMemo(() => {
    if (dbRulesData && Object.keys(dbRulesData).length > 0) {
      return dbRulesData;
    }
    return RULES_DATA;
  }, [dbRulesData]);

  // CUET Slabs resolution (used for dedicated cuet-hero variant)
  const cuetUgSlabs = useMemo(() => {
    if (cuetData?.ug?.slabs && cuetData.ug.slabs.length > 0) {
      return cuetData.ug.slabs;
    }
    return DEFAULT_CUET_UG_SLABS;
  }, [cuetData]);

  const cuetPgSlabs = useMemo(() => {
    if (cuetData?.pg?.slabs && cuetData.pg.slabs.length > 0) {
      return cuetData.pg.slabs;
    }
    return DEFAULT_CUET_PG_SLABS;
  }, [cuetData]);

  // CUET Level for dedicated cuet-hero variant: "UG" vs "PG"
  const initialCuetLevel = lockedLevel === "PG" ? "PG" : "UG";
  const [cuetLevel, setCuetLevel] = useState<"UG" | "PG">(initialCuetLevel);

  // Form Selections
  const [selectedArea, setSelectedArea] = useState<string>(defaultSchool);
  const [selectedProgramId, setSelectedProgramId] = useState<string>(defaultProgram);

  // Standard Mode Fields (CUET-UG and CUET-PG are offered right inside Category)
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>("");
  const [selectedSubCategoryIndex, setSelectedSubCategoryIndex] = useState<string>("");
  const [selectedStandardPercent, setSelectedStandardPercent] = useState<number | null>(null);

  // Dedicated CUET variant Field
  const [selectedCuetPercent, setSelectedCuetPercent] = useState<number | null>(null);

  // Filter available schools based on lockedLevel or active cuetLevel (for cuet-hero)
  const availableAreas = useMemo(() => {
    return Object.keys(programsSource).filter((area) => {
      const progs = programsSource[area]?.programs || [];
      if (progs.length === 0) return false;

      if (variant === "cuet-hero") {
        if (cuetLevel === "UG") {
          return progs.some((p: any) => p.level === "UG" || p.level === "Diploma");
        }
        if (cuetLevel === "PG") {
          return progs.some((p: any) => p.level === "PG");
        }
      }

      if (lockedLevel === "UG") {
        return progs.some((p: any) => p.level === "UG" || p.level === "Diploma");
      }
      if (lockedLevel === "PG") {
        return progs.some((p: any) => p.level === "PG");
      }
      if (lockedLevel === "Diploma") {
        return progs.some((p: any) => p.level === "Diploma");
      }
      if (lockedLevel === "Ph.D") {
        return progs.some((p: any) => p.level === "Ph.D");
      }
      return true;
    });
  }, [programsSource, variant, cuetLevel, lockedLevel]);

  // Auto-select first area if current selection is invalid
  useEffect(() => {
    if (selectedArea && !availableAreas.includes(selectedArea)) {
      setSelectedArea("");
      setSelectedProgramId("");
    }
  }, [availableAreas, selectedArea]);

  // Available programs for chosen Area
  const availablePrograms = useMemo<any[]>(() => {
    if (!selectedArea || !programsSource[selectedArea]) return [];
    const allProgs = programsSource[selectedArea].programs || [];

    if (variant === "cuet-hero") {
      if (cuetLevel === "UG") {
        return allProgs.filter((p: any) => p.level === "UG" || p.level === "Diploma");
      }
      if (cuetLevel === "PG") {
        return allProgs.filter((p: any) => p.level === "PG");
      }
    }

    if (lockedLevel === "UG") {
      return allProgs.filter((p: any) => p.level === "UG" || p.level === "Diploma");
    }
    if (lockedLevel === "PG") {
      return allProgs.filter((p: any) => p.level === "PG");
    }
    if (lockedLevel === "Diploma") {
      return allProgs.filter((p: any) => p.level === "Diploma");
    }
    if (lockedLevel === "Ph.D") {
      return allProgs.filter((p: any) => p.level === "Ph.D");
    }

    return allProgs;
  }, [selectedArea, programsSource, variant, cuetLevel, lockedLevel]);

  // Selected Program Object (Resolved by id or program name)
  const currentProgram = useMemo<any | null>(() => {
    if (!selectedProgramId) return null;
    return (
      availablePrograms.find(
        (p) => p.id === selectedProgramId || p.program === selectedProgramId
      ) || null
    );
  }, [selectedProgramId, availablePrograms]);

  // Available Categories (CUET-UG appears for UG/Diploma; CUET-PG appears for PG)
  const availableCategories = useMemo<{ key: string; rule: any }[]>(() => {
    if (!currentProgram || !selectedArea) return [];
    if (currentProgram.scholarship_allowed === false) return [];

    const programLevel = currentProgram.level || detectLevel(currentProgram.program);

    return Object.entries(rulesSource)
      .filter(([key, rule]: [string, any]) => {
        // Exclusions by Area
        if (rule.exclude_groups?.includes(selectedArea)) return false;
        // Eligibility by Area
        if (rule.eligible_groups && !rule.eligible_groups.includes(selectedArea)) return false;
        // Applicability by Level
        if (rule.level_applicability && !rule.level_applicability.includes(programLevel)) return false;

        // Strict CUET rule filtering:
        // CUET_UG must only appear for UG/Diploma; CUET_PG must only appear for PG
        if (key === "CUET_UG" && programLevel !== "UG" && programLevel !== "Diploma") return false;
        if (key === "CUET_PG" && programLevel !== "PG") return false;

        // GUTS is strictly for UG programs and never for Pharmacy, Nursing, or Ph.D
        if (key === "GUTS") {
          if (programLevel !== "UG") return false;
          if (/pharm|nurs|ph\.?d/i.test(selectedArea)) return false;
          if (/pharm|nurs|ph\.?d/i.test(currentProgram.program)) return false;
        }
        return true;
      })
      .map(([key, rule]) => ({ key, rule }));
  }, [currentProgram, selectedArea, rulesSource]);

  // Selected Rule
  const currentRule = useMemo<any | null>(() => {
    if (!selectedCategoryKey || !rulesSource[selectedCategoryKey]) return null;
    return rulesSource[selectedCategoryKey];
  }, [selectedCategoryKey, rulesSource]);

  // Subcategories
  const availableSubCategories = useMemo<any[]>(() => {
    if (!currentRule) return [];
    return currentRule.subcategories || [];
  }, [currentRule]);

  // Auto-select single subcategory if only one is available (e.g. for CUET-UG or CUET-PG)
  useEffect(() => {
    if (availableSubCategories.length === 1 && selectedSubCategoryIndex === "") {
      setSelectedSubCategoryIndex("0");
    }
  }, [availableSubCategories, selectedSubCategoryIndex]);

  // Slabs
  const availableSlabs = useMemo<any[]>(() => {
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
      if (sub && (sub.percent !== undefined || sub.directPercent !== undefined)) {
        const p = sub.percent ?? sub.directPercent;
        return [{ label: `${sub.label} (${p}%)`, percent: p }];
      }
    }
    return [];
  }, [currentRule, selectedSubCategoryIndex, availableSubCategories]);

  // Active CUET Slabs (for cuet-hero variant)
  const activeCuetSlabs = useMemo(() => {
    return cuetLevel === "PG" ? cuetPgSlabs : cuetUgSlabs;
  }, [cuetLevel, cuetUgSlabs, cuetPgSlabs]);

  // Active Percentage
  const activePercentage = useMemo(() => {
    if (variant === "cuet-hero") {
      return selectedCuetPercent;
    }
    return selectedStandardPercent;
  }, [variant, selectedCuetPercent, selectedStandardPercent]);

  // Pure Math Calculation via shared engine
  const calculation = useMemo(() => {
    if (!currentProgram) {
      return {
        totalFee: 0,
        tuitionFee: 0,
        developmentFee: 0,
        percentage: 0,
        scholarshipAmount: 0,
        payableFee: 0,
        isEligible: true,
      };
    }

    return calculateScholarshipEligibility({
      totalFee: currentProgram.prog_fee_per_sem,
      tuitionFee: currentProgram.tuition_fee,
      percentage: activePercentage ?? 0,
      scholarshipAllowed: currentProgram.scholarship_allowed,
    });
  }, [currentProgram, activePercentage]);

  // Handlers
  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArea(e.target.value);
    setSelectedProgramId("");
    setSelectedCategoryKey("");
    setSelectedSubCategoryIndex("");
    setSelectedStandardPercent(null);
    setSelectedCuetPercent(null);
  };

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProgramId(e.target.value);
    setSelectedCategoryKey("");
    setSelectedSubCategoryIndex("");
    setSelectedStandardPercent(null);
    setSelectedCuetPercent(null);
  };

  const handleCuetLevelChange = (level: "UG" | "PG") => {
    setCuetLevel(level);
    setSelectedArea("");
    setSelectedProgramId("");
    setSelectedCuetPercent(null);
  };

  // CMS Labels
  const titleText = data?.title || settings?.calculatorTitle || "Scholarship Calculator";
  const instructionText =
    data?.instructionText ||
    settings?.instructionText ||
    "Select your discipline, academic program, and qualifying eligibility criteria to instantly view your custom tuition waiver and payable semester fee breakdown.";

  const schoolLabel = settings?.schoolSelectorLabel || "Area of Interest";
  const programLabel = settings?.programSelectorLabel || "Program";
  const categoryLabel = settings?.categorySelectorLabel || "Scholarship Category";
  const subcategoryLabel = settings?.subcategorySelectorLabel || "Scholarship Subcategory";
  const slabLabel = settings?.slabSelectorLabel || "Scholarship Slab / Criteria";

  const resultsHeading = settings?.resultsHeading || "Calculation Breakdown";
  const totalFeeLabel = settings?.totalFeeLabel || "Fee Per Semester";
  const scholarshipAmountLabel = settings?.scholarshipAmountLabel || "Scholarship Amount";
  const payableFeeLabel = settings?.payableFeeLabel || "Payable Fee After Scholarship";
  const explanatoryNotes =
    settings?.explanatoryNotes ||
    "GUTS Scholarship is not valid for Pharmacy and Postgraduate (PG) / Ph.D. Programs.";
  const ctaLabel = settings?.ctaLabel || "Apply for Admission";
  const ctaUrl = settings?.ctaUrl || "/admissions";

  // =========================================================================
  // RENDER: VARIANT "card" (Compact right-side panel for UG/PG programs)
  // =========================================================================
  if (variant === "card") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(10,31,68,0.06)]">
        <div className="mb-5 text-center">
          <h3 className="font-serif text-[20px] sm:text-[22px] font-black text-[#0A1F44] leading-tight">
            Know Your Fees &amp; Scholarship
          </h3>
          <p className="mt-1 text-[12.5px] text-[#64748B]">
            Official AY2027-28 Database Calculator
          </p>
        </div>

        <div className="space-y-3.5">
          {/* Area of Interest */}
          <div>
            <label className="mb-1 block text-[12px] font-bold text-[#0A1F44]">
              {schoolLabel} <span className="text-[#E8871A]">*</span>
            </label>
            <select
              value={selectedArea}
              onChange={handleAreaChange}
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-[13.5px] font-medium text-[#1A1A2E] outline-none focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20"
            >
              <option value="">Select Area of Interest</option>
              {availableAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Program */}
          <div>
            <label className="mb-1 block text-[12px] font-bold text-[#0A1F44]">
              {programLabel} <span className="text-[#E8871A]">*</span>
            </label>
            <select
              value={selectedProgramId}
              onChange={handleProgramChange}
              disabled={!selectedArea}
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-[13.5px] font-medium text-[#1A1A2E] outline-none focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:opacity-60"
            >
              <option value="">
                {selectedArea ? "Select Program" : "Select Area First"}
              </option>
              {availablePrograms.map((p) => (
                <option key={p.id || p.program} value={p.id || p.program}>
                  {p.program} ({p.level})
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-[12px] font-bold text-[#0A1F44]">
              {categoryLabel}
            </label>
            <select
              value={selectedCategoryKey}
              onChange={(e) => {
                setSelectedCategoryKey(e.target.value);
                setSelectedSubCategoryIndex("");
                setSelectedStandardPercent(null);
              }}
              disabled={!currentProgram || currentProgram.scholarship_allowed === false}
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-[13px] font-medium text-[#1A1A2E] outline-none focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:opacity-60"
            >
              <option value="">
                {!currentProgram
                  ? "Select Program First"
                  : currentProgram.scholarship_allowed === false
                  ? "No Scholarship Available"
                  : "Select Category"}
              </option>
              {availableCategories.map(({ key, rule }) => (
                <option key={key} value={key}>
                  {rule.label}
                </option>
              ))}
            </select>
          </div>

          {availableSubCategories.length > 1 && (
            <div>
              <label className="mb-1 block text-[12px] font-bold text-[#0A1F44]">
                {subcategoryLabel}
              </label>
              <select
                value={selectedSubCategoryIndex}
                onChange={(e) => {
                  setSelectedSubCategoryIndex(e.target.value);
                  setSelectedStandardPercent(null);
                }}
                disabled={!selectedCategoryKey}
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-[13px] font-medium text-[#1A1A2E] outline-none focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:opacity-60"
              >
                <option value="">Select Subcategory</option>
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
          )}

          <div>
            <label className="mb-1 block text-[12px] font-bold text-[#0A1F44]">
              {slabLabel}
            </label>
            <select
              value={selectedStandardPercent === null ? "" : selectedStandardPercent.toString()}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedStandardPercent(val === "" ? null : parseFloat(val));
              }}
              disabled={selectedSubCategoryIndex === "" && currentRule?.percent === undefined}
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-[13px] font-medium text-[#1A1A2E] outline-none focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:opacity-60"
            >
              <option value="">
                {selectedSubCategoryIndex !== "" || currentRule?.percent !== undefined
                  ? "Select Slab / Criteria"
                  : "Select Category First"}
              </option>
              {availableSlabs.map((s, idx) => (
                <option key={idx} value={s.percent}>
                  {s.label} ({s.percent}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Compact Result Card */}
        <div className="mt-5 rounded-2xl bg-gradient-to-b from-[#0B3D6B] to-[#066191] p-4 text-white shadow-sm">
          <div className="space-y-2 text-[13px]">
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <span className="text-white/80">{totalFeeLabel}:</span>
              <span className="font-bold">
                {currentProgram ? `₹ ${calculation.totalFee.toLocaleString("en-IN")}` : "₹ 0"}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <span className="text-emerald-200 font-semibold">
                {scholarshipAmountLabel} ({activePercentage ?? 0}%):
              </span>
              <span className="font-bold text-green-300">
                - ₹ {calculation.scholarshipAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-white/10 p-2.5 text-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/80">
              {payableFeeLabel}
            </div>
            <div className="font-serif text-[22px] font-black text-white mt-0.5">
              ₹ {calculation.payableFee.toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] text-white/70 mt-0.5">* per semester</p>
          </div>

          <Link
            href={ctaUrl}
            className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-[#E8871A] text-white hover:bg-[#d07512] transition-colors shadow-xs"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: VARIANT "cuet-hero" (For the dedicated /cuet page)
  // =========================================================================
  if (variant === "cuet-hero") {
    return (
      <div className="rounded-[24px] bg-gradient-to-br from-[#F0F7FF] to-[#FFF8F4] border border-[#CBD5E1] p-6 sm:p-8 shadow-sm">
        <div className="mb-6 pb-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-[22px] sm:text-[26px] font-black text-[#0A1F44] leading-snug">
              CUET Scholarship &amp; Fee Calculator
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Live AY2027-28 Fee Schedule • Instant Tuition Fee Waiver
            </p>
          </div>

          {/* Level Toggle: CUET-UG vs CUET-PG */}
          <div className="flex rounded-xl bg-white p-1 border border-[#CBD5E1] text-[12px] font-bold">
            <button
              type="button"
              onClick={() => handleCuetLevelChange("UG")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                cuetLevel === "UG"
                  ? "bg-[#066191] text-white"
                  : "text-[#64748B] hover:text-[#0A1F44]"
              }`}
            >
              CUET-UG
            </button>
            <button
              type="button"
              onClick={() => handleCuetLevelChange("PG")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                cuetLevel === "PG"
                  ? "bg-[#066191] text-white"
                  : "text-[#64748B] hover:text-[#0A1F44]"
              }`}
            >
              CUET-PG
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-stretch">
          {/* Inputs */}
          <div className="sm:col-span-7 space-y-4">
            <div>
              <label htmlFor="cuet-calc-area" className="block text-[12px] font-bold uppercase tracking-wider text-[#0A1F44] mb-1.5">
                Area of Interest *
              </label>
              <select
                id="cuet-calc-area"
                aria-label="Area of Interest"
                value={selectedArea}
                onChange={handleAreaChange}
                className="w-full rounded-[10px] border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[14.5px] font-semibold text-[#0A1F44] focus:border-[#E8871A] focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
              >
                <option value="">Select Area of Interest</option>
                {availableAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="cuet-calc-program" className="block text-[12px] font-bold uppercase tracking-wider text-[#0A1F44] mb-1.5">
                Program / Course ({cuetLevel}) *
              </label>
              <select
                id="cuet-calc-program"
                aria-label="Program / Course"
                value={selectedProgramId}
                onChange={handleProgramChange}
                disabled={!selectedArea}
                className="w-full rounded-[10px] border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[14.5px] font-semibold text-[#0A1F44] focus:border-[#E8871A] focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20 disabled:opacity-60"
              >
                <option value="">
                  {selectedArea ? "Select Program" : "Select Area First"}
                </option>
                {availablePrograms.map((prog) => (
                  <option key={prog.id || prog.program} value={prog.id || prog.program}>
                    {prog.program} ({prog.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="cuet-calc-slab" className="block text-[12px] font-bold uppercase tracking-wider text-[#0A1F44] mb-1.5">
                CUET Score Slab *
              </label>
              <select
                id="cuet-calc-slab"
                aria-label="CUET Score Slab"
                value={selectedCuetPercent === null ? "" : selectedCuetPercent.toString()}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedCuetPercent(val === "" ? null : parseFloat(val));
                }}
                disabled={!currentProgram}
                className="w-full rounded-[10px] border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[14.5px] font-semibold text-[#0A1F44] focus:border-[#E8871A] focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20 disabled:opacity-60"
              >
                <option value="">
                  {currentProgram ? "Select CUET Score Slab" : "Select Program First"}
                </option>
                {activeCuetSlabs.map((sl, idx) => (
                  <option key={idx} value={sl.percent}>
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
                  <span className="font-bold">
                    {currentProgram ? `₹ ${calculation.totalFee.toLocaleString("en-IN")}` : "₹ 0"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-white/80">
                    Scholarship ({activePercentage ?? 0}%):
                  </span>
                  <span className="font-bold text-[#86EFAC]">
                    - ₹ {calculation.scholarshipAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="mt-4 rounded-[12px] bg-[#E8871A]/20 border border-[#E8871A]/40 p-3 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                  You Pay (Per Sem)
                </div>
                <div className="font-serif text-[24px] font-black text-white mt-0.5">
                  ₹ {calculation.payableFee.toLocaleString("en-IN")}
                </div>
              </div>

              <Link
                href="/admissions"
                className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-[#E8871A] text-white hover:bg-[#d07512] transition-colors shadow-xs"
              >
                <span>Apply for CUET Admission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: VARIANT "full" (Default Single-Form layout for /scholarship-predictor)
  // No mode switch tabs, as CUET-UG and CUET-PG are already selectable in Category.
  // =========================================================================
  return (
    <section id="scholarship-calculator-section" className="scroll-mt-20 bg-white py-12 md:py-16 border-t border-[#E2E8F0]">
      <div className="gu-container">
        {/* Section Heading (NO eyebrow badge per user instruction) */}
        {showTitle && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="font-serif text-[36px] font-black text-[#0A1F44] sm:text-[44px]">
              {titleText.includes("Calculator") ? (
                <>
                  {titleText.replace("Calculator", "").trim()}{" "}
                  <span className="text-[#066191]">Calculator</span>
                </>
              ) : (
                titleText
              )}
            </h2>
            <p className="mt-3 text-[16px] leading-[1.7] text-[#64748B]">
              {instructionText}
            </p>
          </div>
        )}

        {/* Calculator Main Box */}
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_20px_50px_rgba(10,31,68,0.08)]">
          <div className="p-6 sm:p-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
              {/* LEFT FORM FIELDS (7 cols) */}
              <div className="space-y-6 lg:col-span-7">
                {/* 1. Area of Interest */}
                <div>
                  <label htmlFor="calc-area-select" className="mb-1.5 block text-[13.5px] font-bold text-[#0A1F44]">
                    {schoolLabel} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="calc-area-select"
                    aria-label={schoolLabel}
                    value={selectedArea}
                    onChange={handleAreaChange}
                    className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#066191] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#066191]/20"
                  >
                    <option value="">Select Discipline / Area</option>
                    {availableAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Program Selection */}
                <div>
                  <label htmlFor="calc-program-select" className="mb-1.5 block text-[13.5px] font-bold text-[#0A1F44]">
                    {programLabel} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="calc-program-select"
                    aria-label={programLabel}
                    value={selectedProgramId}
                    onChange={handleProgramChange}
                    disabled={!selectedArea}
                    className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#066191] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#066191]/20 disabled:opacity-60"
                  >
                    <option value="">
                      {selectedArea ? "Select Academic Program" : "Select Area of Interest First"}
                    </option>
                    {availablePrograms.map((p) => (
                      <option key={p.id || p.program} value={p.id || p.program}>
                        {p.program} ({p.level})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Category & 4. Subcategory Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Category */}
                  <div>
                    <label htmlFor="calc-category-select" className="mb-1.5 block text-[13.5px] font-bold text-[#0A1F44]">
                      {categoryLabel}
                    </label>
                    <select
                      id="calc-category-select"
                      aria-label={categoryLabel}
                      value={selectedCategoryKey}
                      onChange={(e) => {
                        setSelectedCategoryKey(e.target.value);
                        setSelectedSubCategoryIndex("");
                        setSelectedStandardPercent(null);
                      }}
                      disabled={!currentProgram || currentProgram.scholarship_allowed === false}
                      className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#066191] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#066191]/20 disabled:opacity-60"
                    >
                      <option value="">
                        {!currentProgram
                          ? "Select Program First"
                          : currentProgram.scholarship_allowed === false
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

                  {/* Subcategory */}
                  <div>
                    <label htmlFor="calc-subcategory-select" className="mb-1.5 block text-[13.5px] font-bold text-[#0A1F44]">
                      {subcategoryLabel}
                    </label>
                    <select
                      id="calc-subcategory-select"
                      aria-label={subcategoryLabel}
                      value={selectedSubCategoryIndex}
                      onChange={(e) => {
                        setSelectedSubCategoryIndex(e.target.value);
                        setSelectedStandardPercent(null);
                      }}
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

                {/* 5. Slab */}
                <div>
                  <label htmlFor="calc-slab-select" className="mb-1.5 block text-[13.5px] font-bold text-[#0A1F44]">
                    {slabLabel}
                  </label>
                  <select
                    id="calc-slab-select"
                    aria-label={slabLabel}
                    value={selectedStandardPercent === null ? "" : selectedStandardPercent.toString()}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedStandardPercent(val === "" ? null : parseFloat(val));
                    }}
                    disabled={selectedSubCategoryIndex === "" && currentRule?.percent === undefined}
                    className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#066191] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#066191]/20 disabled:opacity-60"
                  >
                    <option value="">
                      {selectedSubCategoryIndex !== "" || currentRule?.percent !== undefined
                        ? "Select Score / Percentage Slab"
                        : "Select Subcategory First"}
                    </option>
                    {availableSlabs.map((s, idx) => (
                      <option key={idx} value={s.percent}>
                        {s.label} — {s.percent}% Scholarship
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* RIGHT RESULT CARD (5 cols) - NO AY2027-28 badge, NO tuition/development fee rows */}
              <div className="flex flex-col justify-between rounded-[20px] bg-gradient-to-b from-[#0a8ac7] to-[#066191] p-6 text-white shadow-lg lg:col-span-5">
                <div>
                  <div className="mb-6 flex items-center justify-between border-b border-white/20 pb-4">
                    <span className="text-[13px] font-bold uppercase tracking-[1.5px] text-white/80">
                      {resultsHeading}
                    </span>
                  </div>

                  {/* Fee Per Semester */}
                  <div className="mb-4 flex items-center justify-between border-b border-white/15 pb-3">
                    <span className="text-[14.5px] font-medium text-white/90">
                      {totalFeeLabel}
                    </span>
                    <span className="font-serif text-[18px] font-bold text-white">
                      {currentProgram ? `₹ ${calculation.totalFee.toLocaleString("en-IN")}` : "₹ 0"}
                    </span>
                  </div>

                  {/* Scholarship Amount */}
                  <div className="mb-6 flex items-center justify-between border-b border-white/15 pb-3">
                    <span className="text-[14.5px] font-semibold text-emerald-200">
                      {scholarshipAmountLabel} ({activePercentage ?? 0}%):
                    </span>
                    <span className="font-serif text-[20px] font-extrabold text-green-300">
                      - ₹ {calculation.scholarshipAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Payable Fee After Scholarship Box & CTA */}
                <div>
                  <div className="rounded-[16px] bg-white/10 p-5 text-center backdrop-blur-md">
                    <p className="text-[13px] font-semibold uppercase tracking-[1px] text-white/90">
                      {payableFeeLabel}
                    </p>
                    <p className="mt-1 font-serif text-[30px] font-black text-white sm:text-[34px]">
                      ₹ {calculation.payableFee.toLocaleString("en-IN")}
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/70">
                      * Per semester applicable programme fee
                    </p>
                  </div>

                  {ctaLabel && (
                    <Link
                      href={ctaUrl}
                      className="mt-4 flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-sm bg-white text-[#066191] hover:bg-amber-100 hover:text-amber-900 transition-colors shadow-sm"
                    >
                      <span>{ctaLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Note Footnote (Preserved) */}
            {explanatoryNotes && (
              <div className="mt-8 flex items-center justify-center gap-2 rounded-[12px] bg-[#FFFBF0] p-4 text-center text-[#92400E] border border-[#FDE68A]">
                <Info className="h-5 w-5 shrink-0 text-[#D97706]" />
                <p className="text-[13.5px] font-medium">
                  <strong>Note:</strong> {explanatoryNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
