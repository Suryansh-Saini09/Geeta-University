"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { eminentPersonalities } from "@/data/campusLife";

export default function EminentPersonalitiesSection({ data }: { data?: any }) {
  const itemsList = data?.personalities || eminentPersonalities;
  const sectionTitle = data?.title || "Eminent Personalities at GU";
  const [visibleCards, setVisibleCards] = useState(2);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else {
        setVisibleCards(2);
      }
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  const totalSlides = Math.max(1, itemsList.length - visibleCards + 1);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  // Auto-play loop (2.5 seconds, pauses when hovered)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 2500);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide]);

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

  return (
    <section id="eminent-personalities" className="scroll-mt-[190px] bg-white py-10 md:py-14 border-t border-[#E2E8F0]">
      <div className="gu-container">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-4xl text-center md:mb-16">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-9 bg-[#E8871A]" />
            <span className="h-px w-9 bg-[#E8871A]" />
          </div>

          <h2 className="font-serif text-[42px] font-black leading-[1.05] tracking-[-1.5px] text-[#0A1F44] sm:text-[50px] md:text-[58px]">
            Eminent Personalities <span className="text-[#E8871A]">at GU.</span>
          </h2>
        </div>

        {/* Carousel Viewport */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Arrow Left */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous personality"
            className="absolute -left-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#DCE2EB] bg-white text-[#0A1F44] shadow-[0_8px_25px_rgba(10,31,68,0.10)] transition-all duration-300 hover:border-[#0A1F44] hover:bg-[#0A1F44] hover:text-[#E8871A] md:flex"
          >
            <ChevronLeft size={21} strokeWidth={1.8} />
          </button>

          {/* Navigation Arrow Right */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next personality"
            className="absolute -right-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#DCE2EB] bg-white text-[#0A1F44] shadow-[0_8px_25px_rgba(10,31,68,0.10)] transition-all duration-300 hover:border-[#0A1F44] hover:bg-[#0A1F44] hover:text-[#E8871A] md:flex"
          >
            <ChevronRight size={21} strokeWidth={1.8} />
          </button>

          {/* Cards Track */}
          <div
            className="overflow-hidden touch-pan-y select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
              }}
            >
              {itemsList.map((item: any) => (
                <div
                  key={item.id}
                  className="w-full shrink-0 px-3 md:w-1/2"
                >
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[#DCE2EB] bg-white shadow-[0_8px_30px_rgba(10,31,68,0.045)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#E8871A]/40 hover:shadow-[0_18px_40px_rgba(10,31,68,0.09)]">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A1F44]/5">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
