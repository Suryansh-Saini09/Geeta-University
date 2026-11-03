"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DepartmentHighlightItem } from "@/data/programs/types";
import { useFiniteCarousel } from "@/hooks/useFiniteCarousel";

interface DepartmentHighlightsProps {
  title?: string;
  subtitle?: string;
  highlights?: DepartmentHighlightItem[];
  imageOnly?: boolean;
}

export default function DepartmentHighlights({
  title = "Where Learning Meets Achievement",
  subtitle,
  highlights,
}: DepartmentHighlightsProps) {
  const items = highlights || [];
  const isSingle = items.length === 1;

  const {
    containerRef,
    currentIndex,
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
    totalItems: items.length,
    autoplayInterval: 3000,
    enableAutoplay: true,
  });

  if (items.length === 0) return null;

  return (
    <section
      id="DepartmentHighlights"
      style={{
        padding: "52px 0 48px",
        background: "#FDF1D6",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Background Elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#E8871A]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 h-[500px] w-[500px] rounded-full bg-[#0A1F44]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-5xl text-center px-2"
        >
          <h2 className="font-serif text-[clamp(1.15rem,2.8vw,2.75rem)] font-bold leading-tight text-[#0A1F44] whitespace-nowrap tracking-tight">
            {title}
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#E8871A]" />
          {subtitle && (
            <p className="mt-4 text-[15px] leading-relaxed text-[#4A5568] sm:text-base max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Single Item: Centered Display */}
        {isSingle ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center py-4"
          >
            <div className="group relative aspect-[4/3] w-[340px] sm:w-[400px] md:w-[460px] overflow-hidden rounded-3xl border border-[#0A1F44]/10 bg-[#0A1F44] shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-default">
              <Image
                src={items[0].image}
                alt={items[0].title || "Department Highlight"}
                fill
                sizes="(max-width: 640px) 340px, (max-width: 768px) 400px, 460px"
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
              />
            </div>
          </motion.div>
        ) : (
          /* Multiple Items: Interactive Carousel Track */
          <div className="group relative">
            {/* Left navigation arrow */}
            {maxIndex > 0 && (
              <button
                type="button"
                onClick={prev}
                aria-label="Scroll left"
                className="absolute -left-3 sm:-left-4 top-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 backdrop-blur-md text-[#0A1F44] shadow-md transition-all duration-300 hover:border-[#E8871A] hover:bg-[#0A1F44] hover:text-[#E8871A] hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
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
                className="absolute -right-3 sm:-right-4 top-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 backdrop-blur-md text-[#0A1F44] shadow-md transition-all duration-300 hover:border-[#E8871A] hover:bg-[#0A1F44] hover:text-[#E8871A] hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
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
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative flex aspect-[4/3] w-[280px] sm:w-[330px] md:w-[380px] shrink-0 overflow-hidden rounded-3xl border border-[#0A1F44]/10 bg-[#0A1F44] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-default"
                >
                  <Image
                    src={item.image}
                    alt={item.title || `Highlight ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 330px, 380px"
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
