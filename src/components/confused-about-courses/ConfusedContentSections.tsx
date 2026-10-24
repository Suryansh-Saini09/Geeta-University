"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Compass,
  Search,
  CheckSquare,
  BarChart2,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

interface ConfusedContentSectionsProps {
  statisticsReality?: {
    title?: string;
    subtitle?: string;
    cards?: Array<{
      stat: string;
      label: string;
      description: string;
    }>;
  };
  decisionFramework?: {
    title?: string;
    steps?: Array<{
      title: string;
      bullets?: string[];
      stepLabel?: string;
    }>;
  };
  firstDecisionCourse?: {
    title?: string;
    image?: string;
    imageAlt?: string;
    paragraphs?: string[];
    pillarsTitle?: string;
    pillar1Title?: string;
    pillar1Text?: string;
    pillar2Title?: string;
    pillar2Text?: string;
    ctaLabel?: string;
    ctaUrl?: string;
  };
  secondDecisionInstitution?: {
    title?: string;
    intro?: string;
    image?: string;
    imageAlt?: string;
    checklist?: string[];
    ugCtaLabel?: string;
    ugCtaUrl?: string;
    pgCtaLabel?: string;
    pgCtaUrl?: string;
  };
}

const DEFAULT_STAT_CARDS = [
  {
    stat: "99%",
    label: "Medical & IIT Aspirants",
    description: "fail in medical entrance exams each year, and 99.2% do not reach top IITs, highlighting the need to explore diverse degree alternatives.",
  },
  {
    stat: "600+",
    label: "Career Options",
    description: "diverse and high-growth professional fields are available after 12th across technology, management, law, health sciences, and design.",
  },
  {
    stat: "90%+",
    label: "Unplanned Choices",
    description: "of students in India choose their career randomly based purely on peer pressure or casual advice without scientific aptitude testing.",
  },
];

const DEFAULT_FRAMEWORK_STEPS = [
  {
    stepLabel: "Step 1",
    title: "Explore Yourself — Ask",
    bullets: [
      "What are my core interests, values, skills, personality, and natural strengths?",
      "Which top 3 career options do I genuinely prefer?",
      "Which subjects do I passionately want to major in?",
    ],
  },
  {
    stepLabel: "Step 2",
    title: "Workout Career Options — Research",
    bullets: [
      "Look within your mentors, family & industry professionals.",
      "Look for emerging careers having a high global scope.",
      "Look for specializations within chosen majors as per upcoming market trends.",
      "Look for self-employment & entrepreneurship opportunities.",
    ],
  },
  {
    stepLabel: "Step 3",
    title: "Making a Decision",
    bullets: [
      "List down at least 3 viable career options.",
      "Match them directly with your skills, interests, personality, & long-term goals.",
      "List down any limitations or constraints which may obstruct your milestones.",
    ],
  },
  {
    stepLabel: "Step 4",
    title: "Evaluate the Decision",
    bullets: [
      "Peek inside authentic student feedback, placement records, and online reviews.",
      "Discuss directly with current university students and alumni through open forums.",
    ],
  },
];

const STEP_ICONS = [Compass, Search, CheckSquare, BarChart2];

const DEFAULT_CHECKLIST = [
  "Approvals, Affiliations, Rankings, Recognition & Accreditation (UGC, PCI, BCI, etc.)",
  "Updated Syllabus as per Modern Industry Needs & 21st-Century Frameworks",
  "Global Industry Linkages & Active Corporate Tie-ups",
  "State-of-the-Art Infrastructure, High-Tech Labs & Experienced Faculty",
  "Transparent Fee Structure with up to 100% Merit & Test Scholarships",
  "Career Progression Opportunities in Research, Innovation & Incubation",
  "Proven Placement Track Record with 550+ Top Recruiters & Highest Package of 40 LPA",
];

