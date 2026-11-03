"use client";

import React from "react";
import Image from "next/image";
import {
  Award,
  Building2,
  BriefcaseBusiness,
  ChartNoAxesColumnIncreasing,
  PieChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { ProgramPageData, TestimonialItem } from "@/data/programs/types";
import { getProgramIcon } from "./iconHelper";
import { useFiniteCarousel } from "@/hooks/useFiniteCarousel";

interface ProgramPlacementProps {
  placement?: ProgramPageData["placement"];
  testimonials?: TestimonialItem[];
}

export default function ProgramPlacement({ placement, testimonials }: ProgramPlacementProps) {
  const testimonialItems = testimonials && testimonials.length > 0 ? testimonials : [];

  const {
    containerRef,
    currentIndex,
    maxIndex,
    next,
    prev,
    goTo,
    handleScroll,
    handleMouseDown,
    handleMouseLeave,
    handleMouseEnter,
    handleMouseUp,
    handleMouseMove,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useFiniteCarousel({
    totalItems: testimonialItems.length,
    autoplayInterval: 3000,
    enableAutoplay: true,
  });

  const stats = placement?.stats && placement.stats.length > 0 ? placement.stats : [
    { value: "40 LPA", label: "Highest Package", iconName: "Award" },
    { value: "550+", label: "Recruiters Visited", iconName: "Building2" },
    { value: "3500+", label: "Job & Internship Offers", iconName: "BriefcaseBusiness" },
  ];

  const avgPackage = placement?.avgPackage || "₹4.39 LPA";
  const avgPackageNote = placement?.avgPackageNote || "Reflecting balanced career growth and wide industry acceptance of Geeta University graduates.";
  const packageBars = placement?.packageBars && placement.packageBars.length > 0 ? placement.packageBars : [
    { label: "Upto 4 LPA", value: 153, width: "100%" },
    { label: "₹4-6 LPA", value: 65, width: "42%" },
    { label: "₹6-8 LPA", value: 31, width: "20%" },
    { label: "₹8-10 LPA", value: 31, width: "20%" },
  ];
  const disclaimer = placement?.disclaimer || "Disclaimer: Placement data shared is representative. Current academic session placement drives remain in active progress.";

  return (
    <>
      {/* ── TESTIMONIALS CAROUSEL SECTION ── */}
      {testimonialItems.length > 0 && (
        <section
          id="Testimonials"
          style={{
            background: "#0A1F44",
            padding: "52px 0",
            position: "relative",
            overflow: "hidden",
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          {/* Decorative Blur Spheres */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-[#E8871A]/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-[#E8871A]/8 blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            {/* Section Header */}
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                Student Testimonials
              </h2>
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#E8871A]" />
            </div>

            {/* Scrollable & Draggable Testimonials Track */}
            <div className="group relative">
              {/* Left navigation arrow */}
              {maxIndex > 0 && (
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="absolute -left-3 sm:-left-4 top-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#0A1F44]/90 backdrop-blur-md text-white shadow-lg transition-all duration-300 hover:border-[#E8871A] hover:bg-[#E8871A] hover:text-[#0A1F44] hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
                >
                  <ChevronLeft size={19} strokeWidth={2.5} />
                </button>
              )}

              {/* Right navigation arrow */}
              {maxIndex > 0 && (
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next testimonial"
                  className="absolute -right-3 sm:-right-4 top-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#0A1F44]/90 backdrop-blur-md text-white shadow-lg transition-all duration-300 hover:border-[#E8871A] hover:bg-[#E8871A] hover:text-[#0A1F44] hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
                >
                  <ChevronRight size={19} strokeWidth={2.5} />
                </button>
              )}

              <div
                ref={containerRef}
                onScroll={handleScroll}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="flex w-full gap-6 overflow-x-auto pb-4 pt-2 scroll-smooth cursor-grab active:cursor-grabbing select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {testimonialItems.map((item, index) => {
                  const initials = item.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("");
                  const pkg = item.pkg || item.package;
                  const quote = item.quote || item.testimonial || "";
                  const role = item.role || "";
                  const company = item.company || "";

                  const detailsParts = [];
                  if (role) detailsParts.push(role);
                  if (company && !role.includes(company)) detailsParts.push(company);
                  const displayDetails = detailsParts.join(" • ") || company || role;

                  return (
                    <article
                      key={`${item.name}-${index}`}
                      className={`group relative flex w-[300px] sm:w-[350px] md:w-[380px] shrink-0 flex-col overflow-hidden rounded-3xl border bg-white/[0.04] backdrop-blur-md p-7 pb-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/[0.07] ${
                        index % 2 === 1 ? "border-[#E8871A]/40" : "border-white/10"
                      }`}
                    >
                      {/* Top Accent Bar */}
                      <div
                        className={`absolute left-0 top-0 h-1.5 w-full transition-all duration-300 ${
                          index % 2 === 1 ? "bg-[#E8871A]" : "bg-white/20"
                        }`}
                      />

                      {/* Student identity header */}
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-white/15 bg-white/5 flex items-center justify-center">
                          <span className="text-base font-bold text-[#E8871A] select-none">
                            {initials}
                          </span>
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="64px"
                              loading="lazy"
                              className="object-cover object-top transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                            />
                          ) : null}
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-serif text-lg font-bold text-white truncate">
                            {item.name}
                          </h3>

                          {pkg ? (
                            <div className="mt-1.5 inline-flex items-center rounded-full bg-[#E8871A]/15 border border-[#E8871A]/30 px-2.5 py-0.5 text-xs font-bold text-[#E8871A]">
                              {pkg}
                            </div>
                          ) : (
                            <p className="text-xs text-white/60 truncate mt-1">
                              {displayDetails}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quote Body */}
                      <div className="mt-6 flex flex-1 flex-col justify-between">
                        <div>
                          <span
                            aria-hidden="true"
                            className="font-serif text-4xl font-bold leading-none text-[#E8871A]/30"
                          >
                            “
                          </span>

                          <p className="mt-[-4px] text-[14px] leading-relaxed text-white/80 italic">
                            {quote}
                          </p>
                        </div>

                        {/* Footer details if package is rendered above */}
                        {pkg && displayDetails && (
                          <div className="mt-5 border-t border-white/10 pt-3 text-xs text-white/50 truncate">
                            {displayDetails}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PLACEMENT METRICS & ANALYTICS ────────────────────────────────────── */}
      {placement && (
        <section style={{ padding: "52px 0 48px", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, 1fr)`,
                gap: 28,
                marginBottom: 64,
              }}
              className="placement-stats-grid"
            >
              {stats.map((stat, index) => {
                const Icon = getProgramIcon(stat.iconName, Award);
                return (
                  <div
                    key={index}
                    style={{
                      background: "#F8FAFC",
                      borderRadius: 20,
                      padding: "36px 28px",
                      border: "1px solid #E2E8F0",
                      textAlign: "center",
                      transition: "all 0.3s ease",
                    }}
                    className="placement-stat-box"
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: "rgba(232,135,26,0.1)",
                        color: "#E8871A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <div style={{ fontSize: 40, fontWeight: 900, color: "#0A1F44", lineHeight: 1, marginBottom: 8 }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#64748B" }}>
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Package Analysis Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 32,
              }}
              className="placement-analytics-grid"
            >
              {/* Avg Package Card */}
              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: 20,
                  padding: "40px 36px",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#E8871A", fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
                  <ChartNoAxesColumnIncreasing size={16} />
                  Salary Distribution
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 800, color: "#0A1F44", margin: "0 0 16px" }}>
                  Average Package Offered
                </h3>
                <div style={{ fontSize: 44, fontWeight: 900, color: "#E8871A", lineHeight: 1, marginBottom: 16 }}>
                  {avgPackage}
                </div>
                <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.6, margin: "0 0 28px" }}>
                  {avgPackageNote}
                </p>

                <div style={{ display: "grid", gap: 16 }}>
                  {packageBars.map((bar, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, color: "#0A1F44", marginBottom: 6 }}>
                        <span>{bar.label}</span>
                        <span>{bar.value} offers</span>
                      </div>
                      <div style={{ height: 10, background: "#E2E8F0", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: bar.width, background: "linear-gradient(90deg, #0A1F44, #E8871A)", borderRadius: 999 }} />
                      </div>
                    </div>
                  ))}
                </div>

                {disclaimer && (
                  <p style={{ fontSize: 12, color: "#94A3B8", fontStyle: "italic", marginTop: 24, margin: "24px 0 0" }}>
                    {disclaimer}
                  </p>
                )}
              </div>

              {/* Sector Placement Card */}
              <div
                style={{
                  background: "linear-gradient(135deg, #0A1F44 0%, #1A3A6B 100%)",
                  borderRadius: 20,
                  padding: "40px 36px",
                  color: "#FFFFFF",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#E8871A", fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
                    <PieChart size={16} />
                    Recruiter Insights
                  </div>
                  <h3 style={{ fontSize: 26, fontWeight: 800, color: "#FFFFFF", margin: "0 0 16px" }}>
                    Sector-wise Placement Analysis
                  </h3>
                  <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, margin: "0 0 28px" }}>
                    {placement?.avgPackageNote || placement?.subtitle || "A diversified career distribution ensuring high placement rates across key industry domains and specialized career tracks."}
                  </p>
                </div>

                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#E8871A", marginBottom: 12 }}>
                    Key Recruiting Verticals:
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                    {placement?.sectorLegend && placement.sectorLegend.length > 0 ? (
                      placement.sectorLegend.slice(0, 6).map((item, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color || "#E8871A", flexShrink: 0 }} />
                          <span>{item.label} ({item.value})</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div>• Industry Placements (45%)</div>
                        <div>• Research & Clinical (25%)</div>
                        <div>• Corporate & Operations (18%)</div>
                        <div>• Higher Studies & Global (12%)</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <style>{`
            @media (max-width: 960px) {
              .placement-stats-grid, .placement-analytics-grid {
                grid-template-columns: 1fr !important;
              }
            }
            .placement-stat-box:hover {
              border-color: #E8871A !important;
              transform: translateY(-4px);
              box-shadow: 0 12px 24px rgba(10,31,68,0.06);
            }
          `}</style>
        </section>
      )}
    </>
  );
}
