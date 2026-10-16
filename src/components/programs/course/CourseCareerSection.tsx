"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Building2, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import type {
  CourseCareerPathways,
  CourseWhyGeeta,
} from "@/data/programs/courses/types";

interface CourseCareerSectionProps {
  career?: CourseCareerPathways;
  whyGeeta?: CourseWhyGeeta;
}

// Available verified recruiter logos in the project repository
const RECRUITER_LOGOS: Record<string, string> = {
  infosys: "/recruiters/infosys_logo.png?v=3",
  wipro: "/recruiters/wipro_logo.png?v=3",
  accenture: "/recruiters/accenture_logo.png?v=3",
  ibm: "/recruiters/ibm_logo.png?v=3",
  tcs: "/recruiters/tcs_logo.png?v=3",
  hcl: "/recruiters/hcl_logo.png?v=3",
  amazon: "/recruiters/amazon_logo.png?v=3",
  capgemini: "/recruiters/capgemini_logo.png?v=3",
  mcafee: "/recruiters/mcafee.png?v=3",
  hp: "/recruiters/hp.png?v=3",
  philips: "/recruiters/philips.png?v=3",
  prograd: "/recruiters/prograd.png?v=3",
  "blue star": "/recruiters/bluestar.png?v=3",
  "jaro education": "/recruiters/jaro_education.png?v=3",
  "gemini solutions": "/recruiters/gemini_solutions.png?v=3",
  apisero: "/recruiters/apisero.png?v=3",
  cisco: "/cisco.svg?v=3",
  oracle: "/oracle.svg?v=3",
  aws: "/aws.svg?v=3",
  google: "/recruiters/google_logo.png?v=3",
  nvidia: "/recruiters/nvidia_logo.png?v=3",
  microsoft: "/recruiters/microsoft_logo.png?v=3",
  samsung: "/recruiters/samsung_logo.png?v=3",
  bosch: "/recruiters/bosch_logo.png?v=3",
  adobe: "/recruiters/adobe_logo.png?v=3",
  github: "/github.svg?v=3",
};

function getRecruiterLogo(recruiter: { name: string; logo?: string }): string | undefined {
  if (recruiter.logo) return recruiter.logo;
  const key = recruiter.name.toLowerCase().trim();
  for (const [nameKey, path] of Object.entries(RECRUITER_LOGOS)) {
    if (key.includes(nameKey)) return path;
  }
  return undefined;
}

function getRoleIcon(name: string) {
  const n = name.toLowerCase();
  if (
    n.includes("agri") ||
    n.includes("agronom") ||
    n.includes("breeder") ||
    n.includes("soil") ||
    n.includes("horticultur") ||
    n.includes("farm") ||
    n.includes("crop") ||
    n.includes("seed") ||
    n.includes("plant")
  ) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a9 9 0 0 1 9 9c0 4-3 7-9 11C6 18 3 15 3 11a9 9 0 0 1 9-9z" />
        <path d="M12 7v10" />
      </svg>
    );
  }
  if (
    n.includes("software") ||
    n.includes("developer") ||
    n.includes("coder") ||
    n.includes("engineer") ||
    n.includes("cyber") ||
    n.includes("tech")
  ) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }
  if (
    n.includes("data") ||
    n.includes("analyst") ||
    n.includes("finance") ||
    n.includes("banker") ||
    n.includes("audit")
  ) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    );
  }
  if (
    n.includes("health") ||
    n.includes("diet") ||
    n.includes("pharma") ||
    n.includes("clinical") ||
    n.includes("medical") ||
    n.includes("dna") ||
    n.includes("biolog") ||
    n.includes("toxicolog")
  ) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M2 12h20" />
      </svg>
    );
  }
  if (
    n.includes("law") ||
    n.includes("court") ||
    n.includes("legal") ||
    n.includes("judic") ||
    n.includes("counsel")
  ) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18" />
        <path d="M3 7l9-4 9 4" />
        <path d="M6 10l-3 6h6l-3-6z" />
        <path d="M18 10l-3 6h6l-3-6z" />
      </svg>
    );
  }
  if (
    n.includes("forensic") ||
    n.includes("investigat") ||
    n.includes("crime") ||
    n.includes("scene") ||
    n.includes("agent") ||
    n.includes("expert") ||
    n.includes("psychiatr") ||
    n.includes("handwriting")
  ) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

interface CarouselItem {
  name: string;
  logo?: string;
}

