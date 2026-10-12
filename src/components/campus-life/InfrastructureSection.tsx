"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { campusFacilities } from "@/data/campusLife";

interface InfrastructureSectionProps {
  data?: any;
  onOpenVirtualTour: () => void;
}

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.7,
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
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

export default function InfrastructureSection({ data, onOpenVirtualTour }: InfrastructureSectionProps) {
  const itemsList = data?.facilities || campusFacilities;
  const sectionTitle = data?.title || "World Class Infrastructure";
  const sectionSubtitle = data?.subtitle || "Spacious classrooms, high-tech labs, modern auditoriums & living spaces";
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
    <section id="infrastructure" className="scroll-mt-[190px] bg-[#F7F9FC] py-10 md:py-14">
      <div className="gu-container">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-4xl text-center md:mb-16">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-9 bg-[#E8871A]" />
            <span className="h-px w-9 bg-[#E8871A]" />
          </div>

          <h2 className="font-serif text-[42px] font-black leading-[1.05] tracking-[-1.5px] text-[#0A1F44] sm:text-[50px] md:text-[58px]">
            World Class{" "}
            <span className="text-[#E8871A]">Infrastructure</span>
          </h2>
        </div>

        {/* Virtual Campus Tour Banner */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="relative mb-14 min-h-[460px] overflow-hidden rounded-[28px] sm:min-h-[540px] lg:min-h-[620px]"
        >
          {/* Campus image */}
          <Image
            src="/about/campus.webp"
            alt="Aerial view of Geeta University campus"
            fill
            priority={false}
            sizes="100vw"
            className="object-cover"
          />

          {/* Cinematic overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(3, 29, 53, 0.88) 0%, rgba(3, 29, 53, 0.55) 42%, rgba(3, 29, 53, 0.18) 75%, rgba(3, 29, 53, 0.35) 100%)",
            }}
          />

          {/* Bottom gradient */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{
              background:
                "linear-gradient(to top, rgba(3, 29, 53, 0.7), transparent)",
            }}
          />

          {/* Gold edge */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-1"
            style={{
              backgroundColor: "var(--gu-gold)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex min-h-[460px] items-center px-7 py-14 sm:min-h-[540px] sm:px-12 lg:min-h-[620px] lg:px-20">
            <div className="max-w-2xl">
              <motion.h2
                variants={itemVariants}
                id="virtual-tour-heading"
                className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl"
              >
                Experience the
                <span
                  className="block"
                  style={{
                    color: "var(--gu-gold)",
                  }}
                >
                  Campus.
                </span>
              </motion.h2>

              {/* Play button */}
              <motion.button
                variants={itemVariants}
                type="button"
                onClick={onOpenVirtualTour}
                aria-label="Play Geeta University virtual campus tour"
                className="group mt-9 flex items-center gap-4 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                <span className="flex h-12 w-12 items-center justify-center transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14">
                  {/* Authentic YouTube Icon SVG */}
                  <svg
                    width="42"
                    height="42"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
                      fill="#FF0000"
                    />
                    <path
                      d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                      fill="white"
                    />
                  </svg>
                </span>

                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                    Watch the tour
                  </span>

                  <span className="mt-1 block text-sm font-bold text-white sm:text-base">
                    Virtual Campus Tour
                  </span>
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>

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
            aria-label="Previous facility"
            className="absolute -left-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#DCE2EB] bg-white text-[#0A1F44] shadow-[0_8px_25px_rgba(10,31,68,0.10)] transition-all duration-300 hover:border-[#0A1F44] hover:bg-[#0A1F44] hover:text-[#E8871A] md:flex"
          >
            <ChevronLeft size={21} strokeWidth={1.8} />
          </button>

          {/* Navigation Arrow Right */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next facility"
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
              {itemsList.map((facility: any) => (
                <div
                  key={facility.id}
                  className="w-full shrink-0 px-3 sm:w-1/2 lg:w-1/3"
                >
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[#DCE2EB] bg-white shadow-[0_8px_30px_rgba(10,31,68,0.045)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#E8871A]/40 hover:shadow-[0_18px_40px_rgba(10,31,68,0.09)]">
                    {/* Top Accent Strip */}
                    <div className="h-1 w-full bg-[#0A1F44] transition-colors duration-300 group-hover:bg-[#E8871A]" />

                    {/* Facility Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A1F44]/5">
                      <Image
                        src={facility.image}
                        alt={facility.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>

                    {/* Facility Body */}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-serif text-[22px] font-black text-[#0A1F44] transition-colors duration-300 group-hover:text-[#E8871A]">
                        {facility.title}
                      </h3>
                      <p className="mt-2.5 flex-1 text-[14.5px] leading-[1.65] text-[#64748B]">
                        {facility.description}
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
