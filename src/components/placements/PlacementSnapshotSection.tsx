"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { allRecruiterCompanies } from "@/data/placements";

export interface SectorSlice {
  id: string;
  name: string;
  percentage: number;
  color: string;
}

const SECTORS_DATA: SectorSlice[] = [
  {
    id: "sales-marketing",
    name: "Sales & Marketing",
    percentage: 42.3,
    color: "#FFB800", // Gold
  },
  {
    id: "hr-ops",
    name: "HR & Operations",
    percentage: 16.4,
    color: "#FF6B2B", // Orange
  },
  {
    id: "it-software",
    name: "IT & Software",
    percentage: 13.2,
    color: "#FF3366", // Pink-Red
  },
  {
    id: "core-engineering",
    name: "Core Engineering",
    percentage: 10.0,
    color: "#FF55CC", // Magenta
  },
  {
    id: "finance-accounting",
    name: "Finance & Accounting",
    percentage: 8.9,
    color: "#26C6DA", // Cyan Blue
  },
  {
    id: "others",
    name: "Others",
    percentage: 3.2,
    color: "#00BCD4", // Teal
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    percentage: 2.8,
    color: "#00E676", // Green
  },
  {
    id: "healthcare",
    name: "Healthcare",
    percentage: 2.1,
    color: "#8BC34A", // Lime
  },
  {
    id: "consulting",
    name: "Consulting",
    percentage: 1.1,
    color: "#FFA000", // Amber
  },
];

function computePieSlices() {
  const cx = 220;
  const cy = 200;
  const radius = 120;
  let currentAngle = -Math.PI / 2;

  return SECTORS_DATA.map((sector) => {
    const angleSpan = (sector.percentage / 100) * (2 * Math.PI);
    const startAngle = currentAngle;
    const endAngle = currentAngle + angleSpan;
    const midAngle = startAngle + angleSpan / 2;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const riseDistance = 14;
    const riseX = Math.cos(midAngle) * riseDistance;
    const riseY = Math.sin(midAngle) * riseDistance;

    const textRadiusMultiplier = sector.percentage < 4 ? 0.76 : 0.65;
    const xPercent = cx + (radius * textRadiusMultiplier) * Math.cos(midAngle);
    const yPercent = cy + (radius * textRadiusMultiplier) * Math.sin(midAngle);

    const largeArc = angleSpan > Math.PI ? 1 : 0;
    const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    currentAngle = endAngle;

    return {
      ...sector,
      pathData,
      midAngle,
      riseX,
      riseY,
      xPercent,
      yPercent,
    };
  });
}

export interface PlacementSnapshotSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    packages?: Array<{
      tier: string;
      range: string;
      category: string;
      description?: string;
      isAverage?: boolean;
      isTopTier?: boolean;
    }>;
    companies?: string[];
  };
}

