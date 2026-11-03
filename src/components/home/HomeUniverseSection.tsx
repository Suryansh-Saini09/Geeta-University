"use client";

import React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFiniteCarousel } from "@/hooks/useFiniteCarousel";

const flagItems = [
  { name: "Australia", image: "/home/universe-flags/4-full.webp" },
  { name: "Brazil", image: "/home/universe-flags/5-full.webp" },
  { name: "Vietnam", image: "/home/universe-flags/6-full.webp" },
  { name: "Zimbabwe", image: "/home/universe-flags/7-full.webp" },
  { name: "South Africa", image: "/home/universe-flags/8-full.webp" },
  { name: "Nigeria", image: "/home/universe-flags/9-full.webp" },
  { name: "Yemen", image: "/home/universe-flags/11-full.webp" },
  { name: "Switzerland", image: "/home/universe-flags/14-1-full.webp" },
  { name: "Czech Republic", image: "/home/universe-flags/17-1-full.webp" },
  { name: "Malaysia", image: "/home/universe-flags/19-1-full.webp" },
  { name: "Global Partner 1", image: "/international-admissions/logo-11.webp" },
  { name: "Global Partner 2", image: "/international-admissions/logo-12.webp" },
  // { name: "Global Partner 3", image: "/international-admissions/logo-10.webp" },
  // { name: "Global Partner 4", image: "/international-admissions/logo-7.webp" },
  // { name: "Global Partner 5", image: "/international-admissions/logo-8.webp" },
];

const globalUniversities = [
  "University of Sao Paulo, Brazil",
  "Swiss School of Management, Switzerland",
  "Universiti Malaysia Terengganu (UMT), Malaysia",
  "Mendel University, Czech Republic",
  "Murdoch University, Australia",
  "North Caucasian State Academy (NCSA), Russia",
];

const internships = [
  "Dubai",
  "Singapore",
  "Malaysia",
  "Vietnam",
  "Australia",
  "France",
];

interface HomeUniverseSectionProps {
  data?: {
    heading?: string;
    countriesCount?: number;
    statesCount?: number;
    communityDescription?: string;
    globalUniversities?: string[];
    internships?: string[];
    flagItems?: Array<{ name: string; image: string }>;
  } | null;
}

export default function HomeUniverseSection({ data }: HomeUniverseSectionProps) {
  const headingText = data?.heading || "Universe of GU";
  const countries = data?.countriesCount ?? 31;
  const states = data?.statesCount ?? 22;
  const commDesc = data?.communityDescription || "Students and staff from across India and the world contribute to a diverse and globally connected campus community.";
  const univList = data?.globalUniversities && data.globalUniversities.length > 0 ? data.globalUniversities : globalUniversities;
  const internList = data?.internships && data.internships.length > 0 ? data.internships : internships;
  const flags = data?.flagItems && data.flagItems.length > 0 ? data.flagItems : flagItems;

  const {
    containerRef,
    maxIndex,
    next,
    prev,
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
    totalItems: flags.length,
    autoplayInterval: 2500,
    enableAutoplay: true,
  });

  return (
    <section className="relative overflow-hidden bg-[#F5F8FB] py-12 md:py-16">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-[#F28C18]/5 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#06355F]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section heading */}
        <div className="mb-12">
          <h2 className="font-serif text-4xl font-bold leading-tight text-[#06355F] sm:text-5xl">
            {headingText}
          </h2>

          <div className="mt-5 h-1 w-16 rounded-full bg-[#F28C18]" />
        </div>

        {/* Main information cards */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Global community */}
          <div className="group rounded-2xl border border-[#DCE5ED] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#F28C18]/50 hover:shadow-lg">
            <h3 className="font-sans text-2xl font-bold text-[#06355F]">
              {countries} Countries
            </h3>

            <p className="mt-1 font-semibold text-[#536B83]">
              {states} States
            </p>

            <p className="mt-4 text-sm leading-6 text-[#64778A]">
              {commDesc}
            </p>
          </div>

          {/* Global universities */}
          <div className="group rounded-2xl border border-[#DCE5ED] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#F28C18]/50 hover:shadow-lg">
            <h3 className="font-sans text-2xl font-bold text-[#06355F]">
              MOU with Prestigious Global Universities
            </h3>

            <div className="mt-5 space-y-3">
              {univList.map((university) => (
                <div
                  key={university}
                  className="flex items-start gap-3 text-sm leading-5 text-[#536B83]"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#F28C18]" />
                  <span>{university}</span>
                </div>
              ))}
            </div>
          </div>

          {/* International internships */}
          <div className="group rounded-2xl border border-[#DCE5ED] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#F28C18]/50 hover:shadow-lg">
            <h3 className="font-sans text-2xl font-bold text-[#06355F]">
              International Internships
            </h3>

            <p className="mt-4 text-sm leading-6 text-[#64778A]">
              Students get opportunities to gain international exposure
              through internships and professional experiences across
              multiple countries.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {internList.map((location) => (
                <span
                  key={location}
                  className="rounded-full border border-[#DCE5ED] bg-[#F5F8FB] px-4 py-2 text-xs font-semibold text-[#06355F]"
                >
                  {location}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Global image strip */}
        <div className="mt-12">
          <div className="group relative overflow-hidden rounded-2xl border border-[#DCE5ED] bg-white py-5 shadow-sm">
            {/* Left navigation arrow */}
            {maxIndex > 0 && (
              <button
                type="button"
                onClick={prev}
                aria-label="Scroll left"
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-slate-200 bg-white/95 backdrop-blur-md text-[#0A1F44] shadow-md transition-all duration-300 hover:border-[#E8871A] hover:bg-[#0A1F44] hover:text-[#E8871A] hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
              >
                <ChevronLeft size={19} strokeWidth={2.5} />
              </button>
            )}

            {/* Right navigation arrow */}
            {maxIndex > 0 && (
              <button
                type="button"
                onClick={next}
                aria-label="Scroll right"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-slate-200 bg-white/95 backdrop-blur-md text-[#0A1F44] shadow-md transition-all duration-300 hover:border-[#E8871A] hover:bg-[#0A1F44] hover:text-[#E8871A] hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
              >
                <ChevronRight size={19} strokeWidth={2.5} />
              </button>
            )}

            {/* Left fade */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent sm:w-20" />

            {/* Right fade */}
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent sm:w-20" />

            {/* Scrollable & Draggable container */}
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
              className="flex w-full gap-6 overflow-x-auto scroll-smooth cursor-grab active:cursor-grabbing select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex w-max items-center gap-6">
                {flags.map((item, index) => (
                  <div
                    key={`flag-${item.name}-${index}`}
                    className="group/flag flex h-20 w-36 sm:h-24 sm:w-44 shrink-0 items-center justify-center rounded-xl border border-[#E4EAF0] bg-white p-3 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F28C18]/40 hover:shadow-md"
                  >
                    <div className="relative h-12 w-full sm:h-14">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 144px, 176px"
                        loading="lazy"
                        className="object-contain pointer-events-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}