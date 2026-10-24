"use client";

import React from "react";
import { cuetWhyBenefits } from "@/data/cuetData";
import { Award, Zap, BookOpen, Headphones, Briefcase, Building2, Users } from "lucide-react";

interface CuetWhyAndStatsProps {
  data?: {
    title?: string;
    benefits?: Array<{
      title: string;
      iconName?: string;
    }>;
    stats?: Array<{
      label: string;
      value: string;
      highlight?: boolean;
    }>;
  };
}

const defaultStats = [
  { label: "Highest Package", value: "40 LPA", highlight: false },
  { label: "Recruiters", value: "550+", highlight: true },
  { label: "Job Offers", value: "3500+", highlight: false },
];

export default function CuetWhyAndStats({ data }: CuetWhyAndStatsProps = {}) {
  const title = data?.title || "Why Apply Through CUET at Geeta?";
  const benefits = data?.benefits !== undefined ? data.benefits : cuetWhyBenefits;
  const stats = data?.stats !== undefined ? data.stats : defaultStats;

  const getIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case "award":
        return <Award className="h-7 w-7 text-[#E8871A]" />;
      case "zap":
        return <Zap className="h-7 w-7 text-[#E8871A]" />;
      case "book-open":
        return <BookOpen className="h-7 w-7 text-[#E8871A]" />;
      case "headphones":
        return <Headphones className="h-7 w-7 text-[#E8871A]" />;
      case "briefcase":
        return <Briefcase className="h-7 w-7 text-[#E8871A]" />;
      case "users":
        return <Users className="h-7 w-7 text-[#E8871A]" />;
      default:
        return <Award className="h-7 w-7 text-[#E8871A]" />;
    }
  };

  const getStatIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("recruiter") || l.includes("company")) {
      return <Building2 className="h-8 w-8" />;
    }
    if (l.includes("offer") || l.includes("student") || l.includes("job")) {
      return <Users className="h-8 w-8" />;
    }
    return <Award className="h-8 w-8" />;
  };

  return (
    <section className="w-full bg-[#F8FAFC] py-14 sm:py-18 md:py-22 border-b border-[#E2E8F0]">
      <div className="gu-container space-y-16">
        {/* 1. Why Apply Through CUET */}
        {benefits.length > 0 && (
          <div>
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <h2 className="font-serif text-[30px] sm:text-[38px] md:text-[42px] font-black text-[#0A1F44]">
                {title}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {benefits.map((item, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col items-center justify-center rounded-[20px] bg-white border border-[#E2E8F0] p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E8871A] hover:shadow-md"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF8F2] border border-[#FFD9B3] shadow-sm transition-transform group-hover:scale-110">
                    {getIcon(item.iconName)}
                  </div>
                  <h4 className="font-serif text-[17px] font-bold text-[#0A1F44] leading-snug">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Key Placement Stats */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, idx) => {
              const isHighlight = stat.highlight;
              return (
                <div
                  key={idx}
                  className={`rounded-[22px] p-8 text-center transition-all ${
                    isHighlight
                      ? "bg-[#FFF5F0] border-2 border-[#FF8D5B] shadow-md hover:shadow-lg"
                      : "bg-white border border-[#90CAF9] shadow-sm hover:shadow-md"
                  }`}
                >
                  <div
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-sm ${
                      isHighlight
                        ? "bg-white text-[#E8871A]"
                        : "bg-[#EFF6FF] text-[#0284C7]"
                    }`}
                  >
                    {getStatIcon(stat.label)}
                  </div>
                  <div className="text-[38px] sm:text-[44px] font-black text-[#E8871A] leading-tight">
                    {stat.value}
                  </div>
                  <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#0A1F44] mt-2">
                    {stat.label}
                  </h3>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
