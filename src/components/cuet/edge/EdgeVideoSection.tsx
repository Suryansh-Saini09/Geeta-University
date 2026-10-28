"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Sparkles } from "lucide-react";
import type { EdgeVideoSection as EdgeVideoSectionType } from "@/data/edge/types";

interface EdgeVideoSectionProps {
  section: EdgeVideoSectionType;
}

export default function EdgeVideoSection({ section }: EdgeVideoSectionProps) {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const videos = section.playlist || (section.featuredVideo ? [section.featuredVideo] : []);

  return (
    <section className="bg-slate-900 py-12 md:py-16 relative text-white overflow-hidden border-t border-slate-800">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A1F44] via-slate-900 to-slate-950" />
      <div className="absolute -left-20 top-20 w-80 h-80 bg-[#E8871A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="gu-container relative z-10">
        
        {/* Section Header */}
        {(section.eyebrow || section.title || section.subtitle) && (
          <div className="mx-auto mb-16 max-w-3xl text-center">
            {section.eyebrow && (
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#E8871A]/15 px-4 py-1 border border-[#E8871A]/30">
                <Sparkles size={14} className="text-[#E8871A]" />
                <span className="text-xs font-bold uppercase tracking-[2px] text-[#E8871A]">
                  {section.eyebrow}
                </span>
              </div>
            )}
            {section.title && (
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                {section.title}
              </h2>
            )}
            {section.subtitle && (
              <p className="mt-3 text-base md:text-lg text-slate-300 font-medium">
                {section.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Video Cards Grid */}
        <div className={`grid grid-cols-1 ${videos.length > 1 ? (videos.length === 2 ? "md:grid-cols-2 max-w-4xl mx-auto" : "md:grid-cols-3") : "max-w-3xl mx-auto"} gap-8`}>
          {videos.map((vid, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group flex flex-col rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-lg hover:border-[#E8871A]/50 transition-all hover:bg-white/10"
              >
                {/* Thumbnail with Play Button */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
                  <img
                  src={vid.thumbnail}
                    alt={vid.title || "Video thumbnail"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                  {vid.tag && (
                  <span className="absolute top-3 left-3 rounded-full bg-[#E8871A] px-3 py-1 text-xs font-bold text-white shadow-md">
                      {vid.tag}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveVideoUrl(vid.videoUrl)}
                    aria-label={`Play ${vid.title || "video"}`}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white text-[#0A1F44] flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#E8871A] group-hover:text-white"
                  >
                  <Play size={22} className="fill-current ml-0.5" />
                  </button>
                </div>

              {/* Video Info */}
              {(vid.title || vid.description) && (
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {vid.title && (
                      <h3 className="font-serif text-xl font-bold text-white leading-snug">
                        {vid.title}
                      </h3>
                    )}
                    {vid.description && (
                      <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {vid.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
              </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideoUrl && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideoUrl(null)}
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
                  onClick={() => setActiveVideoUrl(null)}
                  className="rounded-full p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="relative aspect-video w-full">
                <iframe
                  src={activeVideoUrl}
                  title="Video Player"
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
  );
}
