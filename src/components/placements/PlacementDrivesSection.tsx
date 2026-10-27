"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight, Building2, Users } from "lucide-react";
import { placementDriveSnapshots as defaultSnapshots } from "@/data/placements";

interface PlacementDrivesProps {
  onOpenVideoModal: (videoId: string, title: string) => void;
  data?: {
    title?: string;
    subtitle?: string;
    drives?: Array<{
      src: string;
      title: string;
      subtitle?: string;
      videoUrl?: string;
    }>;
  };
}

export default function PlacementDrivesSection({ onOpenVideoModal, data }: PlacementDrivesProps) {
  const snapshots = data?.drives !== undefined ? (data.drives || []) : defaultSnapshots;

  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    if (snapshots.length === 0) return;
    setActiveSlide((prev) => (prev + 1) % snapshots.length);
  }, [snapshots.length]);

  const prevSlide = useCallback(() => {
    if (snapshots.length === 0) return;
    setActiveSlide((prev) =>
      prev === 0 ? snapshots.length - 1 : prev - 1
    );
  }, [snapshots.length]);

  // Auto-play loop (3 seconds, pauses on hover)
  useEffect(() => {
    if (isHovered || snapshots.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide, snapshots.length]);

  // Touch Swipe Handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (data && snapshots.length === 0) return null;

  return (
    <section id="drives" className="scroll-mt-[190px] bg-white py-12 md:py-16 border-t border-[#E2E8F0]">
      <div className="gu-container">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-4xl text-center md:mb-16">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-9 bg-[#E8871A]" />
            <span className="h-px w-9 bg-[#E8871A]" />
          </div>

          <h2 className="font-serif text-[38px] font-black leading-[1.08] tracking-[-1.5px] text-[#0A1F44] sm:text-[46px] md:text-[52px]">
            {data?.title ? (
              data.title
            ) : (
              <>
                Placement Drives &amp; <span className="text-[#E8871A]">Snapshots</span>
              </>
            )}
          </h2>
          {data?.subtitle && (
            <p className="mt-3 text-[#64748B] text-base max-w-2xl mx-auto">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Infosys Placement Drive Interactive Video Feature */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-[#E2E8F0] bg-[#F7F9FC] p-7 shadow-sm transition-all duration-300 hover:shadow-xl lg:col-span-6 sm:p-8">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF3E2] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#E8871A]">
                  <span className="h-2 w-2 rounded-full bg-[#E8871A] animate-ping" />
                  Featured Video Spotlight
                </span>
                <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#07589F]">
                  <Users size={14} />
                  350+ Candidates
                </span>
              </div>

              <h3 className="mt-4 font-serif text-[26px] font-bold text-[#0A1F44] sm:text-[30px] leading-tight">
                Infosys Campus Recruitment Drive
              </h3>

              <p className="mt-2 text-[15px] leading-relaxed text-[#64748B]">
                Experience the multi-stage evaluation process, technical assessments, and joyous selection moments as Infosys recruits top engineering and management talent at Geeta University.
              </p>
            </div>

            {/* Video Player Box with Ripple Glow */}
            <div className="relative mt-7 aspect-[16/10] w-full overflow-hidden rounded-[22px] bg-[#0A1F44] shadow-[0_15px_35px_rgba(10,31,68,0.2)]">
              <Image
                src="/placements/drive-1.jpg"
                alt="Infosys Placement Drive at Geeta University"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-75 transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/95 via-[#0A1F44]/40 to-transparent flex flex-col items-center justify-center p-6 text-center">
                {/* Pulsing Play Button */}
                <div className="relative flex items-center justify-center">
                  <span className="absolute h-24 w-24 rounded-full bg-[#E8871A]/30 animate-ping" />
                  <span className="absolute h-20 w-20 rounded-full bg-[#E8871A]/40" />

                  <button
                    type="button"
                    onClick={() =>
                      onOpenVideoModal(
                        "LqKxm1hUDbQ",
                        "Infosys Campus Recruitment Drive at Geeta University"
                      )
                    }
                    className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#E8871A] to-[#F5A623] text-white shadow-[0_12px_30px_rgba(232,135,26,0.6)] transition-all duration-300 hover:scale-110 hover:shadow-[0_15px_40px_rgba(232,135,26,0.8)] sm:h-20 sm:w-20 cursor-pointer"
                    aria-label="Play Infosys Drive Video"
                  >
                    <Play size={28} className="translate-x-0.5 fill-white text-white" />
                  </button>
                </div>

                <div className="mt-5">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    Click to Watch Campus Drive
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Cinematic Placement Drives Gallery with Animated Stage & Thumbnails */}
          <div
            className="flex flex-col justify-between overflow-hidden rounded-[26px] border border-[#E2E8F0] bg-[#F7F9FC] p-7 shadow-sm transition-all duration-300 hover:shadow-xl lg:col-span-6 sm:p-8"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F0FA] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#07589F]">
                  <Building2 size={13} />
                  Live Drive Moments
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-0.5 text-[11px] font-bold text-[#0A1F44] shadow-xs">
                  {snapshots.length > 0 ? `${activeSlide + 1} / ${snapshots.length}` : "0 / 0"}
                </span>
              </div>

              <h3 className="mt-4 font-serif text-[26px] font-bold text-[#0A1F44] sm:text-[30px] leading-tight">
                Placement Drives Gallery
              </h3>

              <p className="mt-2 text-[15px] leading-relaxed text-[#64748B]">
                Corporate interactions, technical interview rounds, and joyful offer letter celebrations across campus.
              </p>
            </div>

            {/* Main Stage Display */}
            <div
              className="relative mt-7 aspect-[16/10] w-full overflow-hidden rounded-[22px] bg-slate-900 shadow-[0_15px_35px_rgba(0,0,0,0.15)] touch-pan-y select-none group"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {snapshots.map((item, idx) => {
                const isCurrent = activeSlide === idx;
                const isExternal = item.src?.startsWith("http://") || item.src?.startsWith("https://");

                return (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      isCurrent
                        ? "opacity-100 scale-100 z-10"
                        : "opacity-0 scale-105 pointer-events-none z-0"
                    }`}
                  >
                    {item.src && (
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                        unoptimized={isExternal}
                      />
                    )}

                    {/* Gradient Info Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/95 via-[#0A1F44]/35 to-transparent flex flex-col justify-end p-6 text-white">
                      <span className="inline-flex w-fit rounded-full bg-[#E8871A] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white mb-2 shadow-sm">
                        Drive Phase 0{idx + 1}
                      </span>
                      <h4 className="font-serif text-[20px] font-black text-white sm:text-[22px] leading-snug">
                        {item.title}
                      </h4>
                      {item.subtitle && (
                        <p className="mt-1 text-[13px] text-slate-200 leading-relaxed max-w-xl">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Floating Prev / Next Chevron Buttons */}
              {snapshots.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous drive snapshot"
                    className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-[#E8871A] hover:scale-110 hover:border-transparent cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next drive snapshot"
                    className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-[#E8871A] hover:scale-110 hover:border-transparent cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Interactive Thumbnail Navigation Strip */}
            {snapshots.length > 1 && (
              <div className="mt-5 grid grid-cols-5 gap-2.5">
                {snapshots.slice(0, 5).map((item, idx) => {
                  const isActive = activeSlide === idx;
                  const isExternal = item.src?.startsWith("http://") || item.src?.startsWith("https://");

                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`group/thumb relative aspect-[16/11] w-full overflow-hidden rounded-[12px] border transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "border-[#E8871A] ring-2 ring-[#E8871A]/40 scale-105 shadow-md"
                          : "border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400"
                      }`}
                      aria-label={`View drive snapshot ${idx + 1}`}
                    >
                      {item.src && (
                        <Image
                          src={item.src}
                          alt={item.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                          unoptimized={isExternal}
                        />
                      )}

                      {/* Progress Bar Active Indicator */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E8871A] animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
