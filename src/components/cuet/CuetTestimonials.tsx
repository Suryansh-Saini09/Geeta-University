"use client";

import Image from "next/image";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { homeFeedback } from "@/data/homeFeedback";
import { useFiniteCarousel } from "@/hooks/useFiniteCarousel";

interface CuetTestimonialItem {
  name: string;
  image: string;
  quote?: string;
  testimonial?: string;
  package?: string;
}

interface CuetTestimonialsProps {
  data?: {
    title?: string;
    items?: CuetTestimonialItem[];
  };
}

export default function CuetTestimonials({ data }: CuetTestimonialsProps = {}) {
  const items = data?.items !== undefined ? data.items : homeFeedback;
  const title = data?.title || "From Campus to Corporate Success";

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
    totalItems: items.length,
    autoplayInterval: 3000,
    enableAutoplay: true,
  });

  if (data?.items && data.items.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#F5F8FB] pt-8 md:pt-10 pb-16 md:pb-20">
      {/* Decorative background elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#F28C18]/5 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-[#06355F]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="font-serif text-4xl font-bold leading-tight text-[#06355F] sm:text-5xl">
            {title}
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#F28C18]" />
        </div>

        {/* Horizontally Scrollable & Draggable Cards Track */}
        <div className="group relative">
          {/* Left Arrow */}
          {maxIndex > 0 && (
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="absolute -left-3 sm:-left-4 top-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 backdrop-blur-md text-[#0A1F44] shadow-md transition-all duration-300 hover:border-[#E8871A] hover:bg-[#0A1F44] hover:text-[#E8871A] hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
            >
              <ChevronLeft size={19} strokeWidth={2.5} />
            </button>
          )}

          {/* Right Arrow */}
          {maxIndex > 0 && (
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
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
            {items.map((student: any, index: number) => {
              const quote = student.quote || student.testimonial || "";
              const pkg = student.package || "";

              return (
                <article
                  key={`${student.name}-${index}`}
                  className={`group relative flex w-[300px] sm:w-[350px] md:w-[380px] shrink-0 flex-col overflow-hidden rounded-3xl border bg-white p-7 pb-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                    index % 2 === 1 ? "border-[#F28C18]/40" : "border-[#DCE5ED]"
                  }`}
                >
                  {/* Top Accent Bar */}
                  <div
                    className={`absolute left-0 top-0 h-1.5 w-full transition-all duration-300 ${
                      index % 2 === 1 ? "bg-[#F28C18]" : "bg-[#06355F]"
                    }`}
                  />

                  {/* Student identity */}
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-[#F5F8FB] bg-[#EAF0F5]">
                      <Image
                        src={student.image}
                        alt={student.name}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-serif text-xl font-bold text-[#06355F]">
                        {student.name}
                      </h3>

                      {pkg && (
                        <div className="mt-2 inline-flex items-center rounded-full bg-[#FFF3E2] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#D97706]">
                          {pkg.startsWith("Package") ? pkg : `Package · ${pkg}`}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="mt-7 flex flex-1 flex-col justify-between">
                    <div>
                      <span
                        aria-hidden="true"
                        className="font-serif text-5xl font-bold leading-none text-[#F28C18]/25"
                      >
                        “
                      </span>

                      <p className="mt-[-6px] text-[15px] leading-7 text-[#536B83]">
                        {quote}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}