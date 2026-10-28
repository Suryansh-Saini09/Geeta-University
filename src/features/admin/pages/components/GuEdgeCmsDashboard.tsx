"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Search,
  X,
  Loader2,
} from "lucide-react";
import {
  GU_EDGE_PAGES_OPTIONS,
  type GuEdgePageOption,
  type GuEdgeSectionItem,
} from "../guEdgeConfig";

/* =========================================================================
   TYPES & PROPS
========================================================================= */

export type PagePublicationStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

export interface GuEdgePageData {
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

interface GuEdgeCmsDashboardProps {
  initialPageSlug?: string;
  initialSectionKey?: string;
  adminDataBySlug: Record<string, GuEdgePageData>;
}

/* =========================================================================
   SECTION SUMMARY HELPER
========================================================================= */

function getSectionFieldsSummary(body: any): string | null {
  if (!body) return null;
  if (Array.isArray(body)) {
    return `${body.length} block items configured`;
  }
  if (typeof body !== "object") return null;

  const parts: string[] = [];
  if (body.title) parts.push(`"${body.title}"`);
  else if (body.heading) parts.push(`"${body.heading}"`);

  if (Array.isArray(body.features)) parts.push(`${body.features.length} cards`);
  if (Array.isArray(body.steps)) parts.push(`${body.steps.length} timeline steps`);
  if (Array.isArray(body.stages)) parts.push(`${body.stages.length} stages`);
  if (Array.isArray(body.mentors)) parts.push(`${body.mentors.length} mentors`);
  if (Array.isArray(body.stats)) parts.push(`${body.stats.length} metrics`);
  if (Array.isArray(body.playlist)) parts.push(`${body.playlist.length} videos`);
  if (Array.isArray(body.items)) parts.push(`${body.items.length} items`);
  if (Array.isArray(body.testimonials)) parts.push(`${body.testimonials.length} testimonials`);

  return parts.length > 0 ? parts.join(" • ") : null;
}

/* =========================================================================
   MAIN DASHBOARD COMPONENT
========================================================================= */

export function GuEdgeCmsDashboard({
  initialPageSlug,
  initialSectionKey,
  adminDataBySlug: initialAdminData,
}: GuEdgeCmsDashboardProps) {
  // Local mutable cache of admin data to immediately reflect saves
  const [dataCache, setDataCache] = useState<Record<string, GuEdgePageData>>(initialAdminData);

  // Selected page & section state
  const [selectedPageSlug, setSelectedPageSlug] = useState<string | null>(
    initialPageSlug && GU_EDGE_PAGES_OPTIONS.some((p) => p.slug === initialPageSlug)
      ? initialPageSlug
      : null
  );

  const [activeSectionKey, setActiveSectionKey] = useState<string | null>(
    initialSectionKey || null
  );

  // Helper to extract clean section body (handling direct vs nested { body: ... })
  const extractCleanBody = (slug: string, secKey: string, sourceData?: Record<string, GuEdgePageData>) => {
    const source = sourceData || dataCache || initialAdminData;
    const rawSec = source?.[slug]?.sections?.[secKey]?.body;
    if (
      rawSec &&
      typeof rawSec === "object" &&
      rawSec.body &&
      typeof rawSec.body === "object" &&
      !Array.isArray(rawSec.body)
    ) {
      return rawSec.body;
    }
    return rawSec || {};
  };

  // Active form editing state for View C (eagerly initialized from initial props)
  const [activeBodyState, setActiveBodyState] = useState<any>(() => {
    if (initialPageSlug && initialSectionKey && initialSectionKey !== "seo") {
      const clean = extractCleanBody(initialPageSlug, initialSectionKey, initialAdminData);
      return clean ? JSON.parse(JSON.stringify(clean)) : {};
    }
    return {};
  });
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

      if (page && GU_EDGE_PAGES_OPTIONS.some((p) => p.slug === page)) {
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
    const targetUrl = queryString ? `/admin/gu-edge?${queryString}` : "/admin/gu-edge";
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

  // Navigate to View A (GU Edge Overview)
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
        const cleanBody = extractCleanBody(selectedPageSlug, secKey);
        // Deep clone so unsaved changes can be cleanly isolated
        setActiveBodyState(cleanBody ? JSON.parse(JSON.stringify(cleanBody)) : {});
      }
      setIsDirty(false);
      updateUrl(selectedPageSlug, secKey);
    });
  };

  // Initialize activeBodyState when entering View C
  useEffect(() => {
    if (selectedPageSlug && activeSectionKey && activeSectionKey !== "seo") {
      const cleanBody = extractCleanBody(selectedPageSlug, activeSectionKey);
      setActiveBodyState(cleanBody ? JSON.parse(JSON.stringify(cleanBody)) : {});
      setIsDirty(false);
    }
  }, [selectedPageSlug, activeSectionKey]);

  // Current selected page option from config
  const currentPageOption = useMemo(() => {
    if (!selectedPageSlug) return null;
    return GU_EDGE_PAGES_OPTIONS.find((p) => p.slug === selectedPageSlug) || null;
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
                Discard &amp; Proceed
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

      {/* VIEW A: GU Edge Overview (Grid of Page Cards) */}
      {currentView === "pages" && (
        <GuEdgeOverviewView
          adminDataBySlug={dataCache}
          onSelectPage={handleSelectPage}
        />
      )}

      {/* VIEW B: Selected Page's Section Overview */}
      {currentView === "sections" && currentPageOption && (
        <GuEdgeSectionsOverviewView
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
        <FocusedGuEdgeSectionEditorView
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
          onBackToGuEdge={handleNavigateToPages}
          onSwitchSection={handleSelectSection}
        />
      )}
    </div>
  );
}

