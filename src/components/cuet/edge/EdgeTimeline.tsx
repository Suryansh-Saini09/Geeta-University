"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle, Sparkles, BookOpen } from "lucide-react";
import type { EdgeTimelineSection } from "@/data/edge/types";

interface EdgeTimelineProps {
  section: EdgeTimelineSection;
}

export default function EdgeTimeline({ section }: EdgeTimelineProps) {
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  return (
    <section className="relative bg-slate-50 py-12 md:py-16 border-y border-slate-200/80 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#06355F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E8871A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="gu-container relative z-10">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          {section.eyebrow && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#E8871A]/10 px-4 py-1.5 border border-[#E8871A]/20">
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
            <p className="mt-4 text-base md:text-lg text-slate-600 font-medium">
              {section.subtitle}
            </p>
          )}

          {section.description && (
            <p className="mt-3 text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
              {section.description}
            </p>
          )}
        </div>

        {/* Steps Grid / Timeline */}
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {section.steps.map((step, idx) => {
            const isExpanded = !!expandedSteps[step.stepNumber];

            return (
              <motion.div
                key={step.stepNumber}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="relative rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-slate-300"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    {/* Step Badge */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#06355F] text-white font-serif font-black text-lg shadow-md shadow-[#06355F]/20">
                      {String(step.stepNumber).padStart(2, "0")}
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#E8871A]">
                        Step {step.stepNumber}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0A1F44]">
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  {/* Read More / Read Less Toggle button */}
                  {(step.expandedDetails || (step.points && step.points.length > 0)) && (
                    <button
                      type="button"
                      onClick={() => toggleStep(step.stepNumber)}
                      className="self-start sm:self-center inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-[#06355F] transition-colors hover:bg-slate-100 hover:text-[#E8871A]"
                    >
                      <span>{isExpanded ? "Read Less" : "Read More"}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  )}
                </div>

                {/* Primary Description */}
                <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-700">
                  {step.description}
                </p>

                {/* Collapsible content (Points & Expanded Details) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
                        {step.points && step.points.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {step.points.map((pt, pIdx) => (
                              <div key={pIdx} className="flex items-start gap-2.5">
                                <CheckCircle size={16} className="text-[#E8871A] shrink-0 mt-0.5" />
                                <span className="text-xs sm:text-sm font-medium text-slate-700">
                                  {pt}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {step.expandedDetails && (
                          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs sm:text-sm leading-relaxed text-slate-600">
                            {Array.isArray(step.expandedDetails) ? (
                              step.expandedDetails.map((detail, dIdx) => (
                                <p key={dIdx} className="mb-2 last:mb-0">
                                  {detail}
                                </p>
                              ))
                            ) : (
                              <p>{step.expandedDetails}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
