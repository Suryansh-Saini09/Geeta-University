"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  updatePageSectionAction,
  updatePageSeoAction,
} from "@/features/admin/pages/actions";
import { getSectionSuccessMessage, getPageTitle } from "@/lib/cms/sectionLabels";
import { sanitizeErrorMessage } from "@/lib/cms/errorSanitizer";
import {
  getInstitutionalPageConfig,
  getSectionMeta,
  INSTITUTIONAL_CATEGORY_FILTERS,
  STANDARD_INSTITUTIONAL_PAGES_LIST,
  type InstitutionalCategoryKey,
  type InstitutionalSectionMeta,
} from "../institutionalConfig";
import { InstitutionalFieldRenderer } from "./InstitutionalFieldRenderer";
import { InstitutionalSeoEditor } from "./InstitutionalSeoEditor";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Globe,
  Layers,
  Loader2,
  Save,
  Search,
  Sparkles,
  X,
  AlertTriangle,
} from "lucide-react";

interface InstitutionalPagesCmsDashboardProps {
  pageSlug: string;
  initialData: {
    sections: Record<string, any>;
    seo: any;
    page?: any;
  };
  initialSectionKey?: string;
}

export function InstitutionalPagesCmsDashboard({
  pageSlug,
  initialData,
  initialSectionKey,
}: InstitutionalPagesCmsDashboardProps) {
  const router = useRouter();

  // 1. Data Cache State
  const [sectionsData, setSectionsData] = useState<Record<string, any>>(
    initialData.sections || {}
  );
  const [seoData, setSeoData] = useState<any>(initialData.seo || {});

  // Synchronize state when pageSlug changes
  useEffect(() => {
    setSectionsData(initialData.sections || {});
    setSeoData(initialData.seo || {});
    setIsDirty(false);
    setFeedback(null);
  }, [pageSlug, initialData]);

  // Page metadata
  const pageConfig = useMemo(() => getInstitutionalPageConfig(pageSlug), [pageSlug]);

  // Section keys list
  const sectionKeys = useMemo(() => {
    const fromData = Object.keys(sectionsData || {});
    const fromConfig = Object.keys(pageConfig.sections || {});
    const combined = Array.from(new Set([...fromConfig, ...fromData])).filter(
      (k) => k !== "seo"
    );
    return combined;
  }, [sectionsData, pageConfig]);

  // 2. Navigation State
  const [activeSectionKey, setActiveSectionKey] = useState<string | null>(() => {
    if (initialSectionKey) {
      if (initialSectionKey === "seo" || sectionKeys.includes(initialSectionKey)) {
        return initialSectionKey;
      }
    }
    return null;
  });

  // 3. Search and Category Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<InstitutionalCategoryKey>("ALL");
  const [pageSwitcherOpen, setPageSwitcherOpen] = useState(false);

  // 4. Dirty State & Unsaved Navigation Guard
  const [isDirty, setIsDirty] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  // 5. Async Operations & Feedback
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Sync browser URL query string
  const updateUrl = (sec: string | null) => {
    const params = new URLSearchParams();
    params.set("page", pageSlug);
    if (sec) {
      params.set("section", sec);
    }
    const targetUrl = `/admin/pages/institutional?${params.toString()}`;
    window.history.pushState(null, "", targetUrl);
  };

  // Safe navigation guard
  const requestNavigation = (callback: () => void) => {
    if (isDirty) {
      setPendingNavigation(() => callback);
    } else {
      callback();
    }
  };

  const handleSelectSection = (key: string) => {
    requestNavigation(() => {
      setActiveSectionKey(key);
      updateUrl(key);
      setIsDirty(false);
      setFeedback(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const handleBackToDirectory = () => {
    requestNavigation(() => {
      setActiveSectionKey(null);
      updateUrl(null);
      setIsDirty(false);
      setFeedback(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const handleSwitchPage = (targetSlug: string) => {
    if (targetSlug === pageSlug) {
      setPageSwitcherOpen(false);
      return;
    }
    requestNavigation(() => {
      setPageSwitcherOpen(false);
      setIsDirty(false);
      setFeedback(null);
      router.push(`/admin/pages/institutional?page=${targetSlug}`);
    });
  };

  // Browser navigation history synchronization (Back/Forward popstate)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const sec = params.get("section");
      if (sec && (sec === "seo" || sectionKeys.includes(sec))) {
        setActiveSectionKey(sec);
      } else {
        setActiveSectionKey(null);
      }
      setIsDirty(false);
      setFeedback(null);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [sectionKeys]);

  // Window beforeunload prompt if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Helper to extract section body
  const getBody = (key: string) => {
    const sec = sectionsData[key];
    return sec?.body || sec || {};
  };

  // Helper to update section body in local state
  const handleSectionBodyChange = (key: string, nextBody: Record<string, any>) => {
    setSectionsData((prev: Record<string, any>) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        body: nextBody,
      },
    }));
    setIsDirty(true);
    setFeedback(null);
  };

  // Helper to update SEO data in local state
  const handleSeoDataChange = (nextSeo: any) => {
    setSeoData(nextSeo);
    setIsDirty(true);
    setFeedback(null);
  };

  // Save Content Section Action
  const handleSaveSection = async (key: string) => {
    setSavingKey(key);
    setFeedback(null);
    try {
      const body = getBody(key);
      const res = await updatePageSectionAction(pageSlug, key, body);
      if (res.success) {
        setFeedback({
          type: "success",
          message:
            res.message || getSectionSuccessMessage(key, pageSlug, "saved"),
        });
        setIsDirty(false);
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Failed to save section.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: sanitizeErrorMessage(err, "An unexpected error occurred while saving."),
      });
    } finally {
      setSavingKey(null);
    }
  };

  // Save SEO Metadata Action
  const handleSaveSeo = async () => {
    setSavingKey("seo");
    setFeedback(null);
    try {
      const res = await updatePageSeoAction(pageSlug, seoData);
      if (res.success) {
        setFeedback({
          type: "success",
          message:
            res.message ||
            `${pageConfig.title} SEO metadata saved successfully.`,
        });
        setIsDirty(false);
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Failed to save SEO metadata.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: sanitizeErrorMessage(err, "An unexpected error occurred while saving SEO."),
      });
    } finally {
      setSavingKey(null);
    }
  };

  // Calculate Real Overview Metrics
  const metrics = useMemo(() => {
    const totalSections = sectionKeys.length;
    let populatedCount = 0;
    let totalStructuredEntries = 0;

    sectionKeys.forEach((key) => {
      const body = getBody(key);
      const bodyKeys = Object.keys(body);
      if (bodyKeys.length > 0) {
        populatedCount += 1;
      }
      bodyKeys.forEach((k) => {
        if (Array.isArray(body[k])) {
          totalStructuredEntries += body[k].length;
        }
      });
    });

    const isSeoConfigured = Boolean(seoData?.title && seoData?.description);

    return {
      totalSections,
      populatedCount,
      totalStructuredEntries,
      isSeoConfigured,
    };
  }, [sectionKeys, sectionsData, seoData]);

  // Section List items formatted for directory
  const directorySections = useMemo(() => {
    const list: InstitutionalSectionMeta[] = sectionKeys.map((key) =>
      getSectionMeta(pageSlug, key)
    );

    // Append SEO Metadata as a first-class card
    list.push({
      key: "seo",
      label: "SEO & Social Sharing",
      category: "seo",
      categoryLabel: "Search & Sharing",
      description:
        "Manage search engine meta title, description snippet, keywords, OpenGraph card, and social share image.",
    });

    return list;
  }, [sectionKeys, pageSlug]);

  // Filtered sections by Search Query and Category
  const filteredSections = useMemo(() => {
    return directorySections.filter((sec) => {
      const matchesCategory =
        categoryFilter === "ALL" || sec.category === categoryFilter;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchLabel = sec.label.toLowerCase().includes(q);
      const matchDesc = sec.description.toLowerCase().includes(q);
      const matchKey = sec.key.toLowerCase().includes(q);
      const matchCat = sec.categoryLabel.toLowerCase().includes(q);

      return matchLabel || matchDesc || matchKey || matchCat;
    });
  }, [directorySections, categoryFilter, searchQuery]);

  // Section traversal for Previous / Next jump buttons in workspace
  const currentSectionIndex = useMemo(() => {
    if (!activeSectionKey) return -1;
    return directorySections.findIndex((s) => s.key === activeSectionKey);
  }, [activeSectionKey, directorySections]);

  const prevSection =
    currentSectionIndex > 0 ? directorySections[currentSectionIndex - 1] : null;
  const nextSection =
    currentSectionIndex >= 0 && currentSectionIndex < directorySections.length - 1
      ? directorySections[currentSectionIndex + 1]
      : null;

  const activeSectionMeta = useMemo(() => {
    if (!activeSectionKey) return null;
    return (
      directorySections.find((s) => s.key === activeSectionKey) ||
      getSectionMeta(pageSlug, activeSectionKey)
    );
  }, [activeSectionKey, directorySections, pageSlug]);

  return (
    <div className="space-y-6">
      {/* =====================================================================
          STAGE A: INSTITUTIONAL PAGE OVERVIEW HEADER
          (Only displayed on directory view without active section)
      ===================================================================== */}
      {!activeSectionKey && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2.5 max-w-3xl">
              {/* Breadcrumb & Institutional Tag */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                <span>Institutional CMS</span>
                <span>/</span>
                <span className="text-[#0A1F44] font-bold">{pageConfig.title}</span>
                <code className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700 border border-slate-200">
                  {pageConfig.publicUrl}
                </code>
              </div>

              {/* Page Heading */}
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1F44] tracking-tight">
                {pageConfig.title}
              </h1>

              {/* Page Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {pageConfig.description}
              </p>
            </div>

            {/* Action Controls: Switch Page & View Live Page */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Page Selector Switcher */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPageSwitcherOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition"
                >
                  <span>Switch Page</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {pageSwitcherOpen && (
                  <div className="absolute right-0 mt-2 z-30 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Standard Institutional Pages
                      </span>
                    </div>
                    <div className="space-y-0.5 max-h-72 overflow-y-auto">
                      {STANDARD_INSTITUTIONAL_PAGES_LIST.map((p) => {
                        const isSelected = p.slug === pageSlug;
                        return (
                          <button
                            key={p.slug}
                            type="button"
                            onClick={() => handleSwitchPage(p.slug)}
                            className={`w-full text-left rounded-xl px-3 py-2 text-xs font-medium transition flex items-center justify-between ${
                              isSelected
                                ? "bg-[#0A1F44] text-white font-bold"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            <span className="truncate">{p.title}</span>
                            {isSelected && (
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* External Live Link */}
              <a
                href={pageConfig.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0A1F44] hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition"
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                <span>View Live Page</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          role="status"
          className={`flex items-center gap-3 rounded-2xl p-4 text-xs font-semibold border animate-in fade-in duration-150 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          )}
          <span className="flex-1">{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 rounded text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* =====================================================================
          STAGE B: SEARCHABLE SECTION DIRECTORY (Shown when no section active)
      ===================================================================== */}
      {!activeSectionKey ? (
        <div className="space-y-6">
          {/* Search Bar & Category Filter Toolbar */}
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Sections Directory ({filteredSections.length})
                </span>
              </div>

              {/* Real-time search box */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find section (e.g. Hero, Helpline, SEO)..."
                  className="w-full rounded-xl border border-slate-200 bg-white pl-8.5 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex overflow-x-auto gap-2 pb-1 [scrollbar-width:none]">
              {INSTITUTIONAL_CATEGORY_FILTERS.map((cat) => {
                const isActive = categoryFilter === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategoryFilter(cat.key)}
                    className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#0A1F44] text-white shadow-2xs"
                        : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sections Responsive Cards Grid */}
          {filteredSections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSections.map((sec) => {
                const isSeo = sec.key === "seo";
                const body = isSeo ? seoData : getBody(sec.key);
                const hasContent = isSeo
                  ? Boolean(seoData?.title || seoData?.description)
                  : Object.keys(body || {}).length > 0;

                return (
                  <div
                    key={sec.key}
                    onClick={() => handleSelectSection(sec.key)}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-400 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div>
                      {/* Top Row: Title & Config Status Badge */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-base font-bold text-[#0A1F44] group-hover:text-black transition-colors">
                          {sec.label}
                        </h3>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            hasContent
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              hasContent ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          {hasContent ? "Configured" : "Empty"}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                        {sec.description}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white space-y-3">
              <p className="text-sm font-semibold text-slate-900">
                No sections matched your search query.
              </p>
              <p className="text-xs text-slate-500">
                Try searching for keywords like &ldquo;hero&rdquo;, &ldquo;helpline&rdquo;, &ldquo;regulations&rdquo;, or &ldquo;seo&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("ALL");
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0A1F44] hover:underline pt-2"
              >
                Reset search filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* =====================================================================
            STAGE C: DEDICATED FULL-WIDTH SECTION EDITOR WORKSPACE
        ===================================================================== */
        <div className="space-y-6">
          {/* Editor Workspace Sticky Header */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Back button and Section Title */}
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={handleBackToDirectory}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition shrink-0"
                >
                  <ArrowLeft className="h-4 w-4 text-slate-500" />
                  <span className="hidden sm:inline">Back to Sections</span>
                </button>

                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#0A1F44] truncate">
                      {activeSectionMeta?.label || activeSectionKey}
                    </h2>
                    {isDirty && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Unsaved
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {activeSectionMeta?.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Jump Previous/Next & Save */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                {/* Traversal Previous */}
                {prevSection && (
                  <button
                    type="button"
                    title={`Previous: ${prevSection.label}`}
                    onClick={() => handleSelectSection(prevSection.key)}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                )}

                {/* Traversal Next */}
                {nextSection && (
                  <button
                    type="button"
                    title={`Next: ${nextSection.label}`}
                    onClick={() => handleSelectSection(nextSection.key)}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}

                {/* Primary Save Button */}
                <button
                  type="button"
                  onClick={() =>
                    activeSectionKey === "seo"
                      ? handleSaveSeo()
                      : handleSaveSection(activeSectionKey)
                  }
                  disabled={savingKey === activeSectionKey}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1A3A6B] disabled:opacity-50 shadow-sm transition"
                >
                  {savingKey === activeSectionKey ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Section Body Workspace Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            {activeSectionKey === "seo" ? (
              <InstitutionalSeoEditor
                pageSlug={pageSlug}
                pageTitle={pageConfig.title}
                seoData={seoData}
                onChange={handleSeoDataChange}
                onSave={handleSaveSeo}
                isSaving={savingKey === "seo"}
                publicUrl={pageConfig.publicUrl}
              />
            ) : (
              <InstitutionalFieldRenderer
                data={getBody(activeSectionKey)}
                onChange={(updated) =>
                  handleSectionBodyChange(activeSectionKey, updated)
                }
                sectionKey={activeSectionKey}
                itemTemplate={pageConfig.sections[activeSectionKey]?.itemTemplate}
              />
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          UNSAVED CHANGES CONFIRMATION MODAL
      ===================================================================== */}
      {pendingNavigation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
                Discard Unsaved Changes?
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have unsaved changes in the current section. Navigating away now will discard any
              modifications that have not been saved.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPendingNavigation(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Stay and Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  const nav = pendingNavigation;
                  setPendingNavigation(null);
                  setIsDirty(false);
                  if (nav) nav();
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-xs transition"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
