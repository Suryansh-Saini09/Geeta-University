"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Search,
  X,
  ChevronRight,
  Clock,
  Layers,
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
import { ProgramFields, ProgramPublishingPanel } from "./ProgramFormFields";
import { updateProgramAction } from "@/features/admin/programs/actions";
import {
  PROGRAM_SECTIONS_CONFIG,
  ProgramSectionConfigItem,
  ProgramSectionStatus,
  calculateProgramCompleteness,
} from "../programConfig";

/* =========================================================================
   TYPES & PROPS
========================================================================= */

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
  heroImage?: {
    id?: string;
    url?: string;
  } | null;
}

interface ProgramContentManagerProps {
  program: ProgramDataProps;
  departments: Array<{ id: string; name: string; slug: string; shortName: string | null }>;
  mediaAssets?: MediaAssetItem[];
  userRole?: string;
  searchParams?: { section?: string; saved?: string; error?: string; updated?: string };
}

const statusStyles: Record<ContentStatus, string> = {
  DRAFT: "border-slate-200 bg-slate-100 text-slate-700",
  PUBLISHED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  ARCHIVED: "border-amber-200 bg-amber-50 text-amber-700",
};

const statusBadgeStyles: Record<ProgramSectionStatus, { badge: string; dot: string }> = {
  Complete: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dot: "bg-emerald-600",
  },
  Partial: {
    badge: "border-amber-200 bg-amber-50 text-amber-800",
    dot: "bg-amber-600",
  },
  "Not Configured": {
    badge: "border-slate-200 bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
};


function parseKeywordsSafely(rawKeywords: any): string[] | undefined {
  if (!rawKeywords) return undefined;
  if (Array.isArray(rawKeywords)) return rawKeywords;
  if (typeof rawKeywords === "string") {
    try {
      const parsed = JSON.parse(rawKeywords);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return rawKeywords.split(",").map((k) => k.trim()).filter(Boolean);
    }
    return rawKeywords.split(",").map((k) => k.trim()).filter(Boolean);
  }
  return undefined;
}

/* =========================================================================
   MAIN COMPONENT
========================================================================= */

