"use client";

import React, { useState } from "react";
import { phdSyllabusList as defaultList } from "@/data/phdData";
import { FileText, ExternalLink } from "lucide-react";

export interface PhdSyllabusSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    syllabusList?: Array<{
      title: string;
      subtitle?: string;
      category?: string;
      pdfUrl: string;
    }>;
  };
}

export default function PhdSyllabusSection({ data }: PhdSyllabusSectionProps = {}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const items =
    data?.syllabusList && data.syllabusList.length > 0
      ? data.syllabusList
      : defaultList;

  const categories = [
    "All",
    ...Array.from(new Set(items.map((i) => i.category || "Core"))),
  ];

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => (item.category || "Core") === selectedCategory);

  return (
    <section id="syllabus" className="w-full bg-white py-14 sm:py-18 md:py-22 border-b border-[#E2E8F0]">
      <div className="gu-container">
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="font-serif text-[32px] sm:text-[42px] font-black text-[#0A1F44]">
            {data?.title || "Ph.D. Entrance Syllabus"}
          </h2>
          {data?.subtitle && (
            <p className="mt-3 text-slate-600 text-base max-w-2xl mx-auto">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#0A1F44] text-white shadow-md"
                  : "border border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] hover:bg-[#E2E8F0] hover:text-[#0A1F44]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Syllabus Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="group flex flex-col justify-between rounded-[20px] border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E8871A]/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded-md bg-[#EFF6FF] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#0284C7]">
                    {item.category || "Core"}
                  </span>
                  <FileText className="h-5 w-5 text-[#94A3B8] group-hover:text-[#E8871A] transition-colors" />
                </div>

                <h3 className="font-serif text-[20px] font-bold text-[#06355F] leading-snug">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-[13.5px] text-[#64748B] mt-1 mb-4">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {item.pdfUrl ? (
                <a
                  href={item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 px-4 text-[14px] font-bold text-[#0A1F44] transition-all duration-200 hover:border-[#E8871A] hover:bg-[#E8871A] hover:text-white hover:shadow-md active:scale-95 cursor-pointer"
                >
                  <span>View Syllabus</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <span className="mt-4 inline-block text-xs font-semibold text-slate-400 py-2">
                  Syllabus details available on enquiry
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
