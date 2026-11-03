"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Code2,
  Globe,
  BrainCircuit,
  ShieldCheck,
  Scale,
  TrendingUp,
  Briefcase,
  Stethoscope,
  Building2,
  Utensils,
  GraduationCap,
  Laptop,
  BookOpen,
  Layers,
  Award,
  Sprout,
  Tractor,
  Leaf,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { PathwayCardItem, NotableRoleItem } from "@/data/programs/types";

function renderPathwayIcon(item: PathwayCardItem) {
  const text = (item.area + " " + item.pathway).toLowerCase();
  if (text.includes("moot") || text.includes("court") || text.includes("litigation") || text.includes("judic") || text.includes("law") || text.includes("jag") || text.includes("adr") || text.includes("arbitrat")) {
    return <Scale size={24} color="#0A1F44" />;
  }
  if (text.includes("forensic") || text.includes("cyber") || text.includes("security") || text.includes("ballistic") || text.includes("investigat") || text.includes("ipr")) {
    return <ShieldCheck size={24} color="#0A1F44" />;
  }
  if (text.includes("ai") || text.includes("machine learning") || text.includes("intelligence") || text.includes("robot")) {
    return <BrainCircuit size={24} color="#0A1F44" />;
  }
  if (text.includes("full stack") || text.includes("web") || text.includes("global") || text.includes("international") || text.includes("export")) {
    return <Globe size={24} color="#0A1F44" />;
  }
  if (text.includes("software") || text.includes("programming") || text.includes("coding") || text.includes("developer")) {
    return <Code2 size={24} color="#0A1F44" />;
  }
  if (text.includes("cloud") || text.includes("network") || text.includes("system")) {
    return <Laptop size={24} color="#0A1F44" />;
  }
  if (text.includes("agri") || text.includes("farm") || text.includes("crop") || text.includes("soil") || text.includes("plant") || text.includes("breeder") || text.includes("seed") || text.includes("horticulture") || text.includes("agronom") || text.includes("vermicompost")) {
    return <Sprout size={24} color="#0A1F44" />;
  }
  if (text.includes("data") || text.includes("analytics") || text.includes("finance") || text.includes("banking") || text.includes("fintech") || text.includes("trading") || text.includes("market")) {
    return <TrendingUp size={24} color="#0A1F44" />;
  }
  if (text.includes("pharma") || text.includes("clinical") || text.includes("hospital") || text.includes("health") || text.includes("diet") || text.includes("medical") || text.includes("patient")) {
    return <Stethoscope size={24} color="#0A1F44" />;
  }
  if (text.includes("culinary") || text.includes("hotel") || text.includes("hospitality") || text.includes("food") || text.includes("chef") || text.includes("beverage") || text.includes("catering")) {
    return <Utensils size={24} color="#0A1F44" />;
  }
  if (text.includes("psycholog") || text.includes("mental health") || text.includes("counsel") || text.includes("therapy") || text.includes("behaviour")) {
    return <BrainCircuit size={24} color="#0A1F44" />;
  }
  if (text.includes("policy") || text.includes("civil service") || text.includes("upsc") || text.includes("govern") || text.includes("administr") || text.includes("diplomacy")) {
    return <Scale size={24} color="#0A1F44" />;
  }
  if (text.includes("social work") || text.includes("ngo") || text.includes("community") || text.includes("empower") || text.includes("welfare")) {
    return <Users size={24} color="#0A1F44" />;
  }
  if (text.includes("research") || text.includes("m.tech") || text.includes("ph.d") || text.includes("higher study") || text.includes("academic") || text.includes("ars") || text.includes("icar")) {
    return <GraduationCap size={24} color="#0A1F44" />;
  }
  if (text.includes("corporate") || text.includes("management") || text.includes("consult") || text.includes("business") || text.includes("hr") || text.includes("startup") || text.includes("entrepreneur")) {
    return <Briefcase size={24} color="#0A1F44" />;
  }
  return <Award size={24} color="#0A1F44" />;
}

function getRoleIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("agri") || n.includes("agronom") || n.includes("breeder") || n.includes("soil") || n.includes("horticultur") || n.includes("farm") || n.includes("crop") || n.includes("seed") || n.includes("plant")) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a9 9 0 0 1 9 9c0 4-3 7-9 11C6 18 3 15 3 11a9 9 0 0 1 9-9z" />
        <path d="M12 7v10" />
      </svg>
    );
  }
  if (n.includes("software") || n.includes("developer") || n.includes("coder") || n.includes("engineer")) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }
  if (n.includes("data") || n.includes("analyst") || n.includes("finance") || n.includes("banker") || n.includes("audit")) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    );
  }
  if (n.includes("health") || n.includes("diet") || n.includes("pharma") || n.includes("clinical") || n.includes("medical")) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M2 12h20" />
      </svg>
    );
  }
  if (n.includes("hotel") || n.includes("chef") || n.includes("manager") || n.includes("lead") || n.includes("consultant")) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

interface CareerPathwaysProps {
  eyebrow?: string;
  title?: string;
  rolesTitle?: string;
  recruitersTitle?: string;
  subtitle?: string;
  description?: string;
  pathways?: PathwayCardItem[];
  notableRoles?: NotableRoleItem[];
  recruiters?: (NotableRoleItem | string)[];
}

