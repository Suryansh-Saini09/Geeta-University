"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { sportsFacilities } from "@/data/campusLife";

export default function SportsFacilitiesSection({ data }: { data?: any }) {
  const itemsList = data?.sports || sportsFacilities;
  const sectionTitle = data?.title || "Sports Facilities";
  const [visibleCards, setVisibleCards] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
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
    <section id="sports" className="scroll-mt-[190px] bg-white py-10 md:py-14 border-t border-[#E2E8F0]">
      <div className="gu-container">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-4xl text-center md:mb-16">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-9 bg-[#E8871A]" />
            <span className="h-px w-9 bg-[#E8871A]" />
          </div>

          <h2 className="font-serif text-[42px] font-black leading-[1.05] tracking-[-1.5px] text-[#0A1F44] sm:text-[50px] md:text-[58px]">
            Sports <span className="text-[#E8871A]">Facilities</span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-[16px] leading-[1.8] text-[#64748B] md:text-[17px]">
            At Geeta University, we encourage students to take part in various sports
            activities to stay active and fit. Our outdoor sports facilities are spread over
            10+ acres besides which we also offer indoor sports and a well-equipped gym.
          </p>
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
            aria-label="Previous sport"
            className="absolute -left-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#DCE2EB] bg-white text-[#0A1F44] shadow-[0_8px_25px_rgba(10,31,68,0.10)] transition-all duration-300 hover:border-[#0A1F44] hover:bg-[#0A1F44] hover:text-[#E8871A] md:flex"
          >
            <ChevronLeft size={21} strokeWidth={1.8} />
          </button>

          {/* Navigation Arrow Right */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next sport"
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
              {itemsList.map((sport: any) => (
                <div
                  key={sport.id}
                  className="w-full shrink-0 px-3 sm:w-1/2 lg:w-1/3"
                >
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[#DCE2EB] bg-white shadow-[0_8px_30px_rgba(10,31,68,0.045)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#E8871A]/40 hover:shadow-[0_18px_40px_rgba(10,31,68,0.09)]">
                    {/* Top Accent Strip */}
                    <div className="h-1 w-full bg-[#0A1F44] transition-colors duration-300 group-hover:bg-[#E8871A]" />

                    {/* Sport Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A1F44]/5">
                      <Image
                        src={sport.image}
                        alt={sport.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>

                    {/* Sport Body */}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-serif text-[22px] font-black text-[#0A1F44] transition-colors duration-300 group-hover:text-[#E8871A]">
                        {sport.title}
                      </h3>
                      <p className="mt-2 text-[14.5px] font-medium leading-[1.6] text-[#64748B]">
                        {sport.tagline}
                      </p>
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
