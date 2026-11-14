
import React from "react";
import type { CourseScholarshipsData } from "@/data/programs/courses/types";

interface CourseScholarshipsProps {
  scholarships?: CourseScholarshipsData;
}

export default function CourseScholarships({ scholarships }: CourseScholarshipsProps = {}) {
  const title = scholarships?.scholarships?.title || "SCHOLARSHIPS AT GEETA UNIVERSITY";
  const description =
    scholarships?.scholarships?.description ||
    "We believe that financial constraints should not limit access to quality education. At Geeta University, we offer scholarships based on:";
  const criteria = scholarships?.scholarships?.criteria || [
    "Merit/Percentage in Qualifying Exams",
    "National Level Entrance Exams (JEE, CUET, NEET, CLAT, and more)",
    "Social Responsibility",
    "Sports Performance",
  ];
  const knowMoreUrl = scholarships?.scholarships?.linkUrl || "https://geetauniversity.edu.in/scholarship";

  const gutsTitle = scholarships?.guts?.title || "GUTS";
  const gutsSubtitle = scholarships?.guts?.subtitle || "GEETA UNIVERSITY TEST OF SCHOLARSHIP";
  const gutsDescription =
    scholarships?.guts?.description ||
    "Geeta University (GU) strongly believes that monetary constraints should not be an obstacle for a student to have access to quality education. Following scholarships are offered at GU:";
  const applyNowUrl = scholarships?.guts?.linkUrl || "https://geetauniversity.edu.in/guts";

  return (
    <section className="relative overflow-hidden bg-[#F5F8FA] py-14 sm:py-16 border-t border-slate-200/80">
      {/* Decorative background blurs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-10 h-64 w-64 rounded-full bg-[#F28C18]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-[#06355F]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] items-stretch">
          
          {/* ── LEFT CARD: Scholarships at Geeta University (Homepage-inspired Navy Card) ── */}
          <div className="group relative overflow-hidden rounded-[2rem] bg-[#06355F] p-7 shadow-xl sm:p-9 lg:p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl">
            {/* Decorative geometric circles */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-[#F28C18]/20"
            />

            <div className="relative z-10">
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold leading-tight text-white">
                {title}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-[15.5px]">
                {description}
              </p>

              {/* Scholarship criteria chips */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {criteria.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.07] p-3.5 transition-all duration-300 hover:border-[#F28C18]/60 hover:bg-white/12"
                  >
                    <span className="flex h-2 w-2 rounded-full bg-[#F28C18] shrink-0" />
                    <span className="text-xs sm:text-[13.5px] font-medium leading-snug text-white/90">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="relative z-10 mt-8">
              <a
                href={knowMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#F28C18] px-7 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e47f0d] hover:shadow-xl"
              >
                <span>Know More</span>
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    d="M4 10H16M10 4L16 10L10 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* ── RIGHT CARD: GUTS (Homepage-inspired White Card) ── */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-[#DCE5EC] bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-9 lg:p-10 flex flex-col justify-between">
            {/* Orange corner accent */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-bl-[5rem] bg-[#F28C18]/10"
            />

            <div className="relative z-10">
              {/* GUTS Badge */}
              <div className="flex items-center justify-start">
                <span className="inline-flex items-center justify-center rounded-full bg-[#06355F] px-6 py-2 text-xs sm:text-sm font-black tracking-[0.22em] text-white shadow-md border border-white/10 transition-transform duration-300 group-hover:scale-105">
                  {gutsTitle}
                </span>
              </div>

              {gutsSubtitle && (
                <h3 className="mt-4 font-serif text-xl sm:text-2xl font-bold leading-tight text-[#06355F]">
                  {gutsSubtitle}
                </h3>
              )}

              <p className="mt-4 text-sm leading-relaxed text-[#607284] sm:text-[15px]">
                {gutsDescription}
              </p>
            </div>

            {/* CTA */}
            <div className="relative z-10 mt-8">
              <a
                href={applyNowUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border-2 border-[#06355F] px-7 py-3 text-sm font-bold text-[#06355F] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#06355F] hover:text-white shadow-sm"
              >
                <span>Apply Now</span>
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    d="M4 10H16M10 4L16 10L10 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}