"use client";

import React from "react";
import { legacyEcosystemData } from "@/data/industryIntegration";

interface IndustryEcosystemSectionProps {
  data?: {
    title?: string;
    intro?: string;
    items?: Array<{ id?: any; title?: string; subtitle?: string; accent?: string }>;
    closing?: string;
    image?: string;
  } | null;
}

export default function IndustryEcosystemSection({ data }: IndustryEcosystemSectionProps) {
  const title = data?.title || legacyEcosystemData.title;
  const intro = data?.intro || legacyEcosystemData.intro;
  const items = data?.items && data.items.length > 0 ? data.items : legacyEcosystemData.items;
  const closing = data?.closing || legacyEcosystemData.closing;
  const image = data?.image || legacyEcosystemData.image;

  const getCardStyles = (accent?: string) => {
    switch (accent) {
      case "saffron":
        return {
          cardBg: "bg-[#E85C2D]",
          textColor: "text-[#FFF5F2]",
          barBg: "bg-[#E85C2D]",
        };
      case "blue":
        return {
          cardBg: "bg-[#07589F]",
          textColor: "text-[#E6F0FA]",
          barBg: "bg-[#07589F]",
        };
      case "navy":
        return {
          cardBg: "bg-[#013D55]",
          textColor: "text-[#E0F7FA]",
          barBg: "bg-[#013D55]",
        };
      default:
        return {
          cardBg: "bg-[#0A1F44]",
          textColor: "text-slate-100",
          barBg: "bg-[#0A1F44]",
        };
    }
  };

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-extrabold text-[#0A1F44] sm:text-4xl md:text-5xl">
            {title}
          </h2>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-12">
          {/* Left Column - Ecosystem Cards */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans">
              {intro}
            </p>

            <div className="space-y-4 pt-2">
              {items.map((item, idx) => {
                const styles = getCardStyles(item.accent);
                return (
                  <div
                    key={item.id || idx}
                    className="group flex items-stretch gap-3 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div
                      className={`flex-grow rounded-xl p-5 sm:p-6 shadow-md transition-all ${styles.cardBg}`}
                    >
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
                        {item.title}
                      </h3>
                      <p className={`text-sm sm:text-base font-medium ${styles.textColor}`}>
                        {item.subtitle}
                      </p>
                    </div>
                    <div
                      className={`w-2.5 rounded-full opacity-75 transition-opacity group-hover:opacity-100 ${styles.barBg}`}
                    />
                  </div>
                );
              })}
            </div>

            <p className="pt-4 text-base sm:text-lg font-semibold text-slate-700 font-sans border-t border-slate-100">
              {closing}
            </p>
          </div>

          {/* Right Column - Campus Image */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-2xl transition-all duration-300 hover:shadow-amber-500/10">
              <div className="aspect-square w-full">
                <img
                  src={image}
                  alt="Geeta Group Campus"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
