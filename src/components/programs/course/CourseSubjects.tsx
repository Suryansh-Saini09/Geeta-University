
import React from "react";

interface CourseSubjectsProps {
  subjects: string[];
  courseTitle?: string;
}

export default function CourseSubjects({ subjects, courseTitle }: CourseSubjectsProps) {
  if (!subjects || subjects.length === 0) return null;

  const titleText = courseTitle ? `${courseTitle} Subjects` : "Program Subjects";
  const subtitleText = courseTitle
    ? `Elective and core subjects offered under the ${courseTitle} curriculum:`
    : "Elective and core subjects offered under the curriculum:";

  return (
    <section className="w-full bg-[#F7F9FC] py-10 md:py-14 border-t border-slate-200/60">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold">
            Academic Focus
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0A1F44] mt-1">
            {titleText}
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-2">
            {subtitleText}
          </p>
        </div>

        <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
          {subjects.map((subject, idx) => {
            const num = (idx + 1).toString().padStart(2, "0");
            return (
              <div
                key={idx}
                className="py-4 md:py-5 flex items-center gap-6 group hover:bg-white/80 px-4 rounded-md transition-colors"
              >
                <span className="text-sm md:text-base font-mono font-bold text-amber-600 w-8 shrink-0">
                  {num}
                </span>
                <span className="text-base md:text-lg font-semibold text-[#0A1F44] group-hover:text-[#1E4E8C] transition-colors">
                  {subject}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