export default function ConfusedContentSections({
  statisticsReality,
  decisionFramework,
  firstDecisionCourse,
  secondDecisionInstitution,
}: ConfusedContentSectionsProps = {}) {
  // 1. Statistics
  const statCards = statisticsReality?.cards !== undefined ? statisticsReality.cards : DEFAULT_STAT_CARDS;
  const statTitle = statisticsReality?.title || "The Reality of Career Decisions in India";
  const statSubtitle = statisticsReality?.subtitle || "Why taking informed, data-backed career decisions early matters more than ever.";

  // 2. Framework
  const frameworkSteps = decisionFramework?.steps !== undefined ? decisionFramework.steps : DEFAULT_FRAMEWORK_STEPS;
  const frameworkTitle = decisionFramework?.title || "What you decide today will affect your FUTURE B'coz it's a BIG DEAL";

  // 3. First Decision Course
  const courseTitle = firstDecisionCourse?.title || "1st Most Important Decision: Choosing the Right Course for Higher Education";
  const courseImage = firstDecisionCourse?.image || "/courses/career-advice.jpg";
  const courseImageAlt = firstDecisionCourse?.imageAlt || "Career Advice from Family, Teachers, and Counsellors";
  const courseParagraphs = firstDecisionCourse?.paragraphs || [
    "Which course will be the best for you? When and how to choose the right course? Which career path after 12th is the best? Well, these are a few questions that might have haunted you after crossing your milestones. To be honest, these queries are universal among students and you are not the only one facing them.",
    "Many students fail to recognize the importance of choosing the right career and regret it later. Without structured career guidance and deep awareness of modern emerging disciplines, there is a high probability of choosing a career pathway randomly.",
  ];
  const pillarsTitle = firstDecisionCourse?.pillarsTitle || "Two Pillars in Finding the Right Course for You";
  const pillar1Title = firstDecisionCourse?.pillar1Title || "1. Career Counselling";
  const pillar1Text = firstDecisionCourse?.pillar1Text || "Getting the right career guidance and being aware of the available options helps you make informed choices rather than picking randomly. For in-person career counselling, visit the Geeta University campus during working hours where our Team of Expert Counsellors guides students to identify their best-fit career with world-class assessment tools and personalized mentorship.";
  const pillar2Title = firstDecisionCourse?.pillar2Title || "2. Psychometric Career Test";
  const pillar2Text = firstDecisionCourse?.pillar2Text || "Psychometric assessments are standard scientific tests used to measure mental capabilities, cognitive abilities, behavioural style, and stream suitability based on personality characteristics. GU's Psychometric Test is fine-tuned to global standards by psychologists and research teams to deliver easy-to-understand actionable recommendations.";
  const ctaLabel = firstDecisionCourse?.ctaLabel || "Take Free Career Test";
  const ctaUrl = firstDecisionCourse?.ctaUrl || "https://psychometrictest.in/career/";

  // 4. Second Decision Institution
  const instTitle = secondDecisionInstitution?.title || "2nd Most Important Decision: Choosing the Right Institution";
  const instIntro = secondDecisionInstitution?.intro || "Your career graph and future opportunities greatly rely on the university from which you earn your degree. While many focus only on reputation, evaluate these critical parameters before finalizing:";
  const checklist = secondDecisionInstitution?.checklist !== undefined ? secondDecisionInstitution.checklist : DEFAULT_CHECKLIST;
  const instImage = secondDecisionInstitution?.image || "/courses/confused-family.webp";
  const instImageAlt = secondDecisionInstitution?.imageAlt || "Career Guidance for Students and Parents at Geeta University";
  const ugCtaLabel = secondDecisionInstitution?.ugCtaLabel || "Explore UG Programs";
  const ugCtaUrl = secondDecisionInstitution?.ugCtaUrl || "/programs-after-12th";
  const pgCtaLabel = secondDecisionInstitution?.pgCtaLabel || "Explore PG Programs";
  const pgCtaUrl = secondDecisionInstitution?.pgCtaUrl || "/post-graduate-programs";

  return (
    <div className="w-full">
      {/* 1. Eye-Opening Statistics & Career Reality Check */}
      {statCards.length > 0 && (
        <section className="bg-[#F3F5F6] py-14 sm:py-20 border-b border-[#E2E8F0]">
          <div className="gu-container">
            <div className="mx-auto max-w-3xl text-center mb-10">
              <h2 className="font-serif text-[28px] sm:text-[34px] md:text-[38px] font-black text-[#0A1F44] leading-tight">
                {statTitle}
              </h2>
              <p className="mt-3 text-[16px] sm:text-[17px] text-[#64748B]">
                {statSubtitle}
              </p>
            </div>

            {/* Reality Check Stat Cards */}
            <div className={`grid grid-cols-1 gap-6 sm:grid-cols-${Math.min(statCards.length, 3)}`}>
              {statCards.map((card, idx) => (
                <div key={idx} className="rounded-[24px] bg-white p-8 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-[#E2E8F0] text-center">
                  <div className={`font-sans text-[42px] sm:text-[48px] font-extrabold leading-none mb-2 ${idx % 2 === 0 ? "text-[#E8871A]" : "text-[#0A1F44]"}`}>
                    {card.stat}
                  </div>
                  <div className="font-bold text-[16px] uppercase tracking-wider text-[#0A1F44] mb-2">
                    {card.label}
                  </div>
                  <p className="text-[15px] leading-relaxed text-[#475569]">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2. Four-Step Decision Framework */}
      {frameworkSteps.length > 0 && (
        <section className="bg-white py-16 sm:py-24 border-b border-[#E2E8F0]">
          <div className="gu-container">
            <div className="mb-12 max-w-3xl">
              <h2 className="font-serif text-[32px] sm:text-[40px] md:text-[46px] font-black leading-tight text-[#0A1F44]">
                {frameworkTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              {frameworkSteps.map((step, idx) => {
                const IconComponent = STEP_ICONS[idx % STEP_ICONS.length];
                return (
                  <div key={idx} className="rounded-[24px] bg-[#F7F9FC] p-8 border border-[#E2E8F0] shadow-sm transition-all duration-200 hover:shadow-md">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0A1F44] px-3.5 py-1 text-[12px] font-bold text-white uppercase tracking-wider" style={{ color: "#ffffff" }}>
                      <IconComponent size={14} className="text-white" />
                      {step.stepLabel || `Step ${idx + 1}`}
                    </div>
                    <h3 className="font-serif text-[22px] font-bold text-[#0A1F44] mb-4">
                      {step.title}
                    </h3>
                    {step.bullets && step.bullets.length > 0 && (
                      <ul className="space-y-2.5 pl-5 list-disc marker:text-[#E8871A] text-[15.5px] leading-relaxed text-[#334155]">
                        {step.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3. 1st Most Important Decision: Choosing the Right Course */}
      <section className="bg-[#F3F5F6] py-16 sm:py-24 border-b border-[#E2E8F0]">
        <div className="gu-container">
          <div className="rounded-[32px] bg-white p-8 sm:p-12 md:p-14 shadow-md border border-[#E2E8F0]">
            <h2 className="font-serif text-[28px] sm:text-[36px] md:text-[42px] font-black text-[#0A1F44] leading-tight mb-8">
              {courseTitle}
            </h2>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              {/* Image Column */}
              <div className="lg:col-span-5 flex justify-center items-start">
                <div className="w-full max-w-[460px] overflow-hidden rounded-[24px] shadow-md border border-[#E2E8F0] bg-white p-2">
                  <Image
                    src={courseImage}
                    alt={courseImageAlt}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain block rounded-[18px]"
                  />
                </div>
              </div>

              {/* Text Column */}
              <div className="lg:col-span-7 space-y-4 text-[17px] sm:text-[18px] leading-[1.85] text-[#334155]">
                {courseParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {/* Two Pillars Subsection */}
            <div className="mt-14 pt-10 border-t border-[#E2E8F0]">
              <h3 className="font-serif text-[24px] sm:text-[28px] font-bold text-[#0A1F44] mb-8">
                {pillarsTitle}
              </h3>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Pillar 1 */}
                <div className="rounded-[24px] bg-[#F7F9FC] p-8 border border-[#E2E8F0]">
                  <h4 className="font-serif text-[21px] font-bold text-[#0A1F44] mb-3">
                    {pillar1Title}
                  </h4>
                  <p className="text-[15.5px] leading-relaxed text-[#475569]">
                    {pillar1Text}
                  </p>
                </div>

                {/* Pillar 2 */}
                <div className="rounded-[24px] bg-[#F7F9FC] p-8 border border-[#E2E8F0]">
                  <h4 className="font-serif text-[21px] font-bold text-[#0A1F44] mb-3">
                    {pillar2Title}
                  </h4>
                  <p className="text-[15.5px] leading-relaxed text-[#475569]">
                    {pillar2Text}
                  </p>
                  {ctaUrl && (
                    <div className="mt-6">
                      <a
                        href={ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] hover:bg-[#c9710f] !text-white px-6 py-3 text-[14.5px] font-bold shadow-md transition-all hover:scale-[1.02]"
                        style={{ color: "#ffffff" }}
                      >
                        <span>{ctaLabel}</span>
                        <ExternalLink size={15} className="!text-white" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 2nd Most Important Decision: Choosing the Right Institution */}
      <section className="bg-white py-16 sm:py-24 border-b border-[#E2E8F0]">
        <div className="gu-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Checklist */}
            <div className="lg:col-span-7">
              <h2 className="font-serif text-[30px] sm:text-[38px] md:text-[44px] font-black text-[#0A1F44] leading-tight">
                {instTitle}
              </h2>

              <p className="mt-5 text-[17px] sm:text-[18px] leading-[1.8] text-[#334155]">
                {instIntro}
              </p>

              {checklist.length > 0 && (
                <ul className="mt-7 space-y-3.5">
                  {checklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[16px] text-[#1E293B]">
                      <CheckCircle2 size={20} className="shrink-0 text-[#E8871A] mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-9 flex flex-wrap items-center gap-4">
                {ugCtaUrl && (
                  <Link
                    href={ugCtaUrl}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] hover:bg-[#c9710f] !text-white px-7 py-3.5 text-[15px] font-bold shadow-md transition-all hover:scale-[1.02]"
                    style={{ color: "#ffffff" }}
                  >
                    <span>{ugCtaLabel}</span>
                    <ArrowRight size={16} className="!text-white" />
                  </Link>
                )}

                {pgCtaUrl && (
                  <Link
                    href={pgCtaUrl}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] hover:bg-[#1A3A6B] !text-white px-7 py-3.5 text-[15px] font-bold shadow-md transition-all hover:scale-[1.02]"
                    style={{ color: "#ffffff" }}
                  >
                    <span>{pgCtaLabel}</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Family Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[440px] overflow-hidden rounded-[28px] shadow-lg border border-[#E2E8F0]">
                <Image
                  src={instImage}
                  alt={instImageAlt}
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
