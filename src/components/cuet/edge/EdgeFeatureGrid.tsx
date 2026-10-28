"use client";

import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import type { EdgeFeatureGridSection } from "@/data/edge/types";

interface EdgeFeatureGridProps {
  section: EdgeFeatureGridSection;
}

export default function EdgeFeatureGrid({ section }: EdgeFeatureGridProps) {
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[iconName];
    return IconComponent ? <IconComponent size={24} className="text-[#E8871A]" /> : null;
  };

  const getColClass = (cols?: number) => {
    switch (cols) {
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
      case 5:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  return (
    <section id={section.id} className="bg-white py-12 md:py-16 relative overflow-hidden border-t border-slate-200">
      <div className="gu-container">

        {/* Header */}
        {(section.eyebrow || section.title || section.subtitle || section.description) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {section.eyebrow && (
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#E8871A]/10 px-4 py-1 border border-[#E8871A]/20">
                <Sparkles size={14} className="text-[#E8871A]" />
                <span className="text-xs font-bold uppercase tracking-[2px] text-[#E8871A]">
                  {section.eyebrow}
                </span>
              </div>
            )}
            {section.title && (
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0A1F44]">
                {section.title}
              </h2>
            )}
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
        )}

        {/* Layout: Numbered (NEP 10 Advantages) */}
        {section.layoutStyle === "numbered" && (
          <div className={`grid ${getColClass(section.columns || 4)} gap-6`}>
            {section.features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (idx % 4) * 0.08 }}
                className="flex flex-col rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group hover:border-[#E8871A]/40"
              >
                {/* Feature Image */}
                {feature.image && (
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-200">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Number + Title */}
                    <div className="flex items-center gap-3 mb-3">
                      {feature.number && (
                        <span className="font-serif text-2xl font-black text-[#E8871A]">
                          {feature.number}
                        </span>
                      )}
                      <h3 className="font-serif text-lg font-bold text-[#0A1F44] leading-snug uppercase">
                        {feature.title}
                      </h3>
                    </div>

                    {feature.description && (
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        {feature.description}
                      </p>
                    )}

                    {feature.bullets && feature.bullets.length > 0 && (
                      <ul className="space-y-2 pt-2 border-t border-slate-200/60">
                        {feature.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                            <CheckCircle2 size={14} className="text-[#E8871A] shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Layout: Cards (Vocational Courses, GTH Offerings, DYOD Pillars) */}
        {section.layoutStyle === "cards" && (
          <div className={`grid ${getColClass(section.columns || 3)} gap-6 md:gap-8`}>
            {section.features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative flex flex-col justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8 shadow-sm transition-all duration-300 hover:border-[#E8871A]/50 hover:bg-white hover:shadow-md"
              >
                {/* Top Accent Strip */}
                <div className="absolute left-0 right-0 top-0 h-1 bg-[#0A1F44] transition-colors duration-300 group-hover:bg-[#E8871A]" />

                {/* Image or Icon */}
                {(feature.image || feature.iconName || feature.tag) && (
                  <div className="mb-5 flex items-center justify-between gap-4">
                    {feature.image ? (
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
                        <img src={feature.image} alt={feature.title} className="h-full w-full object-contain" />
                      </div>
                    ) : feature.iconName ? (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#E8871A]">
                        {getIcon(feature.iconName)}
                      </div>
                    ) : null}

                    {feature.tag && (
                      <span className="rounded-full border border-[#E8871A]/20 bg-[#E8871A]/10 px-3 py-1 text-xs font-bold text-[#E8871A]">
                        {feature.tag}
                      </span>
                    )}
                  </div>
                )}

                <h3 className="font-serif text-xl font-bold text-[#0A1F44] transition-colors duration-300 group-hover:text-[#E8871A] sm:text-2xl">
                  {feature.title}
                </h3>

                {feature.subtitle && (
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#06355F]">
                    {feature.subtitle}
                  </p>
                )}

                {feature.description && (
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                )}

                {feature.bullets && feature.bullets.length > 0 && (
                  <ul className="mt-6 flex-1 space-y-2.5 border-t border-slate-200 pt-6">
                    {feature.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#E8871A]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Layout: Split (Side by side two columns) */}
        {section.layoutStyle === "split" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {section.features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col"
              >
                {/* Heading ALWAYS on top */}
                <div className="flex items-center gap-3 mb-4">
                  {feature.iconName && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-[#E8871A]">
                      {getIcon(feature.iconName)}
                    </div>
                  )}
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1F44]">
                    {feature.title}
                  </h3>
                </div>

                {feature.subtitle && (
                  <p className="text-xs font-bold uppercase tracking-wider text-[#06355F] mb-3">
                    {feature.subtitle}
                  </p>
                )}

                {feature.description && (
                  <p className="text-sm md:text-base leading-relaxed text-slate-600 mb-4">
                    {feature.description}
                  </p>
                )}

                {/* Image placed BELOW the heading */}
                {feature.image && (
                  <div className="my-2 overflow-hidden rounded-xl">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-auto object-contain max-h-[420px] block"
                    />
                  </div>
                )}

                {/* Bullets */}
                {feature.bullets && feature.bullets.length > 0 && (
                  <ul className="space-y-3 pt-2 flex-1">
                    {feature.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                        <CheckCircle2 size={18} className="text-[#E8871A] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
