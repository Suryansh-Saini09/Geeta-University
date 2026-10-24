"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface CollagePhoto {
  id: string;
  src: string;
  alt: string;
}

const COLLAGE_PHOTOS: CollagePhoto[] = [
  {
    id: "top",
    src: "/uploads/all/2248/6.webp",
    alt: "Placement Day Celebration - Top Group",
  },
  {
    id: "circle",
    src: "/uploads/all/2247/5.webp",
    alt: "Placement Day Dignitary Speech",
  },
  {
    id: "mid",
    src: "/uploads/all/2249/7.webp",
    alt: "Placement Day Panel Discussion",
  },
  {
    id: "right",
    src: "/uploads/all/2246/4.webp",
    alt: "Placement Day Award Ceremony",
  },
  {
    id: "bottom-left",
    src: "/uploads/all/2245/3.webp",
    alt: "Placement Day Auditorium Audience",
  },
  {
    id: "bottom-right",
    src: "/uploads/all/2251/9.webp",
    alt: "Placement Day Star Stage Setup",
  },
  {
    id: "star",
    src: "/uploads/all/2250/8.webp",
    alt: "Placement Day Student Performance",
  },
];

export interface PlacementDayGalleryProps {
  data?: {
    title?: string;
    subtitle?: string;
    items?: Array<{
      src: string;
      title?: string;
      alt?: string;
    }>;
  };
}

