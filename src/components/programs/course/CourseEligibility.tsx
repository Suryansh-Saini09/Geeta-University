
import React from "react";
import type {
  CourseEligibility as CourseEligibilityType,
  CourseAdmissions as CourseAdmissionsType,
} from "@/data/programs/courses/types";

interface CourseEligibilityProps {
  eligibility: CourseEligibilityType;
  admissions?: CourseAdmissionsType;
}

export default function CourseEligibility({
  eligibility,
  admissions,
}: CourseEligibilityProps) {
  if (!eligibility) return null;

  return (
    <section className="w-full bg-[#F7F9FC] py-10 md:py-14 border-t border-slate-200/60">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold">
              Entry Criteria
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0A1F44] mt-1 mb-4">
              {eligibility.title}
            </h2>
            <p className="text-slate-600 text-sm md:text-base mb-6">
              {eligibility.description}
            </p>
            <ul className="space-y-3">
              {eligibility.requirements.map((req: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-slate-800 text-sm md:text-base">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {admissions && (
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold">
                Steps to Apply
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0A1F44] mt-1 mb-4">
                {admissions.title}
              </h2>
              <p className="text-slate-600 text-sm md:text-base mb-6">
                {admissions.description}
              </p>
              <ol className="space-y-3">
                {admissions.process.map((step: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-800 text-sm md:text-base">
                    <span className="font-mono font-bold text-amber-600">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
