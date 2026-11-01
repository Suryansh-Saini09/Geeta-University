"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Quote, X, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { ProgramPageData } from "@/data/programs/types";

interface DeanNoteCardProps {
  dean?: ProgramPageData["dean"];
  schoolName?: string;
}

export default function DeanNoteCard({ dean, schoolName }: DeanNoteCardProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setShowModal(false);
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [showModal]);

  if (!dean || !dean.name || !dean.message || (dean as any).isVisible === false) return null;

  const previewLength = 280;
  const isLongMessage = dean.message.length > previewLength;
  const previewText = isLongMessage
    ? `${dean.message.slice(0, previewLength).trim()}...`
    : dean.message;

  return (
    <>
      <div className="mt-8 sm:mt-10 overflow-hidden rounded-2xl border border-slate-200/90 bg-[#F8FAFC] p-5 sm:p-6 lg:p-7 shadow-[0_4px_20px_rgba(10,31,68,0.04)] transition-all duration-300 hover:border-[#E8871A]/50 hover:shadow-[0_12px_32px_rgba(10,31,68,0.08)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6 lg:gap-8">
          {/* Dean Photo */}
          {dean.image && (
            <div className="relative w-28 h-36 sm:w-36 sm:h-48 md:w-40 md:h-52 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-[#0A1F44] shadow-md">
              <Image
                src={dean.image}
                alt={dean.name}
                fill
                sizes="(max-width: 640px) 112px, 160px"
                className="object-cover object-top"
                style={{ objectPosition: "top center" }}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-serif text-[21px] sm:text-[23px] font-bold text-[#0A1F44] leading-snug">
                  {dean.name}
                </h4>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  {dean.designation}
                </p>
              </div>
              <Quote className="h-6 w-6 text-[#E8871A]/40 shrink-0" />
            </div>

            {/* Message preview */}
            <p className="mt-3 font-sans text-[14.5px] sm:text-[15px] leading-relaxed text-slate-600 line-clamp-3 sm:line-clamp-2 italic">
              &ldquo;{previewText}&rdquo;
            </p>

            {/* Action Bar */}
            <div className="mt-4 pt-3.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[12px] sm:text-[13px] font-medium text-slate-400">
                {dean.schoolName || "Academic Leadership Statement"}
              </span>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="group/btn inline-flex items-center gap-2.5 rounded-xl bg-[#0A1F44] px-4.5 py-2 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:bg-[#E8871A] hover:shadow-[0_4px_16px_rgba(232,135,26,0.3)] hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                style={{ color: "#ffffff" }}
              >
                <span className="text-white font-bold" style={{ color: "#ffffff" }}>Read More</span>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover/btn:translate-x-0.5">
                  <ArrowRight className="h-3 w-3 text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Message Modal Popup */}
      <AnimatePresence>
        {showModal && (
          <div
            className="fixed inset-0 z-[9999] overflow-y-auto overscroll-contain bg-black/70 backdrop-blur-sm p-4 sm:p-6 md:p-8 flex items-center justify-center"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl sm:max-w-4xl my-auto rounded-2xl bg-white p-5 sm:p-7 shadow-2xl border border-slate-200"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
                aria-label="Close message"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-start gap-4 sm:gap-6 mb-5 pr-10">
                {dean.image && (
                  <div className="relative w-20 h-26 sm:w-24 sm:h-32 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-[#0A1F44] shadow-md">
                    <Image
                      src={dean.image}
                      alt={dean.name}
                      fill
                      sizes="100px"
                      className="object-cover object-top"
                      style={{ objectPosition: "top center" }}
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0A1F44]">
                    {dean.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
                    {dean.designation}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-[#F8FAFC] p-4 sm:p-5 border border-slate-100 text-slate-700 font-sans text-[14.5px] sm:text-[15px] leading-relaxed italic">
                <Quote className="h-5 w-5 text-[#E8871A] mb-2" />
                <p className="whitespace-pre-line">&ldquo;{dean.message}&rdquo;</p>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl bg-[#0A1F44] px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#E8871A] cursor-pointer"
                  style={{ color: "#ffffff" }}
                >
                  <span className="text-white" style={{ color: "#ffffff" }}>Close Message</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