export default function PlacementDayGallery({ data }: PlacementDayGalleryProps = {}) {
  const [selectedPhoto, setSelectedPhoto] = useState<CollagePhoto | null>(null);

  const photos: CollagePhoto[] = data?.items !== undefined
    ? (data.items || []).filter((it) => it && it.src).map((it, idx) => ({
        id: String(idx),
        src: it.src,
        alt: it.title || it.alt || `Placement Day Photo ${idx + 1}`
      }))
    : COLLAGE_PHOTOS;

  if (data && photos.length === 0) return null;

  return (
    <section id="gallery" className="scroll-mt-[190px] bg-[#F7F9FC] py-12 md:py-16 border-t border-[#E2E8F0] overflow-hidden">
      <div className="gu-container">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-4xl text-center md:mb-16">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-9 bg-[#E8871A]" />
            <span className="h-px w-9 bg-[#E8871A]" />
          </div>

          <h2 className="font-serif text-[38px] font-black leading-[1.08] tracking-[-1.5px] text-[#0A1F44] sm:text-[46px] md:text-[52px]">
            {data?.title ? (
              data.title
            ) : (
              <>
                Placement Day <span className="font-sans text-[#E8871A]">2025–26</span>
              </>
            )}
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-[16px] leading-[1.8] text-[#64748B] md:text-[17px]">
            {data?.subtitle ||
              "Placement Day at Geeta University marks the culmination of dedication, skill development, and industry readiness. Students step into the professional world with confidence, supported by strong industry connections and career guidance."}
          </p>
        </div>

        {/* Desktop Smooth Collage Layout (md & lg) */}
        {photos.length >= 7 ? (
          <div className="hidden md:block relative w-full max-w-6xl mx-auto min-h-[580px] lg:min-h-[660px] select-none py-4">
            {/* TOP IMAGE (Main Group Picture) */}
            <div
              onClick={() => setSelectedPhoto(photos[0])}
              className="group absolute top-0 left-[20%] z-10 w-[58%] max-w-[620px] cursor-pointer rounded-[22px] border-[5px] border-white bg-white p-1 shadow-lg transform-gpu transition-all duration-300 ease-out hover:z-50 hover:scale-[1.03] hover:shadow-2xl"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[16px]">
                <img
                  src={photos[0].src}
                  alt={photos[0].alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="absolute -top-3.5 right-8 z-20 h-7 w-16 rotate-12 rounded-xs bg-[#E8871A] shadow-md opacity-95 pointer-events-none" />
            </div>

            {/* CIRCLE IMAGE (Left Dignitary Speech) */}
            <div
              onClick={() => setSelectedPhoto(photos[1])}
              className="group absolute left-0 top-[18%] z-30 h-44 w-44 lg:h-52 lg:w-52 cursor-pointer rounded-full border-[6px] border-white bg-white shadow-xl transform-gpu transition-all duration-300 ease-out hover:z-50 hover:scale-110 hover:shadow-2xl"
            >
              <div className="h-full w-full overflow-hidden rounded-full">
                <img
                  src={photos[1].src}
                  alt={photos[1].alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* MID IMAGE (Panel Discussion) */}
            <div
              onClick={() => setSelectedPhoto(photos[2])}
              className="group absolute left-[23%] top-[28%] z-15 w-[34%] max-w-[360px] cursor-pointer rounded-[20px] border-[5px] border-white bg-white p-1 shadow-lg transform-gpu transition-all duration-300 ease-out hover:z-50 hover:scale-[1.04] hover:shadow-2xl"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px]">
                <img
                  src={photos[2].src}
                  alt={photos[2].alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* RIGHT IMAGE (Award Presentation) */}
            <div
              onClick={() => setSelectedPhoto(photos[3])}
              className="group absolute right-0 top-[14%] z-20 w-[30%] max-w-[320px] rotate-[3deg] cursor-pointer rounded-[20px] border-[5px] border-white bg-white p-1 shadow-xl transform-gpu transition-all duration-300 ease-out hover:z-50 hover:rotate-0 hover:scale-[1.04] hover:shadow-2xl"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[14px]">
                <img
                  src={photos[3].src}
                  alt={photos[3].alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* GROUP IMAGE (Bottom Left - Auditorium Audience) */}
            <div
              onClick={() => setSelectedPhoto(photos[4])}
              className="group absolute left-0 bottom-[0%] z-25 w-[42%] max-w-[450px] -rotate-[2deg] cursor-pointer rounded-[22px] border-[5px] border-white bg-white p-1 shadow-lg transform-gpu transition-all duration-300 ease-out hover:z-50 hover:rotate-0 hover:scale-[1.04] hover:shadow-2xl"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px]">
                <img
                  src={photos[4].src}
                  alt={photos[4].alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* PANEL IMAGE (Bottom Center - Star Stage Setup) */}
            <div
              onClick={() => setSelectedPhoto(photos[5])}
              className="group absolute left-[40%] bottom-[2%] z-20 w-[36%] max-w-[390px] rotate-[1deg] cursor-pointer rounded-[22px] border-[5px] border-white bg-white p-1 shadow-lg transform-gpu transition-all duration-300 ease-out hover:z-50 hover:rotate-0 hover:scale-[1.04] hover:shadow-2xl"
            >
              <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[16px]">
                <img
                  src={photos[5].src}
                  alt={photos[5].alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* STAR IMAGE (Bottom Right - Student Performance) */}
            <div
              onClick={() => setSelectedPhoto(photos[6])}
              className="group absolute right-0 bottom-[0%] z-30 w-[23%] max-w-[240px] rotate-[4deg] cursor-pointer rounded-[18px] border-[5px] border-white bg-white p-1 shadow-xl transform-gpu transition-all duration-300 ease-out hover:z-50 hover:rotate-0 hover:scale-108 hover:shadow-2xl"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[12px]">
                <img
                  src={photos[6].src}
                  alt={photos[6].alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto py-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative cursor-pointer overflow-hidden rounded-[20px] border-4 border-white bg-white p-1 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl aspect-[16/10]"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}

        {/* Mobile Gallery Layout (< md) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className={`group relative cursor-pointer overflow-hidden rounded-[20px] border-4 border-white bg-white p-1 shadow-md transition-all duration-300 hover:scale-102 hover:shadow-xl ${
                idx === 0 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
              }`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* Modal Lightbox */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="relative max-w-5xl w-full overflow-hidden rounded-[24px] bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
                aria-label="Close photo preview"
              >
                <X size={20} />
              </button>

              <div className="relative aspect-[16/10] w-full bg-black">
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