function RecruitersCarousel({ items }: { items: CarouselItem[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const handlePrev = () => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current;
    if (el.scrollLeft <= 10) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    } else {
      el.scrollBy({ left: -el.clientWidth * 0.75, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (el.scrollLeft >= maxScroll - 10) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: el.clientWidth * 0.75, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isHovered || items.length <= 4) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3200);
    return () => clearInterval(timer);
  }, [isHovered, items.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      className="group relative px-2 sm:px-6"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left Arrow */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous recruiters"
        className="absolute -left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-[#0A1F44] shadow-md transition-all hover:bg-[#0A1F44] hover:text-white"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Right Arrow */}
      <button
        type="button"
        onClick={handleNext}
        aria-label="Next recruiters"
        className="absolute -right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-[#0A1F44] shadow-md transition-all hover:bg-[#0A1F44] hover:text-white"
      >
        <ChevronRight size={18} />
      </button>

      {/* Track */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex w-full gap-4 overflow-x-auto pb-2 pt-1 scroll-smooth cursor-grab active:cursor-grabbing select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex h-[76px] w-[150px] shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-3 shadow-xs transition-all hover:shadow-md"
          >
            {item.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.logo}
                alt={item.name}
                className="max-h-[46px] max-w-[85%] object-contain pointer-events-none"
                loading="lazy"
              />
            ) : (
              <span className="text-[13px] font-bold text-[#0A1F44] text-center leading-tight">
                {item.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CourseCareerSection({
  career,
  whyGeeta,
}: CourseCareerSectionProps) {
  if (!career && !whyGeeta) return null;

  const roles = career?.roles || [];
  const recruiters = career?.recruiters || [];

  const carouselItems: CarouselItem[] = recruiters
    .map((recruiter) => ({
      name: recruiter.name,
      logo: getRecruiterLogo(recruiter),
    }))
    .filter((item) => {
      const n = item.name.toLowerCase();
      return !n.includes("tech mahindra") && !n.includes("genpact");
    });

  const structuredRoles = [
    ...(career?.govtRoles || []),
    ...(career?.privateRoles || []),
  ];

  return (
    <section
      id="CareerOpportunities"
      style={{
        background: "#FDF1D6",
        borderTop: "1px solid rgba(0, 0, 0, 0.06)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        position: "relative",
        overflow: "hidden",
      }}
      className="w-full py-16 sm:py-20"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {career && (
          <div>
            {/* ── 1. Section Header matching School Pages ── */}
            <div className="text-center max-w-4xl mx-auto mb-10">
              <h2
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: "clamp(28px, 3.8vw, 42px)",
                  fontWeight: 900,
                  color: "#0A1F44",
                  lineHeight: 1.18,
                  letterSpacing: "-1px",
                  margin: 0,
                }}
              >
                {career.title}
              </h2>

              {career.intro && (
                <p
                  style={{
                    fontSize: 16,
                    color: "#334155",
                    maxWidth: 920,
                    margin: "16px auto 0",
                    lineHeight: 1.7,
                    fontWeight: 450,
                  }}
                  className="text-justify sm:text-center"
                >
                  {career.intro}
                </p>
              )}
            </div>

            {/* ── 2. Frosted Glass Container for Roles & Recruiters ── */}
            <div
              style={{
                marginTop: 32,
                background: "rgba(255, 255, 255, 0.55)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(232, 135, 26, 0.16)",
                borderRadius: "32px",
                padding: "44px 32px",
                boxShadow:
                  "0 15px 35px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
              }}
            >
              {/* Top Job Roles Badges with Contextual Icons */}
              {roles.length > 0 && (
                <div className="mb-6">
                  {career.rolesTitle && (
                    <div className="text-center mb-6">
                      <h3
                        style={{
                          fontSize: 22,
                          fontWeight: 800,
                          color: "#0A1F44",
                          letterSpacing: "-0.5px",
                          margin: 0,
                          lineHeight: 1.3,
                        }}
                      >
                        {career.rolesTitle}
                      </h3>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 justify-center max-w-5xl mx-auto">
                    {roles.map((role, idx) => {
                      const cleanRole = role.includes(":") ? role.split(":")[0].trim() : role;
                      return (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.04, y: -2 }}
                          transition={{ type: "spring", stiffness: 450, damping: 15 }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "12px 22px",
                            background: "#FFFFFF",
                            border: "1px solid rgba(232, 135, 26, 0.14)",
                            borderRadius: "16px",
                            color: "#0A1F44",
                            fontSize: "14.5px",
                            fontWeight: 650,
                            cursor: "default",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)",
                            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                          className="career-role-badge select-none"
                        >
                          <span
                            style={{
                              color: "#E8871A",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {getRoleIcon(role)}
                          </span>
                          <span>{cleanRole}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Detailed Sector Pathways (Govt & Private Roles) if provided */}
              {structuredRoles.length > 0 && (
                <div className="mb-8 pt-6 border-t border-slate-200/60">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-w-5xl mx-auto">
                    {structuredRoles.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-white/90 border border-amber-900/10 shadow-xs transition-all duration-200 hover:border-[#E8871A]/40 hover:shadow-md"
                      >
                        <h4 className="font-bold text-[#0A1F44] text-[14px] mb-1">
                          {item.title}
                        </h4>
                        <p className="text-[13px] text-[#4A5568] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Recruiters Carousel */}
              {carouselItems.length > 0 && (
                <div className="pt-6 border-t border-slate-200/60">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 text-[#0A1F44] font-extrabold text-[20px] sm:text-[22px]">
                      <Building2 size={20} className="text-[#E8871A]" />
                      <span>{career.recruitersTitle || "Top Recruiters include:"}</span>
                    </div>
                  </div>

                  <RecruitersCarousel items={carouselItems} />
                </div>
              )}

              {/* Who Should Pursue */}
              {career.whoShouldPursue && (
                <div className="pt-6 border-t border-slate-200/60 max-w-5xl mx-auto">
                  <div className="text-center mb-3">
                    <h3
                      style={{
                        fontFamily: "var(--font-serif), Georgia, serif",
                        fontSize: 22,
                        fontWeight: 800,
                        color: "#0A1F44",
                        margin: 0,
                      }}
                    >
                      {career.whoShouldPursue.title || "Who Should Pursue?"}
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: 15,
                      color: "#334155",
                      lineHeight: 1.75,
                      fontWeight: 450,
                    }}
                    className="text-justify"
                  >
                    {career.whoShouldPursue.description}
                  </p>
                </div>
              )}
            </div>

            {/* ── 3. Milestone Stats Cards (550+ Recruiters & 3500+ Job Offers) ── */}
            <div
              style={{
                marginTop: 48,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 24,
                maxWidth: 680,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {/* Card 1: 550+ Recruiters */}
              <div
                style={{
                  background: "#0D2738",
                  borderRadius: 20,
                  padding: "36px 28px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 30px rgba(10, 31, 68, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                className="career-milestone-card hover:-translate-y-1 hover:shadow-2xl"
              >
                <div
                  style={{
                    fontSize: "clamp(36px, 4.2vw, 44px)",
                    fontWeight: 900,
                    color: "#E8871A",
                    lineHeight: 1.1,
                    letterSpacing: "-0.5px",
                    marginBottom: 10,
                  }}
                >
                  550+
                </div>
                <div
                  style={{
                    fontSize: 19,
                    fontWeight: 800,
                    color: "#FFFFFF",
                    letterSpacing: "0.2px",
                  }}
                >
                  Recruiters
                </div>
              </div>

              {/* Card 2: 3500+ Job Offers */}
              <div
                style={{
                  background: "#0D2738",
                  borderRadius: 20,
                  padding: "36px 28px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 30px rgba(10, 31, 68, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                className="career-milestone-card hover:-translate-y-1 hover:shadow-2xl"
              >
                <div
                  style={{
                    fontSize: "clamp(36px, 4.2vw, 44px)",
                    fontWeight: 900,
                    color: "#E8871A",
                    lineHeight: 1.1,
                    letterSpacing: "-0.5px",
                    marginBottom: 10,
                  }}
                >
                  3500+
                </div>
                <div
                  style={{
                    fontSize: 19,
                    fontWeight: 800,
                    color: "#FFFFFF",
                    letterSpacing: "0.2px",
                  }}
                >
                  Job Offers
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 4. Reasons to choose Geeta University ── */}
        {whyGeeta && (
          <div
            style={{
              marginTop: career ? 40 : 0,
              background: "rgba(255, 255, 255, 0.60)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(232, 135, 26, 0.18)",
              borderRadius: "32px",
              padding: "44px 32px",
              boxShadow:
                "0 15px 35px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
            }}
          >
            <div className="text-center mb-8">
              <h3
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: "clamp(26px, 3.2vw, 36px)",
                  fontWeight: 900,
                  color: "#0A1F44",
                  letterSpacing: "-0.5px",
                  margin: 0,
                }}
              >
                {whyGeeta.title}
              </h3>
            </div>

            {/* Intro text */}
            {whyGeeta.intro && (
              <p
                style={{
                  fontSize: 16,
                  color: "#334155",
                  maxWidth: 960,
                  margin: "0 auto 24px",
                  lineHeight: 1.75,
                }}
                className="text-justify sm:text-center"
              >
                {whyGeeta.intro}
              </p>
            )}

            {/* Feature reason cards */}
            {whyGeeta.reasons && whyGeeta.reasons.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {whyGeeta.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-amber-900/12 shadow-xs transition-all duration-200 hover:border-[#E8871A]/40 hover:shadow-md"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 size={18} className="text-[#E8871A] shrink-0" />
                      <h4 className="font-bold text-[#0A1F44] text-[15px]">
                        {reason.title}
                      </h4>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Concluding Paragraphs or Outro */}
            {whyGeeta.paragraphs && whyGeeta.paragraphs.length > 0 && (
              <div className="space-y-4 text-[#334155] text-[15.5px] sm:text-[16px] leading-relaxed font-normal mt-6">
                {whyGeeta.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-justify leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            )}
            {whyGeeta.outro && (
              <p className="text-[#334155] text-[15.5px] sm:text-[16px] leading-relaxed font-normal mt-6 text-justify">
                {whyGeeta.outro}
              </p>
            )}
          </div>
        )}
      </div>

      <style>{`
        .career-role-badge:hover {
          transform: translateY(-2px);
          border-color: rgba(232, 135, 26, 0.4) !important;
          box-shadow: 0 8px 20px rgba(232, 135, 26, 0.08) !important;
        }
      `}</style>
    </section>
  );
}
