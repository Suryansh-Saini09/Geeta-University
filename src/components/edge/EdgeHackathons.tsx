"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Terminal, Flame, Trophy } from "lucide-react";
import type { EdgeHackathonsSection } from "@/data/edge/types";

interface EdgeHackathonsProps {
  section?: EdgeHackathonsSection;
}

export default function EdgeHackathons({ section }: EdgeHackathonsProps) {
  if (!section || !section.items || section.items.length === 0) return null;

  return (
    <section className="bg-white py-14 md:py-20 border-t border-slate-200">
      <div className="gu-container">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#E8871A]/10 px-4 py-1 border border-[#E8871A]/20">
            <Flame size={14} className="text-[#E8871A]" />
            <span className="text-xs font-bold uppercase tracking-[2px] text-[#E8871A]">
              {section.eyebrow || "Competitive Coding & Innovation"}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0A1F44]">
            {section.title || "Hackathons @ GTH"}
          </h2>
          {section.subtitle && (
            <p className="mt-3 text-base md:text-lg text-slate-600">
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Hackathon Cards List */}
        <div className="mx-auto max-w-5xl space-y-8">
          {section.items.map((item, idx) => {
            const isFeatured = item.isFeatured;

            if (isFeatured) {
              return (
                <div
                  key={item.id || idx}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#173b70] via-[#0E2A54] to-[#0A1F44] text-white p-6 sm:p-8 md:p-10 shadow-lg border border-blue-900 transition-all hover:shadow-xl"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6 mb-6">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 border border-amber-400/30 mb-2">
                        Flagship National Hackathon
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                        {item.title}
                      </h3>
                      {item.highlight && (
                        <p className="mt-1 text-xs sm:text-sm font-semibold text-blue-200">
                          {item.highlight}
                        </p>
                      )}
                    </div>

                    {item.ctaLink && (
                      <Link
                        href={item.ctaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#173b70] shadow-sm hover:bg-blue-50 transition-all shrink-0"
                      >
                        <span>{item.ctaText || "Explore NexHack 2.0"}</span>
                        <ExternalLink size={16} />
                      </Link>
                    )}
                  </div>

                  <p className="text-sm sm:text-base leading-relaxed text-blue-50/90 font-normal">
                    {item.description}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={item.id || idx}
                className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#06355F]/10 text-[#06355F]">
                    <Terminal size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0A1F44]">
                      {item.title}
                    </h3>
                    {item.highlight && (
                      <span className="inline-block text-xs font-bold text-[#E8871A]">
                        {item.highlight}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm sm:text-base leading-relaxed text-slate-600 mb-6">
                  {item.description}
                </p>

                {/* 3-Photo Gallery Grid */}
                {item.gallery && item.gallery.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {item.gallery.map((photo, pIdx) => (
                      <div
                        key={pIdx}
                        className="relative h-44 sm:h-48 md:h-52 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 group"
                      >
                        <Image
                          src={photo}
                          alt={`${item.title} photo ${pIdx + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 33vw"
                          unoptimized={photo.startsWith("http")}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

