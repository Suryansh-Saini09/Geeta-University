"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Sparkles, CheckCircle2, Clock, Award } from "lucide-react";
import type { EdgeAccordionSection } from "@/data/edge/types";

interface EdgeAccordionProps {
  section: EdgeAccordionSection;
}

export default function EdgeAccordion({ section }: EdgeAccordionProps) {
  const [openItemId, setOpenItemId] = useState<string | null>(section.items[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenItemId((prev) => (prev === id ? null : id));
  };

  return (
    <section id={section.id} className="bg-slate-50 py-12 md:py-16 relative overflow-hidden border-t border-slate-200">
      <div className="gu-container max-w-5xl">
        
        {/* Section Header */}
        <div className="mx-auto mb-16 text-center">
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

        {/* Accordion List */}
        <div className="space-y-4">
          {section.items.map((item, idx) => {
            const isOpen = openItemId === item.id;

            return (
              <div
                key={item.id || idx}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm transition-all hover:border-slate-300"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`w-full flex items-center justify-between gap-4 p-6 sm:p-7 text-left transition-colors ${
                    isOpen ? "bg-slate-50/80" : "hover:bg-slate-50/40"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold transition-colors ${
                      isOpen ? "bg-[#06355F] text-white" : "bg-slate-100 text-[#06355F]"
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0A1F44]">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="text-xs sm:text-sm font-semibold text-[#E8871A] mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isOpen ? "border-[#E8871A] bg-[#E8871A] text-white" : "border-slate-200 text-slate-500"
                  }`}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>

                {/* Accordion Body */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 sm:p-7 pt-2 border-t border-slate-100 space-y-5">
                        
                        {/* Meta chips (Duration, Eligibility) */}
                        <div className="flex flex-wrap items-center gap-4">
                          {item.duration && (
                            <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#06355F]">
                              <Clock size={14} className="text-[#E8871A]" />
                              <span>Duration: {item.duration}</span>
                            </div>
                          )}
                        </div>

                        {item.description && (
                          <p className="text-sm md:text-base leading-relaxed text-slate-700">
                            {item.description}
                          </p>
                        )}

                        {item.eligibility && (
                          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                              Eligibility Criteria
                            </h4>
                            <p className="text-sm text-slate-700 font-medium">
                              {item.eligibility}
                            </p>
                          </div>
                        )}

                        {item.curriculum && item.curriculum.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                              Key Specializations / Focus Domains
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {item.curriculum.map((c, cIdx) => (
                                <div key={cIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                                  <CheckCircle2 size={15} className="text-[#E8871A] shrink-0 mt-0.5" />
                                  <span>{c}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
