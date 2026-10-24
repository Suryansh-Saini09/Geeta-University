"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
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
import { ProgramFields, ProgramPublishingPanel } from "./ProgramFormFields";
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
    if (hasFull) return { label: "Complete", color: "bg-[#d1fae5] text-[#065f46]" };
    if (hasPartial) return { label: "Partial", color: "bg-[#fef3c7] text-[#92400e]" };
    return { label: "Not Configured", color: "bg-[#f1f5f9] text-[#475569]" };
  };

  const sectionCards = [
    {
      id: "overview",
      title: "Basic Information",
      status: getSectionStatus(!!(program.name && program.slug && program.departmentId), true),
    },
    {
      id: "hero",
      title: "Hero Banner & Quick Facts",
      status: getSectionStatus(
        !!(overview.hero?.title && overview.hero?.image && overview.quickInfo?.duration),
        !!(overview.hero?.title || overview.hero?.image)
      ),
    },
    {
      id: "academicOverview",
      title: "Academic Overview & Curriculum",
      status: getSectionStatus(
        !!(overview.overview?.paragraphs?.length > 0 && overview.subjects?.length > 0),
        !!(overview.overview?.title || overview.subjects?.length > 0)
      ),
    },
    {
      id: "admissions",
      title: "Admissions & Eligibility",
      status: getSectionStatus(
        !!(overview.admission?.eligibility || program.eligibility),
        !!(overview.admission?.eligibility || program.eligibility)
      ),
    },
    {
      id: "whyGeeta",
      title: "Why Choose Geeta",
      status: getSectionStatus(
        !!(overview.whyGeeta?.reasons && overview.whyGeeta.reasons.length > 0),
        !!overview.whyGeeta?.title
      ),
    },
    {
      id: "careers",
      title: "Career Pathways & Recruiters",
      status: getSectionStatus(
        !!(overview.career?.roles && overview.career.roles.length > 0),
        !!overview.career?.title
      ),
    },
    {
      id: "learningSpaces",
      title: "Learning Spaces & Labs",
      status: getSectionStatus(
        !!(overview.learningSpaces?.spaces && overview.learningSpaces.spaces.length > 0),
        !!overview.learningSpaces?.title
      ),
    },
    {
      id: "scholarships",
      title: "Scholarships & GUTS",
      status: getSectionStatus(
        !!(overview.scholarships?.scholarships?.title || overview.scholarships?.guts?.title),
        !!overview.scholarships
      ),
    },
    {
      id: "faculty",
      title: "Faculty & Mentors (Ordered)",
      status: getSectionStatus(
        !!(overview.faculty && overview.faculty.length > 0),
        !!(overview.faculty && overview.faculty.length > 0)
      ),
    },
    {
      id: "testimonials",
      title: "Student Testimonials",
      status: getSectionStatus(
        !!(overview.testimonials && overview.testimonials.length > 0),
        !!(overview.testimonials && overview.testimonials.length > 0)
      ),
    },
    {
      id: "faqs",
      title: "Frequently Asked Questions",
      status: getSectionStatus(
        !!(overview.faqs && overview.faqs.length > 0),
        !!(overview.faqs && overview.faqs.length > 0)
      ),
    },
    {
      id: "cta",
      title: "Final Call to Action",
      status: getSectionStatus(
        !!(overview.cta?.title && overview.cta?.applyUrl),
        !!overview.cta?.title
      ),
    },
    {
      id: "seo",
      title: "SEO & Social Metadata",
      status: getSectionStatus(
        !!(overview.seo?.title && overview.seo?.description),
        !!(overview.seo?.title || program.seo?.title)
      ),
    },
    {
      id: "advancedJson",
      title: "Advanced JSON Editor",
      status: { label: "Complete", color: "bg-[#f1f5f9] text-[#334155]" },
    },
  ];

  const completedCount = sectionCards.filter((s) => s.status.label === "Complete").length;
  const completionPercentage = Math.round((completedCount / sectionCards.length) * 100);
  const filteredCards = sectionCards.filter((c) =>
    c.title.toLowerCase().includes(sectionFilter.toLowerCase())
  );

  const handleSelectSection = (id: string) => {
    router.push(`/admin/programs/${program.id}/edit?section=${id}`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Top Header Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Link
          href="/admin/programs"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Academic Programs
        </Link>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-serif text-3xl font-bold text-[#0f172a]">
                {program.name}
              </h1>
              <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase ${statusStyles[program.status]}`}>
                {program.status}
              </span>
              <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-slate-600 uppercase border border-slate-200">
                {program.level || "Undergraduate Programs"}
              </span>
            </div>

            <p className="text-sm text-slate-500">
              Department: <span className="font-semibold text-slate-800">{program.department.name}</span>{" "}
              <span className="mx-1 text-slate-300">|</span>{" "}
              Slug:{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600 border border-slate-200">
                /{program.slug}
              </code>
            </p>
          </div>

          <Link
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center shrink-0 gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="h-4 w-4 text-slate-400" />
            View Public Course Page
          </Link>
        </div>

        {/* Completeness Bar exactly mirroring reference UI */}
        <div className="mt-8 border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between text-xs mb-2.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white bg-[#374151] px-2 py-0.5 rounded text-[11px] tracking-wide">
                Course Page Completeness:
              </span>
              <span className="font-bold text-[#0f172a]">
                {completedCount} of {sectionCards.length} Sections Complete
              </span>
            </div>
            <span className="font-bold text-[#ea580c] tracking-wide">
              {completionPercentage}% Complete
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#ea580c] transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Feedback Messages */}
      {updated && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          Basic Program Information updated successfully.
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          {sectionCards.find((c) => c.id === activeSection)?.title
            ? `${sectionCards.find((c) => c.id === activeSection)?.title} saved successfully.`
            : "Section content saved successfully."}{" "}
          Public caches revalidated.
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 shadow-sm">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          {error}
        </div>
      )}

      {/* Main Grid: Section Navigation & Active Section Editor */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr] items-start">
        {/* Left Column: Clean Section Selector */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sticky top-6">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              placeholder="Filter sections..."
              className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-700 outline-none transition-colors focus:border-[#0f172a] focus:bg-white"
            />
          </div>

          <nav className="space-y-0.5">
            {filteredCards.map((card) => {
              const isActive = activeSection === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSelectSection(card.id)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-[#0f172a] text-white shadow-sm"
                      : "text-[#334155] hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate pr-2">{card.title}</span>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
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

        {/* Right Column: Active Section Editor */}
        <div className="min-w-0">
          {activeSection === "overview" && (
            <div className="space-y-6">
              <form action={updateProgramAction} className="grid gap-6 xl:grid-cols-[1fr_320px]">
                <input type="hidden" name="id" value={program.id} />

                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="border-b border-slate-100 pb-4 mb-5">
                    <h3 className="font-serif text-xl font-bold text-[#0f172a]">
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