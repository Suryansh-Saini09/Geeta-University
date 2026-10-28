"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import type { EdgeGallerySection, EdgeGalleryItem } from "@/data/edge/types";
import { useFiniteCarousel } from "@/hooks/useFiniteCarousel";

interface EdgeGalleryProps {
  section: EdgeGallerySection;
}

export default function EdgeGallery({ section }: EdgeGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<EdgeGalleryItem | null>(null);

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
    totalItems: section.items?.length || 0,
    autoplayInterval: 3500,
    enableAutoplay: true,
  });

  if (!section.items || section.items.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12 md:py-16 relative overflow-hidden border-t border-slate-200">
      {/* Background ambient accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#E8871A]/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#0A1F44]/5 blur-3xl"
      />

      <div className="gu-container relative">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          {section.eyebrow && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#E8871A]/10 px-4 py-1 border border-[#E8871A]/20">
              <Sparkles size={14} className="text-[#E8871A]" />
              <span className="text-xs font-bold uppercase tracking-[2px] text-[#E8871A]">
                {section.eyebrow}
              </span>
            </div>
          )}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0A1F44]">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mt-3 text-base md:text-lg text-slate-600 font-medium">
              {section.subtitle}
            </p>
          )}
          {section.description && (
            <p className="mt-3 text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
              {section.description}
            </p>
          )}
        </div>

        {/* Multi-Item Carousel Track */}
        <div className="group relative px-2 sm:px-4">
          {/* Left navigation arrow */}
          {maxIndex > 0 && (
            <button
              type="button"
              onClick={prev}
              aria-label="Scroll left"
              className="absolute -left-2 sm:-left-4 top-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 backdrop-blur-md text-[#0A1F44] shadow-md transition-all duration-300 hover:border-[#E8871A] hover:bg-[#0A1F44] hover:text-[#E8871A] hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
          )}

          {/* Right navigation arrow */}
          {maxIndex > 0 && (
            <button
              type="button"
              onClick={next}
              aria-label="Scroll right"
              className="absolute -right-2 sm:-right-4 top-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 backdrop-blur-md text-[#0A1F44] shadow-md transition-all duration-300 hover:border-[#E8871A] hover:bg-[#0A1F44] hover:text-[#E8871A] hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
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
            className="flex w-full gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth cursor-grab active:cursor-grabbing select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {section.items.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(item)}
                className="group/card relative flex aspect-[4/3] w-[280px] sm:w-[330px] md:w-[380px] shrink-0 overflow-hidden rounded-3xl border border-[#0A1F44]/10 bg-[#0A1F44] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
              >
                {/* Background Image */}
                <img
                  src={item.src}
                  alt={item.title || `Gallery image ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105 pointer-events-none"
                />

                {/* Dark Gradient Overlay for Text */}
                {(item.title || item.caption) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-5 text-white z-10">
                    {item.title && (
                      <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug text-white group-hover/card:text-[#E8871A] transition-colors">
                        {item.title}
                      </h3>
                    )}
                    {item.caption && (
                      <p className="mt-1 text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                        {item.caption}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden bg-slate-950 border border-white/20 shadow-2xl flex flex-col"
            >
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 rounded-full p-2 text-white/80 hover:text-white bg-black/60 hover:bg-black/90 transition z-30"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              <div className="p-4 flex items-center justify-center flex-1 overflow-hidden">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title || "Full image"}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg"
                />
              </div>

              {(selectedImage.title || selectedImage.caption) && (
                <div className="p-5 bg-slate-900 text-white border-t border-white/10 text-center">
                  {selectedImage.title && (
                    <h3 className="font-serif text-xl font-bold">
                      {selectedImage.title}
                    </h3>
                  )}
                  {selectedImage.caption && (
                    <p className="mt-1 text-sm text-slate-300">
                      {selectedImage.caption}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
