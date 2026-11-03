
import React from "react";
import type { CourseResearch as CourseResearchType, CourseResearchArea, CourseResearchInfrastructure } from "@/data/programs/courses/types";

interface CourseResearchProps {
  research: CourseResearchType;
}

export default function CourseResearch({ research }: CourseResearchProps) {
  if (!research) return null;

  return (
    <section className="w-full bg-white py-10 md:py-14 border-t border-slate-100">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold">
            Research & Innovation
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0A1F44] mt-1">
            {research.title}
          </h2>
          {research.description && (
            <p className="text-slate-600 text-base mt-2 max-w-2xl">
              {research.description}
            </p>
          )}
        </div>

        {research.areas && research.areas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {research.areas.map((area: CourseResearchArea, idx: number) => (
              <div
                key={idx}
                className="p-6 rounded-lg bg-slate-50 border border-slate-200"
              >
                <h3 className="font-serif font-bold text-lg text-[#0A1F44] mb-2">
                  {area.title}
                </h3>
                <p className="text-slate-600 text-sm">{area.description}</p>
              </div>
            ))}
          </div>
        )}

        {research.infrastructure && research.infrastructure.length > 0 && (
          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-xl font-serif font-bold text-[#0A1F44] mb-6">
              Research Infrastructure
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {research.infrastructure.map((infra: CourseResearchInfrastructure, idx: number) => (
                <div key={idx} className="p-5 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-900 text-base mb-1">
                    {infra.title}
                  </h4>
                  <p className="text-slate-600 text-xs">{infra.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
