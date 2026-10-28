"use client";

import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { EdgeStatsSection } from "@/data/edge/types";

interface EdgeStatsProps {
  section: EdgeStatsSection;
}

export default function EdgeStats({ section }: EdgeStatsProps) {
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[iconName];
    return IconComponent ? <IconComponent size={24} className="text-[#E8871A]" /> : null;
  };

  return (
    <section className="bg-[#0A1F44] py-16 md:py-20 text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#06355F] to-[#0A1F44] opacity-80" />
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#E8871A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="gu-container relative z-10">
        {(section.title || section.subtitle) && (
          <div className="mx-auto mb-14 max-w-3xl text-center">
            {section.title && (
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
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

        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${Math.min(section.stats.length, 6)} gap-6 md:gap-8`}>
          {section.stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group relative rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-[#E8871A]/40"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#E8871A] tracking-tight">
                  {stat.value}
                </span>
                {stat.iconName && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    {getIcon(stat.iconName)}
                  </div>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {stat.label}
              </h3>

              {stat.sublabel && (
                <p className="mt-1 text-xs sm:text-sm text-slate-400 font-medium">
                  {stat.sublabel}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
