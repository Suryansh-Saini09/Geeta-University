
import React from "react";
import type { CourseCareerPathways } from "@/data/programs/courses/types";

interface CourseCareerProps {
  career: CourseCareerPathways;
}

export default function CourseCareer({ career }: CourseCareerProps) {
  if (!career) return null;

  return (
    <section className="w-full bg-[#F7F9FC] py-10 md:py-14 border-t border-slate-200/60">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold">
            Career Opportunities
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0A1F44] mt-1">
            {career.title}
          </h2>
          <p className="text-slate-600 text-base max-w-3xl mt-2 leading-relaxed">
            {career.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Government Sector Roles */}
          {career.govtRoles && career.govtRoles.length > 0 && (
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-serif font-bold text-[#0A1F44] border-b border-amber-500/30 pb-3 mb-6 flex items-center justify-between">
                <span>Government Sector Roles</span>
                <span className="text-xs uppercase bg-amber-100 text-amber-900 font-sans font-semibold px-2.5 py-1 rounded">
                  Public Domain
                </span>
              </h3>
              <ul className="space-y-4">
                {career.govtRoles.map((role, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold">•</span>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-base">
                        {role.title}
                      </h4>
                      {role.description && (
                        <p className="text-slate-600 text-sm mt-0.5">
                          {role.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Private Sector Roles */}
          {career.privateRoles && career.privateRoles.length > 0 && (
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-serif font-bold text-[#0A1F44] border-b border-amber-500/30 pb-3 mb-6 flex items-center justify-between">
                <span>Private Sector Roles</span>
                <span className="text-xs uppercase bg-blue-100 text-blue-900 font-sans font-semibold px-2.5 py-1 rounded">
                  Agribusiness & Tech
                </span>
              </h3>
              <ul className="space-y-4">
                {career.privateRoles.map((role, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-[#1E4E8C] font-bold">•</span>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-base">
                        {role.title}
                      </h4>
                      {role.description && (
                        <p className="text-slate-600 text-sm mt-0.5">
                          {role.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {career.notes && (
          <p className="text-xs md:text-sm text-slate-500 mt-6 italic">
            * {career.notes}
          </p>
        )}
      </div>
    </section>
  );
}
