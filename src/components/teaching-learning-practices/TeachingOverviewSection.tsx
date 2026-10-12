"use client";

import React from "react";
import { teachingOverview as fallbackOverview } from "@/data/teachingLearningPractices";

interface TeachingOverviewSectionProps {
  overview?: {
    headingOrange?: string;
    headingBlack?: string;
    paragraphs?: string[];
    image?: string;
  } | null;
}

export default function TeachingOverviewSection({ overview }: TeachingOverviewSectionProps) {
  const o = overview || fallbackOverview;
  const headingOrange = o.headingOrange || fallbackOverview.headingOrange;
  const headingBlack = o.headingBlack || fallbackOverview.headingBlack;
  const paragraphs =
    o.paragraphs && o.paragraphs.length > 0 ? o.paragraphs : fallbackOverview.paragraphs;
  const image = o.image || fallbackOverview.image;

  return (
    <section className="w-full bg-white py-16 md:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-serif text-3xl font-extrabold sm:text-4xl md:text-5xl text-[#0A1F44]">
              <span className="text-[#E8871A]">{headingOrange}</span>{" "}
              <span>{headingBlack}</span>
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed font-sans">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>

          {/* Right Image Feature */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-2xl transition-all duration-300 hover:shadow-amber-500/10">
              <img
                src={image}
                alt="Teaching Practice at Geeta University"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
