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

type Program = {
  name: string;
  href?: string;
};

type ProgramCategory = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  programs: Program[];
  schoolHref?: string;
};

const programCategories: ProgramCategory[] = [
  {
    id: "cse",
    number: "01",
    title: "Computer Science & Engineering",
    shortTitle: "Computer Science & Engineering",
    description:
      "Build the technology of tomorrow through computing, artificial intelligence, cybersecurity, data science and modern software development.",
    schoolHref:
      "/programs/school-of-computer-science-and-engineering",
    programs: [
      {
        name: "B.Tech. (Hons.) CSE",
        href: "/programs/school-of-computer-science-and-engineering/btech-cse",
      },
      {
        name: "B.Tech. (Hons.) CSE — Artificial Intelligence & Machine Learning",
        href: "/programs/school-of-computer-science-and-engineering/btech-artificial-intelligence-and-machine-learning",
      },
      {
        name: "B.Tech. (Hons.) CSE — Cybersecurity",
        href: "/programs/school-of-computer-science-and-engineering/btech-cyber-security",
      },
      {
        name: "B.Tech. (Hons.) CSE — Full Stack Web Development",
        href: "/programs/school-of-computer-science-and-engineering/btech-full-stack-web-development",
      },
      {
        name: "B.Tech. (Hons.) CSE — Data Science & Business Analytics with HCL",
        href: "/programs/school-of-computer-science-and-engineering/btech-data-science-and-business-analytics",
      },
      {
        name: "B.Tech. (Hons.) CSE — NIAT Upskilling",
        href: "/programs/school-of-computer-science-and-engineering/niat-upskilling",
      },
      {
        name: "B.Tech. (Hons.) CSE — Quantum Computing",
        href: "/programs/school-of-computer-science-and-engineering/btech-quantum-computing",
      },
      {
        name: "M.Tech. CSE",
        href: "/programs/school-of-computer-science-and-engineering/mtech-cse",
      },
      {
        name: "Ph.D. CSE",
        href: "/phd-cse",
      },
    ],
  },

  {
    id: "applications",
    number: "02",
    title: "Computer Applications",
    shortTitle: "Computer Applications",
    description:
      "Develop strong foundations in software, applications, computing systems and emerging digital technologies.",
    schoolHref:
      "/programs/school-of-computer-science-and-engineering",
    programs: [
      {
        name: "BCA (Hons.) — Computer Applications",
        href: "/programs/school-of-computer-science-and-engineering/bca",
      },
      {
        name: "BCA (Hons.) — Artificial Intelligence & Machine Learning",
        href: "/programs/school-of-computer-science-and-engineering/bca-artificial-intelligence-and-machine-learning",
      },
      {
        name: "BCA (Hons.) — Cybersecurity",
        href: "/programs/school-of-computer-science-and-engineering/bca-cyber-security",
      },
      {
        name: "BCA (Hons.) — Data Science & Business Analytics",
        href: "/programs/school-of-computer-science-and-engineering/bca-data-science-and-business-analytics",
      },
      {
        name: "MCA",
        href: "/programs/school-of-computer-science-and-engineering/mca",
      },
      {
        name: "Ph.D. — Computer Applications",
        href: "/phd-computer-application",
      },
    ],
  },

  {
    id: "business",
    number: "03",
    title: "Business Management",
    shortTitle: "Business Management",
    description:
      "Develop business leaders with specialised pathways across management, finance, marketing, human resources, entrepreneurship and emerging business technologies.",
    schoolHref:
      "/programs/school-of-commerce-and-business-management",
    programs: [
      {
        name: "BBA (Hons.) — Bachelor of Business Administration",
        href: "/programs/school-of-commerce-and-business-management/bba",
      },
      {
        name: "BBA (Hons.) — International Accounting with ACCA UK",
        href: "/programs/school-of-commerce-and-business-management/bba-international-accounting",
      },
      {
        name: "BBA (Hons.) — Human Resource Management",
        href: "/programs/school-of-commerce-and-business-management/bba-human-resource-management",
      },
      {
        name: "BBA (Hons.) — Import & Export Management",
        href: "/programs/school-of-commerce-and-business-management/bba-export-and-import-management",
      },
      {
        name: "BBA (Hons.) — Banking & Finance",
        href: "/programs/school-of-commerce-and-business-management/bba-banking-and-finance",
      },
      {
        name: "BBA (Hons.) — Marketing",
        href: "/programs/school-of-commerce-and-business-management/bba-marketing",
      },
      {
        name: "BBA (Hons.) — FinTech",
        href: "/programs/school-of-commerce-and-business-management/bba-fintech",
      },
      {
        name: "BBA (Hons.) — Artificial Intelligence & Data Analytics",
        href: "/programs/school-of-commerce-and-business-management/bba-artificial-intelligence-and-data-analytics",
      },
      {
        name: "BBA (Hons.) — Digital Marketing",
        href: "/programs/school-of-commerce-and-business-management/bba-digital-marketing",
      },
      {
        name: "BBA (Hons.) — Entrepreneurship and Family Business",
      },
      {
        name: "MBA — AI For Business",
        href: "/programs/school-of-commerce-and-business-management/mba-ai-for-business",
      },
      {
        name: "MBA — Digital Marketing",
        href: "/programs/school-of-commerce-and-business-management/mba-digital-marketing",
      },
      {
        name: "MBA — FinTech",
        href: "/programs/school-of-commerce-and-business-management/mba",
      },
      {
        name: "MBA — Finance",
        href: "/programs/school-of-commerce-and-business-management/mba-finance",
      },
      {
        name: "MBA — Marketing",
        href: "/programs/school-of-commerce-and-business-management/mba-marketing",
      },
      {
        name: "MBA — Human Resource Management",
        href: "/programs/school-of-commerce-and-business-management/mba-human-resource-management",
      },
      {
        name: "MBA — Supply Chain Management",
        href: "/programs/school-of-commerce-and-business-management/mba-supply-chain-management-and-logistics",
      },
      {
        name: "MBA — Entrepreneurship and Family Business",
        href: "/programs/school-of-commerce-and-business-management/mba-entrepreneurship-family-business",
      },
      {
        name: "Ph.D. — Business & Management",
        href: "/phd-management",
      },
    ],
  },

  {
    id: "commerce",
    number: "04",
    title: "Commerce",
    shortTitle: "Commerce",
    description:
      "Explore accounting, taxation, banking, insurance and international accounting through industry-oriented commerce education.",
    schoolHref:
      "/programs/school-of-commerce-and-business-management",
    programs: [
      {
        name: "B.Com. (Hons.) — Bachelor of Commerce",
        href: "/programs/school-of-commerce-and-business-management/bcom",
      },
      {
        name: "B.Com. (Hons.) — Auditing & Taxation",
        href: "/programs/school-of-commerce-and-business-management/bcom-auditing-and-taxation",
      },
      {
        name: "B.Com. (Hons.) — Banking & Insurance",
        href: "/programs/school-of-commerce-and-business-management/bcom-banking-and-insurance",
      },
      {
        name: "B.Com. (Hons.) — Advanced Accounting",
      },
      {
        name: "B.Com. (Hons.) — International Accounting with ACCA UK",
        href: "/programs/school-of-commerce-and-business-management/bcom-international-accounting",
      },
      {
        name: "M.Com.",
      },
      {
        name: "Ph.D. — Commerce",
        href: "/phd-commerce",
      },
    ],
  },

  {
    id: "pharmacy",
    number: "05",
    title: "Pharmacy",
    shortTitle: "Pharmacy",
    description:
      "Build knowledge across pharmaceutical sciences, pharmaceutics and professional pharmacy practice.",
    schoolHref:
      "/programs/geeta-institute-of-pharmacy",
    programs: [
      {
        name: "D.Pharm. — Diploma in Pharmacy",
        href: "/programs/geeta-institute-of-pharmacy/d-pharmacy",
      },
      {
        name: "B.Pharm. — Bachelor of Pharmacy",
        href: "/programs/geeta-institute-of-pharmacy/b-pharmacy",
      },
      {
        name: "M.Pharm. — Pharmaceutics",
        href: "/programs/geeta-institute-of-pharmacy/m-pharmacy-in-pharmaceutics",
      },
      {
        name: "Ph.D. — Pharmaceutical Sciences",
        href: "/phd-pharmacy",
      },
    ],
  },

  {
    id: "agriculture",
    number: "06",
    title: "Agricultural Sciences",
    shortTitle: "Agricultural Sciences",
    description:
      "Study agriculture through scientific, sustainable and research-driven approaches to modern agricultural practices.",
    schoolHref:
      "/programs/school-of-agricultural-studies",
    programs: [
      {
        name: "B.Sc. (Hons.) — Agriculture",
        href: "/programs/school-of-agricultural-studies/bsc-agriculture",
      },
      {
        name: "M.Sc. Agriculture (Agronomy)",
        href: "/programs/school-of-agricultural-studies/msc-agriculture-agronomy",
      },
      {
        name: "Ph.D. — Agriculture",
        href: "/phd-agriculture",
      },
    ],
  },

  {
    id: "law",
    number: "07",
    title: "Law",
    shortTitle: "Law",
    description:
      "Develop legal knowledge and professional capabilities through undergraduate, postgraduate and doctoral study.",
    schoolHref:
      "/programs/geeta-global-law-school",
    programs: [
      {
        name: "B.A. LL.B. (Hons.)",
        href: "/programs/geeta-global-law-school",
      },
      {
        name: "B.B.A. LL.B. (Hons.)",
        href: "/programs/geeta-global-law-school",
      },
      {
        name: "Master of Law — LLM",
        href: "/programs/geeta-global-law-school/llm",
      },
      {
        name: "Ph.D. — Law",
        href: "/phd-law",
      },
    ],
  },

  {
    id: "hospitality",
    number: "08",
    title: "Hospitality & Hotel Management",
    shortTitle: "Hospitality & Hotel Management",
    description:
      "Prepare for careers across hospitality, hotel operations and tourism through professional and specialised education.",
    schoolHref:
      "/programs/school-of-hospitality-and-hotel-management",
    programs: [
      {
        name: "Diploma in Hotel Management",
        href: "/programs/school-of-hospitality-and-hotel-management/diploma-in-hotel-management",
      },
      {
        name: "B.Sc. (Hons.) — Hotel Management",
        href: "/programs/school-of-hospitality-and-hotel-management/bsc-hotel-management",
      },
      {
        name: "M.Sc. — Hotel Management",
        href: "/programs/school-of-hospitality-and-hotel-management",
      },
      {
        name: "Ph.D. — Hotel & Tourism Management",
        href: "/programs/school-of-hospitality-and-hotel-management",
      },
    ],
  },

  {
    id: "nutrition",
    number: "09",
    title: "Nutrition & Dietetics",
    shortTitle: "Nutrition & Dietetics",
    description:
      "Explore nutrition science, dietetics and health-focused research through undergraduate, postgraduate and doctoral programs.",
    schoolHref:
      "/programs/school-of-health-and-allied-sciences",
    programs: [
      {
        name: "B.Sc. (Hons.) — Nutrition & Dietetics",
        href: "/programs/school-of-health-and-allied-sciences/bsc-nutrition-and-dietetics",
      },
      {
        name: "M.Sc. — Nutrition & Dietetics",
        href: "/programs/school-of-health-and-allied-sciences/msc-nutrition-and-dietetics",
      },
      {
        name: "Ph.D. — Nutrition & Dietetics",
        href: "/phd-nutrition-and-dietetics",
      },
    ],
  },

  {
    id: "humanities",
    number: "10",
    title: "Humanities & Social Sciences",
    shortTitle: "Humanities & Social Sciences",
    description:
      "Understand society, people, economics, politics and culture through interdisciplinary humanities and social science education.",
    schoolHref:
      "/programs/school-of-humanities-and-social-science",
    programs: [
      {
        name: "B.Sc. (Hons.) — Psychology",
        href: "/bsc-psychology",
      },
      {
        name: "B.A. (Hons.)",
        href: "/programs/school-of-humanities-and-social-science",
      },
      {
        name: "B.A. (Hons.) — Political Science",
        href: "/programs/school-of-humanities-and-social-science/ba-political-science",
      },
      {
        name: "B.A. (Hons.) — Economics",
        href: "/programs/school-of-humanities-and-social-science/ba-economics",
      },
      {
        name: "B.A. (Hons.) — Psychology",
        href: "/programs/school-of-humanities-and-social-science/ba-psychology",
      },
      {
        name: "B.A. (Hons.) — English",
        href: "/programs/school-of-humanities-and-social-science",
      },
      {
        name: "M.A. — Political Science",
        href: "/programs/school-of-humanities-and-social-science",
      },
      {
        name: "M.A. — Psychology",
        href: "/programs/school-of-humanities-and-social-science",
      },
      {
        name: "M.A. — English",
        href: "/programs/school-of-humanities-and-social-science",
      },
      {
        name: "M.A. — Economics",
        href: "/programs/school-of-humanities-and-social-science",
      },
      {
        name: "Ph.D. — Psychology",
        href: "/phd-psychology",
      },
      {
        name: "Ph.D. — Political Science",
        href: "/phd-political-science",
      },
    ],
  },

  {
    id: "forensic",
    number: "11",
    title: "Forensic Science",
    shortTitle: "Forensic Science",
    description:
      "Combine scientific investigation, analytical thinking and evidence-based approaches to explore the world of forensic sciences.",
    schoolHref: "/programs/school-of-forensic-sciences",
    programs: [
      {
        name: "B.Sc. (Hons.) — Forensic Sciences",
        href: "/programs/school-of-forensic-sciences/bsc-forensic-science",
      },
      {
        name: "M.Sc. — Forensic Sciences",
        href: "/programs/school-of-forensic-sciences/msc-forensic-science",
      },
      {
        name: "Ph.D. — Forensic Sciences",
        href: "/phd-forensic-science",
      },
    ],
  },

  {
    id: "nursing",
    number: "12",
    title: "Nursing*",
    shortTitle: "Nursing*",
    description:
      "Professional healthcare education focused on developing skilled and compassionate nursing professionals.",
    schoolHref: "/programs/geeta-nursing-college",
    programs: [
      {
        name: "B.Sc. Nursing*",
        href: "/programs/geeta-nursing-college",
      },
      {
        name: "GNM — General Nursing & Midwifery*",
        href: "/programs/geeta-nursing-college",
      },
    ],
  },
];

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
              color: "var(--gu-navy)",
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
                className="flex w-full items-center justify-between gap-3 p-3 text-left transition-colors duration-200 hover:bg-slate-50/70 sm:p-5"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Icon Box */}
                  <div
                    className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: isOpen
                        ? "var(--gu-navy)"
                        : "rgba(6, 53, 95, 0.06)",
                      color: isOpen
                        ? "var(--gu-gold)"
                        : "var(--gu-navy)",
                    }}
                  >
                    <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>

                  {/* Title */}
                  <div className="min-w-0">
                    <h4
                      className="font-serif text-sm font-bold sm:text-lg"
                      style={{
                        color: "var(--gu-navy)",
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
                        ? "rotate-180 bg-[var(--gu-navy)] text-white border-[var(--gu-navy)] shadow-xs"
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
                                className="h-2 w-2 rounded-full shrink-0 transition-transform duration-200 group-hover:scale-125 mt-[6px]"
                                style={{
                                  backgroundColor: "var(--gu-gold)",
                                }}
                              />

                              <span
                                className={`flex-1 text-xs sm:text-sm font-semibold leading-5 transition-colors duration-200 ${
                                  isLink
                                    ? "group-hover:text-[var(--gu-gold)]"
                                    : ""
                                }`}
                                style={{
                                  color: "var(--gu-navy)",
                                }}
                              >
                                {program.name}
                              </span>

                              {isLink && (
                                <span
                                  className="opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100 flex items-center shrink-0 mt-0.5"
                                  style={{
                                    color: "var(--gu-gold)",
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
                                className="group flex h-full min-h-[58px] sm:min-h-[66px] items-start gap-2.5 sm:gap-3 rounded-xl border bg-white p-3 sm:p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#E8871A]/40"
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
                              className="flex h-full min-h-[58px] sm:min-h-[66px] items-start gap-2.5 sm:gap-3 rounded-xl border bg-white p-3 sm:p-4"
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
                color: "var(--gu-navy)",
              }}
            >
              View the complete school offering.
            </p>
          </div>

          <Link
            href={category.schoolHref}
            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              backgroundColor: "var(--gu-navy)",
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

export default function HomeProgramsSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>("cse");
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
    programCategories.find((category) => category.id === activeCategory) ??
    programCategories[0];

  return (
    <section
      aria-labelledby="programs-heading"
      className="relative overflow-hidden bg-white py-12 md:py-16"
    >
      {/* Background accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full opacity-10 blur-3xl"
        style={{
          backgroundColor: "var(--gu-gold)",
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
                color: "var(--gu-navy)",
              }}
            >
              Programs Offered
            </h2>

            <div
              className="mx-auto mt-5 h-1 w-16 rounded-full"
              style={{
                backgroundColor: "var(--gu-gold)",
              }}
            />

            <p
              className="mx-auto mt-6 max-w-2xl text-base leading-8 sm:text-lg"
              style={{
                color: "var(--gu-text-muted)",
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
                  backgroundColor: "var(--gu-bg)",
                }}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col gap-2">
                    {programCategories.map((category) => {
                      const isActive = category.id === activeCategory;

                      return (
                        <div key={category.id} className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => toggleCategory(category.id)}
                            aria-expanded={isActive}
                            className="group flex items-center justify-between rounded-xl px-3.5 py-3.5 text-left transition-all duration-200 sm:px-4"
                            style={{
                              backgroundColor: isActive
                                ? "var(--gu-navy)"
                                : "transparent",
                              color: isActive
                                ? "white"
                                : "var(--gu-navy)",
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="flex h-2 w-2 rounded-full shrink-0 transition-transform duration-200 group-hover:scale-125"
                                style={{
                                  backgroundColor: "var(--gu-gold)",
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
                                color: "var(--gu-gold)",
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

                          {/* MOBILE INLINE ACCORDION CONTENT (Opens directly under clicked school tab) */}
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