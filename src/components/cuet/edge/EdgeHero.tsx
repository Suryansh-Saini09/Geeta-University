"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Check, ArrowRight, Sparkles } from "lucide-react";
import type { EdgeHero } from "@/data/edge/types";
import LawTechCircle from "./LawTechCircle";

interface EdgeHeroProps {
  hero: EdgeHero;
}

export default function EdgeHero({ hero }: EdgeHeroProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const isDark = hero.theme === "dark" || hero.graphicType === "tech-circle";

  return (
    <>
      {/* 1. Full-Width Top Banner (Only if image provided — 100% whole image visible, no height cutoffs) */}
      {hero.image && (
        <div className="w-full bg-slate-900 border-b border-slate-200">
          <img
            src={hero.image}
            alt={hero.title}
            className="w-full h-auto block"
          />
        </div>
      )}

      {/* 2. Hero Content Section */}
      <section
        className={`relative py-12 md:py-16 lg:py-20 border-b border-slate-200 overflow-hidden ${
          isDark
            ? "bg-[#061A40] text-white border-slate-800"
            : "bg-white text-[#0A1F44]"
        }`}
      >
        {/* Background Gradients */}
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#04122C] via-[#061A40] to-[#082352] opacity-95" />
            <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#00d4ff]/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-40 -bottom-40 h-96 w-96 rounded-full bg-[#E8871A]/10 blur-3xl pointer-events-none" />
          </>
        ) : (
          <>
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#06355F]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E8871A]/5 rounded-full blur-3xl pointer-events-none" />
          </>
        )}

        <div className="gu-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content Column */}
            <div
              className={`${
                hero.graphicType === "tech-circle" || hero.videoThumb || hero.videoUrl
                  ? "lg:col-span-6 xl:col-span-7"
                  : "lg:col-span-12 max-w-4xl"
              }`}
            >
              {/* Eyebrow badge */}
              {hero.eyebrow && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 border ${
                    isDark
                      ? "border-[#00d4ff]/40 bg-[#00d4ff]/10 text-[#00d4ff]"
                      : "border-[#E8871A]/30 bg-[#E8871A]/10 text-[#E8871A]"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-[2px]">
                    {hero.eyebrow}
                  </span>
                </motion.div>
              )}

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.18] tracking-tight ${
                  isDark ? "text-white" : "text-[#0A1F44]"
                }`}
              >
                {hero.title}
              </motion.h1>

              {/* Subtitle */}
              {hero.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className={`mt-3 text-base md:text-lg font-bold ${
                    isDark ? "text-[#00d4ff]" : "text-[#E8871A]"
                  }`}
                >
                  {hero.subtitle}
                </motion.p>
              )}

              {/* Description */}
              {hero.description && (
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`mt-5 text-sm md:text-base leading-relaxed text-justify ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {hero.description}
                </motion.p>
              )}

              {/* Badges / Checklist */}
              {hero.badges && hero.badges.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mt-6 flex flex-col gap-2.5"
                >
                  {hero.badges.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${
                          isDark ? "bg-[#00d4ff] text-[#04122C]" : "bg-[#E8871A] text-white"
                        }`}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span
                        className={`text-sm md:text-base font-semibold ${
                          isDark ? "text-slate-100" : "text-[#0A1F44]"
                        }`}
                      >
                        {b}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                {hero.ctaText && (
                  <Link
                    href={hero.ctaLink || "https://admissions.geetauniversity.edu.in/"}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-7 py-3.5 text-sm md:text-base font-bold text-white shadow-lg shadow-[#E8871A]/25 transition-all hover:bg-[#c9710f] hover:shadow-xl hover:translate-y-[-1px]"
                  >
                    <span>{hero.ctaText}</span>
                    <ArrowRight size={16} />
                  </Link>
                )}

                {/* {hero.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setIsVideoOpen(true)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm md:text-base font-bold transition-all ${
                      isDark
                        ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                        : "border-slate-300 bg-slate-50 text-[#06355F] hover:bg-slate-100 hover:border-slate-400"
                    }`}
                  >
                    <Play size={16} className="text-[#E8871A] fill-[#E8871A]" />
                    <span>Watch Video</span>
                  </button>
                )} */}
              </motion.div>
            </div>

            {/* Right Column: Law Tech Circle OR Video Thumbnail */}
            {hero.graphicType === "tech-circle" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-6 xl:col-span-5 flex justify-center"
              >
                <LawTechCircle />
              </motion.div>
            ) : (hero.videoThumb || hero.videoUrl) ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-6 xl:col-span-5 flex justify-center"
              >
                <div className="relative group w-full max-w-lg aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 ring-1 ring-slate-200">
                  <img
                    src={
                      hero.videoUrl && hero.videoUrl.includes("youtube")
                        ? `https://img.youtube.com/vi/${hero.videoUrl.match(/(?:embed\/|v\/|watch\?v=|youtu\.be\/|\?v=)([^#&?]*)/)?.[1] || ""}/hqdefault.jpg`
                        : (hero.videoThumb || "/edge/nep/maxresdefault.jpg")
                    }
                    alt={hero.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-black/10 to-transparent group-hover:from-slate-950/40 transition-all duration-300" />
                  
                  {/* Play Button Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsVideoOpen(true)}
                    aria-label="Play video"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 md:h-18 md:w-18 rounded-full bg-[#E8871A] text-white flex items-center justify-center shadow-2xl shadow-[#E8871A]/40 ring-4 ring-white/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#ff951e] group-hover:ring-white/60"
                  >
                    <Play size={26} className="fill-current ml-1" />
                  </button>
                </div>
              </motion.div>
            ) : null}

          </div>
        </div>

        {/* Video Modal */}
        <AnimatePresence>
          {isVideoOpen && hero.videoUrl && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsVideoOpen(false)}
                className="fixed inset-0 bg-black/85 backdrop-blur-md"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="relative z-10 w-full max-w-4xl rounded-2xl overflow-hidden bg-black border border-white/20 shadow-2xl"
              >
                <div className="flex justify-end p-2 bg-slate-950">
                  <button
                    type="button"
                    onClick={() => setIsVideoOpen(false)}
                    className="rounded-full p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
                    aria-label="Close modal"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="relative aspect-video w-full">
                  <iframe
                    src={hero.videoUrl}
                    title={hero.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
