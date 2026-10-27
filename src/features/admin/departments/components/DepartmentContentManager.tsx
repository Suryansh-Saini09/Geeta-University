"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ImageIcon,
  BookOpen,
  Compass,
  UserCheck,
  GraduationCap,
  Award,
  Users,
  Layers,
  MapPin,
  Building2,
  Video,
  Sparkles,
  MessageSquare,
  FileText,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  Globe,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  Search,
  X,
  ChevronRight,
  Clock,
} from "lucide-react";
import { ContentStatus } from "@prisma/client";

import { MediaAssetItem } from "./MediaPickerModal";
import { HeroSectionEditor } from "./HeroSectionEditor";
import { AboutSectionEditor } from "./AboutSectionEditor";
import { VisionMissionSectionEditor } from "./VisionMissionSectionEditor";
import { DeanSectionEditor } from "./DeanSectionEditor";
import { ProgramsOfferedSectionEditor } from "./ProgramsOfferedSectionEditor";
import { SpecialisationsSectionEditor } from "./SpecialisationsSectionEditor";
import { FacultySectionEditor } from "./FacultySectionEditor";
import { TransformativeTracksSectionEditor } from "./TransformativeTracksSectionEditor";
import { CareerPathwaysSectionEditor } from "./CareerPathwaysSectionEditor";
import { LearningSpacesSectionEditor } from "./LearningSpacesSectionEditor";
import { CorporateConnectSectionEditor } from "./CorporateConnectSectionEditor";
import { CenterOfExcellenceSectionEditor } from "./CenterOfExcellenceSectionEditor";
import { DepartmentHighlightsSectionEditor } from "./DepartmentHighlightsSectionEditor";
import { TestimonialsSectionEditor } from "./TestimonialsSectionEditor";
import { BrochureSectionEditor } from "./BrochureSectionEditor";
import { PlacementSectionEditor } from "./PlacementSectionEditor";
import { UspsSectionEditor } from "./UspsSectionEditor";
import { FaqSectionEditor } from "./FaqSectionEditor";
import { SeoSectionEditor } from "./SeoSectionEditor";
import { CtaSectionEditor } from "./CtaSectionEditor";
import { updateDepartmentAction } from "@/features/admin/departments/actions";
import {
  DEPARTMENT_SECTIONS_CONFIG,
  DEPARTMENT_CATEGORIES,
  DepartmentSectionStatus,
  calculateDepartmentCompleteness,
} from "../departmentConfig";

/* =========================================================================
   TYPES & PROPS
========================================================================= */

export interface DepartmentDataProps {
  id: string;
  name: string;
  shortName?: string | null;
  slug: string;
  summary?: string | null;
  status: ContentStatus;
  sortOrder: number;
  updatedAt: Date | string;
  body: any;
  heroImage?: { url: string } | null;
}

interface DepartmentContentManagerProps {
  department: DepartmentDataProps;
  mediaAssets?: MediaAssetItem[];
  userRole?: string;
  searchParams?: { section?: string; saved?: string; error?: string; updated?: string; reordered?: string };
}

