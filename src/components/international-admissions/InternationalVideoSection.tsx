"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Play } from "lucide-react";
import { INTERNATIONAL_VIDEOS } from "@/data/internationalAdmissions";

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

export interface InternationalVideoSectionProps {
  data?: {
    showcaseVideos?: Array<{
      id: string;
      title: string;
      thumbnail?: string;
    }>;
    virtualTourVideoId?: string;
  };
}

export default function InternationalVideoSection({ data }: InternationalVideoSectionProps = {}) {
  const showcaseVideos = data?.showcaseVideos && data.showcaseVideos.length > 0 ? data.showcaseVideos : INTERNATIONAL_VIDEOS.showcaseVideos;
  const tourVideoId = data?.virtualTourVideoId || INTERNATIONAL_VIDEOS.virtualTourVideoId;
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isTourOpen, setIsTourOpen] = useState(false);

  return (
    <section className="py-10 md:py-14 bg-white border-t border-[#E2E8F0]">
      <div className="gu-container">
        {/* Video Frames Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {showcaseVideos.map((video: any, idx: number) => (
            <div
              key={idx}
              className="rounded-2xl overflow-hidden bg-[#0A1F44] border border-[#E2E8F0] shadow-md transition-transform duration-300 hover:-translate-y-1 group"
            >
              <div className="relative aspect-video w-full bg-slate-900">
                {playingVideoId === video.id ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <button
                    onClick={() => setPlayingVideoId(video.id)}
                    className="relative w-full h-full block text-left cursor-pointer focus:outline-none"
                    aria-label={`Play ${video.title}`}
                  >
                    {/* YouTube Thumbnail - hqdefault is 100% reliable for all YT videos */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-colors group-hover:bg-black/20">
                      <div className="h-16 w-16 rounded-full bg-[#E8871A] text-white flex items-center justify-center shadow-xl transition-transform group-hover:scale-110">
                        <Play size={28} className="ml-1 fill-current" />
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Virtual Campus Tour Hero Banner */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="relative min-h-[400px] sm:min-h-[480px] lg:min-h-[520px] overflow-hidden rounded-[28px]"
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
          <div className="relative z-10 flex min-h-[400px] sm:min-h-[480px] lg:min-h-[520px] items-center px-7 py-10 sm:px-12 lg:px-20">
            <div className="max-w-2xl">
              <motion.h2
                variants={itemVariants}
                className="font-serif text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
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
                onClick={() => setIsTourOpen(true)}
                aria-label="Play Geeta University virtual campus tour"
                className="group mt-7 flex items-center gap-4 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 cursor-pointer"
              >
                <span className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center transition-transform duration-300 group-hover:scale-110">
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
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isTourOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsTourOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Geeta University Virtual Campus Tour"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Close */}
              <button
                type="button"
                onClick={() => setIsTourOpen(false)}
                aria-label="Close virtual campus tour"
                className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white backdrop-blur-md transition hover:bg-black/80 cursor-pointer"
              >
                ×
              </button>

              {/* Video */}
              <div className="aspect-video w-full">
                <iframe
                  title="Geeta University Virtual Campus Tour"
                  src={`https://www.youtube.com/embed/${tourVideoId}?autoplay=1`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
