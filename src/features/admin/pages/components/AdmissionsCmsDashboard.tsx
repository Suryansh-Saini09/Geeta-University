"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  updatePageSectionAction,
  updatePageSeoAction,
  updatePageStatusAction,
} from "@/features/admin/pages/actions";
import { getSectionSuccessMessage } from "@/lib/cms/sectionLabels";
import { sanitizeErrorMessage } from "@/lib/cms/errorSanitizer";
import {
  CmsImagePreviewInput,
  CmsAutoTextarea,
  CmsStringRepeater,
} from "./CmsFieldHelpers";
import {
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  Save,
  FileText,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Layers,
  GraduationCap,
  BookOpen,
  HelpCircle,
  Award,
  Globe,
  Loader2,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import {
  ADMISSIONS_PAGES_OPTIONS,
  type AdmissionsPageOption,
  type AdmissionsSectionItem,
} from "../admissionsConfig";

/* =========================================================================
   TYPES & PROPS
========================================================================= */

export type PagePublicationStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

export interface AdmissionsPageData {
  sections: Record<
    string,
    {
      id?: string;
      title?: string;
      body: any;
      status?: string;
      updatedAt?: string | Date;
    }
  >;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[] | string;
    canonical?: string | null;
    ogTitle?: string | null;
    ogImage?: string | null;
    noIndex?: boolean;
  } | null;
  page?: {
    id?: string;
    slug?: string;
    title?: string;
    status?: PagePublicationStatus;
    updatedAt?: string | Date;
    publishedAt?: string | Date | null;
  } | null;
}

interface AdmissionsCmsDashboardProps {
  initialPageSlug?: string;
  initialSectionKey?: string;
  adminDataBySlug: Record<string, AdmissionsPageData>;
}

/* =========================================================================
   MAIN COMPONENT
========================================================================= */

