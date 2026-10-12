"use client";

import React from "react";
import { motion } from "framer-motion";
import { Microscope, Cpu, TrendingUp, Award, Users, BookOpen } from "lucide-react";

const BENEFITS = [
  {
    icon: Microscope,
    title: "Research Grants & Support",
    description: "Generous seed grants, patent assistance, and incentives for high-impact journal publications.",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  {
    icon: Cpu,
    title: "AI & Tech Infrastructure",
    description: "Modern smart classrooms, futuristic computer labs, and integrated digital teaching tools.",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    icon: TrendingUp,
    title: "Continuous Professional Growth",
    description: "Faculty enrichment programs, international conference sponsorship, and clear career progression.",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    icon: Award,
    title: "Competitive Compensation",
    description: "Industry-benchmarked remuneration, annual performance rewards, and family wellness benefits.",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  {
    icon: Users,
    title: "Inclusive & Collaborative Culture",
    description: "A supportive academic community fostering interdisciplinary ideas and cross-department innovation.",
    color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  },
  {
    icon: BookOpen,
    title: "Academic Autonomy",
    description: "Freedom to design outcome-based curricula aligned with NEP 2020 and industry 4.0 demands.",
    color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  },
];

const BENEFIT_THEMES = [
  { icon: Microscope, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { icon: Cpu, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { icon: TrendingUp, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { icon: Award, color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { icon: Users, color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
  { icon: BookOpen, color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Microscope,
  Cpu,
  TrendingUp,
  Award,
  Users,
  BookOpen,
};

interface CareersWhyUsProps {
  benefits?: {
    title?: string;
    subtitle?: string;
    items?: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
  } | null;
}

export default function CareersWhyUs({ benefits }: CareersWhyUsProps) {
  const sectionTitle = benefits?.title || "Empowering Your Professional Journey";
  const sectionSubtitle =
    benefits?.subtitle ||
    "At Geeta University, we believe our educators and staff are our greatest asset. We provide an environment where innovation thrives, scholarship is celebrated, and professional development is prioritized.";

  const items =
    benefits?.items && benefits.items.length > 0
      ? benefits.items
      : BENEFITS;

  return (
    <section id="why-join-us" className="scroll-mt-20 bg-[#F8FAFC] py-10 md:py-14">
      <div className="gu-container">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#E8871A]" />
            <span className="text-[12px] font-bold uppercase tracking-[2.5px] text-[#E8871A]">
              Why Work With Us
            </span>
            <span className="h-px w-8 bg-[#E8871A]" />
          </div>
          <h2 className="font-serif text-[36px] font-black text-[#0A1F44] sm:text-[42px] md:text-[48px]">
            {sectionTitle.includes("Professional Journey") ? (
              <>
                {sectionTitle.replace("Professional Journey", "").trim()}{" "}
                <span className="text-[#E8871A]">Professional Journey</span>
              </>
            ) : (
              sectionTitle
            )}
          </h2>
          <p className="mt-4 text-[16px] leading-[1.7] text-[#64748B] sm:text-[17px]">
            {sectionSubtitle}
          </p>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const theme = BENEFIT_THEMES[index % BENEFIT_THEMES.length];
            const Icon =
              typeof item.icon === "string"
                ? ICON_MAP[item.icon] || theme.icon
                : item.icon || theme.icon;
            const colorClass = (item as any).color || theme.color;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative flex flex-col rounded-[16px] border border-[#E2E8F0] bg-white p-7 shadow-[0_4px_20px_rgba(10,31,68,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-[#E8871A]/40 hover:shadow-[0_12px_30px_rgba(232,135,26,0.1)]"
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-[12px] border ${colorClass}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-[20px] font-extrabold text-[#0A1F44] transition-colors group-hover:text-[#E8871A]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-[1.65] text-[#64748B]">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
