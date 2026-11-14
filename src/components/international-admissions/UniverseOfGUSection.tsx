"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { UNIVERSE_OF_GU } from "@/data/internationalAdmissions";

export interface UniverseOfGUSectionProps {
  data?: {
    title?: string;
    subheading?: string;
    description?: string;
    mouHeading?: string;
    mouIntro?: string;
    mouClosing?: string;
    mous?: Array<{
      country: string;
      institution: string;
      description: string;
    }>;
  };
}

export default function UniverseOfGUSection({ data }: UniverseOfGUSectionProps = {}) {
  const content = {
    title: data?.title || UNIVERSE_OF_GU.title,
    subheading: data?.subheading || UNIVERSE_OF_GU.subheading,
    description: data?.description || UNIVERSE_OF_GU.description,
    mouHeading: data?.mouHeading || UNIVERSE_OF_GU.mouHeading,
    mouIntro: data?.mouIntro || UNIVERSE_OF_GU.mouIntro,
    mouClosing: data?.mouClosing || UNIVERSE_OF_GU.mouClosing,
    mous: data?.mous && data.mous.length > 0 ? data.mous : UNIVERSE_OF_GU.mous,
  };

  return (
    <section id="universe-of-gu" className="scroll-mt-24 py-10 md:py-14 bg-[#F7F9FC]">
      <div className="gu-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0A1F44] tracking-tight font-serif">
            {content.title}
          </h2>

          <div className="mt-4 p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
            <h3 className="text-lg font-bold text-[#0A1F44]">
              {content.subheading}
            </h3>
            <p className="text-sm text-[#475569] mt-1.5 leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* MOUs Header & List */}
          <div className="mt-10">
            <h3 className="text-2xl font-extrabold text-[#0A1F44] font-serif mb-4">
              {content.mouHeading}
            </h3>
            <p className="text-[#475569] text-base leading-relaxed mb-6">
              {content.mouIntro}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.mous.map((mou: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#E8871A]/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#E8871A] flex items-center gap-1">
                        <MapPin size={12} /> {mou.country}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-[#0A1F44] text-base">
                      {mou.institution}
                    </h4>
                    <p className="text-xs text-[#64748B] mt-2 leading-normal">
                      {mou.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm text-[#475569] font-medium bg-orange-50/80 p-4 rounded-xl border border-orange-200 text-[#0A1F44]">
              {content.mouClosing}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
