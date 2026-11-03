
import React from "react";

interface CourseLearningOutcomesProps {
  learningOutcomes: string[];
}

export default function CourseLearningOutcomes({
  learningOutcomes,
}: CourseLearningOutcomesProps) {
  if (!learningOutcomes || learningOutcomes.length === 0) return null;

  return (
    <section className="w-full bg-[#0A1F44] text-white py-10 md:py-14">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Competencies & Skills
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mt-1">
            Learning Outcomes — What You Will Learn
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningOutcomes.map((outcome, index) => {
            const num = (index + 1).toString().padStart(2, "0");
            return (
              <div
                key={index}
                className="p-6 rounded-lg bg-slate-800/60 border border-slate-700/80 flex flex-col justify-between"
              >
                <span className="text-2xl font-serif font-bold text-amber-400 mb-3 block">
                  {num}
                </span>
                <p className="text-slate-200 text-base leading-relaxed font-medium">
                  {outcome}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
