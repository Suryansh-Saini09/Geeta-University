"use client";

import React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFiniteCarousel } from "@/hooks/useFiniteCarousel";
interface IndustryIntegrationSectionProps {
  data?: Array<{ id: string | number; name: string; image: string }> | null;
}

export default function IndustryIntegrationSection({ data }: IndustryIntegrationSectionProps) {
  const partnerList = data && data.length > 0 ? data : [];

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
    totalItems: partnerList.length,
    autoplayInterval: 2500,
    enableAutoplay: true,
  });

  return (
    <section className="relative overflow-hidden bg-white py-12 md:py-16">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[#F28C18]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="font-serif text-4xl font-bold leading-tight text-[#06355F] sm:text-5xl">
            Skill Centers &amp;{" "}
            <span className="text-[#F28C18]">
              Industry Integration
            </span>
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#F28C18]" />
        </div>

        {/* Industry marquee & scroll container */}
        <div className="group relative">
          {/* Left navigation arrow */}
          {maxIndex > 0 && (
            <button
              type="button"
              onClick={prev}
              aria-label="Scroll left"
              className="absolute -left-2 sm:left-2 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-slate-200 bg-white/95 backdrop-blur-md text-[#0A1F44] shadow-md transition-all duration-300 hover:border-[#E8871A] hover:bg-[#0A1F44] hover:text-[#E8871A] hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
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
              className="absolute -right-2 sm:right-2 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-slate-200 bg-white/95 backdrop-blur-md text-[#0A1F44] shadow-md transition-all duration-300 hover:border-[#E8871A] hover:bg-[#0A1F44] hover:text-[#E8871A] hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
            >
              <ChevronRight size={19} strokeWidth={2.5} />
            </button>
          )}

          {/* Left fade */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent sm:w-28"
          />

          {/* Right fade */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent sm:w-28"
          />

          {/* Viewport with drag and scroll */}
          <div className="overflow-hidden rounded-3xl border border-[#DCE5EC] bg-[#F8FAFC] py-7 shadow-sm sm:py-9">
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
              <div className="flex w-max items-center">
                {partnerList.map((partner, index) => (
                  <div
                    key={`${partner.image}-${index}`}
                    className="group/item mx-3 flex h-28 w-44 shrink-0 items-center justify-center rounded-2xl border border-[#E1E8EE] bg-white px-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#F28C18]/40 hover:shadow-lg sm:mx-4 sm:h-32 sm:w-52"
                  >
                    <div className="relative h-16 w-full sm:h-20">
                      <Image
                        src={partner.image}
                        alt={partner.name}
                        fill
                        sizes="(max-width: 640px) 150px, 175px"
                        loading="lazy"
                        className="object-contain transition-transform duration-300 group-hover/item:scale-105 pointer-events-none"
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