const statusBadgeStyles: Record<DepartmentSectionStatus, { badge: string; dot: string }> = {
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

function getDepartmentSectionIcon(iconName: string) {
  switch (iconName) {
    case "ImageIcon":
      return <ImageIcon className="h-4 w-4" />;
    case "BookOpen":
      return <BookOpen className="h-4 w-4" />;
    case "Compass":
      return <Compass className="h-4 w-4" />;
    case "UserCheck":
      return <UserCheck className="h-4 w-4" />;
    case "GraduationCap":
      return <GraduationCap className="h-4 w-4" />;
    case "Award":
      return <Award className="h-4 w-4" />;
    case "Users":
      return <Users className="h-4 w-4" />;
    case "Layers":
      return <Layers className="h-4 w-4" />;
    case "MapPin":
      return <MapPin className="h-4 w-4" />;
    case "Building2":
      return <Building2 className="h-4 w-4" />;
    case "Video":
      return <Video className="h-4 w-4" />;
    case "Sparkles":
      return <Sparkles className="h-4 w-4" />;
    case "MessageSquare":
      return <MessageSquare className="h-4 w-4" />;
    case "FileText":
      return <FileText className="h-4 w-4" />;
    case "TrendingUp":
      return <TrendingUp className="h-4 w-4" />;
    case "ShieldCheck":
      return <ShieldCheck className="h-4 w-4" />;
    case "HelpCircle":
      return <HelpCircle className="h-4 w-4" />;
    case "Globe":
      return <Globe className="h-4 w-4" />;
    case "CheckCircle":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

/* =========================================================================
   MAIN COMPONENT
========================================================================= */

export function DepartmentContentManager({
  department,
  mediaAssets = [],
  userRole = "ADMIN",
  searchParams = {},
}: DepartmentContentManagerProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  // Active section: defaults to "overview" if absent or explicitly requested
  const rawSection = currentSearchParams.get("section") || searchParams.section || "overview";
  const [activeSection, setActiveSection] = useState<string>(rawSection);
  const [sectionQuery, setSectionQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const saved = currentSearchParams.get("saved") === "1" || searchParams.saved === "1";
  const reordered = currentSearchParams.get("reordered") === "1" || searchParams.reordered === "1";
  const error = currentSearchParams.get("error") || searchParams.error;
  const updated = currentSearchParams.get("updated") === "1" || searchParams.updated === "1";

  const body = useMemo(() => {
    return (department.body && typeof department.body === "object" ? department.body : {}) as Record<string, any>;
  }, [department.body]);

  const publicUrl = `/programs/${department.slug}`;

  // Synchronize browser history (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const sec = params.get("section") || "overview";
      setActiveSection(sec);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Synchronize URL query parameter updates from server redirects
  useEffect(() => {
    const sec = currentSearchParams.get("section") || searchParams.section || "overview";
    setActiveSection(sec);
  }, [currentSearchParams, searchParams.section]);

  // Update browser URL query params
  const updateUrl = (sectionKey: string) => {
    const url = new URL(window.location.href);
    if (sectionKey && sectionKey !== "overview") {
      url.searchParams.set("section", sectionKey);
    } else {
      url.searchParams.set("section", "overview");
    }
    url.searchParams.delete("saved");
    url.searchParams.delete("updated");
    url.searchParams.delete("reordered");
    url.searchParams.delete("error");
    window.history.pushState({}, "", url.pathname + url.search);
  };

  const navigateToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    updateUrl(sectionId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToSections = () => {
    navigateToSection("overview");
  };

  // Truthful completeness metrics
  const completeness = useMemo(() => {
    return calculateDepartmentCompleteness(department, body);
  }, [department, body]);

  // Current active section configuration item (if in Stage C)
  const currentSectionConfig = useMemo(() => {
    if (activeSection === "overview") return null;
    return DEPARTMENT_SECTIONS_CONFIG.find((s) => s.id === activeSection) || null;
  }, [activeSection]);

  const currentSectionIndex = useMemo(() => {
    if (activeSection === "overview") return -1;
    return DEPARTMENT_SECTIONS_CONFIG.findIndex((s) => s.id === activeSection);
  }, [activeSection]);

  const prevSection = useMemo(() => {
    if (currentSectionIndex > 0) {
      return DEPARTMENT_SECTIONS_CONFIG[currentSectionIndex - 1];
    }
    return null;
  }, [currentSectionIndex]);

  const nextSection = useMemo(() => {
    if (currentSectionIndex >= 0 && currentSectionIndex < DEPARTMENT_SECTIONS_CONFIG.length - 1) {
      return DEPARTMENT_SECTIONS_CONFIG[currentSectionIndex + 1];
    }
    return null;
  }, [currentSectionIndex]);

  // Filtered sections for Stage B Section Overview Grid
  const filteredSectionCards = useMemo(() => {
    return DEPARTMENT_SECTIONS_CONFIG.filter((section) => {
      // Category filter
      if (selectedCategory !== "ALL" && section.category !== selectedCategory) {
        return false;
      }
      // Text search
      if (!sectionQuery.trim()) return true;
      const q = sectionQuery.toLowerCase();
      return (
        section.title.toLowerCase().includes(q) ||
        section.description.toLowerCase().includes(q) ||
        section.shortTitle.toLowerCase().includes(q) ||
        section.searchKeywords.toLowerCase().includes(q) ||
        section.id.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, sectionQuery]);

  const formattedUpdatedAt = useMemo(() => {
    try {
      return new Date(department.updatedAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recently";
    }
  }, [department.updatedAt]);

  const isOverview = activeSection === "overview" || !currentSectionConfig;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-16">
      {/* ===================================================================
          STAGE B: DEPARTMENT SECTION OVERVIEW (When section=overview)
      =================================================================== */}
      {isOverview ? (
        <div className="space-y-6">
          {/* Top Header Card */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Link
                  href="/admin/departments"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Departments
                </Link>

                <div className="mt-2.5 flex items-center gap-2.5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      department.status === ContentStatus.PUBLISHED
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : department.status === ContentStatus.DRAFT
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {department.status}
                  </span>
                </div>

                <h1 className="mt-1.5 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  {department.name}
                </h1>

                <div className="mt-1 flex flex-wrap items-center gap-y-1 text-xs text-slate-500">
                  <span>
                    Slug:{" "}
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-700 border border-slate-200">
                      /{department.slug}
                    </code>
                  </span>
                  <span className="mx-2 text-slate-300">|</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    Updated {formattedUpdatedAt}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  View Live Page
                </Link>
              </div>
            </div>

            {/* Publishing Status Bar */}
            <div className="mt-6 border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-4">
              <form action={updateDepartmentAction} className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <input type="hidden" name="id" value={department.id} />
                <input type="hidden" name="name" value={department.name} />
                <input type="hidden" name="slug" value={department.slug} />
                <input type="hidden" name="section" value="overview" />

                <div className="flex items-center gap-2">
                  <label htmlFor="status" className="text-xs font-bold text-slate-700">
                    Publishing Status:
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={department.status}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-slate-400 focus:bg-white transition"
                  >
                    <option value={ContentStatus.DRAFT}>Draft</option>
                    <option value={ContentStatus.PUBLISHED}>Published</option>
                    <option value={ContentStatus.ARCHIVED}>Archived</option>
                  </select>
                </div>

                <CmsSubmitButton
                  label="Update Status"
                  loadingLabel="Updating..."
                  iconType="save"
                  className="px-3 py-1.5 text-xs"
                  variant="secondary"
                />
              </form>

              {updated && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Department status updated successfully
                </span>
              )}
            </div>

            {/* Completeness Progress Bar */}
            <div className="mt-6 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded text-[11px] tracking-wide">
                    Course Page Completeness:
                  </span>
                  <span className="font-bold text-slate-900">
                    {completeness.completedCount} of {completeness.totalSections} Sections Complete
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
          </section>

          {/* Global Alert Messages */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 shadow-xs">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              {error}
            </div>
          )}

          {/* Search & Category Filter Toolbar */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={sectionQuery}
                onChange={(e) => setSectionQuery(e.target.value)}
                placeholder="Search sections (e.g. Faculty, Hero, Dean, Placement)..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-9 text-sm text-slate-900 outline-none transition-colors focus:border-slate-400 focus:bg-white"
              />
              {sectionQuery && (
                <button
                  type="button"
                  onClick={() => setSectionQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear section search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-semibold">
              {DEPARTMENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-lg px-2.5 py-1.5 transition-colors shrink-0 cursor-pointer ${
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

          {/* 4-Column Responsive Grid of All 20 Section Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSectionCards.map((section, idx) => {
              const statusInfo = completeness.sectionStatuses[section.id] || { status: "Not Configured" };
              const badgeStyle = statusBadgeStyles[statusInfo.status];

              return (
                <div
                  key={section.id}
                  onClick={() => navigateToSection(section.id)}
                  className="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                          {getDepartmentSectionIcon(section.iconName)}
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Section {idx + 1}
                        </span>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-bold ${badgeStyle.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${badgeStyle.dot}`} />
                        {statusInfo.status}
                      </span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                      {section.title}
                    </h3>

                    <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {section.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium truncate max-w-[140px]">
                      {statusInfo.detail || "Ready for editing"}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-slate-700 group-hover:text-slate-950 group-hover:translate-x-0.5 transition-all">
                      Edit Section
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty Search State */}
          {filteredSectionCards.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <Search className="mx-auto h-8 w-8 text-slate-300" />
              <h3 className="mt-3 text-base font-bold text-slate-900">
                No matching sections found
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                No department sections match &ldquo;{sectionQuery}&rdquo;. Try another search term or reset filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSectionQuery("");
                  setSelectedCategory("ALL");
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Reset Search &amp; Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ===================================================================
            STAGE C: DEDICATED FULL-WIDTH SECTION EDITOR
        =================================================================== */
        <div className="space-y-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link
              href="/admin/departments"
              className="hover:text-slate-900 transition-colors"
            >
              Departments
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <button
              type="button"
              onClick={handleBackToSections}
              className="hover:text-slate-900 transition-colors truncate max-w-[220px] cursor-pointer"
            >
              {department.name}
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-slate-900 font-bold truncate">
              {currentSectionConfig.title}
            </span>
          </nav>

          {/* Focused Editor Header Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
              <button
                type="button"
                onClick={handleBackToSections}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors self-start cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sections Overview
              </button>

              <div className="flex items-center gap-3">
                <Link
                  href={publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  View Live Page
                </Link>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 uppercase tracking-wide border border-slate-200">
                    Section {currentSectionIndex + 1} of 20
                  </span>
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

              <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
                <span className="text-xs font-semibold text-slate-500">
                  Department:
                </span>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800 border border-slate-200">
                  {department.shortName || department.name}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback Messages */}
          {saved && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              {currentSectionConfig.title} saved successfully. Live page revalidated.
            </div>
          )}

          {reordered && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              Faculty display order updated successfully and synchronized to database.
            </div>
          )}

          {updated && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              Department status updated successfully.
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 shadow-xs">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              {error}
            </div>
          )}

          {/* Full-Width Workspace Canvas for Active Specialized Section Editor */}
          <div className="min-w-0">
            {activeSection === "hero" && (
              <HeroSectionEditor
                departmentId={department.id}
                departmentName={department.name}
                heroData={body.hero || {}}
                mediaAssets={mediaAssets}
                saved={saved}
                error={error}
              />
            )}

            {activeSection === "about" && (
              <AboutSectionEditor
                departmentId={department.id}
                aboutData={body.about || body.intro || {}}
                mediaAssets={mediaAssets}
                saved={saved}
                error={error}
              />
            )}

            {activeSection === "visionMission" && (
              <VisionMissionSectionEditor
                departmentId={department.id}
                visionMissionData={body.visionMission || {}}
                saved={saved}
                error={error}
              />
            )}

            {activeSection === "dean" && (
              <DeanSectionEditor
                departmentId={department.id}
                deanData={body.dean || {}}
                mediaAssets={mediaAssets}
                saved={saved}
                error={error}
              />
            )}

            {activeSection === "courses" && (
              <ProgramsOfferedSectionEditor
                departmentId={department.id}
                coursesData={body.courses || []}
                saved={saved}
                error={error}
              />
            )}

            {activeSection === "specialisations" && (
              <SpecialisationsSectionEditor
                departmentId={department.id}
                specialisationsData={body.specialisations || {}}
                saved={saved}
                error={error}
              />
            )}

            {activeSection === "faculty" && (
              <FacultySectionEditor
                departmentId={department.id}
                facultyData={body.faculty || body.mentorsSection?.faculty || []}
                mentorsTitle={body.mentorsSection?.title}
                mentorsEyebrow={body.mentorsSection?.eyebrow}
                mediaAssets={mediaAssets}
                saved={saved}
                reordered={reordered}
                error={error}
              />
            )}

            {activeSection === "transformativeTracks" && (
              <TransformativeTracksSectionEditor
                departmentId={department.id}
                tracksData={body.transformativeTracks || {}}
                saved={saved}
                error={error}
              />
            )}

            {activeSection === "careerPathways" && (
              <CareerPathwaysSectionEditor
                departmentId={department.id}
                careerPathwaysData={body.careerPathways || {}}
                mediaAssets={mediaAssets}
                saved={saved}
                error={error}
              />
            )}

            {activeSection === "learningSpaces" && (
              <LearningSpacesSectionEditor
                departmentId={department.id}
                spacesData={body.learningSpaces || {}}
                mediaAssets={mediaAssets}
                saved={saved}
                error={error}
              />
            )}

            {activeSection === "corporateConnect" && (
              <CorporateConnectSectionEditor
                departmentId={department.id}
                corporateConnectData={body.corporateConnect || {}}
                saved={saved}
                error={error}
              />
            )}

            {activeSection === "centerOfExcellence" && (
              <CenterOfExcellenceSectionEditor
                departmentId={department.id}
                centerData={body.centerOfExcellence || {}}
                saved={saved}
                error={error}
              />
            )}

            {activeSection === "departmentHighlights" && (
              <DepartmentHighlightsSectionEditor
                departmentId={department.id}
                highlightsData={body.departmentHighlights || []}
                highlightsTitle={body.departmentHighlightsTitle}
                highlightsSubtitle={body.departmentHighlightsSubtitle}
                mediaAssets={mediaAssets}
                saved={saved}
                error={error}
              />
            )}

            {activeSection === "testimonials" && (
              <TestimonialsSectionEditor
                departmentId={department.id}
                testimonialsData={body.testimonials || []}
                mediaAssets={mediaAssets}
                saved={saved}
                error={error}
              />
            )}

            {activeSection === "brochure" && (
              <BrochureSectionEditor
                departmentId={department.id}
                brochureData={body.brochure || {}}
                mediaAssets={mediaAssets}
                saved={saved}
                error={error}
              />
            )}

            {activeSection === "placement" && (
              <PlacementSectionEditor
                departmentId={department.id}
                placementData={body.placement || body.career || {}}
                saved={saved}
                error={error}
              />
            )}

            {activeSection === "usps" && (
              <UspsSectionEditor
                departmentId={department.id}
                uspsData={body.usps || body.gth || {}}
                saved={saved}
                error={error}
              />
            )}

            {activeSection === "faqs" && (
              <FaqSectionEditor
                departmentId={department.id}
                faqsData={body.faqs || []}
                saved={saved}
                error={error}
              />
            )}

            {activeSection === "seo" && (
              <SeoSectionEditor
                departmentId={department.id}
                departmentName={department.name}
                seoData={body.seo || {}}
                saved={saved}
                error={error}
              />
            )}

            {activeSection === "cta" && (
              <CtaSectionEditor
                departmentId={department.id}
                ctaData={body.cta || {}}
                saved={saved}
                error={error}
              />
            )}
          </div>

          {/* Bottom Quick-Jump Section Navigation Bar */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 mt-8">
            {prevSection ? (
              <button
                type="button"
                onClick={() => navigateToSection(prevSection.id)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors w-full sm:w-auto justify-center cursor-pointer"
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
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5" />
              All Content Sections ({completeness.totalSections})
            </button>

            {nextSection ? (
              <button
                type="button"
                onClick={() => navigateToSection(nextSection.id)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors w-full sm:w-auto justify-center cursor-pointer"
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