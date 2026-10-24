"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  GraduationCap,
  Award,
  Atom,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { INTERNATIONAL_PROGRAM_CATEGORIES } from "@/data/internationalAdmissions";

type Program = {
  name: string;
  href?: string;
};

type ProgramCategory = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  description?: string;
  programs: Program[];
  schoolHref?: string;
};

const categories: ProgramCategory[] = INTERNATIONAL_PROGRAM_CATEGORIES.map((cat, idx) => ({
  id: `cat-${idx}`,
  number: String(idx + 1).padStart(2, "0"),
  title: cat.categoryName,
  shortTitle: cat.categoryName,
  schoolHref: cat.href,
  programs: cat.programs.map((p) => ({
    name: p.title,
    href: p.href,
  })),
}));

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.7,
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

function getProgramLevel(name: string): "Undergraduate" | "Postgraduate" | "Ph.D." {
  const lower = name.toLowerCase();
  if (lower.includes("ph.d.") || lower.includes("phd") || lower.includes("doctoral")) {
    return "Ph.D.";
  }
  if (
    lower.startsWith("m.") ||
    lower.startsWith("mba") ||
    lower.startsWith("mca") ||
    lower.startsWith("llm") ||
    lower.startsWith("master") ||
    lower.startsWith("m.sc") ||
    lower.startsWith("m.pharm") ||
    lower.startsWith("m.com") ||
    lower.startsWith("m.tech") ||
    lower.startsWith("m.a.")
  ) {
    return "Postgraduate";
  }
  return "Undergraduate";
}

const LEVEL_CONFIG = {
  Undergraduate: {
    label: "Undergraduate Programs",
    icon: GraduationCap,
  },
  Postgraduate: {
    label: "Postgraduate Programs",
    icon: Award,
  },
  "Ph.D.": {
    label: "Ph.D. Programs",
    icon: Atom,
  },
} as const;

