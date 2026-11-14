"use client";

import React, { useState, useMemo } from "react";
import {
  PROGRAMS_FEE_DATABASE,
  SCHOLARSHIP_RULES_DATABASE,
  ProgramItem,
} from "@/data/feeAndScholarshipData";

interface ScholarshipPredictorSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    rulesDatabase?: any;
  };
}

export default function ScholarshipPredictorSection({ data }: ScholarshipPredictorSectionProps = {}) {
  const rulesDb = (data?.rulesDatabase && Object.keys(data.rulesDatabase).length > 0)
    ? data.rulesDatabase
    : SCHOLARSHIP_RULES_DATABASE;

  const areaKeys = useMemo(() => Object.keys(PROGRAMS_FEE_DATABASE), []);

  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedProgramData, setSelectedProgramData] = useState<{
    fee: number;
    tuition: number;
    name: string;
    level: "UG" | "PG" | "Ph.D" | "Diploma";
  } | null>(null);

  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>("");
  const [selectedSubCategoryIdx, setSelectedSubCategoryIdx] = useState<string>("");
  const [selectedPercent, setSelectedPercent] = useState<number | null>(null);

  // Available programs for current area
  const currentPrograms = useMemo(() => {
    if (!selectedArea) return [];
    return PROGRAMS_FEE_DATABASE[selectedArea]?.programs || [];
  }, [selectedArea]);

  // Filter available scholarship categories based on area and level
  const availableCategories = useMemo<Array<[string, any]>>(() => {
    if (!selectedProgramData || !selectedArea) return [];
    return Object.entries(rulesDb).filter(([key, rule]: [string, any]) => {
      if (rule?.exclude_groups?.includes(selectedArea)) return false;
      if (rule?.eligible_groups && !rule.eligible_groups.includes(selectedArea)) return false;
      if (rule?.level_applicability && !rule.level_applicability.includes(selectedProgramData.level)) return false;
      return true;
    }) as Array<[string, any]>;
  }, [selectedArea, selectedProgramData, rulesDb]);

  // Current selected category rule
  const currentRule = useMemo(() => {
    if (!selectedCategoryKey) return null;
    return rulesDb[selectedCategoryKey] || null;
  }, [selectedCategoryKey, rulesDb]);

  // Subcategories
  const currentSubcategories = useMemo(() => {
    return currentRule?.subcategories || [];
  }, [currentRule]);

  // Slabs
  const currentSlabs = useMemo(() => {
    if (selectedSubCategoryIdx === "") return [];
    const idx = parseInt(selectedSubCategoryIdx, 10);
    const subcat = currentSubcategories[idx];
    return subcat?.slabs || [];
  }, [currentSubcategories, selectedSubCategoryIdx]);

  // Handlers
  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newArea = e.target.value;
    setSelectedArea(newArea);
    setSelectedProgramData(null);
    setSelectedCategoryKey("");
    setSelectedSubCategoryIdx("");
    setSelectedPercent(null);
  };

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      setSelectedProgramData(null);
      setSelectedCategoryKey("");
      setSelectedSubCategoryIdx("");
      setSelectedPercent(null);
      return;
    }
    const data = JSON.parse(val);
    setSelectedProgramData(data);
    setSelectedCategoryKey("");
    setSelectedSubCategoryIdx("");
    setSelectedPercent(null);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newKey = e.target.value;
    setSelectedCategoryKey(newKey);
    setSelectedSubCategoryIdx("");
    setSelectedPercent(null);
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newIdx = e.target.value;
    setSelectedSubCategoryIdx(newIdx);
    setSelectedPercent(null);
  };

  const handleSlabChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "") {
      setSelectedPercent(null);
      return;
    }
    setSelectedPercent(parseFloat(val));
  };

  // Calculations
  const feePerSem = selectedProgramData?.fee || 0;
  const tuitionFee = selectedProgramData?.tuition || 0;
  const scholarshipAmount =
    selectedPercent !== null && tuitionFee > 0
      ? Math.round((tuitionFee * selectedPercent) / 100)
      : null;
  const applicableFee =
    scholarshipAmount !== null ? Math.max(0, feePerSem - scholarshipAmount) : null;

  return (
    <section className="py-8 bg-white" id="scholarship-calculator">
      <style>{`
        .finder-heading {
          color: #06355F;
          font-weight: 800;
          font-size: 1.4rem;
          margin-bottom: 0.8rem;
          font-family: 'Zilla Slab', serif;
        }

        .finder-content p {
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          color: #333;
        }

        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .benefits-list li {
          position: relative;
          padding-left: 25px;
          margin-bottom: 10px;
          font-size: 0.95rem;
          color: #444;
        }

        .benefits-list li::before {
          content: "\\2713";
          position: absolute;
          left: 0;
          color: #06355F;
          font-weight: bold;
        }

        .form-control-custom-fee {
          width: 100%;
          padding: 0.5rem 0.85rem;
          border: 1px solid #ced4da;
          border-radius: 0.375rem;
          font-size: 0.95rem;
          background-color: #fff;
          outline: none;
          transition: border-color 0.15s ease-in-out;
        }
        .form-control-custom-fee:focus {
          border-color: #06355F;
          box-shadow: 0 0 0 0.2rem rgba(6, 53, 95, 0.15);
        }
      `}</style>

      <div className="max-w-[1320px] mx-auto px-4">
        <div className="scholarship-finder-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: FINDER CONTENT & PRAGATI SCHOLARSHIP */}
            <div className="lg:col-span-7 finder-content">
              <h3 className="finder-heading">{data?.title || "Find out your exact scholarship in seconds!"}</h3>
              {data?.subtitle && (
                <p className="font-semibold text-[#06355F] mb-3">{data.subtitle}</p>
              )}
              <p>
                Find your true potential by using our simple-to-use scholarship
                Predictor Tool created to assist you in determining the amount
                of scholarships you&apos;re qualified for on Geeta University. Just a
                couple of quick selections--your category, your program and
                academic record--you&apos;ll get an exact, precise estimation in just
                a few seconds.
              </p>

              <div className="space-y-4">
                <p className="font-semibold text-[#333] mb-2">
                  After you have entered your information The tool will immediately present:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <ul className="benefits-list">
                      <li>Your applicable scholarship slab</li>
                      <li>Revisionized tuition fees after deducting the scholarship</li>
                      <li>Savings per semester total</li>
                    </ul>
                  </div>
                  <div className="md:col-span-7">
                    <ul className="benefits-list">
                      <li>Final payment fees</li>
                      <li>Transparency in fees for greater decision-making</li>
                      <li>
                        This powerful and user-friendly tool lets you make plans
                        for your future through Geeta University with complete
                        clarity trust, certainty, and transparency.
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="pt-2">
                  Explore your scholarships right now, and make your first step to build an impressive&nbsp;career!
                </p>

                {/* Pragati Scholarship Card */}
                <div
                  className="card mb-4 border-0 shadow-lg overflow-hidden"
                  style={{ borderRadius: "1rem", backgroundColor: "#ffffff", border: "1px solid #eee" }}
                >
                  <div style={{ height: "6px", background: "#FF7A00" }} />
                  <div className="p-6 md:p-8">
                    <span
                      className="inline-block rounded-full mb-3"
                      style={{
                        backgroundColor: "#f0f7ff",
                        color: "#06355F",
                        fontWeight: 600,
                        padding: "0.4rem 1rem",
                        border: "1px solid #cce0ff",
                        fontSize: "0.85rem",
                      }}
                    >
                      Special Program
                    </span>

                    <h3 className="font-bold mb-3 font-serif" style={{ color: "#06355F", fontSize: "1.6rem" }}>
                      Pragati Scholarship 2026–27
                    </h3>

                    <p className="mb-4" style={{ color: "#444", fontSize: "1.05rem", lineHeight: 1.6 }}>
                      A special scholarship program of Geeta University.<br />
                      <strong style={{ color: "#06355F" }}>
                        For the students of Himachal Pradesh, Jammu &amp; Kashmir, Ladakh, and Northeast India.
                      </strong>
                    </p>

                    <ul className="space-y-3 mb-4 list-none p-0">
                      <li className="flex items-start">
                        <div
                          className="mr-3 mt-1 flex justify-center items-center rounded-full shrink-0"
                          style={{
                            width: "24px",
                            height: "24px",
                            backgroundColor: "#FFF2E5",
                            color: "#FF7A00",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span style={{ color: "#333" }}>
                          5 students eligible for <strong style={{ color: "#FF7A00" }}>100% Scholarship</strong>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div
                          className="mr-3 mt-1 flex justify-center items-center rounded-full shrink-0"
                          style={{
                            width: "24px",
                            height: "24px",
                            backgroundColor: "#FFF2E5",
                            color: "#FF7A00",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span style={{ color: "#333" }}>
                          5 students eligible for <strong style={{ color: "#FF7A00" }}>50% Scholarship</strong>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div
                          className="mr-3 mt-1 flex justify-center items-center rounded-full shrink-0"
                          style={{
                            width: "24px",
                            height: "24px",
                            backgroundColor: "#FFF2E5",
                            color: "#FF7A00",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span style={{ color: "#333" }}>
                          Hon&apos;ble MLAs/MPs make recommendations for funding scholarships.
                        </span>
                      </li>
                    </ul>

                    <div
                      className="p-3 rounded-lg mb-4"
                      style={{ backgroundColor: "#f8fbff", borderLeft: "4px solid #06355F" }}
                    >
                      <p className="mb-0" style={{ color: "#444", fontSize: "0.95rem" }}>
                        Applicable for selected programs in Engineering, Computer Applications, Management, Nutrition &amp;
                        Dietetics, Hospitality, Humanities, Forensic Science, Pharmacy, Commerce, Agriculture, and Law programs.
                      </p>
                    </div>

                    <div
                      className="flex items-center p-3 rounded-lg"
                      style={{ backgroundColor: "#FFF2E5", border: "1px solid #FFE5CC" }}
                    >
                      <div
                        className="flex justify-center items-center rounded-full mr-3 shrink-0"
                        style={{ width: "32px", height: "32px", backgroundColor: "#FF7A00", color: "white" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <div>
                        <div style={{ color: "#FF7A00", fontWeight: 700, fontSize: "0.9rem" }}>
                          Admissions Open
                        </div>
                        <div style={{ color: "#666", fontSize: "0.85rem", fontWeight: 500 }}>
                          Limited Seat availability.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: FEE & SCHOLARSHIP PREDICTOR FORM */}
            <div className="lg:col-span-5">
              <h3 className="finder-heading text-center">Fee &amp; Scholarship Predictor</h3>
              <section className="bg-white rounded-2xl p-5 shadow-lg border border-[#E2E8F0]">
                <div className="space-y-4">
                  {/* Area of Interest */}
                  <div className="form-group">
                    <label className="text-dark small mb-1 block font-semibold text-sm text-[#333]">
                      Area of Interest
                    </label>
                    <select
                      value={selectedArea}
                      onChange={handleAreaChange}
                      className="form-control-custom-fee"
                    >
                      <option value="">Select</option>
                      {areaKeys.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Program */}
                  <div className="form-group">
                    <label className="text-dark small mb-1 block font-semibold text-sm text-[#333]">
                      Program
                    </label>
                    <select
                      value={
                        selectedProgramData
                          ? JSON.stringify({
                            fee: selectedProgramData.fee,
                            tuition: selectedProgramData.tuition,
                            name: selectedProgramData.name,
                            level: selectedProgramData.level,
                          })
                          : ""
                      }
                      onChange={handleProgramChange}
                      className="form-control-custom-fee"
                      disabled={!selectedArea}
                    >
                      <option value="">Select Program</option>
                      {currentPrograms.map((p, idx) => (
                        <option
                          key={idx}
                          value={JSON.stringify({
                            fee: p.prog_fee_per_sem,
                            tuition: p.tuition_fee,
                            name: p.program,
                            level: p.level,
                          })}
                        >
                          {p.program}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category & Subcategory Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="form-group">
                      <label className="text-dark small mb-1 block font-semibold text-sm text-[#333]">
                        Scholarship Category
                      </label>
                      <select
                        value={selectedCategoryKey}
                        onChange={handleCategoryChange}
                        className="form-control-custom-fee"
                        disabled={!selectedProgramData}
                      >
                        <option value="">Select</option>
                        {availableCategories.map(([key, rule]: [string, any]) => (
                          <option key={key} value={key}>
                            {rule.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="text-dark small mb-1 block font-semibold text-sm text-[#333]">
                        Scholarship Subcategory
                      </label>
                      <select
                        value={selectedSubCategoryIdx}
                        onChange={handleSubCategoryChange}
                        className="form-control-custom-fee"
                        disabled={!selectedCategoryKey || currentSubcategories.length === 0}
                      >
                        <option value="">Select</option>
                        {currentSubcategories.map((s: any, i: number) => (
                          <option key={i} value={i.toString()}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Scholarship Slab */}
                  <div className="form-group">
                    <label className="text-dark small mb-1 block font-semibold text-sm text-[#333]">
                      Scholarship Slab
                    </label>
                    <select
                      value={selectedPercent !== null ? selectedPercent.toString() : ""}
                      onChange={handleSlabChange}
                      className="form-control-custom-fee"
                      disabled={selectedSubCategoryIdx === "" || currentSlabs.length === 0}
                    >
                      <option value="">Select Slab</option>
                      {currentSlabs.map((s: any, idx: number) => (
                        <option key={idx} value={s.percent.toString()}>
                          {s.label} – {s.percent}%
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* RESULT CARD IN NAVY (#06355F) */}
                <div className="mt-5">
                  <div
                    className="p-6 h-full shadow-lg relative overflow-hidden text-white"
                    style={{ background: "#06355F", borderRadius: "1rem" }}
                  >
                    <h4 className="text-white mb-4 font-bold text-lg font-serif">Scholarship Estimate</h4>

                    <div className="mb-3 flex justify-between border-b border-white/25 pb-2.5 items-center">
                      <span className="text-white/70 text-sm">Fee Per Semester</span>
                      <span className="font-bold text-white text-base">
                        {selectedProgramData ? `₹ ${feePerSem.toLocaleString("en-IN")}` : "—"}
                      </span>
                    </div>

                    <div className="mb-3 flex justify-between border-b border-white/25 pb-2.5 items-center">
                      <span className="text-white/70 text-sm">Tuition Fee</span>
                      <span className="font-bold text-white text-base">
                        {selectedProgramData ? `₹ ${tuitionFee.toLocaleString("en-IN")}` : "—"}
                      </span>
                    </div>

                    <div className="mb-4 flex justify-between border-b border-white/25 pb-2.5 items-center">
                      <span className="text-white/70 text-sm">Scholarship Amount</span>
                      <span className="font-bold text-base" style={{ color: "#FF7A00" }}>
                        {scholarshipAmount !== null ? `₹ ${scholarshipAmount.toLocaleString("en-IN")}` : "—"}
                      </span>
                    </div>

                    <div
                      className="text-center p-4 rounded-xl"
                      style={{
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      }}
                    >
                      <p
                        className="mb-1 uppercase font-bold text-xs"
                        style={{ color: "#ffffff", letterSpacing: "1px" }}
                      >
                        Applicable Fee
                      </p>
                      <div
                        className="font-black text-white w-full"
                        style={{ fontSize: "2.4rem", lineHeight: 1.1 }}
                      >
                        {applicableFee !== null ? `₹ ${applicableFee.toLocaleString("en-IN")}` : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
