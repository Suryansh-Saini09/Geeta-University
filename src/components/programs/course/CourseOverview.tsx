
import React from "react";
import type { CourseOverview as CourseOverviewType } from "@/data/programs/courses/types";

interface CourseOverviewProps {
  overview: CourseOverviewType;
}

export default function CourseOverview({ overview }: CourseOverviewProps) {
  return (
    <section className="w-full bg-[#F7F9FC] py-10 md:py-14">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="max-w-4xl">
          <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
            Course Overview
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0A1F44] mb-8 leading-tight">
            {overview.title}
          </h2>

          <div className="space-y-6 text-slate-700 text-base md:text-lg leading-relaxed">
            {overview.paragraphs.map((p, idx) => (
              <p key={idx} className="first-letter:text-3xl first-letter:font-serif first-letter:font-bold first-letter:text-[#0A1F44]">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
