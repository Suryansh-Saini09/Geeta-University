"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  ImageIcon,
  BookOpen,
  Compass,
  GraduationCap,
  Users,
  Briefcase,
  Building2,
  Award,
  MessageSquare,
  HelpCircle,
  Megaphone,
  Globe,
  Code,
  CheckCircle2,
  AlertCircle,
  Search,
} from "lucide-react";
import { ContentStatus } from "@prisma/client";

import { MediaAssetItem } from "@/features/admin/departments/components/MediaPickerModal";
import { HeroQuickInfoSectionEditor } from "./HeroQuickInfoSectionEditor";
import { AcademicOverviewSectionEditor } from "./AcademicOverviewSectionEditor";
import { AdmissionsSectionEditor } from "./AdmissionsSectionEditor";
import { WhyGeetaSectionEditor } from "./WhyGeetaSectionEditor";
import { CareerPathwaysSectionEditor } from "./CareerPathwaysSectionEditor";
import { LearningSpacesSectionEditor } from "./LearningSpacesSectionEditor";
import { ScholarshipsSectionEditor } from "./ScholarshipsSectionEditor";
import { FacultyMentorsSectionEditor } from "./FacultyMentorsSectionEditor";
import { TestimonialsSectionEditor } from "./TestimonialsSectionEditor";
import { FaqSectionEditor } from "./FaqSectionEditor";
import { CtaSectionEditor } from "./CtaSectionEditor";
import { SeoSectionEditor } from "./SeoSectionEditor";
import { AdvancedJsonSectionEditor } from "./AdvancedJsonSectionEditor";
import { ProgramFields, ProgramPublishingPanel } from "@/app/admin/(secure)/programs/new/page";
import { updateProgramAction } from "@/features/admin/programs/actions";

export interface ProgramDataProps {
  id: string;
  name: string;
  slug: string;
  departmentId: string;
  level?: string | null;
  duration?: string | null;
  eligibility?: string | null;
  status: ContentStatus;
  sortOrder: number;
  updatedAt: Date | string;
  overview: any;
  department: {
    id: string;
    name: string;
    slug?: string;
    shortName?: string | null;
  };
  seo?: any | null;
}

interface ProgramContentManagerProps {
  program: ProgramDataProps;
  departments: Array<{ id: string; name: string; slug: string; shortName: string | null }>;
  mediaAssets?: MediaAssetItem[];
  userRole?: string;
  searchParams?: { section?: string; saved?: string; error?: string; updated?: string };
}

const statusStyles = {
  DRAFT: "border-slate-200 bg-slate-100 text-slate-700",
  PUBLISHED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  ARCHIVED: "border-amber-200 bg-amber-50 text-amber-700",
};