export default function PlacementSnapshotSection({ data }: PlacementSnapshotSectionProps = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSectorId, setActiveSectorId] = useState<string>("sales-marketing");

  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return allRecruiterCompanies;
    return allRecruiterCompanies.filter((company) =>
      company.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [searchTerm]);

  // Memoize static pie slice calculations
  const pieSlices = useMemo(() => computePieSlices(), []);

  return (
    <section id="snapshot" className="scroll-mt-[190px] bg-white py-12 md:py-16 border-t border-[#E2E8F0]">
      {/* Inline styles for vertical scrolling badge marquee (0.1x speed - 250s duration) */}
      <style>{`
        @keyframes marqueeVertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .companies-vertical-marquee:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      <div className="gu-container">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-4xl text-center md:mb-16">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-9 bg-[#E8871A]" />
            <span className="h-px w-9 bg-[#E8871A]" />
          </div>

          <h2 className="font-serif text-[38px] font-black leading-[1.08] tracking-[-1.5px] text-[#0A1F44] sm:text-[46px] md:text-[52px]">
            Placement Snapshot<span className="font-sans text-[#E8871A]"> 2025–26</span>
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-[16px] leading-[1.8] text-[#64748B] md:text-[17px]">
Our institution continues to demonstrate strong industry engagement, with 150+ recruiters participating in the 2025–26 placement cycle, offering opportunities across diverse sectors.          </p>
        </div>

        {/* 2-Column Section: Left (Auto-Scrolling 3-Column Company Grid) | Right (Interactive Hover/Click Rising Pie Chart) */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: 150+ Companies in Canonical 3-Column Layout with 0.1x Auto-Scroll */}
          <div className="lg:col-span-7">
            <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F7F9FC] p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-serif text-[24px] font-bold text-[#0A1F44]">
                    150+ Recruiting Partners
                  </h3>
                  <p className="text-[13px] text-[#64748B] mt-0.5">
                    Continuous corporate network across 10+ industry sectors
                  </p>
                </div>
              </div>

              {/* Search Box */}
              <div className="relative mt-5">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search 150+ companies (e.g. Zomato, PayTM, Axis Bank, Infosys)..."
                  className="w-full rounded-[14px] border border-slate-200 bg-white py-3 pl-11 pr-4 text-[14px] text-[#0A1F44] placeholder-slate-400 shadow-sm transition-all focus:border-[#E8871A] focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                />
                <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3.5 top-3 text-[12px] font-semibold text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Display Logic: If Searching -> Filtered Grid; Else -> Canonical 3-Column Auto-Scrolling Marquee */}
              {searchTerm.trim() ? (
                <div className="mt-5 max-h-[360px] overflow-y-auto rounded-[16px] border border-slate-200/80 bg-white p-4 shadow-inner">
                  {filteredCompanies.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {filteredCompanies.map((company, index) => (
                        <div
                          key={`${company}-${index}`}
                          className="group flex items-center gap-2 rounded-[10px] border border-slate-100 bg-[#F8FAFC] px-3 py-2 text-[12.5px] font-semibold text-[#0A1F44] transition-all hover:border-[#07589F] hover:bg-[#EEF5FF] hover:text-[#07589F]"
                        >
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8871A] group-hover:bg-[#07589F]" />
                          <span className="truncate">{company}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-[14px] text-slate-400">
                      No matching company found for &ldquo;{searchTerm}&rdquo;
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative mt-5 h-[360px] overflow-hidden rounded-[16px] border border-slate-200/80 bg-white p-4 shadow-inner">
                  {/* Top & Bottom Fade Shadows */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-white to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-white to-transparent" />

                  {/* Auto-Scrolling Vertical Track at 0.1x Speed (250s duration) */}
                  <div
                    className="companies-vertical-marquee"
                    style={{ animation: "marqueeVertical 250s linear infinite" }}
                  >
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {allRecruiterCompanies.map((company, index) => (
                        <div
                          key={`orig-${company}-${index}`}
                          className="group flex items-center gap-2 rounded-[10px] border border-slate-100 bg-[#F8FAFC] px-3 py-2 text-[12.5px] font-semibold text-[#0A1F44] transition-all hover:border-[#07589F] hover:bg-[#EEF5FF] hover:text-[#07589F]"
                        >
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8871A] group-hover:bg-[#07589F]" />
                          <span className="truncate">{company}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 mt-2">
                      {allRecruiterCompanies.map((company, index) => (
                        <div
                          key={`dup-${company}-${index}`}
                          className="group flex items-center gap-2 rounded-[10px] border border-slate-100 bg-[#F8FAFC] px-3 py-2 text-[12.5px] font-semibold text-[#0A1F44] transition-all hover:border-[#07589F] hover:bg-[#EEF5FF] hover:text-[#07589F]"
                        >
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8871A] group-hover:bg-[#07589F]" />
                          <span className="truncate">{company}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quote Motto */}
              <div className="mt-5 rounded-[16px] border border-[#E2E8F0] bg-white p-4 text-center shadow-xs">
                <p className="font-serif text-[15px] italic font-semibold sm:text-[16px] text-[#0A1F44]">
                  “Diverse Opportunities. Unlimited Career Paths Across 150+ Corporate Partners.”
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Frameless Interactive Rising Pie Chart */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 w-full select-none flex items-center justify-center">
              <svg
                viewBox="0 0 440 400"
                className="w-full h-auto overflow-visible"
              >
                {/* Subtle 3D Shadow Base */}
                <g opacity="0.10" transform="translate(6, 10)">
                  {pieSlices.map((slice) => (
                    <path
                      key={`shadow-${slice.id}`}
                      d={slice.pathData}
                      fill="#000000"
                    />
                  ))}
                </g>

                {/* Slices Group with Click & Hover Rise */}
                {pieSlices.map((slice) => {
                  const isActive = activeSectorId === slice.id;

                  return (
                    <g
                      key={slice.id}
                      onClick={() => setActiveSectorId(slice.id)}
                      onMouseEnter={() => setActiveSectorId(slice.id)}
                      className="cursor-pointer transition-all duration-300 ease-out"
                      style={{
                        transform: isActive
                          ? `translate(${slice.riseX}px, ${slice.riseY}px) scale(1.05)`
                          : "translate(0px, 0px) scale(1)",
                        transformOrigin: "220px 200px",
                      }}
                    >
                      <path
                        d={slice.pathData}
                        fill={slice.color}
                        stroke="#FFFFFF"
                        strokeWidth={isActive ? "3.5" : "2"}
                        style={{
                          filter: isActive
                            ? "drop-shadow(0 6px 14px rgba(0,0,0,0.22))"
                            : "none",
                          transition: "all 0.3s ease",
                        }}
                      />

                      {/* Percentage on Slice (For All Slices) */}
                      <text
                        x={slice.xPercent}
                        y={slice.yPercent}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#1E293B"
                        fontSize={slice.percentage < 4 ? "9.5" : isActive ? "13" : "11.5"}
                        fontWeight="800"
                        style={{ pointerEvents: "none" }}
                      >
                        {slice.percentage}%
                      </text>
                    </g>
                  );
                })}

                {/* Clean Callout Text Labels Around the Perimeter with Hover Links */}
                {/* Sales & Marketing */}
                <text
                  x="85"
                  y="310"
                  textAnchor="middle"
                  fill={activeSectorId === "sales-marketing" ? "#E8871A" : "#334155"}
                  fontSize="12"
                  fontWeight="700"
                  className="cursor-pointer transition-colors"
                  onClick={() => setActiveSectorId("sales-marketing")}
                  onMouseEnter={() => setActiveSectorId("sales-marketing")}
                >
                  Sales &amp; Marketing
                </text>

                {/* HR & Operations */}
                <text
                  x="355"
                  y="315"
                  textAnchor="middle"
                  fill={activeSectorId === "hr-ops" ? "#E8871A" : "#334155"}
                  fontSize="12"
                  fontWeight="700"
                  className="cursor-pointer transition-colors"
                  onClick={() => setActiveSectorId("hr-ops")}
                  onMouseEnter={() => setActiveSectorId("hr-ops")}
                >
                  HR &amp; Operations
                </text>

                {/* IT & Software */}
                <text
                  x="395"
                  y="195"
                  textAnchor="start"
                  fill={activeSectorId === "it-software" ? "#E8871A" : "#334155"}
                  fontSize="12"
                  fontWeight="700"
                  className="cursor-pointer transition-colors"
                  onClick={() => setActiveSectorId("it-software")}
                  onMouseEnter={() => setActiveSectorId("it-software")}
                >
                  IT &amp; Software
                </text>

                {/* Core Engineering */}
                <text
                  x="365"
                  y="80"
                  textAnchor="start"
                  fill={activeSectorId === "core-engineering" ? "#E8871A" : "#334155"}
                  fontSize="12"
                  fontWeight="700"
                  className="cursor-pointer transition-colors"
                  onClick={() => setActiveSectorId("core-engineering")}
                  onMouseEnter={() => setActiveSectorId("core-engineering")}
                >
                  Core Engineering
                </text>

                {/* Finance & Accounting */}
                <text
                  x="220"
                  y="32"
                  textAnchor="middle"
                  fill={activeSectorId === "finance-accounting" ? "#E8871A" : "#334155"}
                  fontSize="12"
                  fontWeight="700"
                  className="cursor-pointer transition-colors"
                  onClick={() => setActiveSectorId("finance-accounting")}
                  onMouseEnter={() => setActiveSectorId("finance-accounting")}
                >
                  Finance &amp; Accounting
                </text>

                {/* Small Slices Stack at Top Left */}
                <g transform="translate(10, 48)">
                  <text
                    fill={activeSectorId === "others" ? "#E8871A" : "#475569"}
                    fontSize="11"
                    fontWeight="600"
                    y="0"
                    className="cursor-pointer transition-colors"
                    onClick={() => setActiveSectorId("others")}
                    onMouseEnter={() => setActiveSectorId("others")}
                  >
                    Others (3.2%)
                  </text>
                  <text
                    fill={activeSectorId === "digital-marketing" ? "#E8871A" : "#475569"}
                    fontSize="11"
                    fontWeight="600"
                    y="16"
                    className="cursor-pointer transition-colors"
                    onClick={() => setActiveSectorId("digital-marketing")}
                    onMouseEnter={() => setActiveSectorId("digital-marketing")}
                  >
                    Digital Marketing (2.8%)
                  </text>
                  <text
                    fill={activeSectorId === "healthcare" ? "#E8871A" : "#475569"}
                    fontSize="11"
                    fontWeight="600"
                    y="32"
                    className="cursor-pointer transition-colors"
                    onClick={() => setActiveSectorId("healthcare")}
                    onMouseEnter={() => setActiveSectorId("healthcare")}
                  >
                    Healthcare (2.1%)
                  </text>
                  <text
                    fill={activeSectorId === "consulting" ? "#E8871A" : "#475569"}
                    fontSize="11"
                    fontWeight="600"
                    y="48"
                    className="cursor-pointer transition-colors"
                    onClick={() => setActiveSectorId("consulting")}
                    onMouseEnter={() => setActiveSectorId("consulting")}
                  >
                    Consulting (1.1%)
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
