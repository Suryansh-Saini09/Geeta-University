"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Sparkles,
  Target,
  Compass,
  Award,
  Mic,
  FileCheck,
  type LucideIcon,
} from "lucide-react";
import type { EdgeTrainingModelSection } from "@/data/edge/types";

interface EdgeTrainingModelProps {
  section: EdgeTrainingModelSection;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Mic,
  FileCheck,
  Award,
  Compass,
  Target,
  Sparkles,
};

export default function EdgeTrainingModel({ section }: EdgeTrainingModelProps) {
  const getStageIcon = (stageNumber: number, iconName?: string) => {
    if (iconName && ICON_MAP[iconName]) {
      const IconComp = ICON_MAP[iconName];
      return <IconComp size={24} className="text-[#E8871A]" />;
    }
    switch (stageNumber) {
      case 1:
        return <Compass size={24} className="text-[#E8871A]" />;
      case 2:
        return <Target size={24} className="text-[#E8871A]" />;
      case 3:
        return <Award size={24} className="text-[#E8871A]" />;
      default:
        return <Sparkles size={24} className="text-[#E8871A]" />;
    }
  };

  return (
    <section className="bg-slate-50 py-12 md:py-16 relative overflow-hidden border-y border-slate-200">
      <div className="gu-container">
        
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
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
        </div>

        {/* 3 Stages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {section.stages.map((stage, idx) => {
            const items =
              stage.focusAreas && stage.focusAreas.length > 0
                ? stage.focusAreas
                : stage.modules && stage.modules.length > 0
                ? stage.modules
                : [];

            return (
              <motion.div
                key={stage.stageNumber || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative flex flex-col rounded-2xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all hover:border-[#E8871A]/40 group"
              >
                {/* Stage Badge & Icon */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-[#E8871A]/10 transition-colors">
                    {getStageIcon(stage.stageNumber, stage.iconName)}
                  </div>
                  <span className="font-serif text-2xl font-black text-[#06355F]">
                    Stage {String(stage.stageNumber || idx + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                  {stage.title}
                </h3>
                {stage.subtitle && (
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#E8871A]">
                    {stage.subtitle}
                  </p>
                )}

                {/* Description */}
                {stage.description ? (
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {stage.description}
                  </p>
                ) : null}

                {/* Modules / Focus Areas list */}
                {items.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-100 space-y-2.5 flex-1">
                    {items.map((mod, mIdx) => (
                      <div key={mIdx} className="flex items-start gap-2">
                        <CheckCircle size={15} className="text-[#E8871A] shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                          {mod}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