function ProgramCategoryDetails({
  category,
  openLevels,
  toggleLevel,
}: {
  category: ProgramCategory;
  openLevels: Record<string, boolean>;
  toggleLevel: (level: string) => void;
}) {
  const ugPrograms = category.programs.filter(
    (p) => getProgramLevel(p.name) === "Undergraduate"
  );
  const pgPrograms = category.programs.filter(
    (p) => getProgramLevel(p.name) === "Postgraduate"
  );
  const phdPrograms = category.programs.filter(
    (p) => getProgramLevel(p.name) === "Ph.D."
  );

  const programSections = [
    { level: "Undergraduate", label: "Undergraduate Programs", programs: ugPrograms },
    { level: "Postgraduate", label: "Postgraduate Programs", programs: pgPrograms },
    { level: "Ph.D.", label: "Ph.D. Programs", programs: phdPrograms },
  ].filter((section) => section.programs.length > 0);

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:gap-6 sm:flex-row sm:items-start">
        <div>
          <h3
            className="mt-1 font-serif text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl"
            style={{
              color: "var(--gu-navy, #0A1F44)",
            }}
          >
            {category.title}
          </h3>
        </div>
      </div>

      {/* Programs Categorised by Level with Dropdowns */}
      <div className="mt-5 sm:mt-8 space-y-3 sm:space-y-4">
        {programSections.map((section) => {
          const isOpen = !!openLevels[section.level];
          const config =
            LEVEL_CONFIG[
              section.level as keyof typeof LEVEL_CONFIG
            ] || LEVEL_CONFIG.Undergraduate;
          const Icon = config.icon;

          return (
            <div
              key={section.level}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                isOpen
                  ? "bg-white shadow-md border-[rgba(232,135,26,0.35)]"
                  : "bg-white/90 hover:bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              {/* Dropdown Header Toggle Button */}
              <button
                type="button"
                onClick={() => toggleLevel(section.level)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 p-3 text-left transition-colors duration-200 hover:bg-slate-50/70 sm:p-5 cursor-pointer"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Icon Box */}
                  <div
                    className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: isOpen
                        ? "var(--gu-navy, #0A1F44)"
                        : "rgba(6, 53, 95, 0.06)",
                      color: isOpen
                        ? "var(--gu-gold, #E8871A)"
                        : "var(--gu-navy, #0A1F44)",
                    }}
                  >
                    <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>

                  {/* Title */}
                  <div className="min-w-0">
                    <h4
                      className="font-serif text-sm font-bold sm:text-lg"
                      style={{
                        color: "var(--gu-navy, #0A1F44)",
                      }}
                    >
                      {config.label}
                    </h4>
                  </div>
                </div>

                {/* Right Chevron */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div
                    className={`flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition-all duration-300 ${
                      isOpen
                        ? "rotate-180 bg-[#0A1F44] text-white border-[#0A1F44] shadow-xs"
                        : "rotate-0 bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    <ChevronDown size={15} />
                  </div>
                </div>
              </button>

              {/* Dropdown Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.28,
                      ease: "easeInOut",
                    }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-slate-100 bg-[#FAFBFD]/60 p-3 sm:p-5 lg:p-6">
                      <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                        {section.programs.map((program) => {
                          const isLink = !!program.href;

                          const content = (
                            <>
                              <span
                                className="flex h-2 w-2 rounded-full shrink-0 transition-transform duration-200 group-hover:scale-125"
                                style={{
                                  backgroundColor: "var(--gu-gold, #E8871A)",
                                }}
                              />

                              <span
                                className={`flex-1 text-xs sm:text-sm font-semibold leading-snug sm:leading-6 transition-colors duration-200 ${
                                  isLink
                                    ? "group-hover:text-[#E8871A]"
                                    : ""
                                }`}
                                style={{
                                  color: "var(--gu-navy, #0A1F44)",
                                }}
                              >
                                {program.name}
                              </span>

                              {isLink && (
                                <span
                                  className="opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100 flex items-center shrink-0"
                                  style={{
                                    color: "var(--gu-gold, #E8871A)",
                                  }}
                                >
                                  <ArrowRight size={15} />
                                </span>
                              )}
                            </>
                          );

                          if (isLink) {
                            return (
                              <Link
                                key={program.name}
                                href={program.href as string}
                                className="group flex items-center gap-2.5 sm:gap-3 rounded-xl border bg-white p-3 sm:p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#E8871A]/40"
                                style={{
                                  borderColor: "rgba(6, 53, 95, 0.08)",
                                }}
                              >
                                {content}
                              </Link>
                            );
                          }

                          return (
                            <div
                              key={program.name}
                              className="flex items-center gap-2.5 sm:gap-3 rounded-xl border bg-white p-3 sm:p-4"
                              style={{
                                borderColor: "rgba(6, 53, 95, 0.06)",
                              }}
                            >
                              {content}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* School CTA */}
      {category.schoolHref && (
        <div className="mt-5 sm:mt-8 flex flex-col gap-3 sm:gap-4 border-t pt-5 sm:pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p
              className="text-xs sm:text-sm font-semibold"
              style={{
                color: "var(--gu-navy, #0A1F44)",
              }}
            >
              View the complete school offering.
            </p>
          </div>

          <Link
            href={category.schoolHref}
            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              backgroundColor: "var(--gu-navy, #0A1F44)",
              color: "#ffffff",
            }}
          >
            Explore School
          </Link>
        </div>
      )}
    </div>
  );
}

export interface InternationalProgramsAccordionProps {
  data?: {
    title?: string;
    categories?: any[];
  };
}

export default function InternationalProgramsAccordion({ data }: InternationalProgramsAccordionProps = {}) {
  const rawCategories = data?.categories && data.categories.length > 0 ? data.categories : INTERNATIONAL_PROGRAM_CATEGORIES;
  const categories: ProgramCategory[] = rawCategories.map((cat: any, idx: number) => ({
    id: `cat-${idx}`,
    number: String(idx + 1).padStart(2, "0"),
    title: cat.categoryName || cat.title,
    shortTitle: cat.categoryName || cat.shortTitle || cat.title,
    schoolHref: cat.href || cat.schoolHref,
    programs: (cat.programs || []).map((prog: any) => ({
      name: typeof prog === "string" ? prog : prog.title || prog.name,
      href: typeof prog === "object" ? prog.href : undefined,
    })),
  }));
  const [activeCategory, setActiveCategory] = useState<string | null>(categories[0]?.id || null);
  const [openLevels, setOpenLevels] = useState<Record<string, boolean>>({
    Undergraduate: true,
  });

  const toggleLevel = (level: string) => {
    setOpenLevels((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
  };

  const toggleCategory = (id: string) => {
    setActiveCategory((current) => (current === id ? null : id));
  };

  const activeProgramCategory =
    categories.find((category) => category.id === activeCategory) ??
    categories[0];

  return (
    <section
      id="programs-offered"
      aria-labelledby="programs-heading"
      className="relative overflow-hidden bg-white py-12 md:py-16"
    >
      {/* Background accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full opacity-10 blur-3xl"
        style={{
          backgroundColor: "var(--gu-gold, #E8871A)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.12,
          }}
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <h2
              id="programs-heading"
              className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
              style={{
                color: "var(--gu-navy, #0A1F44)",
              }}
            >
              Programs Offered
            </h2>

            <div
              className="mx-auto mt-5 h-1 w-16 rounded-full"
              style={{
                backgroundColor: "var(--gu-gold, #E8871A)",
              }}
            />

            <p
              className="mx-auto mt-6 max-w-2xl text-base leading-8 sm:text-lg"
              style={{
                color: "var(--gu-text-muted, #64748B)",
              }}
            >
              70+ Study Programs at Diploma, UG, PG, and Ph.D. Levels
            </p>
          </motion.div>

          {/* Main explorer */}
          <motion.div
            variants={itemVariants}
            className="mt-12 overflow-hidden rounded-3xl border bg-white shadow-sm md:mt-16"
            style={{
              borderColor: "rgba(6, 53, 95, 0.10)",
            }}
          >
            <div className="grid lg:grid-cols-[0.85fr_1.5fr]">
              {/* Category navigation (With Mobile Inline Accordions) */}
              <div
                className="border-b lg:border-b-0 lg:border-r"
                style={{
                  borderColor: "rgba(6, 53, 95, 0.10)",
                  backgroundColor: "var(--gu-bg, #F8FAFC)",
                }}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col gap-2">
                    {categories.map((category) => {
                      const isActive = category.id === activeCategory;

                      return (
                        <div key={category.id} className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => toggleCategory(category.id)}
                            aria-expanded={isActive}
                            className="group flex items-center justify-between rounded-xl px-3.5 py-3.5 text-left transition-all duration-200 sm:px-4 cursor-pointer"
                            style={{
                              backgroundColor: isActive
                                ? "var(--gu-navy, #0A1F44)"
                                : "transparent",
                              color: isActive
                                ? "white"
                                : "var(--gu-navy, #0A1F44)",
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="flex h-2 w-2 rounded-full shrink-0 transition-transform duration-200 group-hover:scale-125"
                                style={{
                                  backgroundColor: "var(--gu-gold, #E8871A)",
                                }}
                              />
                              <span className="text-sm font-bold sm:text-base tracking-tight">
                                {category.shortTitle}
                              </span>
                            </div>

                            {/* Arrow / Chevron */}
                            <span
                              className={`ml-auto flex items-center transition-all duration-200 ${
                                isActive
                                  ? "opacity-100 translate-x-0"
                                  : "opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
                              }`}
                              style={{
                                color: "var(--gu-gold, #E8871A)",
                              }}
                            >
                              <span className="hidden lg:inline-flex">
                                <ArrowRight size={17} />
                              </span>
                              <span className={`lg:hidden transition-transform duration-300 ${isActive ? "rotate-180" : "rotate-0"}`}>
                                <ChevronDown size={18} />
                              </span>
                            </span>
                          </button>

                          {/* MOBILE INLINE ACCORDION CONTENT */}
                          <AnimatePresence initial={false}>
                            {isActive && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.28,
                                  ease: "easeInOut",
                                }}
                                className="overflow-hidden lg:hidden"
                              >
                                <div className="my-3 rounded-2xl border border-[rgba(6,53,95,0.08)] bg-white p-4 shadow-sm">
                                  <ProgramCategoryDetails
                                    category={category}
                                    openLevels={openLevels}
                                    toggleLevel={toggleLevel}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Program details (DESKTOP VIEW ONLY) */}
              <div className="hidden p-6 sm:p-8 lg:block lg:p-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProgramCategory.id}
                    initial={{
                      opacity: 0,
                      x: 18,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -18,
                    }}
                    transition={{
                      duration: 0.25,
                      ease: "easeOut",
                    }}
                  >
                    <ProgramCategoryDetails
                      category={activeProgramCategory}
                      openLevels={openLevels}
                      toggleLevel={toggleLevel}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