function RecruiterGrid({
  items,
  title,
}: {
  items: NotableRoleItem[];
  title?: string;
}) {
  const colClass =
    items.length === 6
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
      : items.length === 4
      ? "grid-cols-2 sm:grid-cols-4"
      : items.length === 5
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
      : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";

  return (
    <div style={{ marginTop: 36 }}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <h3
          style={{
            fontSize: "clamp(22px, 3vw, 26px)",
            fontWeight: 900,
            color: "#0A1F44",
            letterSpacing: "-0.5px",
            margin: "0",
          }}
        >
          {title || "Top Recruiters"}
        </h3>
      </div>

      <div className={`grid ${colClass} gap-4 max-w-6xl mx-auto`}>
        {items.map((recruiter, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.04, y: -4 }}
            transition={{ type: "spring", stiffness: 450, damping: 15 }}
            style={{
              borderColor: "rgba(232, 135, 26, 0.20)",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.04)",
            }}
            className="career-recruiter-card flex h-[110px] w-full items-center justify-center rounded-2xl border bg-white p-3 transition-all duration-300 select-none box-border"
          >
            {recruiter.logo ? (
              <div className="relative flex items-center justify-center w-full h-[65px]">
                <Image
                  src={recruiter.logo}
                  alt={recruiter.name}
                  fill
                  sizes="(max-width: 640px) 150px, 160px"
                  loading="lazy"
                  className="object-contain pointer-events-none"
                />
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8, textAlign: "center" }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "8px",
                    background: "#FFF4E8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Building2 size={16} color="#E8871A" />
                </div>
                <span
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 700,
                    color: "#0A1F44",
                    lineHeight: 1.3,
                  }}
                >
                  {recruiter.name}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RecruiterCarousel({
  items,
  title,
}: {
  items: NotableRoleItem[];
  title?: string;
}) {
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
      el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (el.scrollLeft >= maxScroll - 10) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isHovered || items.length <= 6) return;
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
    <div style={{ marginTop: 36 }}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <h3
          style={{
            fontSize: "clamp(22px, 3vw, 26px)",
            fontWeight: 900,
            color: "#0A1F44",
            letterSpacing: "-0.5px",
            margin: "0",
          }}
        >
          {title || "Top Recruiters"}
        </h3>
      </div>

      <div
        className="group relative px-3 sm:px-6"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left Movement Arrow */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous recruiters"
          className="absolute -left-1 sm:-left-3 top-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 backdrop-blur-md text-[#0A1F44] shadow-md transition-all duration-300 hover:border-[#E8871A] hover:bg-[#0A1F44] hover:text-[#E8871A] hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
        >
          <ChevronLeft size={21} strokeWidth={2.5} />
        </button>

        {/* Right Movement Arrow */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next recruiters"
          className="absolute -right-1 sm:-right-3 top-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 backdrop-blur-md text-[#0A1F44] shadow-md transition-all duration-300 hover:border-[#E8871A] hover:bg-[#0A1F44] hover:text-[#E8871A] hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
        >
          <ChevronRight size={21} strokeWidth={2.5} />
        </button>

        {/* Carousel Track */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex w-full gap-4 overflow-x-auto pb-4 pt-2 scroll-smooth cursor-grab active:cursor-grabbing select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {items.map((recruiter, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.04, y: -4 }}
              transition={{ type: "spring", stiffness: 450, damping: 15 }}
              style={{
                scrollSnapAlign: "start",
                borderColor: "rgba(232, 135, 26, 0.20)",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.04)",
              }}
              className="career-recruiter-card flex h-[110px] w-[calc((100%-16px)/2)] sm:w-[calc((100%-32px)/3)] md:w-[calc((100%-48px)/4)] lg:w-[calc((100%-80px)/6)] shrink-0 items-center justify-center rounded-2xl border bg-white p-3 transition-all duration-300 select-none box-border"
            >
              {recruiter.logo ? (
                  <div className="relative flex items-center justify-center w-full h-[65px]">
                    <Image
                      src={recruiter.logo}
                      alt={recruiter.name}
                      fill
                      sizes="(max-width: 640px) 150px, 160px"
                      loading="lazy"
                      className="object-contain pointer-events-none"
                    />
                  </div>
                ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 8, textAlign: "center" }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "8px",
                      background: "#FFF4E8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Building2 size={16} color="#E8871A" />
                  </div>
                  <span
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 700,
                      color: "#0A1F44",
                      lineHeight: 1.3,
                    }}
                  >
                    {recruiter.name}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CareerPathways({
  eyebrow,
  title = "Career Pathways",
  rolesTitle,
  recruitersTitle,
  subtitle,
  description,
  pathways,
  notableRoles,
  recruiters,
}: CareerPathwaysProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathwayItems = pathways || [];
  const roleItems = notableRoles || [];
  const recruiterItems = (recruiters || []).map((r) =>
    typeof r === "string" ? { name: r } : r
  );
  const descText = description || subtitle;

  if (pathwayItems.length === 0 && roleItems.length === 0 && recruiterItems.length === 0) return null;

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -360, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 360, behavior: "smooth" });
  };

  return (
    <section
      id="CareerPathways"
      style={{
        background: "#FDF1D6",
        padding: pathwayItems.length > 0 ? "80px 0 90px" : "64px 0 74px",
        position: "relative",
        borderTop: "1px solid rgba(0, 0, 0, 0.06)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: pathwayItems.length > 0 ? 40 : 36 }}>
          <h2
            style={{
              fontSize: "clamp(28px, 3.8vw, 42px)",
              fontWeight: 900,
              color: "#0A1F44",
              margin: 0,
              lineHeight: 1.15,
              letterSpacing: "-1px",
            }}
          >
            {title}
          </h2>

          {descText && (
            <p
              style={{
                fontSize: 16,
                color: "#334155",
                maxWidth: 920,
                margin: "16px auto 0",
                lineHeight: 1.7,
                fontWeight: 450,
              }}
            >
              {descText}
            </p>
          )}
        </div>

        {/* Carousel Slider */}
        {pathwayItems.length > 0 && (

          <div style={{ position: "relative", marginTop: 40, padding: "0 20px" }}>
            <div
              ref={scrollRef}
              className="hide-scroll"
              style={{
                display: "flex",
                gap: 28,
                overflowX: "auto",
                paddingBottom: "32px",
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
              }}
            >
              {pathwayItems.map((item, idx) => {
                const numStr = `0${idx + 1}`;
                const points = item.roles || item.points || [];
                const cardTitle = item.pathway && item.pathway !== item.area ? item.pathway : item.area;
                const cardArea = item.pathway && item.pathway !== item.area && item.area ? item.area : null;

                return (
                  <div
                    key={idx}
                    style={{
                      scrollSnapAlign: "start",
                      flexShrink: 0,
                      width: "340px",
                      minHeight: "460px",
                      background: "linear-gradient(180deg, #F5E6C9 0%, #EAD7B2 100%)",
                      borderRadius: "24px",
                      padding: "36px 28px",
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
                      border: "1px solid rgba(0, 0, 0, 0.03)",
                      transition:
                        "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    className="pathway-slider-card"
                  >
                    <div
                      style={{
                        fontSize: 24,
                        background: "rgba(255, 255, 255, 0.45)",
                        width: 48,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "12px",
                        marginBottom: 20,
                      }}
                    >
                      {renderPathwayIcon(item)}
                    </div>

                    {cardArea && (
                      <span
                        style={{
                          color: "#E8871A",
                          fontSize: "11.5px",
                          fontWeight: 800,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          marginBottom: "6px",
                          display: "block",
                          position: "relative",
                          zIndex: 2,
                        }}
                      >
                        {cardArea}
                      </span>
                    )}

                    <h3
                      style={{
                        fontSize: 19,
                        fontWeight: 800,
                        color: "#0A1F44",
                        margin: "0 0 16px",
                        lineHeight: 1.3,
                        position: "relative",
                        zIndex: 2,
                      }}
                    >
                      {cardTitle}
                    </h3>

                    {points.length > 0 ? (
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: "0 0 24px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                          position: "relative",
                          zIndex: 2,
                          flex: 1,
                        }}
                      >
                        {points.map((pt, pIdx) => (
                          <li
                            key={pIdx}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 8,
                              fontSize: 13.5,
                              color: "#334155",
                              lineHeight: 1.5,
                              fontWeight: 500,
                            }}
                          >
                            <span
                              style={{
                                color: "#E8871A",
                                fontWeight: 700,
                                fontSize: 16,
                                lineHeight: "16px",
                                marginTop: 2,
                                flexShrink: 0,
                              }}
                            >
                              •
                            </span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (item.desc || (item.pathway && item.pathway !== cardTitle)) ? (
                      <p
                        style={{
                          fontSize: 14.5,
                          color: "#475569",
                          margin: 0,
                          lineHeight: 1.6,
                          fontWeight: 450,
                          position: "relative",
                          zIndex: 2,
                        }}
                      >
                        {item.desc || item.pathway}
                      </p>
                    ) : null}

                    {/* Huge ghost number at the bottom */}
                    <div
                      className="ghost-number"
                      style={{
                        position: "absolute",
                        bottom: "-10px",
                        right: "20px",
                        fontSize: "90px",
                        fontWeight: 900,
                        color: "rgba(255, 255, 255, 0.22)",
                        lineHeight: 1,
                        userSelect: "none",
                        zIndex: 1,
                        pointerEvents: "none",
                        transition:
                          "color 0.4s cubic-bezier(0.16, 1, 0.3, 1), text-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      {numStr}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Left Arrow Button */}
            <button
              onClick={scrollLeft}
              style={{
                position: "absolute",
                left: "-16px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#FFFFFF",
                width: 48,
                height: 48,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #E2E8F0",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                color: "#0A1F44",
                zIndex: 10,
                transition: "transform 0.2s",
              }}
              className="slider-nav-btn"
              aria-label="Previous pathway"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Right Arrow Button */}
            <button
              onClick={scrollRight}
              style={{
                position: "absolute",
                right: "-16px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#FFFFFF",
                width: 48,
                height: 48,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #E2E8F0",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                color: "#0A1F44",
                zIndex: 10,
                transition: "transform 0.2s",
              }}
              className="slider-nav-btn"
              aria-label="Next pathway"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}

        {/* Notable Career Roles Band */}
        {(roleItems.length > 0 || recruiterItems.length > 0) && (
          <div
            style={{
              marginTop: pathwayItems.length > 0 ? 80 : 36,
              background: "rgba(255, 255, 255, 0.45)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(232, 135, 26, 0.15)",
              borderRadius: "32px",
              padding: "48px 32px",
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
            }}
          >
            {/* Text Badges for Roles / Pathways / Employment Sectors */}
            {roleItems.filter((r) => !r.logo).length > 0 && (
              <div style={{ marginBottom: recruiterItems.length > 0 ? 48 : 0 }}>
                {rolesTitle ? (
                  <div style={{ textAlign: "center", marginBottom: 26 }}>
                    <h3 style={{ fontSize: 24, fontWeight: 900, color: "#0A1F44", letterSpacing: "-0.5px", margin: "0", lineHeight: 1.3 }}>
                      {rolesTitle}
                    </h3>
                  </div>
                ) : (
                  !recruiterItems.length && !roleItems.some((r) => r.logo) ? (
                    <div style={{ textAlign: "center", marginBottom: 28 }}>
                      <h3 style={{ fontSize: 24, fontWeight: 900, color: "#0A1F44", letterSpacing: "-0.5px", margin: "0" }}>
                        Notable Career Roles Our Graduates Pursue
                      </h3>
                    </div>
                  ) : null
                )}

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 14,
                    justifyContent: "center",
                    maxWidth: 1080,
                    margin: "0 auto",
                  }}
                >
                  {roleItems
                    .filter((r) => !r.logo)
                    .map((role, idx) => (
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
                          border: "1px solid rgba(232, 135, 26, 0.12)",
                          borderRadius: "16px",
                          color: "#0A1F44",
                          fontSize: "14.5px",
                          fontWeight: 650,
                          cursor: "default",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)",
                          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                        className="career-role-badge"
                      >
                        <span
                          className="career-role-icon"
                          style={{
                            color: "#E8871A",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {getRoleIcon(role.name)}
                        </span>
                        <span>{role.name}</span>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}

            {/* Dedicated Top Recruiters / Industrial Partners Display */}
            {recruiterItems.length > 6 ? (
              <RecruiterCarousel items={recruiterItems} title={recruitersTitle || "Top Recruiters"} />
            ) : recruiterItems.length > 0 ? (
              <RecruiterGrid items={recruiterItems} title={recruitersTitle || "Top Recruiters"} />
            ) : roleItems.filter((r) => r.logo).length > 6 ? (
              <RecruiterCarousel items={roleItems.filter((r) => r.logo)} title={rolesTitle || "Top Recruiters"} />
            ) : roleItems.filter((r) => r.logo).length > 0 ? (
              <RecruiterGrid items={roleItems.filter((r) => r.logo)} title={rolesTitle || "Top Recruiters"} />
            ) : null}
          </div>
        )}

        {/* Milestone Stats Cards (550+ Recruiters & 3500+ Job Offers) */}
        <div
          style={{
            marginTop: roleItems.length > 0 || pathwayItems.length > 0 ? 48 : 24,
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
            className="career-milestone-card"
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
            className="career-milestone-card"
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

      <style>{`
        .career-recruiters-grid {
          display: grid;
          gap: 16px;
          max-width: 1140px;
          margin: 0 auto;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        .career-recruiters-grid.grid-6 {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 640px) {
          .career-recruiters-grid.grid-6 {
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
          }
        }
        @media (min-width: 1024px) {
          .career-recruiters-grid.grid-6 {
            grid-template-columns: repeat(6, 1fr);
            gap: 18px;
          }
        }
        .career-recruiters-grid.grid-8 {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 640px) {
          .career-recruiters-grid.grid-8 {
            grid-template-columns: repeat(4, 1fr);
            gap: 18px;
          }
        }
        @media (min-width: 1024px) {
          .career-recruiters-grid.grid-8 {
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }
        }
        .career-recruiters-grid.grid-4 {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 768px) {
          .career-recruiters-grid.grid-4 {
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }
        }
        .career-recruiters-grid.grid-5 {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 640px) {
          .career-recruiters-grid.grid-5 {
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
          }
        }
        @media (min-width: 1024px) {
          .career-recruiters-grid.grid-5 {
            grid-template-columns: repeat(5, 1fr);
            gap: 18px;
          }
        }
        .career-recruiters-grid.grid-auto {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 18px;
          max-width: 1140px;
          margin: 0 auto;
        }
        .career-recruiters-grid.grid-auto .career-recruiter-card {
          flex: 0 1 calc(25% - 18px);
          min-width: 170px;
          max-width: 250px;
        }
        @media (max-width: 768px) {
          .career-recruiters-grid.grid-auto .career-recruiter-card {
            flex: 0 1 calc(50% - 14px);
            min-width: 140px;
          }
        }
        .career-recruiter-card:hover {
          transform: translateY(-3px) scale(1.03) !important;
          border-color: #E8871A !important;
          box-shadow: 0 10px 24px rgba(232, 135, 26, 0.15) !important;
        }
        .career-milestone-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(10, 31, 68, 0.22) !important;
        }
        .pathway-slider-card:hover {
          border-color: rgba(232, 135, 26, 0.18) !important;
          box-shadow: 0 15px 30px rgba(232, 135, 26, 0.07), 0 0 18px rgba(232, 135, 26, 0.04) !important;
        }
        .pathway-slider-card:hover .ghost-number {
          color: rgba(255, 255, 255, 0.28) !important;
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
        }
        .career-role-badge:hover {
          background: #0A1F44 !important;
          color: #FFFFFF !important;
          border-color: #E8871A !important;
          box-shadow: 0 12px 24px rgba(232, 135, 26, 0.16) !important;
        }
        .career-role-badge:hover .career-role-icon {
          color: #E8871A !important;
          transform: scale(1.15) rotate(8deg);
        }
        .slider-nav-btn:hover {
          transform: translateY(-50%) scale(1.08) !important;
          color: #E8871A !important;
        }
        .slider-nav-btn:active {
          transform: translateY(-50%) scale(0.95) !important;
        }
      `}</style>
    </section>
  );
}
