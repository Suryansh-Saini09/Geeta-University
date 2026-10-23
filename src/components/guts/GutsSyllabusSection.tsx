"use client";

import React, { useState } from "react";
import { gutsSyllabusList } from "@/data/gutsData";
import { Download, FileText, ExternalLink, Sparkles } from "lucide-react";

export interface GutsSyllabusSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    items?: Array<{
      title: string;
      category?: string;
      pdfUrl?: string;
      subtitle?: string;
    }>;
  };
}

export default function GutsSyllabusSection({ data }: GutsSyllabusSectionProps = {}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Commerce & Mgmt", "Sciences", "Humanities", "Aptitude & Core"];

  const filteredItems = selectedCategory === "All"
    ? gutsSyllabusList
    : gutsSyllabusList.filter((item) => item.category === selectedCategory);

  return (
    <section id="guts-syllabus" className="w-full bg-white py-14 sm:py-18 md:py-22 border-b border-[#E2E8F0]">
      <div className="gu-container">
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-[2px] w-8 bg-[#E8871A]" />
            <span className="h-[2px] w-8 bg-[#E8871A]" />
          </div>
          <h2 className="font-serif text-[32px] sm:text-[42px] font-black text-[#0A1F44]">
            Download Subject-Wise Syllabus
          </h2>
          <p className="mt-2 text-[16px] text-[#64748B]">
            Prepare systematically for the Geeta University Test of Scholarship (GUTS) by downloading the official syllabus for your subjects.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-[#0A1F44] text-white shadow-md"
                  : "border border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] hover:bg-[#E2E8F0] hover:text-[#0A1F44]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Syllabus Grid (14 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="group flex flex-col justify-between rounded-[20px] border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E8871A]/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded-md bg-[#EFF6FF] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#0284C7]">
                    {item.category}
                  </span>
                  <FileText className="h-5 w-5 text-[#94A3B8] group-hover:text-[#E8871A] transition-colors" />
                </div>

                <h3 className="font-serif text-[20px] font-bold text-[#06355F] leading-snug">
                  {item.title}
                </h3>
                <p className="text-[13.5px] text-[#64748B] mt-1 mb-4">
                  {item.subtitle}
                </p>
              </div>

              <a
                href={item.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 px-4 text-[14px] font-bold text-[#0A1F44] transition-all duration-200 hover:border-[#E8871A] hover:bg-[#E8871A] hover:text-white hover:shadow-md active:scale-95"
              >
                <span>Download PDF</span>
                <Download className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
