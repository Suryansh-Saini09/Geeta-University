"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CourseTestimonial } from "@/data/programs/courses/types";

interface CourseTestimonialsProps {
  testimonials: CourseTestimonial[];
}

export default function CourseTestimonials({
  testimonials,
}: CourseTestimonialsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const testimonialItems = testimonials && testimonials.length > 0 ? testimonials : [];

  if (testimonialItems.length === 0) return null;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
    }
  };

  return (
    <section
      id="StudentTestimonials"
      className="w-full bg-[#FFFFFF] py-14 sm:py-16 border-t border-slate-200/80 overflow-hidden"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <h2
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "clamp(28px, 3.2vw, 38px)",
              fontWeight: 800,
              color: "#0A1F44",
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
            }}
          >
            Student Testimonial
          </h2>
        </div>

        {/* Carousel Container with Left/Right Arrows */}
        <div className="relative flex items-center">
          {/* Left Arrow Button */}
          <button
            onClick={scrollLeft}
            aria-label="Previous Testimonials"
            className="absolute -left-2 sm:-left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-slate-200 bg-white/95 backdrop-blur-md text-[#0A1F44] shadow-md transition-all duration-300 hover:border-[#E8871A] hover:bg-[#0A1F44] hover:text-[#E8871A] hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
          >
            <ChevronLeft size={19} strokeWidth={2.5} />
          </button>

          {/* Cards Track */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 pt-2 w-full scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-1"
            style={{
              scrollSnapType: "x mandatory",
            }}
          >
            {testimonialItems.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[290px] sm:w-[340px] md:w-[360px] bg-[#F8FAFC] rounded-2xl p-7 sm:p-8 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:border-amber-300"
                style={{
                  scrollSnapAlign: "start",
                }}
              >
                <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-[#E8871A] shadow-sm mb-4 bg-slate-100 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="88px"
                    className="object-cover object-top"
                  />
                </div>

                {/* Student Name */}
                <h3
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "#0A1F44",
                    marginBottom: "12px",
                  }}
                >
                  {item.name}
                </h3>

                {/* Testimonial Quote */}
                <p className="text-[#4A5568] text-[14px] sm:text-[14.5px] leading-relaxed italic font-normal text-center">
                  {item.text || item.quote}
                </p>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={scrollRight}
            aria-label="Next Testimonials"
            className="absolute -right-2 sm:-right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-slate-200 bg-white/95 backdrop-blur-md text-[#0A1F44] shadow-md transition-all duration-300 hover:border-[#E8871A] hover:bg-[#0A1F44] hover:text-[#E8871A] hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
          >
            <ChevronRight size={19} strokeWidth={2.5} />
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex sm:hidden justify-center gap-3 mt-5">
          <button
            onClick={scrollLeft}
            aria-label="Previous Testimonials"
            className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[#0A1F44]"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={scrollRight}
            aria-label="Next Testimonials"
            className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[#0A1F44]"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
