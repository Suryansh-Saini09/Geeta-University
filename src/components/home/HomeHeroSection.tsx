"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

/* =========================================================
   HERO BACKGROUND DRONE SHOTS
========================================================= */
const HERO_DRONE_SHOTS = [
  "/videos/hero_drone_shot1.webm",
  "/videos/hero_drone_shot2.webm",
];

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
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
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1], // Cinematic ease-out
    },
  },
};

interface HomeHeroSectionProps {
  data?: {
    headline?: string;
    highlightedHeadline?: string;
    description?: string;
    applyPillBadge?: string;
    applyPillText?: string;
    applyPillUrl?: string;
    primaryCtaLabel?: string;
    primaryCtaUrl?: string;
    secondaryCtaLabel?: string;
    secondaryCtaUrl?: string;
    posterImage?: string;
    heroDroneShots?: string[];
  } | null;
}

export default function HomeHeroSection({ data }: HomeHeroSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [nextVideoPreload, setNextVideoPreload] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const droneShots = data?.heroDroneShots?.length ? data.heroDroneShots : HERO_DRONE_SHOTS;
  const poster = data?.posterImage || "/about/campus.webp";
  const headline = data?.headline || "Empowering Minds.";
  const highlightedHeadline = data?.highlightedHeadline || "Transforming Futures.";
  const description = data?.description || "Join a premier academic ecosystem designed to ignite innovation, foster global leadership, and drive impactful careers. Your legacy begins at Geeta University.";
  const applyBadge = data?.applyPillBadge || "Apply Now";
  const applyText = data?.applyPillText || "Admissions Open";
  const applyUrl = data?.applyPillUrl || "https://admissions.geetauniversity.edu.in/";
  const primaryLabel = data?.primaryCtaLabel || "About University";
  const primaryUrl = data?.primaryCtaUrl === "/about" ? "/about-us" : (data?.primaryCtaUrl || "/about-us");
  const secondaryLabel = data?.secondaryCtaLabel || "Campus Tour";
  const secondaryUrl = data?.secondaryCtaUrl || "https://www.youtube.com/embed/arnFS6rf454";

  // Autoplay active video safely
  useEffect(() => {
    const currentVideo = videoRefs.current[activeVideoIndex];
    if (currentVideo) {
      currentVideo.play().catch(() => {
        // Fallback gracefully if browser restricts autoplay
      });
    }
  }, [activeVideoIndex]);

  // Intelligent preloading & seamless crossfade transition
  const handleTimeUpdate = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    // Preload next video metadata/stream when 3.5s remaining
    if (video.duration && video.duration - video.currentTime <= 3.5 && !nextVideoPreload) {
      setNextVideoPreload(true);
      const nextIndex = (index + 1) % HERO_DRONE_SHOTS.length;
      const nextVideo = videoRefs.current[nextIndex];
      if (nextVideo && nextVideo.readyState < 2) {
        nextVideo.load();
      }
    }

    // Trigger crossfade transition 1.0s before current video ends
    if (video.duration && video.duration - video.currentTime <= 1.0) {
      if (index === activeVideoIndex) {
        const nextIndex = (index + 1) % HERO_DRONE_SHOTS.length;
        const nextVideo = videoRefs.current[nextIndex];
        if (nextVideo && nextVideo.paused) {
          nextVideo.currentTime = 0;
          nextVideo.play().catch(() => { });
          setActiveVideoIndex(nextIndex);
          setNextVideoPreload(false);
        }
      }
    }
  };

  const handleVideoEnded = (index: number) => {
    if (index === activeVideoIndex) {
      const nextIndex = (index + 1) % HERO_DRONE_SHOTS.length;
      const nextVideo = videoRefs.current[nextIndex];
      if (nextVideo) {
        nextVideo.currentTime = 0;
        nextVideo.play().catch(() => { });
      }
      setActiveVideoIndex(nextIndex);
      setNextVideoPreload(false);
    }
  };

  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-[#0A1F44]">
      {/* =====================================================
          CINEMATIC BACKGROUND VIDEO ARCHITECTURE (DUAL LOOP)
      ===================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Poster Fallback Image */}
        <Image
          src={poster}
          alt="Geeta University Campus Aerial View"
          fill
          priority
          className="object-cover object-[70%_center] md:object-center"
          sizes="100vw"
        />

        {/* Dual Seamless Crossfading Drone Videos */}
        {droneShots.map((src, index) => (
          <video
            key={src}
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
            autoPlay={index === 0}
            muted
            playsInline
            preload={index === 0 || nextVideoPreload ? "auto" : "metadata"}
            poster={poster}
            onTimeUpdate={() => handleTimeUpdate(index)}
            onEnded={() => handleVideoEnded(index)}
            className={`absolute inset-0 h-full w-full object-cover object-[70%_center] md:object-center scale-[1.02] transition-opacity duration-1000 ease-in-out ${index === activeVideoIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
          >
            <source src={src} type="video/webm" />
          </video>
        ))}

        {/* =====================================================
            CINEMATIC LAYERED GRADIENT GRADING (ART-DIRECTED)
        ===================================================== */}
        {/* Layer 1: Left-to-right dark navy gradient protecting text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44] via-[#0A1F44]/80 via-45% sm:via-40% to-transparent pointer-events-none z-15" />

        {/* Layer 2: Extra left-edge anchor shadow for crisp contrast */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-1/2 bg-gradient-to-r from-[#0A1F44]/90 via-[#0A1F44]/60 to-transparent pointer-events-none z-15" />

        {/* Layer 3: Bottom gradient fading into page body */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44] via-[#0A1F44]/30 via-25% to-transparent pointer-events-none z-15" />

        {/* Layer 4: Global restrained dark tint */}
        <div className="absolute inset-0 bg-[#0A1F44]/20 pointer-events-none z-15" />

        {/* Subtle Saffron Ambient Accent Glow (Distant Edge) */}
        <div className="absolute -top-32 right-10 h-96 w-96 rounded-full bg-[#E8871A] opacity-15 blur-[120px] pointer-events-none z-15" />
      </div>

      {/* =====================================================
          MAIN HERO CONTENT (LEFT-ALIGNED ADMISSIONS HIERARCHY)
      ===================================================== */}
      <div className="gu-container relative z-20 flex w-full flex-1 flex-col justify-center pb-16 pt-28 sm:pt-36 lg:pt-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl sm:max-w-3xl"
        >
          {/* 1. ADMISSIONS PILL STATUS */}
          <motion.div variants={itemVariants} className="mb-6">
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 p-1 pr-4 sm:pr-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-[#E8871A] hover:bg-white/20 active:translate-y-0"
            >
              {/* Badge */}
              <span className="flex items-center gap-2 rounded-full bg-[#E8871A] px-3 py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                <span>{applyBadge}</span>
              </span>

              {/* Status Text */}
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-white transition-colors group-hover:text-amber-100">
                {applyText}
              </span>

              {/* Arrow Indicator */}
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white transition-all duration-300 group-hover:bg-[#E8871A]">
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </a>
          </motion.div>

          {/* 2. MAIN HEADLINE */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold leading-[1.08] tracking-tight drop-shadow-[0_4px_16px_rgba(10,31,68,0.7)]"
          >
            <span className="text-white block">{headline}</span>
            <span className="text-[#E8871A] block mt-1">{highlightedHeadline}</span>
          </motion.h1>

          {/* 3. SUPPORTING DESCRIPTION */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-200 font-sans drop-shadow-[0_2px_8px_rgba(10,31,68,0.6)]"
          >
            {description}
          </motion.p>

          {/* 4. PRIMARY + SECONDARY CTA BUTTONS */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <Link
              href={primaryUrl}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#E8871A] px-8 py-4 text-xs font-bold uppercase tracking-[1.5px] text-[#0A1F44] shadow-lg shadow-[#E8871A]/25 transition-all duration-300 hover:bg-amber-500 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{primaryLabel}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-xs font-bold uppercase tracking-[1.5px] text-white backdrop-blur-md transition-all duration-300 hover:border-white/60 hover:bg-white/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#0A1F44] transition-colors group-hover:bg-[#E8871A] group-hover:text-white">
                <Play className="h-2.5 w-2.5 ml-0.5 fill-current" />
              </span>
              <span>{secondaryLabel}</span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* =====================================================
          YOUTUBE VIDEO MODAL (CAMPUS TOUR)
      ===================================================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
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
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close virtual campus tour"
                className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white backdrop-blur-md transition hover:bg-black/80"
              >
                &times;
              </button>

              {/* Video Iframe */}
              <div className="aspect-video w-full">
                <iframe
                  title="Geeta University Virtual Campus Tour"
                  src={secondaryUrl.includes("youtube") ? secondaryUrl : "https://www.youtube.com/embed/arnFS6rf454?autoplay=1"}
                  className="h-full w-full border-0"
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