export function ProgramContentManager({
  program,
  departments,
  mediaAssets = [],
  userRole = "ADMIN",
  searchParams = {},
}: ProgramContentManagerProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  const activeSection = currentSearchParams.get("section") || searchParams.section || "overview";
  const saved = currentSearchParams.get("saved") === "1" || searchParams.saved === "1";
  const updated = currentSearchParams.get("updated") === "1" || searchParams.updated === "1";
  const error = currentSearchParams.get("error") || searchParams.error;

  const overview = (program.overview && typeof program.overview === "object" ? program.overview : {}) as Record<string, any>;
  const [sectionFilter, setSectionFilter] = useState("");

  const schoolSlug = overview.schoolSlug || program.department.slug || "programs";
  const courseSlug = program.slug;
  const publicUrl = `/programs/${schoolSlug}/${courseSlug}`;

  // Helper to compute completeness status
  const getSectionStatus = (
    hasFull: boolean,
    hasPartial: boolean
  ): { label: "Complete" | "Partial" | "Not Configured"; color: string } => {
    if (hasFull) return { label: "Complete", color: "bg-emerald-100 text-emerald-800" };
    if (hasPartial) return { label: "Partial", color: "bg-amber-100 text-amber-800" };
    return { label: "Not Configured", color: "bg-slate-100 text-slate-500" };
  };

  const sectionCards = [
    {
      id: "overview",
      title: "Basic Information",
      desc: "Program identity, department assignment, level, duration, and publication status",
      icon: GraduationCap,
      status: getSectionStatus(!!(program.name && program.slug && program.departmentId), true),
    },
    {
      id: "hero",
      title: "Hero Banner & Quick Facts",
      desc: "Banner title, description, desktop & mobile imagery, duration, mode, and intake",
      icon: ImageIcon,
      status: getSectionStatus(
        !!(overview.hero?.title && overview.hero?.image && overview.quickInfo?.duration),
        !!(overview.hero?.title || overview.hero?.image)
      ),
    },
    {
      id: "academicOverview",
      title: "Academic Overview & Curriculum",
      desc: "Detailed academic description, curriculum subjects, takeaways, and learning outcomes",
      icon: BookOpen,
      status: getSectionStatus(
        !!(overview.overview?.paragraphs?.length > 0 && overview.subjects?.length > 0),
        !!(overview.overview?.title || overview.subjects?.length > 0)
      ),
    },
    {
      id: "admissions",
      title: "Admissions & Eligibility",
      desc: "Eligibility prerequisites, admission steps, application links, and criteria",
      icon: Compass,
      status: getSectionStatus(
        !!(overview.admission?.eligibility || program.eligibility),
        !!(overview.admission?.eligibility || program.eligibility)
      ),
    },
    {
      id: "whyGeeta",
      title: "Why Choose Geeta",
      desc: "Institutional USPs, distinctive advantages, and academic differentiators",
      icon: Award,
      status: getSectionStatus(
        !!(overview.whyGeeta?.reasons && overview.whyGeeta.reasons.length > 0),
        !!overview.whyGeeta?.title
      ),
    },
    {
      id: "careers",
      title: "Career Pathways & Recruiters",
      desc: "Industry job profiles, government/private pathways, and hiring partners",
      icon: Briefcase,
      status: getSectionStatus(
        !!(overview.career?.roles && overview.career.roles.length > 0),
        !!overview.career?.title
      ),
    },
    {
      id: "learningSpaces",
      title: "Learning Spaces & Labs",
      desc: "Smart laboratories, computing hubs, research studios, and campus photos",
      icon: Building2,
      status: getSectionStatus(
        !!(overview.learningSpaces?.spaces && overview.learningSpaces.spaces.length > 0),
        !!overview.learningSpaces?.title
      ),
    },
    {
      id: "scholarships",
      title: "Scholarships & GUTS",
      desc: "Merit fee concessions, criteria bands, and Geeta University Talent Search details",
      icon: Award,
      status: getSectionStatus(
        !!(overview.scholarships?.scholarships?.title || overview.scholarships?.guts?.title),
        !!overview.scholarships
      ),
    },
    {
      id: "faculty",
      title: "Faculty & Mentors (Ordered)",
      desc: "Professor roster, research specializations, photos, and public display ordering",
      icon: Users,
      status: getSectionStatus(
        !!(overview.faculty && overview.faculty.length > 0),
        !!(overview.faculty && overview.faculty.length > 0)
      ),
    },
    {
      id: "testimonials",
      title: "Student Testimonials",
      desc: "Alumni success stories, company placements, package figures, and photos",
      icon: MessageSquare,
      status: getSectionStatus(
        !!(overview.testimonials && overview.testimonials.length > 0),
        !!(overview.testimonials && overview.testimonials.length > 0)
      ),
    },
    {
      id: "faqs",
      title: "Frequently Asked Questions",
      desc: "Admissions, academic life, and student inquiries answered directly",
      icon: HelpCircle,
      status: getSectionStatus(
        !!(overview.faqs && overview.faqs.length > 0),
        !!(overview.faqs && overview.faqs.length > 0)
      ),
    },
    {
      id: "cta",
      title: "Final Call to Action",
      desc: "Closing application callout banner, helpline contacts, and brochure download",
      icon: Megaphone,
      status: getSectionStatus(
        !!(overview.cta?.title && overview.cta?.applyUrl),
        !!overview.cta?.title
      ),
    },
    {
      id: "seo",
      title: "SEO & Social Metadata",
      desc: "Meta title, SERP description, search keywords, canonical URL, and OG preview",
      icon: Globe,
      status: getSectionStatus(
        !!(overview.seo?.title && overview.seo?.description),
        !!(overview.seo?.title || program.seo?.title)
      ),
    },
    {
      id: "advancedJson",
      title: "Advanced JSON Editor",
      desc: "Direct low-level inspection and raw JSON payload manipulation",
      icon: Code,
      status: { label: "Complete", color: "bg-slate-100 text-slate-700" },
    },
  ];

  const completedCount = sectionCards.filter((s) => s.status.label === "Complete").length;
  const filteredCards = sectionCards.filter(
    (c) =>
      c.title.toLowerCase().includes(sectionFilter.toLowerCase()) ||
      c.desc.toLowerCase().includes(sectionFilter.toLowerCase())
  );

  const handleSelectSection = (id: string) => {
    router.push(`/admin/programs/${program.id}/edit?section=${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Program Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/programs"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Academic Programs
            </Link>

            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <h2 className="font-serif text-3xl font-bold text-[#0A1F44]">
                {program.name}
              </h2>
              <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusStyles[program.status]}`}>
                {program.status}
              </span>
              <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                {program.level || "Degree Course"}
              </span>
            </div>

            <p className="mt-1.5 text-sm text-slate-500">
              Department: <strong className="text-slate-800">{program.department.name}</strong> • Slug:{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700">
                /{program.slug}
              </code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-[#0A1F44] shadow-xs hover:bg-slate-100 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Public Course Page
            </Link>
          </div>
        </div>

        {/* Completeness Bar */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              Course Page Completeness:{" "}
              <strong className="text-[#0A1F44]">
                {completedCount} of {sectionCards.length} Sections Complete
              </strong>
            </span>
            <span className="font-bold text-[#E8871A]">
              {Math.round((completedCount / sectionCards.length) * 100)}% Complete
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0A1F44] to-[#E8871A] transition-all duration-500"
              style={{ width: `${(completedCount / sectionCards.length) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* Feedback Messages */}
      {updated ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          Basic Program Information updated successfully.
        </div>
      ) : null}

      {saved ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          Section content saved and persisted to Aiven MySQL. Public caches revalidated.
        </div>
      ) : null}

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          {error}
        </div>
      ) : null}

      {/* Main Grid: Section Navigation Tabs & Active Section Editor */}
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Left Column: Section Selector */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                placeholder="Filter sections..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <nav className="mt-3 space-y-1">
              {filteredCards.map((card) => {
                const Icon = card.icon;
                const isActive = activeSection === card.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleSelectSection(card.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition ${
                      isActive
                        ? "bg-[#0A1F44] text-white shadow-xs"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#E8871A]" : "text-slate-400"}`} />
                      <span className="truncate">{card.title}</span>
                    </div>
                    <span
                      className={`ml-2 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        isActive ? "bg-white/20 text-white" : card.status.color
                      }`}
                    >
                      {card.status.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Right Column: Active Section Editor */}
        <div className="min-w-0">
          {activeSection === "overview" && (
            <div className="space-y-6">
              <form action={updateProgramAction} className="grid gap-6 xl:grid-cols-[1fr_320px]">
                <input type="hidden" name="id" value={program.id} />

                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="border-b border-slate-100 pb-4 mb-5">
                    <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                      Basic Program Information
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Manage core identity, slug routing, department relationship, and program duration.
                    </p>
                  </div>

                  <ProgramFields
                    departments={departments}
                    defaults={{
                      departmentId: program.departmentId,
                      name: program.name,
                      slug: program.slug,
                      level: program.level,
                      duration: program.duration,
                      eligibility: program.eligibility,
                    }}
                  />
                </section>

                <ProgramPublishingPanel
                  defaultStatus={program.status}
                  defaultSortOrder={program.sortOrder}
                  buttonLabel="Save Basic Info"
                />
              </form>
            </div>
          )}

          {activeSection === "hero" && (
            <HeroQuickInfoSectionEditor
              programId={program.id}
              programName={program.name}
              heroData={overview.hero}
              quickInfoData={overview.quickInfo}
              mediaAssets={mediaAssets}
              saved={saved}
              error={error}
            />
          )}

          {activeSection === "academicOverview" && (
            <AcademicOverviewSectionEditor
              programId={program.id}
              programName={program.name}
              overviewData={overview.overview}
              takeaways={overview.takeaways}
              subjects={overview.subjects}
              subjectsTitle={overview.subjectsTitle}
              subjectsParagraphs={overview.subjectsParagraphs}
              learningOutcomes={overview.learningOutcomes}
              mediaAssets={mediaAssets}
              saved={saved}
              error={error}
            />
          )}

          {activeSection === "admissions" && (
            <AdmissionsSectionEditor
              programId={program.id}
              programName={program.name}
              admissionData={overview.admission}
              saved={saved}
              error={error}
            />
          )}

          {activeSection === "whyGeeta" && (
            <WhyGeetaSectionEditor
              programId={program.id}
              programName={program.name}
              whyGeetaData={overview.whyGeeta}
              saved={saved}
              error={error}
            />
          )}

          {activeSection === "careers" && (
            <CareerPathwaysSectionEditor
              programId={program.id}
              programName={program.name}
              careerData={overview.career}
              mediaAssets={mediaAssets}
              saved={saved}
              error={error}
            />
          )}

          {activeSection === "learningSpaces" && (
            <LearningSpacesSectionEditor
              programId={program.id}
              programName={program.name}
              learningSpacesData={overview.learningSpaces}
              mediaAssets={mediaAssets}
              saved={saved}
              error={error}
            />
          )}

          {activeSection === "scholarships" && (
            <ScholarshipsSectionEditor
              programId={program.id}
              programName={program.name}
              scholarshipsData={overview.scholarships}
              saved={saved}
              error={error}
            />
          )}

          {activeSection === "faculty" && (
            <FacultyMentorsSectionEditor
              programId={program.id}
              programName={program.name}
              facultyData={overview.faculty}
              mediaAssets={mediaAssets}
              saved={saved}
              error={error}
            />
          )}

          {activeSection === "testimonials" && (
            <TestimonialsSectionEditor
              programId={program.id}
              programName={program.name}
              testimonialsData={overview.testimonials}
              mediaAssets={mediaAssets}
              saved={saved}
              error={error}
            />
          )}

          {activeSection === "faqs" && (
            <FaqSectionEditor
              programId={program.id}
              programName={program.name}
              faqsData={overview.faqs}
              saved={saved}
              error={error}
            />
          )}

          {activeSection === "cta" && (
            <CtaSectionEditor
              programId={program.id}
              programName={program.name}
              ctaData={overview.cta}
              saved={saved}
              error={error}
            />
          )}

          {activeSection === "seo" && (
            <SeoSectionEditor
              programId={program.id}
              programName={program.name}
              seoData={overview.seo || (program.seo ? {
                title: program.seo.title,
                description: program.seo.description,
                keywords: program.seo.keywords ? JSON.parse(program.seo.keywords) : undefined,
                canonical: program.seo.canonicalUrl || undefined,
                ogImage: program.seo.ogImage || undefined,
              } : undefined)}
              mediaAssets={mediaAssets}
              saved={saved}
              error={error}
            />
          )}

          {activeSection === "advancedJson" && (
            <AdvancedJsonSectionEditor
              programId={program.id}
              programName={program.name}
              overviewData={overview}
              saved={saved}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
}