export function ProgramContentManager({
  program,
  departments,
  mediaAssets = [],
  userRole = "ADMIN",
  searchParams = {},
}: ProgramContentManagerProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  // Determine active section from URL query or SSR props
  const rawQuerySection = currentSearchParams.get("section") || searchParams.section || null;
  // Normalize sub-action sections like "quickInfo" to parent "hero"
  const normalizedInitialSection = rawQuerySection === "quickInfo" ? "hero" : rawQuerySection;

  const [activeSection, setActiveSection] = useState<string | null>(normalizedInitialSection);
  const [sectionFilter, setSectionFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const saved = currentSearchParams.get("saved") === "1" || searchParams.saved === "1";
  const updated = currentSearchParams.get("updated") === "1" || searchParams.updated === "1";
  const error = currentSearchParams.get("error") || searchParams.error;

  const overview = useMemo(() => {
    return (program.overview && typeof program.overview === "object" ? program.overview : {}) as Record<string, any>;
  }, [program.overview]);

  const schoolSlug = overview.schoolSlug || program.department.slug || "programs";
  const courseSlug = program.slug;
  const publicUrl = `/programs/${schoolSlug}/${courseSlug}`;

  // Synchronize browser history (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const sec = params.get("section");
      setActiveSection(sec === "quickInfo" ? "hero" : sec);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update browser URL query params
  const updateUrl = (sectionKey: string | null) => {
    const url = new URL(window.location.href);
    if (sectionKey) {
      url.searchParams.set("section", sectionKey);
    } else {
      url.searchParams.delete("section");
    }
    url.searchParams.delete("saved");
    url.searchParams.delete("updated");
    url.searchParams.delete("error");
    window.history.pushState({}, "", url.pathname + url.search);
  };

  const handleSelectSection = (id: string) => {
    setActiveSection(id);
    updateUrl(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToSections = () => {
    setActiveSection(null);
    updateUrl(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Truthful completeness metrics (excluding Advanced JSON)
  const completeness = useMemo(() => {
    return calculateProgramCompleteness(program, overview);
  }, [program, overview]);

  // Current active section configuration item
  const currentSectionConfig = useMemo(() => {
    if (!activeSection) return null;
    return PROGRAM_SECTIONS_CONFIG.find((s) => s.id === activeSection) || null;
  }, [activeSection]);

  // Active section index and sequence
  const currentSectionIndex = useMemo(() => {
    if (!activeSection) return -1;
    return PROGRAM_SECTIONS_CONFIG.findIndex((s) => s.id === activeSection);
  }, [activeSection]);

  const prevSection = useMemo(() => {
    if (currentSectionIndex > 0) {
      return PROGRAM_SECTIONS_CONFIG[currentSectionIndex - 1];
    }
    return null;
  }, [currentSectionIndex]);

  const nextSection = useMemo(() => {
    if (currentSectionIndex >= 0 && currentSectionIndex < PROGRAM_SECTIONS_CONFIG.length - 1) {
      return PROGRAM_SECTIONS_CONFIG[currentSectionIndex + 1];
    }
    return null;
  }, [currentSectionIndex]);

  // Filtered sections for View B catalog
  const filteredContentSections = useMemo(() => {
    return PROGRAM_SECTIONS_CONFIG.filter((section) => {
      // Category filter
      if (selectedCategory !== "ALL" && section.category !== selectedCategory) {
        return false;
      }
      // Text search
      if (!sectionFilter.trim()) return true;
      const q = sectionFilter.toLowerCase();
      return (
        section.title.toLowerCase().includes(q) ||
        section.description.toLowerCase().includes(q) ||
        section.shortTitle.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, sectionFilter]);

  const formattedUpdatedDate = useMemo(() => {
    try {
      const date = new Date(program.updatedAt);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  }, [program.updatedAt]);

  return (
    <div className="space-y-6 max-w-[1280px] mx-auto pb-16">
      {/* ===================================================================
          STAGE B: PROGRAM SECTION OVERVIEW (When no section is active)
      =================================================================== */}
      {!activeSection && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <Link
              href="/admin/programs"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Academic Programs
            </Link>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <h1 className="font-serif text-3xl font-bold text-slate-900">
                    {program.name}
                  </h1>
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase ${
                      statusStyles[program.status]
                    }`}
                  >
                    {program.status}
                  </span>
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-slate-600 uppercase border border-slate-200">
                    {program.level || "Undergraduate"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-1 text-sm text-slate-500">
                  <span>
                    Department:{" "}
                    <strong className="font-semibold text-slate-800">
                      {program.department.name}
                    </strong>
                  </span>
                  <span className="mx-2 text-slate-300">|</span>
                  <span>
                    Slug:{" "}
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700 border border-slate-200">
                      /{program.slug}
                    </code>
                  </span>
                  <span className="mx-2 text-slate-300">|</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    Updated {formattedUpdatedDate}
                  </span>
                </div>
              </div>

              <Link
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center shrink-0 gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-slate-400" />
                View Public Course Page
              </Link>
            </div>

            {/* Truthful Course Page Completeness Bar */}
            <div className="mt-8 border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded text-[11px] tracking-wide">
                    Course Page Completeness:
                  </span>
                  <span className="font-bold text-slate-900">
                    {completeness.completedCount} of {completeness.totalContentSections} Sections Complete
                  </span>
                </div>
                <span className="font-bold text-slate-900 tracking-wide">
                  {completeness.percentage}% Complete
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-900 transition-all duration-500"
                  style={{ width: `${completeness.percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Feedback Messages */}
          {updated && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              Basic Program Information updated successfully. Public caches revalidated.
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              Section changes saved successfully. Public caches revalidated.
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 shadow-xs">
              <AlertCircle className="h-5 w-6 text-red-600 shrink-0" />
              {error}
            </div>
          )}

          {/* Search & Category Filter Bar */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                placeholder="Filter sections by title or description..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-9 text-sm text-slate-900 outline-none transition-colors focus:border-slate-400 focus:bg-white"
              />
              {sectionFilter && (
                <button
                  type="button"
                  onClick={() => setSectionFilter("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-semibold">
              {[
                { id: "ALL", label: "All Sections" },
                { id: "core", label: "Core" },
                { id: "curriculum", label: "Curriculum" },
                { id: "admissions", label: "Admissions" },
                { id: "outcomes", label: "Outcomes" },
                { id: "people", label: "People" },
                { id: "metadata", label: "SEO" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-lg px-2.5 py-1.5 transition-colors shrink-0 ${
                    selectedCategory === cat.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section Cards Catalogue Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredContentSections.map((section) => {
              const statusInfo = completeness.sectionStatuses[section.id] || { status: "Not Configured" };
              const badgeStyle = statusBadgeStyles[statusInfo.status];

              return (
                <div
                  key={section.id}
                  onClick={() => handleSelectSection(section.id)}
                  className="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                        {section.title}
                      </h3>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-bold ${badgeStyle.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${badgeStyle.dot}`} />
                        {statusInfo.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {section.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty Search State */}
          {filteredContentSections.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <Search className="mx-auto h-8 w-8 text-slate-300" />
              <h3 className="mt-3 text-base font-bold text-slate-900">
                No matching sections found
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                No program sections match &ldquo;{sectionFilter}&rdquo;. Try another search term or reset filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSectionFilter("");
                  setSelectedCategory("ALL");
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Reset Search &amp; Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          STAGE C: FULL-WIDTH SECTION EDITOR (When a section is selected)
      =================================================================== */}
      {activeSection && currentSectionConfig && (
        <div className="space-y-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link
              href="/admin/programs"
              className="hover:text-slate-900 transition-colors"
            >
              Academic Programs
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <button
              type="button"
              onClick={handleBackToSections}
              className="hover:text-slate-900 transition-colors truncate max-w-[200px]"
            >
              {program.name}
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-slate-900 font-bold truncate">
              {currentSectionConfig.title}
            </span>
          </nav>

          {/* Focused Editor Workspace Header */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
              <button
                type="button"
                onClick={handleBackToSections}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors self-start"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Program Sections
              </button>

              <div className="flex items-center gap-3">
                <Link
                  href={publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  View Public Page
                </Link>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-bold ${
                      statusBadgeStyles[
                        completeness.sectionStatuses[currentSectionConfig.id]?.status || "Not Configured"
                      ].badge
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        statusBadgeStyles[
                          completeness.sectionStatuses[currentSectionConfig.id]?.status || "Not Configured"
                        ].dot
                      }`}
                    />
                    {completeness.sectionStatuses[currentSectionConfig.id]?.status || "Not Configured"}
                  </span>
                </div>

                <h2 className="font-serif text-2xl font-bold text-slate-900">
                  {currentSectionConfig.title}
                </h2>
                <p className="mt-1 text-xs text-slate-500 max-w-3xl leading-relaxed">
                  {currentSectionConfig.description}
                </p>
              </div>
            </div>
          </div>

          {/* Feedback Messages */}
          {updated && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              Basic Program Information updated successfully. Public caches revalidated.
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              {currentSectionConfig.title} updated successfully. Public caches revalidated.
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 shadow-xs">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              {error}
            </div>
          )}

          {/* Full-Width Workspace Canvas for Active Editor */}
          <div className="min-w-0">
            {activeSection === "overview" && (
              <div className="space-y-6">
                <form action={updateProgramAction} className="grid gap-6 xl:grid-cols-[1fr_320px]">
                  <input type="hidden" name="id" value={program.id} />
                  <input type="hidden" name="section" value="overview" />

                  <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="border-b border-slate-100 pb-4 mb-5">
                      <h3 className="font-serif text-xl font-bold text-slate-900">
                        Basic Program Information
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Manage core program identity, slug routing, department relationship, and program duration.
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
                seoData={
                  overview.seo ||
                  (program.seo
                    ? {
                        title: program.seo.title,
                        description: program.seo.description,
                        keywords: parseKeywordsSafely(program.seo.keywords),
                        canonical: program.seo.canonicalUrl || undefined,
                        ogImage: program.seo.ogImage || undefined,
                      }
                    : undefined)
                }
                mediaAssets={mediaAssets}
                saved={saved}
                error={error}
              />
            )}
          </div>

          {/* Bottom Section Quick-Jump Navigation Bar */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 mt-8">
            {prevSection ? (
              <button
                type="button"
                onClick={() => handleSelectSection(prevSection.id)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors w-full sm:w-auto justify-center"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Previous: {prevSection.shortTitle}
              </button>
            ) : (
              <div className="hidden sm:block" />
            )}

            <button
              type="button"
              onClick={handleBackToSections}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <Layers className="h-3.5 w-3.5" />
              All Program Sections
            </button>

            {nextSection ? (
              <button
                type="button"
                onClick={() => handleSelectSection(nextSection.id)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors w-full sm:w-auto justify-center"
              >
                Next: {nextSection.shortTitle}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <div className="hidden sm:block" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}