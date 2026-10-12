"use client";

import React from "react";
import Link from "next/link";
import { pgSchoolsData } from "@/data/postGraduatePrograms";
import ScholarshipCalculator from "@/components/programs-after-12th/ScholarshipCalculator";

export default function PostGraduateListSection({
  schoolsData,
  statsData,
}: {
  schoolsData?: any;
  statsData?: any;
}) {
  const activeSchools = schoolsData?.schools || pgSchoolsData;
  const col1Schools = activeSchools.slice(0, Math.ceil(activeSchools.length / 2));
  const col2Schools = activeSchools.slice(Math.ceil(activeSchools.length / 2));

  const cards = statsData?.cards || [
    { value: "550+", label: "Top Recruiters" },
    { value: "3500+", label: "Job Offers" },
  ];

  return (
    <section id="programs-catalog" className="scroll-mt-20 bg-[#F3F5F6] py-12 sm:py-16">
      <div className="gu-container space-y-10">
        {/* Main 2-Column Section Layout: Schools (Left) & Calculator (Right) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Left Side: Schools in 2 Sub-Columns (8 cols) */}
          <div className="lg:col-span-8 xl:col-span-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Sub-Column 1 */}
              <div className="space-y-6">
                {col1Schools.map((school: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-[24px] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-shadow duration-200 hover:shadow-md"
                  >
                    <h3 className="font-serif text-[19px] sm:text-[20px] font-bold text-[#0B2D4C] mb-3 leading-snug">
                      {school.schoolName}
                    </h3>

                    <ul className="space-y-2 pl-5 list-disc marker:text-[#06355F]">
                      {school.programs.map((program: any, pIdx: number) => (
                        <li key={pIdx}>
                          <Link
                            href={program.href || "#"}
                            className="font-sans text-[15px] sm:text-[16px] text-[#06355F] hover:text-[#E8871A] hover:underline transition-colors leading-snug block"
                          >
                            {program.name || program.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Sub-Column 2 */}
              <div className="space-y-6">
                {col2Schools.map((school: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-[24px] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-shadow duration-200 hover:shadow-md"
                  >
                    <h3 className="font-serif text-[19px] sm:text-[20px] font-bold text-[#0B2D4C] mb-3 leading-snug">
                      {school.schoolName}
                    </h3>

                    <ul className="space-y-2 pl-5 list-disc marker:text-[#06355F]">
                      {school.programs.map((program: any, pIdx: number) => (
                        <li key={pIdx}>
                          <Link
                            href={program.href || "#"}
                            className="font-sans text-[15px] sm:text-[16px] text-[#06355F] hover:text-[#E8871A] hover:underline transition-colors leading-snug block"
                          >
                            {program.name || program.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Scholarship Calculator (4 cols) */}
          <div id="fee-calculator" className="lg:col-span-4 xl:col-span-4">
            <ScholarshipCalculator />
          </div>
        </div>

        {/* Horizontal Achievement Cards (2 across) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-4">
          {cards.map((card: any, cIdx: number) => (
            <div key={cIdx} className="rounded-[24px] bg-[#0B2D4C] p-8 text-center text-white shadow-md">
              <div className="font-serif text-[42px] sm:text-[48px] font-bold text-white leading-none mb-2">
                {card.value}
              </div>
              <div className="text-[16px] sm:text-[17px] uppercase tracking-wider text-white font-medium">
                {card.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
