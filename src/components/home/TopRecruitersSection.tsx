"use client";

import React from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { recruiters as defaultRecruiters } from "@/data/recruiters";
import { useFiniteCarousel } from "@/hooks/useFiniteCarousel";

export interface RecruiterItem {
  id: string | number;
  name: string;
  logo: string;
}

interface TopRecruitersSectionProps {
  data?: RecruiterItem[] | null;
  title?: string;
}

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.7,
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

export default function TopRecruitersSection({
  data,
  title = "Our Top Recruiters",
}: TopRecruitersSectionProps) {
  const recruiterList = data && data.length > 0 ? data : defaultRecruiters;

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
    totalItems: recruiterList.length,
    autoplayInterval: 2500,
    enableAutoplay: true,
  });

  return (
    <section
      aria-labelledby="top-recruiters-heading"
      className="relative overflow-hidden bg-white py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0,
          }}
        >
          {/* Section heading */}
          <motion.div
            variants={itemVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <h2
              id="top-recruiters-heading"
              className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
              style={{
                color: "var(--gu-navy)",
              }}
            >
              {title}
            </h2>

            <div
              className="mx-auto mt-5 h-1 w-16 rounded-full"
              style={{
                backgroundColor: "var(--gu-gold)",
              }}
            />
          </motion.div>

          {/* Recruiter marquee & scroll container */}
          <motion.div
            variants={itemVariants}
            className="group relative mt-10 overflow-hidden rounded-2xl border py-6 shadow-sm md:mt-12 md:py-8"
            style={{
              borderColor: "rgba(6, 53, 95, 0.10)",
              backgroundColor: "var(--gu-bg)",
            }}
          >
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

            {/* Left gradient */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 sm:w-28"
              style={{
                background:
                  "linear-gradient(to right, var(--gu-bg), transparent)",
              }}
            />

            {/* Right gradient */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 sm:w-28"
              style={{
                background:
                  "linear-gradient(to left, var(--gu-bg), transparent)",
              }}
            />

            {/* Horizontally Scrollable Container */}
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
              className="flex w-full overflow-x-auto scroll-smooth cursor-grab active:cursor-grabbing select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex w-max items-center py-2">
                {recruiterList.map((recruiter) => (
                  <div
                    key={recruiter.id}
                    className="group/card mx-3 flex h-24 w-52 shrink-0 items-center justify-center rounded-2xl border bg-white px-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:mx-4 sm:h-28 sm:w-60 md:h-32 md:w-64 pointer-events-auto"
                    style={{
                      borderColor: "rgba(6, 53, 95, 0.08)",
                    }}
                  >
                    <Image
                      src={recruiter.logo}
                      alt={`${recruiter.name} logo`}
                      width={220}
                      height={90}
                      sizes="(max-width: 640px) 180px, 240px"
                      className="max-h-16 sm:max-h-20 md:max-h-22 w-auto max-w-[85%] object-contain transition-all duration-300 pointer-events-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}