/* =========================================================================
   VIEW A: GU EDGE OVERVIEW
========================================================================= */

function GuEdgeOverviewView({
  adminDataBySlug,
  onSelectPage,
}: {
  adminDataBySlug: Record<string, GuEdgePageData>;
  onSelectPage: (slug: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Filter pages by search query and publication status
  const filteredPages = useMemo(() => {
    return GU_EDGE_PAGES_OPTIONS.filter((page) => {
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
          GU Edge
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          Manage GU Edge initiative pages, mentors, curriculum tracks, specialized learning models, and media.
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
            placeholder="Search GU Edge pages by title or URL..."
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
                onClick={() => onSelectPage(page.slug)}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-400 hover:shadow-md transition-all cursor-pointer"
              >
                <div>
                  {/* Top Row: Title & Status Badge */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                      {page.title}
                    </h2>
                    <span
                      className={`inline-flex shrink-0 items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
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

                  {/* Description */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {page.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-900">
            No GU Edge pages matched your search.
          </p>
          <p className="text-xs text-slate-500">
            Try adjusting your search terms or publication filter to locate GU Edge content.
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

function GuEdgeSectionsOverviewView({
  pageOption,
  pageData,
  onBack,
  onSelectSection,
  onUpdatePageStatus,
  isSaving,
}: {
  pageOption: GuEdgePageOption;
  pageData: GuEdgePageData;
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
          GU Edge
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
              <span>Back to GU Edge</span>
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
        {filteredSections.map((sec) => {
          const rawSec = sections[sec.key]?.body;
          const cleanBody =
            rawSec && typeof rawSec === "object" && rawSec.body && typeof rawSec.body === "object" && !Array.isArray(rawSec.body)
              ? rawSec.body
              : rawSec;
          const isConfigured = Boolean(cleanBody && (Array.isArray(cleanBody) ? cleanBody.length > 0 : Object.keys(cleanBody).length > 0));

          return (
            <div
              key={sec.key}
              onClick={() => onSelectSection(sec.key)}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-400 hover:shadow-md transition-all cursor-pointer"
            >
              <div>
                {/* Top Row: Title & Config Status Badge */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                    {sec.label.replace(/^\d+[\.\)]\s*/, "")}
                  </h3>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      isConfigured
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
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

                {/* Section Description */}
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {sec.description}
                </p>
              </div>
            </div>
          );
        })}

        {/* Dedicated SEO & Meta Tags Card */}
        <div
          onClick={() => onSelectSection("seo")}
          className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-400 hover:shadow-md transition-all cursor-pointer"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-600 group-hover:text-slate-900 transition-colors" />
                <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                  SEO &amp; Meta Tags
                </h3>
              </div>
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  hasSeo
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-600 border-slate-200"
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
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
              Manage search engine title, meta description, keywords, canonical link, and social sharing image.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   VIEW C: FOCUSED, FULL-WIDTH SECTION EDITOR
========================================================================= */

function FocusedGuEdgeSectionEditorView({
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
  onBackToGuEdge,
  onSwitchSection,
}: {
  pageOption: GuEdgePageOption;
  sectionKey: string;
  bodyState: any;
  seoState: any;
  isDirty: boolean;
  isSaving: boolean;
  onBodyChange: (newBody: any) => void;
  onSeoChange: (newSeo: any) => void;
  onSave: () => void;
  onBackToSections: () => void;
  onBackToGuEdge: () => void;
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
          onClick={onBackToGuEdge}
          className="hover:text-slate-900 transition-colors font-semibold"
        >
          GU Edge
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
                ? "Configure search engine titles, open-graph image, and metadata tags for this GU Edge page."
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
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
            >
              <span>Next: {nextSection.label}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
        {isSeo ? (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Meta Title Tag
              </label>
              <input
                type="text"
                value={seoState.title}
                onChange={(e) => onSeoChange({ ...seoState, title: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none transition-all"
                placeholder={`e.g. ${pageOption.title} | Geeta University`}
              />
            </div>

            <div>
              <CmsAutoTextarea
                label="Meta Description"
                value={seoState.description}
                onChange={(val) => onSeoChange({ ...seoState, description: val })}
                placeholder="Compelling search result description summarizing the page..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Keywords (comma separated)
              </label>
              <input
                type="text"
                value={seoState.keywords}
                onChange={(e) => onSeoChange({ ...seoState, keywords: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none transition-all"
                placeholder="geeta university, gu edge, higher education"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Canonical URL
                </label>
                <input
                  type="text"
                  value={seoState.canonical}
                  onChange={(e) => onSeoChange({ ...seoState, canonical: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none transition-all"
                  placeholder={`https://geetauniversity.edu.in${pageOption.publicRoute}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Open Graph Social Title
                </label>
                <input
                  type="text"
                  value={seoState.ogTitle}
                  onChange={(e) => onSeoChange({ ...seoState, ogTitle: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none transition-all"
                  placeholder={pageOption.title}
                />
              </div>
            </div>

            <div className="pt-2">
              <CmsImagePreviewInput
                label="OG Social Image"
                value={seoState.ogImage}
                onChange={(val) => onSeoChange({ ...seoState, ogImage: val })}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <input
                type="checkbox"
                id="noIndexToggle"
                checked={seoState.noIndex}
                onChange={(e) => onSeoChange({ ...seoState, noIndex: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
              />
              <label htmlFor="noIndexToggle" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Instruct search engines not to index this page (no-index)
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Safe Normalized Body Editor Switcher */}
            {(() => {
              const safeBody = bodyState || {};
              if (
                Array.isArray(safeBody) ||
                sectionKey === "features" ||
                sectionKey.startsWith("featureGrid")
              ) {
                return (
                  <FeatureGridSectionEditor
                    state={safeBody}
                    onChange={onBodyChange}
                  />
                );
              }
              if (sectionKey.includes("accordion")) {
                return (
                  <AccordionSectionEditor
                    state={safeBody}
                    onChange={onBodyChange}
                  />
                );
              }
              if (sectionKey === "timeline") {
                return (
                  <TimelineSectionEditor
                    state={safeBody}
                    onChange={onBodyChange}
                  />
                );
              }
              if (sectionKey.includes("training")) {
                return (
                  <TrainingModelSectionEditor
                    state={safeBody}
                    onChange={onBodyChange}
                  />
                );
              }
              if (sectionKey === "videos") {
                return (
                  <VideoSectionEditor
                    state={safeBody}
                    onChange={onBodyChange}
                  />
                );
              }
              if (sectionKey === "mentors") {
                return (
                  <MentorsSectionEditor
                    state={safeBody}
                    onChange={onBodyChange}
                  />
                );
              }
              if (sectionKey === "testimonials") {
                return (
                  <TestimonialsSectionEditor
                    state={safeBody}
                    onChange={onBodyChange}
                  />
                );
              }
              if (sectionKey === "gallery") {
                return (
                  <GallerySectionEditor
                    state={safeBody}
                    onChange={onBodyChange}
                  />
                );
              }
              if (sectionKey === "stats") {
                return (
                  <StatsSectionEditor
                    state={safeBody}
                    onChange={onBodyChange}
                  />
                );
              }
              if (sectionKey === "cta") {
                return (
                  <CtaSectionEditor
                    state={safeBody}
                    onChange={onBodyChange}
                  />
                );
              }
              return (
                <UniversalSectionEditor
                  state={safeBody}
                  onChange={onBodyChange}
                  activeSectionKey={sectionKey}
                />
              );
            })()}
          </div>
        )}


        {/* Bottom Save Changes Action Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToSections}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to sections</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs"
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
   SUB-EDITORS FOR SPECIALISED SECTION TYPES
========================================================================= */

function FeatureGridSectionEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  // Normalize array vs object
  const gridList = Array.isArray(state) ? state : [state];

  const updateGridItem = (idx: number, updatedItem: any) => {
    if (Array.isArray(state)) {
      const copy = [...state];
      copy[idx] = updatedItem;
      onChange(copy);
    } else {
      onChange(updatedItem);
    }
  };

  const addGridCard = () => {
    const newCard = {
      id: `feature-card-${Date.now()}`,
      title: "New Feature Block Title",
      columns: 3,
      layoutStyle: "cards",
      description: "Feature block overview description...",
      features: [
        { title: "Feature Item 1", description: "Details..." },
        { title: "Feature Item 2", description: "Details..." },
      ],
    };
    if (Array.isArray(state)) {
      onChange([...state, newCard]);
    } else {
      onChange([state, newCard]);
    }
  };

  const removeGridCard = (idx: number) => {
    if (Array.isArray(state)) {
      onChange(state.filter((_, i) => i !== idx));
    } else {
      onChange([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h4 className="text-sm font-bold text-slate-900">Feature Grid Cards ({gridList.length})</h4>
        <button
          type="button"
          onClick={addGridCard}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Grid Block</span>
        </button>
      </div>

      {gridList.map((grid, gridIdx) => (
        <div key={gridIdx} className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4 relative">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="text-xs font-bold uppercase text-slate-800">
              Grid Block #{gridIdx + 1}: {grid.title || "Feature Grid"}
            </span>
            {gridList.length > 1 && (
              <button
                type="button"
                onClick={() => removeGridCard(gridIdx)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove Block</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Grid Main Title</label>
              <input
                type="text"
                value={grid.title || ""}
                onChange={(e) => updateGridItem(gridIdx, { ...grid, title: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Columns</label>
                <select
                  value={grid.columns || 3}
                  onChange={(e) => updateGridItem(gridIdx, { ...grid, columns: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-slate-400"
                >
                  <option value={2}>2 Columns</option>
                  <option value={3}>3 Columns</option>
                  <option value={4}>4 Columns</option>
                  <option value={5}>5 Columns</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Layout Style</label>
                <select
                  value={grid.layoutStyle || "cards"}
                  onChange={(e) => updateGridItem(gridIdx, { ...grid, layoutStyle: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-slate-400"
                >
                  <option value="cards">Cards</option>
                  <option value="numbered">Numbered</option>
                  <option value="minimal">Minimal</option>
                  <option value="badges">Badges</option>
                  <option value="split">Split</option>
                </select>
              </div>
            </div>
          </div>

          {grid.description !== undefined && (
            <CmsAutoTextarea
              label="Block Overview Description"
              value={grid.description || ""}
              onChange={(val) => updateGridItem(gridIdx, { ...grid, description: val })}
              rows={2}
            />
          )}

          {/* Features Repeater */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase text-slate-800">
                Feature Items (Cards) ({grid.features?.length || 0})
              </label>
              <button
                type="button"
                onClick={() => {
                  const currentFeatures = grid.features || [];
                  const newFeat = { title: "New Feature Title", description: "" };
                  updateGridItem(gridIdx, { ...grid, features: [...currentFeatures, newFeat] });
                }}
                className="inline-flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs font-bold text-white hover:bg-slate-900 transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>Add Card</span>
              </button>
            </div>

            <div className="space-y-3">
              {(grid.features || []).map((feat: any, featIdx: number) => (
                <div key={featIdx} className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800">
                      Card #{featIdx + 1}: {feat.title || "Feature Item"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedFeats = (grid.features || []).filter((_: any, i: number) => i !== featIdx);
                        updateGridItem(gridIdx, { ...grid, features: updatedFeats });
                      }}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-600 mb-0.5">Card Title</label>
                      <input
                        type="text"
                        value={feat.title || ""}
                        onChange={(e) => {
                          const updatedFeats = [...(grid.features || [])];
                          updatedFeats[featIdx] = { ...updatedFeats[featIdx], title: e.target.value };
                          updateGridItem(gridIdx, { ...grid, features: updatedFeats });
                        }}
                        className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-slate-400"
                      />
                    </div>
                    {feat.subtitle !== undefined && (
                      <div>
                        <label className="block font-bold text-slate-600 mb-0.5">Subtitle / Tag</label>
                        <input
                          type="text"
                          value={feat.subtitle || feat.tag || ""}
                          onChange={(e) => {
                            const updatedFeats = [...(grid.features || [])];
                            updatedFeats[featIdx] = { ...updatedFeats[featIdx], subtitle: e.target.value };
                            updateGridItem(gridIdx, { ...grid, features: updatedFeats });
                          }}
                          className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                        />
                      </div>
                    )}
                  </div>

                  {feat.description !== undefined && (
                    <CmsAutoTextarea
                      label="Card Description"
                      value={feat.description || ""}
                      onChange={(val) => {
                        const updatedFeats = [...(grid.features || [])];
                        updatedFeats[featIdx] = { ...updatedFeats[featIdx], description: val };
                        updateGridItem(gridIdx, { ...grid, features: updatedFeats });
                      }}
                      rows={2}
                    />
                  )}

                  {feat.image !== undefined && (
                    <CmsImagePreviewInput
                      label="Card Icon / Image URL"
                      value={feat.image || ""}
                      onChange={(val) => {
                        const updatedFeats = [...(grid.features || [])];
                        updatedFeats[featIdx] = { ...updatedFeats[featIdx], image: val };
                        updateGridItem(gridIdx, { ...grid, features: updatedFeats });
                      }}
                    />
                  )}

                  {Array.isArray(feat.bullets) && (
                    <CmsStringRepeater
                      title="Bullet Points"
                      items={feat.bullets}
                      onChange={(newBullets) => {
                        const updatedFeats = [...(grid.features || [])];
                        updatedFeats[featIdx] = { ...updatedFeats[featIdx], bullets: newBullets };
                        updateGridItem(gridIdx, { ...grid, features: updatedFeats });
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AccordionSectionEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const accList = Array.isArray(state) ? state : [state];

  const updateAcc = (idx: number, updatedItem: any) => {
    if (Array.isArray(state)) {
      const copy = [...state];
      copy[idx] = updatedItem;
      onChange(copy);
    } else {
      onChange(updatedItem);
    }
  };

  return (
    <div className="space-y-6">
      {accList.map((acc, accIdx) => (
        <div key={accIdx} className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
              <input
                type="text"
                value={acc.title || ""}
                onChange={(e) => updateAcc(accIdx, { ...acc, title: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:border-slate-400"
              />
            </div>
            {acc.subtitle !== undefined && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={acc.subtitle || ""}
                  onChange={(e) => updateAcc(accIdx, { ...acc, subtitle: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-slate-400"
                />
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase text-slate-800">
                Accordion Program Items ({acc.items?.length || 0})
              </label>
              <button
                type="button"
                onClick={() => {
                  const currentItems = acc.items || [];
                  const newItem = { id: `item-${Date.now()}`, title: "New Academic Course Program", duration: "3-4 Years", eligibility: "10+2", description: "" };
                  updateAcc(accIdx, { ...acc, items: [...currentItems, newItem] });
                }}
                className="inline-flex items-center gap-1 rounded bg-slate-900 px-2.5 py-1 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>Add Accordion Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {(acc.items || []).map((item: any, itemIdx: number) => (
                <div key={itemIdx} className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800">
                      #{itemIdx + 1}: {item.title || "Course Program"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedItems = (acc.items || []).filter((_: any, i: number) => i !== itemIdx);
                        updateAcc(accIdx, { ...acc, items: updatedItems });
                      }}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-600 mb-0.5">Program Title</label>
                      <input
                        type="text"
                        value={item.title || ""}
                        onChange={(e) => {
                          const updated = [...(acc.items || [])];
                          updated[itemIdx] = { ...updated[itemIdx], title: e.target.value };
                          updateAcc(accIdx, { ...acc, items: updated });
                        }}
                        className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 mb-0.5">Duration</label>
                      <input
                        type="text"
                        value={item.duration || ""}
                        onChange={(e) => {
                          const updated = [...(acc.items || [])];
                          updated[itemIdx] = { ...updated[itemIdx], duration: e.target.value };
                          updateAcc(accIdx, { ...acc, items: updated });
                        }}
                        className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>

                  {item.description !== undefined && (
                    <CmsAutoTextarea
                      label="Program Overview"
                      value={item.description || ""}
                      onChange={(val) => {
                        const updated = [...(acc.items || [])];
                        updated[itemIdx] = { ...updated[itemIdx], description: val };
                        updateAcc(accIdx, { ...acc, items: updated });
                      }}
                      rows={2}
                    />
                  )}

                  {Array.isArray(item.curriculum) && (
                    <CmsStringRepeater
                      title="Curriculum Modules"
                      items={item.curriculum}
                      onChange={(newCurr) => {
                        const updated = [...(acc.items || [])];
                        updated[itemIdx] = { ...updated[itemIdx], curriculum: newCurr };
                        updateAcc(accIdx, { ...acc, items: updated });
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineSectionEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const safeState = state || {};
  const steps = safeState.steps || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Timeline Heading</label>
        <input
          type="text"
          value={safeState.title || ""}
          onChange={(e) => onChange({ ...safeState, title: e.target.value })}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400"
        />
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-slate-800">
          Timeline Process Steps ({steps.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newStep = { stepNumber: steps.length + 1, title: "New Step Title", category: "Core", description: "", points: [], expandedDetails: "" };
            onChange({ ...safeState, steps: [...steps, newStep] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Step</span>
        </button>
      </div>

      <div className="space-y-3">
        {steps.map((step: any, idx: number) => (
          <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800">
                Step #{step.stepNumber || idx + 1}: {step.title}
              </span>
              <button
                type="button"
                onClick={() => {
                  onChange({ ...safeState, steps: steps.filter((_: any, i: number) => i !== idx) });
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Step Number</label>
                <input
                  type="number"
                  value={step.stepNumber || idx + 1}
                  onChange={(e) => {
                    const copy = [...steps];
                    copy[idx] = { ...copy[idx], stepNumber: Number(e.target.value) };
                    onChange({ ...safeState, steps: copy });
                  }}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Step Title</label>
                <input
                  type="text"
                  value={step.title || ""}
                  onChange={(e) => {
                    const copy = [...steps];
                    copy[idx] = { ...copy[idx], title: e.target.value };
                    onChange({ ...safeState, steps: copy });
                  }}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Category</label>
                <input
                  type="text"
                  value={step.category || ""}
                  onChange={(e) => {
                    const copy = [...steps];
                    copy[idx] = { ...copy[idx], category: e.target.value };
                    onChange({ ...safeState, steps: copy });
                  }}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <CmsAutoTextarea
              label="Step Description"
              value={step.description || ""}
              onChange={(val) => {
                const copy = [...steps];
                copy[idx] = { ...copy[idx], description: val };
                onChange({ ...safeState, steps: copy });
              }}
              rows={2}
            />

            <CmsStringRepeater
              title="Bullet Points / Highlights"
              items={Array.isArray(step.points) ? step.points : []}
              onChange={(newPoints) => {
                const copy = [...steps];
                copy[idx] = { ...copy[idx], points: newPoints };
                onChange({ ...safeState, steps: copy });
              }}
            />

            <CmsAutoTextarea
              label="Expanded Details / Takeaways"
              value={Array.isArray(step.expandedDetails) ? step.expandedDetails.join("\n") : (step.expandedDetails || "")}
              onChange={(val) => {
                const copy = [...steps];
                copy[idx] = { ...copy[idx], expandedDetails: val };
                onChange({ ...safeState, steps: copy });
              }}
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}


function TrainingModelSectionEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const safeState = state || {};
  const stages = safeState.stages || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Model Heading</label>
        <input
          type="text"
          value={safeState.title || ""}
          onChange={(e) => onChange({ ...safeState, title: e.target.value })}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400"
        />
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-slate-800">
          Training Stages ({stages.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newStage = { stageNumber: stages.length + 1, stageName: `Stage ${stages.length + 1}`, title: "New Training Stage", description: "", focusAreas: [] };
            onChange({ ...safeState, stages: [...stages, newStage] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Stage</span>
        </button>
      </div>

      <div className="space-y-3">
        {stages.map((stage: any, idx: number) => (
          <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800">
                Stage #{stage.stageNumber || idx + 1}: {stage.title}
              </span>
              <button
                type="button"
                onClick={() => {
                  onChange({ ...safeState, stages: stages.filter((_: any, i: number) => i !== idx) });
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Stage Name / Badge</label>
                <input
                  type="text"
                  value={stage.stageName || ""}
                  onChange={(e) => {
                    const copy = [...stages];
                    copy[idx] = { ...copy[idx], stageName: e.target.value };
                    onChange({ ...safeState, stages: copy });
                  }}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Stage Title</label>
                <input
                  type="text"
                  value={stage.title || ""}
                  onChange={(e) => {
                    const copy = [...stages];
                    copy[idx] = { ...copy[idx], title: e.target.value };
                    onChange({ ...safeState, stages: copy });
                  }}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <CmsAutoTextarea
              label="Stage Description"
              value={stage.description || ""}
              onChange={(val) => {
                const copy = [...stages];
                copy[idx] = { ...copy[idx], description: val };
                onChange({ ...safeState, stages: copy });
              }}
              rows={2}
            />

            {Array.isArray(stage.focusAreas) && (
              <CmsStringRepeater
                title="Focus Areas"
                items={stage.focusAreas}
                onChange={(newAreas) => {
                  const copy = [...stages];
                  copy[idx] = { ...copy[idx], focusAreas: newAreas };
                  onChange({ ...safeState, stages: copy });
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoSectionEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const safeState = state || {};
  const playlist = safeState.playlist || [];
  const featured = safeState.featuredVideo || {};

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Video Section Title</label>
        <input
          type="text"
          value={safeState.title || ""}
          onChange={(e) => onChange({ ...safeState, title: e.target.value })}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400"
        />
      </div>

      {/* Featured Video */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
        <h4 className="font-bold text-xs uppercase text-slate-800">Featured Hero Video Spotlight</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-0.5">Video Title</label>
            <input
              type="text"
              value={featured.title || ""}
              onChange={(e) => onChange({ ...safeState, featuredVideo: { ...featured, title: e.target.value } })}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-0.5">Video URL (YouTube/Embed)</label>
            <input
              type="text"
              value={featured.videoUrl || ""}
              onChange={(e) => onChange({ ...safeState, featuredVideo: { ...featured, videoUrl: e.target.value } })}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-slate-400"
            />
          </div>
        </div>
        <CmsImagePreviewInput
          label="Featured Video Poster / Thumbnail"
          value={featured.thumbnail || ""}
          onChange={(val) => onChange({ ...safeState, featuredVideo: { ...featured, thumbnail: val } })}
        />
      </div>

      {/* Playlist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <label className="block text-xs font-bold uppercase text-slate-800">
            Playlist Videos ({playlist.length})
          </label>
          <button
            type="button"
            onClick={() => {
              const newVid = { title: "New Video Story", videoUrl: "", thumbnail: "" };
              onChange({ ...safeState, playlist: [...playlist, newVid] });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Video</span>
          </button>
        </div>


        {playlist.map((vid: any, idx: number) => (
          <div key={idx} className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800">
                Video #{idx + 1}: {vid.title || "Video Item"}
              </span>
              <button
                type="button"
                onClick={() => {
                  onChange({ ...state, playlist: playlist.filter((_: any, i: number) => i !== idx) });
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                <span>Remove</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Video Title</label>
                <input
                  type="text"
                  value={vid.title || ""}
                  onChange={(e) => {
                    const copy = [...playlist];
                    copy[idx] = { ...copy[idx], title: e.target.value };
                    onChange({ ...state, playlist: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Video URL</label>
                <input
                  type="text"
                  value={vid.videoUrl || ""}
                  onChange={(e) => {
                    const copy = [...playlist];
                    copy[idx] = { ...copy[idx], videoUrl: e.target.value };
                    onChange({ ...state, playlist: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <CmsImagePreviewInput
              label="Thumbnail Poster"
              value={vid.thumbnail || ""}
              onChange={(val) => {
                const copy = [...playlist];
                copy[idx] = { ...copy[idx], thumbnail: val };
                onChange({ ...state, playlist: copy });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function MentorsSectionEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const safeState = state || {};
  const mentors = safeState.mentors || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
        <input
          type="text"
          value={safeState.title || ""}
          onChange={(e) => onChange({ ...safeState, title: e.target.value })}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400"
        />
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-slate-800">
          Corporate Mentors &amp; Faculty ({mentors.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newMentor = { name: "Mentor Name", designation: "Designation / Title", role: "Industry Expert", description: "", image: "" };
            onChange({ ...safeState, mentors: [...mentors, newMentor] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Mentor</span>
        </button>
      </div>

      <div className="space-y-3">
        {mentors.map((mentor: any, idx: number) => (
          <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800">
                Mentor #{idx + 1}: {mentor.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  onChange({ ...safeState, mentors: mentors.filter((_: any, i: number) => i !== idx) });
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Full Name</label>
                <input
                  type="text"
                  value={mentor.name || ""}
                  onChange={(e) => {
                    const copy = [...mentors];
                    copy[idx] = { ...copy[idx], name: e.target.value };
                    onChange({ ...safeState, mentors: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Designation</label>
                <input
                  type="text"
                  value={mentor.designation || ""}
                  onChange={(e) => {
                    const copy = [...mentors];
                    copy[idx] = { ...copy[idx], designation: e.target.value };
                    onChange({ ...safeState, mentors: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Role / Domain</label>
                <input
                  type="text"
                  value={mentor.role || ""}
                  onChange={(e) => {
                    const copy = [...mentors];
                    copy[idx] = { ...copy[idx], role: e.target.value };
                    onChange({ ...safeState, mentors: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <CmsImagePreviewInput
              label="Mentor Photo URL"
              value={mentor.image || ""}
              onChange={(val) => {
                const copy = [...mentors];
                copy[idx] = { ...copy[idx], image: val };
                onChange({ ...safeState, mentors: copy });
              }}
            />

            <CmsAutoTextarea
              label="Bio / Description"
              value={mentor.description || mentor.fullBio || ""}
              onChange={(val) => {
                const copy = [...mentors];
                copy[idx] = { ...copy[idx], description: val };
                onChange({ ...safeState, mentors: copy });
              }}
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}


function TestimonialsSectionEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const safeState = state || {};
  const items = safeState.testimonials || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
        <input
          type="text"
          value={safeState.title || ""}
          onChange={(e) => onChange({ ...safeState, title: e.target.value })}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400"
        />
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-slate-800">
          Student Testimonials ({items.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newItem = { name: "Student Name", programOrRole: "B.Tech CSE", quote: "Geeta University empowered me...", image: "" };
            onChange({ ...safeState, testimonials: [...items, newItem] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800">
                #{idx + 1}: {item.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  onChange({ ...safeState, testimonials: items.filter((_: any, i: number) => i !== idx) });
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Author Name</label>
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={(e) => {
                    const copy = [...items];
                    copy[idx] = { ...copy[idx], name: e.target.value };
                    onChange({ ...safeState, testimonials: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Program / Role</label>
                <input
                  type="text"
                  value={item.programOrRole || item.role || ""}
                  onChange={(e) => {
                    const copy = [...items];
                    copy[idx] = { ...copy[idx], programOrRole: e.target.value };
                    onChange({ ...safeState, testimonials: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <CmsImagePreviewInput
              label="Author Photo URL"
              value={item.image || ""}
              onChange={(val) => {
                const copy = [...items];
                copy[idx] = { ...copy[idx], image: val };
                onChange({ ...safeState, testimonials: copy });
              }}
            />

            <CmsAutoTextarea
              label="Testimonial Quote"
              value={item.quote || ""}
              onChange={(val) => {
                const copy = [...items];
                copy[idx] = { ...copy[idx], quote: val };
                onChange({ ...safeState, testimonials: copy });
              }}
              rows={3}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function GallerySectionEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const safeState = state || {};
  const items = safeState.items || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Gallery Section Title</label>
        <input
          type="text"
          value={safeState.title || ""}
          onChange={(e) => onChange({ ...safeState, title: e.target.value })}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400"
        />
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-slate-800">
          Gallery Images ({items.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newItem = { src: "", title: "", caption: "" };
            onChange({ ...safeState, items: [...items, newItem] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Photo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800">Photo #{idx + 1}</span>
              <button
                type="button"
                onClick={() => {
                  onChange({ ...safeState, items: items.filter((_: any, i: number) => i !== idx) });
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>

            <CmsImagePreviewInput
              label="Image File / URL"
              value={item.src || ""}
              onChange={(val) => {
                const copy = [...items];
                copy[idx] = { ...copy[idx], src: val };
                onChange({ ...safeState, items: copy });
              }}
            />

            <input
              type="text"
              placeholder="Caption / Title"
              value={item.title || item.caption || ""}
              onChange={(e) => {
                const copy = [...items];
                copy[idx] = { ...copy[idx], title: e.target.value };
                onChange({ ...safeState, items: copy });
              }}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-slate-400"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsSectionEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const safeState = state || {};
  const stats = safeState.stats || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
        <input
          type="text"
          value={safeState.title || ""}
          onChange={(e) => onChange({ ...safeState, title: e.target.value })}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400"
        />
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-slate-800">
          Key Statistics Counters ({stats.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newStat = { label: "New Metric", value: "100%", sublabel: "" };
            onChange({ ...safeState, stats: [...stats, newStat] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Stat</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stats.map((st: any, idx: number) => (
          <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <span className="text-xs font-bold text-slate-800">Stat #{idx + 1}</span>
              <button
                type="button"
                onClick={() => {
                  onChange({ ...safeState, stats: stats.filter((_: any, i: number) => i !== idx) });
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-800"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Value (e.g. 100%)</label>
                <input
                  type="text"
                  value={st.value || ""}
                  onChange={(e) => {
                    const copy = [...stats];
                    copy[idx] = { ...copy[idx], value: e.target.value };
                    onChange({ ...safeState, stats: copy });
                  }}
                  className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Label</label>
                <input
                  type="text"
                  value={st.label || ""}
                  onChange={(e) => {
                    const copy = [...stats];
                    copy[idx] = { ...copy[idx], label: e.target.value };
                    onChange({ ...safeState, stats: copy });
                  }}
                  className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CtaSectionEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const safeState = state || {};
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Banner Heading</label>
        <input
          type="text"
          value={safeState.heading || safeState.title || ""}
          onChange={(e) => onChange({ ...safeState, heading: e.target.value })}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400"
        />
      </div>

      <CmsAutoTextarea
        label="Description / Supporting Text"
        value={safeState.description || safeState.subtitle || ""}
        onChange={(val) => onChange({ ...safeState, description: val })}
        rows={3}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Primary Button Text</label>
          <input
            type="text"
            value={safeState.buttonText || "Apply Now"}
            onChange={(e) => onChange({ ...safeState, buttonText: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:outline-none focus:border-slate-400"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Primary Button Link</label>
          <input
            type="text"
            value={safeState.buttonLink || ""}
            onChange={(e) => onChange({ ...safeState, buttonLink: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>
    </div>
  );
}


function UniversalSectionEditor({ state, onChange, activeSectionKey }: { state: any; onChange: (val: any) => void; activeSectionKey: string }) {
  if (!state || typeof state !== "object") {
    return (
      <div className="p-4 text-center text-sm text-slate-500 italic">
        No structured content found for this section.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Common Scalar Fields */}
      {state.title !== undefined && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Section Title / Headline
          </label>
          <input
            type="text"
            value={state.title || ""}
            onChange={(e) => onChange({ ...state, title: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 focus:border-slate-400 focus:outline-none"
          />
        </div>
      )}

      {state.eyebrow !== undefined && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Eyebrow Badge
          </label>
          <input
            type="text"
            value={state.eyebrow || ""}
            onChange={(e) => onChange({ ...state, eyebrow: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-slate-400 focus:outline-none"
          />
        </div>
      )}

      {state.subtitle !== undefined && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Subtitle
          </label>
          <input
            type="text"
            value={state.subtitle || ""}
            onChange={(e) => onChange({ ...state, subtitle: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-slate-400 focus:outline-none"
          />
        </div>
      )}

      {state.description !== undefined && (
        <CmsAutoTextarea
          label="Description / Content Text"
          value={state.description || ""}
          onChange={(val) => onChange({ ...state, description: val })}
          rows={4}
        />
      )}

      {state.image !== undefined && (
        <CmsImagePreviewInput
          label="Featured Image URL"
          value={state.image || ""}
          onChange={(val) => onChange({ ...state, image: val })}
        />
      )}

      {state.videoUrl !== undefined && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Video URL / YouTube Embed
            </label>
            <input
              type="text"
              value={state.videoUrl || ""}
              onChange={(e) => onChange({ ...state, videoUrl: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-slate-400 focus:outline-none"
            />
          </div>
          <CmsImagePreviewInput
            label="Video Poster Thumbnail"
            value={state.videoThumb || ""}
            onChange={(val) => onChange({ ...state, videoThumb: val })}
          />
        </div>
      )}

      {/* CTAs */}
      {(state.ctaLink !== undefined || state.ctaText !== undefined) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Primary CTA Label
            </label>
            <input
              type="text"
              value={state.ctaText || "Apply Now"}
              onChange={(e) => onChange({ ...state, ctaText: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-slate-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Primary CTA Link URL
            </label>
            <input
              type="text"
              value={state.ctaLink || ""}
              onChange={(e) => onChange({ ...state, ctaLink: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-slate-400 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Custom NEP main_content section editor */}
      {activeSectionKey === "main_content" && (
        <div className="space-y-4 rounded-xl border border-slate-200 p-4 bg-slate-50">
          <h4 className="font-bold text-sm text-slate-900">NEP Main Content &amp; Bullet Points</h4>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">First University Heading</label>
            <input
              type="text"
              value={state.firstUniversityHeading || ""}
              onChange={(e) => onChange({ ...state, firstUniversityHeading: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-400 focus:outline-none"
            />
          </div>
          <CmsStringRepeater
            title="NEP Key Highlights Bullet Points"
            items={state.bulletPoints || []}
            onChange={(items) => onChange({ ...state, bulletPoints: items })}
          />
          <div>
            <CmsAutoTextarea
              label="Overview Paragraph"
              value={state.overviewText || ""}
              onChange={(val) => onChange({ ...state, overviewText: val })}
              rows={4}
            />
          </div>
        </div>
      )}

      {/* General Array Repeaters Fallback */}
      {Object.keys(state).map((propKey) => {
        const val = state[propKey];
        if (
          Array.isArray(val) &&
          !["bullets", "bulletPoints", "badges"].includes(propKey)
        ) {
          return (
            <div key={propKey} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  {propKey} ({val.length})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const newItem = typeof val[0] === "object" ? { title: "New Item" } : "New Item";
                    onChange({ ...state, [propKey]: [...val, newItem] });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="space-y-3">
                {val.map((item: any, idx: number) => (
                  <div key={idx} className="rounded-lg border border-slate-200 bg-white p-3 space-y-2 relative">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-700">
                        #{idx + 1} {item.title || item.name || item.stepNumber || "Item"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newArr = val.filter((_: any, i: number) => i !== idx);
                          onChange({ ...state, [propKey]: newArr });
                        }}
                        className="text-rose-600 hover:text-rose-800 text-xs font-bold inline-flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    {typeof item === "object" && item !== null && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {Object.keys(item).map((itemKey) => {
                          if (typeof item[itemKey] === "string" || typeof item[itemKey] === "number") {
                            return (
                              <div key={itemKey} className={itemKey.toLowerCase().includes("desc") ? "sm:col-span-2" : ""}>
                                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">
                                  {itemKey}
                                </label>
                                <input
                                  type="text"
                                  value={item[itemKey] ?? ""}
                                  onChange={(e) => {
                                    const updatedArr = [...val];
                                    updatedArr[idx] = { ...updatedArr[idx], [itemKey]: e.target.value };
                                    onChange({ ...state, [propKey]: updatedArr });
                                  }}
                                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                                />
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}