
import React from "react";
import type { CourseWhyGeeta as CourseWhyGeetaType } from "@/data/programs/courses/types";

interface CourseWhyGeetaProps {
  whyGeeta: CourseWhyGeetaType;
}

export default function CourseWhyGeeta({ whyGeeta }: CourseWhyGeetaProps) {
  if (!whyGeeta) return null;

  return (
    <section className="w-full bg-white py-10 md:py-14 border-t border-slate-100">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0A1F44] mt-1">
            {whyGeeta.title}
          </h2>
          {whyGeeta.intro && (
            <p className="text-slate-600 text-base mt-2">{whyGeeta.intro}</p>
          )}
        </div>

        {whyGeeta.reasons && whyGeeta.reasons.length > 0 && (
          <div className="space-y-6">
            {whyGeeta.reasons.map((reason, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <h3 className="text-lg font-serif font-bold text-[#0A1F44] mb-2">
                  {reason.title}
                </h3>
                <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