export function AdmissionsCmsDashboard({
  initialPageSlug,
  initialSectionKey,
  adminDataBySlug: initialAdminData,
}: AdmissionsCmsDashboardProps) {
  // Local mutable cache of admin data to immediately reflect saves
  const [dataCache, setDataCache] = useState<Record<string, AdmissionsPageData>>(initialAdminData);

  // Selected page & section state
  const [selectedPageSlug, setSelectedPageSlug] = useState<string | null>(
    initialPageSlug && ADMISSIONS_PAGES_OPTIONS.some((p) => p.slug === initialPageSlug)
      ? initialPageSlug
      : null
  );

  const [activeSectionKey, setActiveSectionKey] = useState<string | null>(
    initialSectionKey || null
  );

  // Active form editing state for View C
  const [activeBodyState, setActiveBodyState] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Unsaved changes confirmation modal state
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  // Global feedback notification
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state with browser URL search parameters & history popstate
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const page = params.get("page");
      const section = params.get("section");

      if (page && ADMISSIONS_PAGES_OPTIONS.some((p) => p.slug === page)) {
        setSelectedPageSlug(page);
        setActiveSectionKey(section || null);
      } else {
        setSelectedPageSlug(null);
        setActiveSectionKey(null);
      }
      setIsDirty(false);
      setFeedback(null);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update URL helper
  const updateUrl = (page: string | null, section: string | null) => {
    const params = new URLSearchParams();
    if (page) params.set("page", page);
    if (section) params.set("section", section);
    const queryString = params.toString();
    const targetUrl = queryString ? `/admin/admissions?${queryString}` : "/admin/admissions";
    window.history.pushState(null, "", targetUrl);
  };

  // Safe navigation with unsaved changes guard
  const requestNavigation = (navAction: () => void) => {
    if (isDirty) {
      setPendingNavigation(() => navAction);
    } else {
      navAction();
    }
  };

  // Navigate to View A (Admissions Overview)
  const handleNavigateToPages = () => {
    requestNavigation(() => {
      setSelectedPageSlug(null);
      setActiveSectionKey(null);
      setIsDirty(false);
      setFeedback(null);
      updateUrl(null, null);
    });
  };

  // Navigate to View B (Page Section Overview)
  const handleSelectPage = (slug: string) => {
    requestNavigation(() => {
      setSelectedPageSlug(slug);
      setActiveSectionKey(null);
      setIsDirty(false);
      setFeedback(null);
      updateUrl(slug, null);
    });
  };

  // Navigate to View C (Focused Section Editor)
  const handleSelectSection = (secKey: string) => {
    requestNavigation(() => {
      if (!selectedPageSlug) return;
      setActiveSectionKey(secKey);
      setFeedback(null);

      if (secKey !== "seo") {
        const currentSecBody = dataCache[selectedPageSlug]?.sections?.[secKey]?.body;
        // Deep clone so unsaved changes can be cleanly discarded or tracked
        setActiveBodyState(currentSecBody ? JSON.parse(JSON.stringify(currentSecBody)) : {});
      }
      setIsDirty(false);
      updateUrl(selectedPageSlug, secKey);
    });
  };

  // Initialize activeBodyState when entering View C
  useEffect(() => {
    if (selectedPageSlug && activeSectionKey && activeSectionKey !== "seo") {
      const currentSecBody = dataCache[selectedPageSlug]?.sections?.[activeSectionKey]?.body;
      setActiveBodyState(currentSecBody ? JSON.parse(JSON.stringify(currentSecBody)) : {});
      setIsDirty(false);
    }
  }, [selectedPageSlug, activeSectionKey]);

  // Current selected page option from config
  const currentPageOption = useMemo(() => {
    if (!selectedPageSlug) return null;
    return ADMISSIONS_PAGES_OPTIONS.find((p) => p.slug === selectedPageSlug) || null;
  }, [selectedPageSlug]);

  // Current page data from local cache
  const currentPageData = useMemo(() => {
    if (!selectedPageSlug) return null;
    return dataCache[selectedPageSlug] || { sections: {}, seo: null, page: null };
  }, [selectedPageSlug, dataCache]);

  // Save Current Section Handler
  const handleSaveSection = async () => {
    if (!selectedPageSlug || !activeSectionKey || activeSectionKey === "seo") return;

    try {
      setIsSaving(true);
      setFeedback(null);

      const res = await updatePageSectionAction(selectedPageSlug, activeSectionKey, activeBodyState);

      if (res.success) {
        setFeedback({
          type: "success",
          text: res.message || getSectionSuccessMessage(activeSectionKey, selectedPageSlug, "updated"),
        });
        setIsDirty(false);

        // Update local memory cache
        setDataCache((prev) => {
          const pageData = prev[selectedPageSlug] || { sections: {}, seo: null, page: null };
          const updatedSections = {
            ...pageData.sections,
            [activeSectionKey]: {
              ...pageData.sections[activeSectionKey],
              body: activeBodyState,
              status: "PUBLISHED",
              updatedAt: new Date().toISOString(),
            },
          };
          return {
            ...prev,
            [selectedPageSlug]: {
              ...pageData,
              sections: updatedSections,
            },
          };
        });
      } else {
        setFeedback({
          type: "error",
          text: res.error || "Unable to save changes. Please try again.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: sanitizeErrorMessage(err, "Unable to save changes. Please try again."),
      });
    } finally {
      setIsSaving(false);
    }
  };

  // SEO Form State & Handler
  const currentSeo = currentPageData?.seo;
  const [seoState, setSeoState] = useState({
    title: currentSeo?.title || "",
    description: currentSeo?.description || "",
    keywords: Array.isArray(currentSeo?.keywords)
      ? currentSeo.keywords.join(", ")
      : currentSeo?.keywords || "",
    canonical: currentSeo?.canonical || "",
    ogTitle: currentSeo?.ogTitle || "",
    ogImage: currentSeo?.ogImage || "",
    noIndex: currentSeo?.noIndex || false,
  });

  // Re-sync SEO form when switching page
  useEffect(() => {
    if (currentPageData?.seo) {
      const seo = currentPageData.seo;
      setSeoState({
        title: seo.title || "",
        description: seo.description || "",
        keywords: Array.isArray(seo.keywords) ? seo.keywords.join(", ") : seo.keywords || "",
        canonical: seo.canonical || "",
        ogTitle: seo.ogTitle || "",
        ogImage: seo.ogImage || "",
        noIndex: seo.noIndex || false,
      });
    } else {
      setSeoState({
        title: "",
        description: "",
        keywords: "",
        canonical: "",
        ogTitle: "",
        ogImage: "",
        noIndex: false,
      });
    }
    setIsDirty(false);
  }, [selectedPageSlug]);

  const handleSaveSeo = async () => {
    if (!selectedPageSlug) return;

    try {
      setIsSaving(true);
      setFeedback(null);

      const payload = {
        title: seoState.title,
        description: seoState.description,
        keywords:
          typeof seoState.keywords === "string"
            ? seoState.keywords.split(",").map((k) => k.trim()).filter(Boolean)
            : seoState.keywords,
        canonical: seoState.canonical || null,
        ogTitle: seoState.ogTitle || null,
        ogImage: seoState.ogImage || null,
        noIndex: seoState.noIndex,
      };

      const res = await updatePageSeoAction(selectedPageSlug, payload);

      if (res.success) {
        setFeedback({ type: "success", text: "SEO metadata saved successfully." });
        setIsDirty(false);

        // Update local memory cache
        setDataCache((prev) => {
          const pageData = prev[selectedPageSlug] || { sections: {}, seo: null, page: null };
          return {
            ...prev,
            [selectedPageSlug]: {
              ...pageData,
              seo: payload,
            },
          };
        });
      } else {
        setFeedback({
          type: "error",
          text: res.error || "Unable to save SEO metadata. Please try again.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: sanitizeErrorMessage(err, "Unable to save SEO metadata. Please try again."),
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Page Status toggle handler
  const handleUpdatePageStatus = async (newStatus: PagePublicationStatus) => {
    if (!selectedPageSlug) return;
    try {
      setIsSaving(true);
      setFeedback(null);
      const res = await updatePageStatusAction(selectedPageSlug, newStatus as any);
      if (res.success) {
        setFeedback({
          type: "success",
          text: `Page status updated to ${newStatus.toLowerCase()}.`,
        });
        setDataCache((prev) => {
          const pageData = prev[selectedPageSlug] || { sections: {}, seo: null, page: null };
          return {
            ...prev,
            [selectedPageSlug]: {
              ...pageData,
              page: {
                ...(pageData.page || {}),
                status: newStatus,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      } else {
        setFeedback({
          type: "error",
          text: res.error || "Unable to update page status.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: sanitizeErrorMessage(err, "Unable to update page status."),
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Determine current view mode
  const currentView: "pages" | "sections" | "editor" = useMemo(() => {
    if (!selectedPageSlug) return "pages";
    if (!activeSectionKey) return "sections";
    return "editor";
  }, [selectedPageSlug, activeSectionKey]);

  return (
    <div className="w-full min-h-screen pb-16">
      {/* Unsaved Changes Confirmation Modal */}
      {pendingNavigation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-amber-100 p-2 text-amber-700">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Unsaved Changes</h3>
                <p className="mt-1 text-sm text-slate-600">
                  You have unsaved changes in this section. If you leave now, your edits will be discarded.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPendingNavigation(null)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  const nav = pendingNavigation;
                  setPendingNavigation(null);
                  setIsDirty(false);
                  if (nav) nav();
                }}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
              >
                Discard & Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Feedback Banner */}
      {feedback && (
        <div className="mb-6">
          <div
            className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium shadow-xs border ${
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-rose-200 bg-rose-50 text-rose-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-700 ml-4"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* VIEW A: Admissions Overview (Grid of Page Cards) */}
      {currentView === "pages" && (
        <AdmissionsOverviewView
          adminDataBySlug={dataCache}
          onSelectPage={handleSelectPage}
        />
      )}

      {/* VIEW B: Selected Page's Section Overview */}
      {currentView === "sections" && currentPageOption && (
        <PageSectionsOverviewView
          pageOption={currentPageOption}
          pageData={currentPageData || { sections: {}, seo: null, page: null }}
          onBack={handleNavigateToPages}
          onSelectSection={handleSelectSection}
          onUpdatePageStatus={handleUpdatePageStatus}
          isSaving={isSaving}
        />
      )}

      {/* VIEW C: Focused, Full-Width Section Editor */}
      {currentView === "editor" && currentPageOption && activeSectionKey && (
        <FocusedSectionEditorView
          pageOption={currentPageOption}
          sectionKey={activeSectionKey}
          bodyState={activeBodyState}
          seoState={seoState}
          isDirty={isDirty}
          isSaving={isSaving}
          onBodyChange={(newBody) => {
            setActiveBodyState(newBody);
            setIsDirty(true);
          }}
          onSeoChange={(newSeo) => {
            setSeoState(newSeo);
            setIsDirty(true);
          }}
          onSave={activeSectionKey === "seo" ? handleSaveSeo : handleSaveSection}
          onBackToSections={() => {
            requestNavigation(() => {
              setActiveSectionKey(null);
              setIsDirty(false);
              setFeedback(null);
              if (selectedPageSlug) updateUrl(selectedPageSlug, null);
            });
          }}
          onBackToAdmissions={handleNavigateToPages}
          onSwitchSection={handleSelectSection}
        />
      )}
    </div>
  );
}

/* =========================================================================
   VIEW A: ADMISSIONS OVERVIEW
========================================================================= */

function AdmissionsOverviewView({
  adminDataBySlug,
  onSelectPage,
}: {
  adminDataBySlug: Record<string, AdmissionsPageData>;
  onSelectPage: (slug: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Filter pages by search query and publication status
  const filteredPages = useMemo(() => {
    return ADMISSIONS_PAGES_OPTIONS.filter((page) => {
      const pageInfo = adminDataBySlug[page.slug]?.page;
      const actualStatus = pageInfo?.status || "PUBLISHED";

      // Status filter
      if (statusFilter !== "ALL" && actualStatus !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = page.title.toLowerCase().includes(q);
        const matchesRoute = page.publicRoute.toLowerCase().includes(q);
        const matchesDesc = page.description.toLowerCase().includes(q);
        return matchesTitle || matchesRoute || matchesDesc;
      }

      return true;
    });
  }, [searchQuery, statusFilter, adminDataBySlug]);

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900">
          Admissions content
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          Manage admissions pathways, eligibility guidelines, fee schedules, and academic requirements across all university admission portals.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search admissions pages by title or URL..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Publication Status Filter */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-xl">
          {(["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"] as const).map((st) => {
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st === "ALL" ? "All pages" : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pages Grid */}
      {filteredPages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page) => {
            const pageData = adminDataBySlug[page.slug];
            const pageStatus = pageData?.page?.status || "PUBLISHED";
            const sectionCount = page.sectionsList.length;

            return (
              <div
                key={page.slug}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all"
              >
                <div>
                  {/* Top Row: Icon & Status Badge */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700 group-hover:bg-slate-200 transition-colors">
                      <PageIcon name={page.iconName} className="h-5 w-5" />
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        pageStatus === "PUBLISHED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : pageStatus === "DRAFT"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {pageStatus.charAt(0) + pageStatus.slice(1).toLowerCase()}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                    {page.title}
                  </h2>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {page.description}
                  </p>

                  {/* Public Path & Metadata */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono text-[11px] text-slate-500 truncate max-w-[180px]">
                      {page.publicRoute}
                    </span>
                    <span className="font-medium text-slate-700">
                      {sectionCount} sections + SEO
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onSelectPage(page.slug)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    <span>Edit page</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <Link
                    href={page.publicRoute}
                    target="_blank"
                    className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    title="View public page in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-900">
            No admissions pages matched your search.
          </p>
          <p className="text-xs text-slate-500">
            Try adjusting your search terms or publication filter to locate admissions content.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("ALL");
            }}
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors mt-2"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   VIEW B: SELECTED PAGE'S SECTION OVERVIEW
========================================================================= */

function PageSectionsOverviewView({
  pageOption,
  pageData,
  onBack,
  onSelectSection,
  onUpdatePageStatus,
  isSaving,
}: {
  pageOption: AdmissionsPageOption;
  pageData: AdmissionsPageData;
  onBack: () => void;
  onSelectSection: (secKey: string) => void;
  onUpdatePageStatus: (newStatus: PagePublicationStatus) => void;
  isSaving: boolean;
}) {
  const [sectionSearch, setSectionSearch] = useState("");
  const sections = pageData.sections || {};
  const pageStatus = pageData?.page?.status || "PUBLISHED";

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!sectionSearch.trim()) return pageOption.sectionsList;
    const q = sectionSearch.toLowerCase();
    return pageOption.sectionsList.filter(
      (sec) =>
        sec.label.toLowerCase().includes(q) ||
        sec.key.toLowerCase().includes(q) ||
        sec.description.toLowerCase().includes(q)
    );
  }, [pageOption.sectionsList, sectionSearch]);

  const hasSeo = Boolean(pageData?.seo?.title || pageData?.seo?.description);

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <button
          type="button"
          onClick={onBack}
          className="hover:text-slate-900 transition-colors font-semibold"
        >
          Admissions
        </button>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold">{pageOption.title}</span>
      </nav>

      {/* Page Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">
                {pageOption.title}
              </h1>

              {/* Publication Status Selector */}
              <div className="relative inline-flex items-center">
                <select
                  value={pageStatus}
                  onChange={(e) => onUpdatePageStatus(e.target.value as PagePublicationStatus)}
                  disabled={isSaving}
                  className={`rounded-full px-3 py-1 text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all ${
                    pageStatus === "PUBLISHED"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : pageStatus === "DRAFT"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  <option value="PUBLISHED">Status: Published</option>
                  <option value="DRAFT">Status: Draft</option>
                  <option value="ARCHIVED">Status: Archived</option>
                </select>
              </div>
            </div>

            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              {pageOption.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="font-mono bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                {pageOption.publicRoute}
              </span>
              <span>•</span>
              <span>{pageOption.sectionsList.length} content sections</span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Admissions</span>
            </button>

            <Link
              href={pageOption.publicRoute}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <span>View public page</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* Sections Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Page sections</h2>
          <p className="text-xs text-slate-500">
            Select a section card below to open the dedicated full-width editor.
          </p>
        </div>

        {/* Section Search input */}
        {pageOption.sectionsList.length > 4 && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={sectionSearch}
              onChange={(e) => setSectionSearch(e.target.value)}
              placeholder="Search sections..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-8 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none transition-all"
            />
            {sectionSearch && (
              <button
                type="button"
                onClick={() => setSectionSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Responsive Grid of Independent Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSections.map((sec, idx) => {
          const secBody = sections[sec.key]?.body;
          const isConfigured = Boolean(secBody && Object.keys(secBody).length > 0);
          const fieldsSummary = getSectionFieldsSummary(secBody);

          return (
            <div
              key={sec.key}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div>
                {/* Card Top: Position & Config Status */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                  <span className="font-semibold text-slate-400">
                    Section {idx + 1} of {pageOption.sectionsList.length}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                      isConfigured
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isConfigured ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />
                    {isConfigured ? "Configured" : "Not configured"}
                  </span>
                </div>

                {/* Section Title & Description */}
                <h3 className="text-base font-bold text-slate-900">{sec.label}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {sec.description}
                </p>

                {/* Content summary */}
                {fieldsSummary && (
                  <div className="mt-3.5 rounded-lg bg-slate-50 p-2.5 text-[11px] text-slate-600 border border-slate-100">
                    <span className="font-semibold text-slate-700">Content preview: </span>
                    <span>{fieldsSummary}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSelectSection(sec.key)}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
                >
                  <span>Edit section</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Dedicated SEO & Meta Tags Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-xs hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
              <span className="font-semibold text-slate-500">Search Engine Settings</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                  hasSeo ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-600"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    hasSeo ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
                {hasSeo ? "Configured" : "Defaults"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-700" />
              <h3 className="text-base font-bold text-slate-900">SEO & Meta Tags</h3>
            </div>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Manage search engine title, meta description, keywords, canonical link, and social sharing image.
            </p>

            {hasSeo && (
              <div className="mt-3.5 rounded-lg bg-white p-2.5 text-[11px] text-slate-600 border border-slate-200">
                <span className="font-semibold text-slate-700">Title: </span>
                <span className="truncate block">{pageData?.seo?.title || "Default"}</span>
              </div>
            )}
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-200">
            <button
              type="button"
              onClick={() => onSelectSection("seo")}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <span>Edit SEO metadata</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   VIEW C: FOCUSED, FULL-WIDTH SECTION EDITOR
========================================================================= */

function FocusedSectionEditorView({
  pageOption,
  sectionKey,
  bodyState,
  seoState,
  isDirty,
  isSaving,
  onBodyChange,
  onSeoChange,
  onSave,
  onBackToSections,
  onBackToAdmissions,
  onSwitchSection,
}: {
  pageOption: AdmissionsPageOption;
  sectionKey: string;
  bodyState: any;
  seoState: any;
  isDirty: boolean;
  isSaving: boolean;
  onBodyChange: (newBody: any) => void;
  onSeoChange: (newSeo: any) => void;
  onSave: () => void;
  onBackToSections: () => void;
  onBackToAdmissions: () => void;
  onSwitchSection: (secKey: string) => void;
}) {
  const isSeo = sectionKey === "seo";

  // Section metadata from config
  const sectionConfig = pageOption.sectionsList.find((s) => s.key === sectionKey);
  const sectionIndex = pageOption.sectionsList.findIndex((s) => s.key === sectionKey);
  const totalSections = pageOption.sectionsList.length;

  const previousSection =
    sectionIndex > 0 ? pageOption.sectionsList[sectionIndex - 1] : null;
  const nextSection =
    sectionIndex >= 0 && sectionIndex < totalSections - 1
      ? pageOption.sectionsList[sectionIndex + 1]
      : sectionIndex === totalSections - 1 && !isSeo
      ? { key: "seo", label: "SEO & Meta Tags" }
      : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <button
          type="button"
          onClick={onBackToAdmissions}
          className="hover:text-slate-900 transition-colors font-semibold"
        >
          Admissions
        </button>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <button
          type="button"
          onClick={onBackToSections}
          className="hover:text-slate-900 transition-colors font-semibold"
        >
          {pageOption.title}
        </button>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold truncate max-w-[240px]">
          {isSeo ? "SEO & Meta Tags" : sectionConfig?.label || sectionKey}
        </span>
      </nav>

      {/* Focused Editor Top Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">
                {isSeo ? "SEO Settings" : `Section ${sectionIndex + 1} of ${totalSections}`}
              </span>
              {isDirty && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  Unsaved edits
                </span>
              )}
            </div>
            <h1 className="font-serif text-2xl font-bold text-slate-900">
              {isSeo ? `SEO Metadata — ${pageOption.title}` : sectionConfig?.label || sectionKey}
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl">
              {isSeo
                ? "Configure search engine titles, open-graph image, and metadata tags for this admissions page."
                : sectionConfig?.description || "Update the text, imagery, and structured items for this section."}
            </p>
          </div>

          {/* Primary Top Save Action */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              type="button"
              onClick={onBackToSections}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to sections</span>
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving changes...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Previous & Next Section Quick Jump Navigation */}
        <div className="flex items-center justify-between text-xs pt-1">
          {previousSection ? (
            <button
              type="button"
              onClick={() => onSwitchSection(previousSection.key)}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Previous: {previousSection.label}</span>
            </button>
          ) : (
            <span />
          )}

          {nextSection ? (
            <button
              type="button"
              onClick={() => onSwitchSection(nextSection.key)}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium ml-auto"
            >
              <span>Next: {nextSection.label}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>

      {/* Editor Content Surface */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
        {isSeo ? (
          <SeoFieldEditor
            seoState={seoState}
            onChange={onSeoChange}
            pagePublicRoute={pageOption.publicRoute}
          />
        ) : (
          <GenericSectionObjectEditor
            bodyState={bodyState}
            onChange={onBodyChange}
          />
        )}
      </div>

      {/* Bottom Action & Navigation Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToSections}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to page sections</span>
        </button>

        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-xs text-amber-700 font-medium">
              You have unsaved edits
            </span>
          )}

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving changes...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SEO FIELD EDITOR COMPONENT
========================================================================= */

function SeoFieldEditor({
  seoState,
  onChange,
  pagePublicRoute,
}: {
  seoState: any;
  onChange: (val: any) => void;
  pagePublicRoute: string;
}) {
  const titleLength = (seoState.title || "").length;
  const descLength = (seoState.description || "").length;

  return (
    <div className="space-y-6">
      {/* Meta Title */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Meta Title
          </label>
          <span
            className={`text-xs ${
              titleLength > 65
                ? "text-rose-600 font-semibold"
                : titleLength >= 40
                ? "text-emerald-600"
                : "text-slate-400"
            }`}
          >
            {titleLength} / 60 characters
          </span>
        </div>
        <input
          type="text"
          value={seoState.title}
          onChange={(e) => onChange({ ...seoState, title: e.target.value })}
          placeholder="e.g. Undergraduate Programs | Geeta University Admissions"
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none transition-all"
        />
        <p className="mt-1 text-[11px] text-slate-500">
          Recommended length: 50–60 characters. Appears as the headline link in search results.
        </p>
      </div>

      {/* Meta Description */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Meta Description
          </label>
          <span
            className={`text-xs ${
              descLength > 165
                ? "text-rose-600 font-semibold"
                : descLength >= 120
                ? "text-emerald-600"
                : "text-slate-400"
            }`}
          >
            {descLength} / 160 characters
          </span>
        </div>
        <CmsAutoTextarea
          label=""
          value={seoState.description}
          onChange={(val) => onChange({ ...seoState, description: val })}
          placeholder="Provide a concise, compelling summary of the page for search engine results..."
          rows={3}
        />
        <p className="mt-1 text-[11px] text-slate-500">
          Recommended length: 140–160 characters. Summarizes the page content under the title.
        </p>
      </div>

      {/* 2-Column Row: Keywords & Canonical */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Keywords (comma-separated)
          </label>
          <input
            type="text"
            value={seoState.keywords}
            onChange={(e) => onChange({ ...seoState, keywords: e.target.value })}
            placeholder="e.g. Admissions, Geeta University, Scholarships, 12th Programs"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Canonical URL
          </label>
          <input
            type="text"
            value={seoState.canonical}
            onChange={(e) => onChange({ ...seoState, canonical: e.target.value })}
            placeholder={`https://geetauniversity.edu.in${pagePublicRoute}`}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* OpenGraph Social Image */}
      <div>
        <CmsImagePreviewInput
          label="OpenGraph Social Sharing Image"
          value={seoState.ogImage}
          onChange={(val) => onChange({ ...seoState, ogImage: val })}
          placeholder="/images/og-admissions.webp"
          helpText="Image displayed when this admissions page is shared on LinkedIn, WhatsApp, Facebook, or Twitter."
        />
      </div>

      {/* No Index Toggle */}
      <div className="pt-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(seoState.noIndex)}
            onChange={(e) => onChange({ ...seoState, noIndex: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <div>
            <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Discourage Search Engine Indexing (noIndex)
            </span>
            <p className="text-[11px] text-slate-500">
              Only enable this if the page is private, deprecated, or under draft preparation.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}

/* =========================================================================
   GENERIC SECTION OBJECT EDITOR
   Full-width, responsive 2-column layout for primitives, auto-growing
   textareas for multi-line copy, image preview inputs, string repeaters,
   and collapsible card repeaters.
========================================================================= */

function GenericSectionObjectEditor({
  bodyState,
  onChange,
}: {
  bodyState: any;
  onChange: (newState: any) => void;
}) {
  if (typeof bodyState !== "object" || bodyState === null) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500 italic">
        No structured content found for this section.
      </div>
    );
  }

  const keys = Object.keys(bodyState);

  const updateField = (key: string, val: any) => {
    onChange({
      ...bodyState,
      [key]: val,
    });
  };

  // Group simple primitive fields into 2-column grids when beneficial
  // We classify keys into:
  // - "simple" (short string, number, boolean)
  // - "complex" (image, long text/textarea, string array, object array, nested object)
  const isSimpleField = (key: string, value: any): boolean => {
    if (typeof value === "boolean") return true;
    if (typeof value === "number") return true;
    if (typeof value === "string") {
      const keyLower = key.toLowerCase();
      const isAlt = keyLower.endsWith("alt") || keyLower === "alt";
      const isImage =
        !isAlt &&
        (keyLower.includes("image") ||
          keyLower.includes("logo") ||
          keyLower.includes("banner") ||
          keyLower.includes("poster") ||
          /\.(webp|png|jpg|jpeg|svg|gif|avif)$/i.test(value));
      const isLong =
        keyLower.includes("description") ||
        keyLower.includes("paragraph") ||
        keyLower.includes("intro") ||
        keyLower.includes("text") ||
        keyLower.includes("bio") ||
        keyLower.includes("notice") ||
        value.length > 70;
      return !isImage && !isLong;
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* 1. Simple fields in responsive 2-column grid */}
      {keys.some((k) => isSimpleField(k, bodyState[k])) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {keys
            .filter((k) => isSimpleField(k, bodyState[k]))
            .map((key) => {
              const value = bodyState[key];

              if (typeof value === "boolean") {
                return (
                  <div key={key} className="flex items-center gap-3 pt-4">
                    <input
                      type="checkbox"
                      id={`chk-${key}`}
                      checked={value}
                      onChange={(e) => updateField(key, e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <label
                      htmlFor={`chk-${key}`}
                      className="text-xs font-semibold text-slate-800 uppercase tracking-wider cursor-pointer"
                    >
                      {formatLabel(key)}
                    </label>
                  </div>
                );
              }

              return (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    {formatLabel(key)}
                  </label>
                  <input
                    type={typeof value === "number" ? "number" : "text"}
                    value={value ?? ""}
                    onChange={(e) =>
                      updateField(
                        key,
                        typeof value === "number"
                          ? parseFloat(e.target.value) || 0
                          : e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none transition-all"
                  />
                </div>
              );
            })}
        </div>
      )}

      {/* 2. Complex fields (Images, Long Text, Repeaters, Nested Objects) */}
      {keys
        .filter((k) => !isSimpleField(k, bodyState[k]))
        .map((key) => {
          const value = bodyState[key];
          const keyLower = key.toLowerCase();

          // Alt text detection (if standalone)
          const isAltField =
            keyLower.endsWith("alt") || keyLower.includes("alttext") || keyLower === "alt";

          if (typeof value === "string" && isAltField) {
            return (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {formatLabel(key)} (Alt Text)
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateField(key, e.target.value)}
                  placeholder="Accessibility description for this visual asset..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none transition-all"
                />
              </div>
            );
          }

          // Image Field detection
          const isImageField =
            !isAltField &&
            (keyLower.includes("image") ||
              keyLower.includes("logo") ||
              keyLower.includes("poster") ||
              keyLower.includes("portrait") ||
              keyLower === "banner" ||
              keyLower.endsWith("banner") ||
              keyLower.startsWith("bannerimage") ||
              (typeof value === "string" &&
                (value.startsWith("/") || value.startsWith("http")) &&
                /\.(webp|png|jpg|jpeg|svg|gif|avif)$/i.test(value)));

          if (typeof value === "string" && isImageField) {
            return (
              <div key={key}>
                <CmsImagePreviewInput
                  label={formatLabel(key)}
                  value={value}
                  onChange={(val) => updateField(key, val)}
                  altValue={bodyState[`${key}Alt`]}
                  onAltChange={
                    bodyState[`${key}Alt`] !== undefined
                      ? (altVal) => updateField(`${key}Alt`, altVal)
                      : undefined
                  }
                />
              </div>
            );
          }

          // Long text / Multi-line copy
          const isLongText =
            keyLower.includes("description") ||
            keyLower.includes("paragraph") ||
            keyLower.includes("intro") ||
            keyLower.includes("text") ||
            keyLower.includes("notice") ||
            keyLower.includes("quote") ||
            keyLower.includes("bio") ||
            keyLower.includes("eligibility") ||
            keyLower.includes("selection") ||
            keyLower.includes("mouintro") ||
            keyLower.includes("mouclosing");

          if (typeof value === "string" && (isLongText || value.length > 70)) {
            return (
              <div key={key}>
                <CmsAutoTextarea
                  label={formatLabel(key)}
                  value={value}
                  onChange={(val) => updateField(key, val)}
                  rows={3}
                />
              </div>
            );
          }

          // String Array (e.g. paragraphs, checklist, strengths)
          if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
            return (
              <div key={key}>
                <CmsStringRepeater
                  title={formatLabel(key)}
                  items={value}
                  onChange={(newItems) => updateField(key, newItems)}
                />
              </div>
            );
          }

          // Object Array (Repeaters: cards, steps, faqs, schools, etc.)
          if (Array.isArray(value)) {
            return (
              <div key={key}>
                <CollapsibleCardRepeater
                  title={formatLabel(key)}
                  items={value}
                  onChange={(newItems) => updateField(key, newItems)}
                />
              </div>
            );
          }

          // Nested Object
          if (typeof value === "object" && value !== null) {
            return (
              <div
                key={key}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-slate-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    {formatLabel(key)}
                  </h4>
                </div>
                <GenericSectionObjectEditor
                  bodyState={value}
                  onChange={(nestedState) => updateField(key, nestedState)}
                />
              </div>
            );
          }

          return null;
        })}
    </div>
  );
}

/* =========================================================================
   COLLAPSIBLE CARD REPEATER
   Each item is a distinct collapsible card.
   Header displays clear title summary, reorder buttons, and delete action.
   Expanded view allows deep editing of nested fields.
========================================================================= */

function CollapsibleCardRepeater({
  title,
  items = [],
  onChange,
}: {
  title: string;
  items: any[];
  onChange: (newItems: any[]) => void;
}) {
  // Track open state for each item index (can support accordion or individual toggles)
  const [openIndexes, setOpenIndexes] = useState<Record<number, boolean>>({
    0: true, // first item open by default
  });

  const toggleItem = (idx: number) => {
    setOpenIndexes((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleExpandAll = () => {
    const allOpen: Record<number, boolean> = {};
    items.forEach((_, i) => {
      allOpen[i] = true;
    });
    setOpenIndexes(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenIndexes({});
  };

  const handleItemChange = (idx: number, newItem: any) => {
    const updated = [...items];
    updated[idx] = newItem;
    onChange(updated);
  };

  const handleAddItem = () => {
    const sampleItem =
      items.length > 0
        ? createSampleFromPattern(items[0])
        : { title: "New Item", description: "" };
    const updated = [...items, sampleItem];
    onChange(updated);
    // Auto-open newly added item
    setOpenIndexes((prev) => ({
      ...prev,
      [updated.length - 1]: true,
    }));
  };

  const handleDeleteItem = (idx: number) => {
    const updated = items.filter((_, i) => i !== idx);
    onChange(updated);
  };

  const handleMove = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const updated = [...items];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange(updated);

    // Keep open state synchronized
    setOpenIndexes((prev) => {
      const next = { ...prev };
      const curOpen = prev[idx];
      const targetOpen = prev[targetIdx];
      next[targetIdx] = curOpen;
      next[idx] = targetOpen;
      return next;
    });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
      {/* Repeater Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            {title} ({items.length})
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Manage, reorder, or edit individual items in this collection.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {items.length > 1 && (
            <div className="flex items-center gap-1.5 mr-1">
              <button
                type="button"
                onClick={handleExpandAll}
                className="text-[11px] font-medium text-slate-500 hover:text-slate-900 px-1.5 py-1"
              >
                Expand all
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={handleCollapseAll}
                className="text-[11px] font-medium text-slate-500 hover:text-slate-900 px-1.5 py-1"
              >
                Collapse all
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add item</span>
          </button>
        </div>
      </div>

      {/* List of Collapsible Cards */}
      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const isOpen = Boolean(openIndexes[idx]);
          const displayHeader = getItemSummaryTitle(item, idx);

          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all ${
                isOpen
                  ? "border-slate-300 bg-white shadow-xs"
                  : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
              }`}
            >
              {/* Card Header Bar */}
              <div className="flex items-center justify-between p-3.5 gap-3">
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="flex items-center gap-2.5 text-xs font-bold text-slate-800 hover:text-slate-900 text-left flex-1 truncate"
                >
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600">
                    {idx + 1}
                  </span>
                  <span className="truncate">{displayHeader}</span>
                </button>

                {/* Card Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    title="Move up"
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-25 rounded hover:bg-slate-100 transition-colors"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === items.length - 1}
                    title="Move down"
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-25 rounded hover:bg-slate-100 transition-colors"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(idx)}
                    title="Delete item"
                    className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleItem(idx)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors ml-1"
                  >
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Card Body (Visible when expanded) */}
              {isOpen && (
                <div className="p-5 border-t border-slate-100 bg-white rounded-b-xl space-y-4">
                  {typeof item === "object" && item !== null ? (
                    <GenericSectionObjectEditor
                      bodyState={item}
                      onChange={(updatedItem) => handleItemChange(idx, updatedItem)}
                    />
                  ) : (
                    <input
                      type="text"
                      value={String(item)}
                      onChange={(e) => handleItemChange(idx, e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:outline-none"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-xs italic text-slate-400">
            No items in list. Click "Add item" to add one.
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   HELPER UTILITIES
========================================================================= */

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

function getItemSummaryTitle(item: any, idx: number): string {
  if (typeof item !== "object" || item === null) {
    return String(item) || `Item #${idx + 1}`;
  }

  const candidate =
    item.title ||
    item.name ||
    item.question ||
    item.q ||
    item.schoolName ||
    item.program ||
    item.categoryName ||
    item.heading ||
    item.label ||
    item.subject ||
    item.package ||
    item.stat ||
    item.metric;

  if (candidate && typeof candidate === "string" && candidate.trim()) {
    return candidate.slice(0, 65);
  }

  return `Item #${idx + 1}`;
}

function getSectionFieldsSummary(body: any): string | null {
  if (!body || typeof body !== "object") return null;
  const keys = Object.keys(body);
  if (keys.length === 0) return null;

  const parts: string[] = [];

  // Check for common array counters
  for (const k of keys) {
    if (Array.isArray(body[k])) {
      parts.push(`${body[k].length} ${formatLabel(k).toLowerCase()}`);
    }
  }

  if (parts.length > 0) {
    return parts.join(", ");
  }

  // Otherwise list first 3 keys
  return `${keys.length} fields (${keys.slice(0, 3).map(formatLabel).join(", ")}${
    keys.length > 3 ? "..." : ""
  })`;
}

function createSampleFromPattern(patternObj: any): any {
  if (typeof patternObj !== "object" || patternObj === null) return "";
  const sample: any = {};
  for (const k of Object.keys(patternObj)) {
    const val = patternObj[k];
    if (typeof val === "string") sample[k] = "";
    else if (typeof val === "number") sample[k] = 0;
    else if (typeof val === "boolean") sample[k] = false;
    else if (Array.isArray(val)) {
      if (val.length > 0 && typeof val[0] === "object") {
        sample[k] = [createSampleFromPattern(val[0])];
      } else {
        sample[k] = [];
      }
    } else if (typeof val === "object") {
      sample[k] = createSampleFromPattern(val);
    }
  }
  return sample;
}

function PageIcon({
  name,
  className = "h-5 w-5",
}: {
  name: AdmissionsPageOption["iconName"];
  className?: string;
}) {
  switch (name) {
    case "GraduationCap":
      return <GraduationCap className={className} />;
    case "BookOpen":
      return <BookOpen className={className} />;
    case "HelpCircle":
      return <HelpCircle className={className} />;
    case "Award":
      return <Award className={className} />;
    case "Globe":
      return <Globe className={className} />;
    case "FileText":
      return <FileText className={className} />;
    default:
      return <FileText className={className} />;
  }
}