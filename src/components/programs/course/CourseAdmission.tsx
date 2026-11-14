
import React from "react";
import type { CourseAdmissionProcess } from "@/data/programs/courses/types";

interface CourseAdmissionProps {
  admission: CourseAdmissionProcess;
}

export default function CourseAdmission({ admission }: CourseAdmissionProps) {
  if (!admission) return null;

  return (
    <section className="w-full bg-white py-10 md:py-14 border-t border-slate-100">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
          {/* Admission Process / Eligibility */}
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold">
              Admissions
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0A1F44] mt-1 mb-4">
              Degree Admission Process
            </h2>
            <div className="p-6 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="text-sm font-bold text-[#0A1F44] uppercase tracking-wide mb-2">
                Eligibility Criteria
              </h3>
              <p className="text-slate-700 text-base leading-relaxed">
                {admission.eligibility}
              </p>
            </div>
          </div>

          {/* Why Choose an M.Sc. Agriculture (Agronomy)? */}
          {admission.whyChooseHeading && (
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold">
                Program Insight
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0A1F44] mt-1 mb-4">
                {admission.whyChooseHeading}
              </h2>
              <div className="space-y-4 text-slate-700 text-base leading-relaxed">
                {admission.whyChooseParagraphs?.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
