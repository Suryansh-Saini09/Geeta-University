"use client";

import React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImpactRankings from "@/components/about/ImpactRankings";
import { useFiniteCarousel } from "@/hooks/useFiniteCarousel";

interface AwardsRankingsSectionProps {
  data?: Array<{
    id: string | number;
    title: string;
    presentedBy?: string | null;
    designation?: string | null;
    presenters?: any;
    image: string;
  }> | null;
}
export default function AwardsRankingsSection({ data }: AwardsRankingsSectionProps) {
  const awardList = data && data.length > 0 ? data : [];

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
    totalItems: awardList.length,
    autoplayInterval: 3000,
    enableAutoplay: true,
  });

  return (
    <section
      id="awards-ranking"
      className="scroll-mt-[190px] overflow-hidden bg-[#F7F8FA] pt-12 md:pt-16 pb-8 md:pb-10"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* SECTION INTRO */}
        <div className="mx-auto mb-10 max-w-[900px] text-center">
          {/* Heading */}
          <h2 className="font-serif text-[38px] font-black leading-[1.06] tracking-[-1.5px] text-[#0A1F44] sm:text-[46px] md:text-[54px] lg:text-[60px]">
            Awards &amp; Rankings
          </h2>
        </div>

        {/* CAROUSEL CONTAINER */}
        <div className="group relative">
          {/* Left Arrow */}
          {maxIndex > 0 && (
            <button
              type="button"
              onClick={prev}
              aria-label="Previous award"
              className="absolute -left-2 sm:left-1 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 backdrop-blur-md text-[#0A1F44] shadow-md transition-all duration-300 hover:border-[#E8871A] hover:bg-[#0A1F44] hover:text-[#E8871A] hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
          )}

          {/* Right Arrow */}
          {maxIndex > 0 && (
            <button
              type="button"
              onClick={next}
              aria-label="Next award"
              className="absolute -right-2 sm:right-1 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 backdrop-blur-md text-[#0A1F44] shadow-md transition-all duration-300 hover:border-[#E8871A] hover:bg-[#0A1F44] hover:text-[#E8871A] hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          )}

          {/* Horizontally Scrollable & Draggable Track */}
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
            className="flex w-full gap-5 overflow-x-auto pb-6 pt-2 cursor-grab active:cursor-grabbing select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {awardList.map((award) => (
              <div
                key={award.id}
                className="w-[280px] sm:w-[310px] md:w-[340px] shrink-0"
              >
                <article className="group/card flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-400 ease-out hover:-translate-y-1.5 hover:border-[#E8871A]/50 hover:shadow-xl hover:shadow-[#0A1F44]/10">
                  {/* Image Frame Container */}
                  <div className="relative aspect-[1.45/1] w-full overflow-hidden bg-slate-900/5 p-2.5">
                    <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-100">
                      <Image
                        src={award.image}
                        alt={award.title}
                        fill
                        sizes="(max-width: 639px) 280px, (max-width: 767px) 310px, 340px"
                        unoptimized={Boolean(award.image?.startsWith("/uploads/") || award.image?.startsWith("http"))}
                        className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.05] pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col px-5 pb-6 pt-5 text-center">
                    <h3 className="line-clamp-2 min-h-[42px] font-serif text-[15px] font-bold leading-snug text-[#0A1F44] sm:text-[16px]">
                      {award.title}
                    </h3>

                    <div className="my-4 flex items-center justify-center gap-2 opacity-50">
                      <span className="h-px w-10 bg-slate-300" />
                      <span className="h-1 w-1 rounded-full bg-[#E8871A]" />
                      <span className="h-px w-10 bg-slate-300" />
                    </div>

                    {award.presenters && award.presenters.length > 0 ? (
                      <div className="mt-auto min-h-[132px] rounded-xl bg-slate-50/90 p-3.5 border border-slate-100 flex flex-col justify-center">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Presented By
                        </p>
                        <div className="flex flex-col gap-2">
                          {award.presenters.map((presenter: any, pIdx: number) => (
                            <div
                              key={pIdx}
                              className={
                                pIdx > 0
                                  ? "pt-2 border-t border-slate-200/60 flex flex-col"
                                  : "flex flex-col"
                              }
                            >
                              <p className="font-serif text-[13.5px] font-bold text-[#0A1F44] leading-tight">
                                {presenter.name}
                              </p>
                              <p className="mt-0.5 text-[11px] leading-snug text-slate-500 font-medium">
                                {presenter.designation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : award.presentedBy ? (
                      <div className="mt-auto min-h-[132px] rounded-xl bg-slate-50/90 p-3.5 border border-slate-100 flex flex-col justify-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Presented By
                        </p>
                        <p className="mt-1 font-serif text-[14px] font-bold text-[#0A1F44] leading-tight">
                          {award.presentedBy}
                        </p>
                        {award.designation && (
                          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 font-medium">
                            {award.designation}
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* IMPACT RANKINGS */}
        <ImpactRankings />
      </div>
    </section>
  );
}