"use client";

import Image from "next/image";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { homeFeedback } from "@/data/homeFeedback";
import { useFiniteCarousel } from "@/hooks/useFiniteCarousel";

export interface StudentSuccessStoriesProps {
  data?: {
    title?: string;
    subtitle?: string;
    stories?: Array<{
      id?: string;
      name: string;
      package: string;
      company?: string;
      role?: string;
      image?: string;
      quote?: string;
      testimonial?: string;
    }>;
  };
}

export default function StudentSuccessStories({ data }: StudentSuccessStoriesProps = {}) {
  const items = data?.stories !== undefined ? (data.stories || []) : homeFeedback;
  if (data && items.length === 0) return null;

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
    totalItems: items.length,
    autoplayInterval: 3000,
    enableAutoplay: true,
  });

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
          {data?.title ? (
            <h2 className="font-serif text-4xl font-bold leading-tight text-[#06355F] sm:text-5xl">
              {data.title}
            </h2>
          ) : (
            <h2 className="font-serif text-4xl font-bold leading-tight text-[#06355F] sm:text-5xl">
              From Campus to{" "}
              <span className="text-[#F28C18]">Corporate Success</span>
            </h2>
          )}
          {data?.subtitle && (
            <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
              {data.subtitle}
            </p>
          )}

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

          {/* Track */}
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
            const studentImg = student.image || "/images/placeholder.webp";
            const isExternal = studentImg.startsWith("http://") || studentImg.startsWith("https://");
            const quoteText = student.quote || student.testimonial || "";
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
                    {studentImg ? (
                      <Image
                        src={studentImg}
                        alt={student.name}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                        unoptimized={isExternal}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-bold text-slate-400">
                        {student.name?.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-serif text-xl font-bold text-[#06355F]">
                      {student.name}
                    </h3>
                    {(student.company || student.role) && (
                      <p className="text-xs text-slate-500 font-medium truncate">
                        {student.company ? `${student.company}${student.role ? ` · ${student.role}` : ""}` : student.role}
                      </p>
                    )}

                    <div className="mt-2 inline-flex items-center rounded-full bg-[#FFF3E2] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#D97706]">
                      Package · {student.package}
                    </div>
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
                      {quoteText}
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