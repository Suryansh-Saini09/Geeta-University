"use client";

import { useState } from "react";
import Link from "next/link";
import { updatePageSectionAction, updatePageSeoAction } from "@/features/admin/pages/actions";
import { CmsActionButton } from "@/components/admin/CmsActionButton";
import {
  CmsImagePreviewInput,
  CmsAutoTextarea,
  CmsStringRepeater,
} from "./CmsFieldHelpers";
import {
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Save,
  GraduationCap,
  FileText,
  HelpCircle,
  Award,
  Globe,
  BookOpen,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Layers,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { GU_EDGE_PAGES_OPTIONS } from "../guEdgeConfig";

const ICON_MAP: Record<string, any> = {
  Sparkles,
  TrendingUp,
  Globe,
  BookOpen,
  Award,
  CheckCircle2,
  Layers,
};

interface GuEdgeCmsDashboardProps {
  initialPageSlug?: string;
  adminDataBySlug: Record<string, { sections: Record<string, any>; seo: any }>;
}

export function GuEdgeCmsDashboard({
  initialPageSlug = "dyod",
  adminDataBySlug,
}: GuEdgeCmsDashboardProps) {
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>(initialPageSlug);

  const currentPageOption =
    GU_EDGE_PAGES_OPTIONS.find((p) => p.slug === selectedPageSlug) || GU_EDGE_PAGES_OPTIONS[0];

  const currentAdminData = adminDataBySlug[selectedPageSlug] || { sections: {}, seo: null };
  const sections = currentAdminData.sections || {};
  const pageSeo = currentAdminData.seo || {};

  const [activeSectionKey, setActiveSectionKey] = useState<string>(
    currentPageOption.sectionsList[0]?.key || "hero"
  );

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Dynamic Section Body State (handles clean un-nesting of DB bodies)
  const getSectionBody = (key: string) => {
    const raw = sections[key]?.body;
    if (raw && typeof raw === "object" && raw.body && typeof raw.body === "object" && !Array.isArray(raw.body)) {
      return raw.body;
    }
    return raw || {};
  };

  const [activeBodyState, setActiveBodyState] = useState<any>(
    getSectionBody(currentPageOption.sectionsList[0]?.key || "hero")
  );

  // Handle Page Switching
  const handlePageSelect = (slug: string) => {
    setSelectedPageSlug(slug);
    const targetOpt = GU_EDGE_PAGES_OPTIONS.find((p) => p.slug === slug) || GU_EDGE_PAGES_OPTIONS[0];
    const firstSecKey = targetOpt.sectionsList[0]?.key || "hero";
    setActiveSectionKey(firstSecKey);
    const targetData = adminDataBySlug[slug] || { sections: {}, seo: null };
    const rawFirst = targetData.sections?.[firstSecKey]?.body;
    const cleanFirst =
      rawFirst && typeof rawFirst === "object" && rawFirst.body && typeof rawFirst.body === "object" && !Array.isArray(rawFirst.body)
        ? rawFirst.body
        : rawFirst || {};
    setActiveBodyState(cleanFirst);
    setSeoState({
      title: targetData.seo?.title || "",
      description: targetData.seo?.description || "",
      keywords: Array.isArray(targetData.seo?.keywords)
        ? targetData.seo.keywords.join(", ")
        : targetData.seo?.keywords || "",
      canonical: targetData.seo?.canonical || "",
      ogTitle: targetData.seo?.ogTitle || "",
      ogImage: targetData.seo?.ogImage || "",
      noIndex: targetData.seo?.noIndex || false,
    });
    setFeedback(null);
  };

  // Handle Section Tab Switching
  const handleSectionSelect = (key: string) => {
    setActiveSectionKey(key);
    if (key !== "seo") {
      setActiveBodyState(getSectionBody(key));
    }
    setFeedback(null);
  };

  // Save Section Action Handler
  const handleSaveSection = async () => {
    try {
      setIsSaving(true);
      setFeedback(null);

      const res = await updatePageSectionAction(selectedPageSlug, activeSectionKey, activeBodyState);

      if (res.success) {
        setFeedback({
          type: "success",
          text: `Section "${activeSectionKey}" saved successfully!`,
        });
        if (sections[activeSectionKey]) {
          sections[activeSectionKey].body = activeBodyState;
        } else {
          sections[activeSectionKey] = { body: activeBodyState };
        }
      } else {
        setFeedback({ type: "error", text: res.error || "Failed to update section." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  // SEO Form State & Handler
  const [seoState, setSeoState] = useState({
    title: pageSeo?.title || "",
    description: pageSeo?.description || "",
    keywords: Array.isArray(pageSeo?.keywords) ? pageSeo.keywords.join(", ") : pageSeo?.keywords || "",
    canonical: pageSeo?.canonical || "",
    ogTitle: pageSeo?.ogTitle || "",
    ogImage: pageSeo?.ogImage || "",
    noIndex: pageSeo?.noIndex || false,
  });

  const handleSaveSeo = async () => {
    try {
      setIsSaving(true);
      setFeedback(null);

      const payload = {
        title: seoState.title,
        description: seoState.description,
        keywords: typeof seoState.keywords === "string" ? seoState.keywords.split(",").map((k) => k.trim()).filter(Boolean) : seoState.keywords,
        canonical: seoState.canonical || null,
        ogTitle: seoState.ogTitle || null,
        ogImage: seoState.ogImage || null,
        noIndex: seoState.noIndex,
      };

      const res = await updatePageSeoAction(selectedPageSlug, payload);

      if (res.success) {
        setFeedback({ type: "success", text: "SEO Metadata saved successfully!" });
      } else {
        setFeedback({ type: "error", text: res.error || "Failed to save SEO metadata." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save SEO metadata." });
    } finally {
      setIsSaving(false);
    }
  };

  // Accurate Status Calculator (COMPLETE, PARTIAL, NOT CONFIGURED)
  const computeSectionStatus = (key: string): "COMPLETE" | "PARTIAL" | "NOT CONFIGURED" => {
    if (key === "seo") {
      return pageSeo && pageSeo.title && pageSeo.description ? "COMPLETE" : pageSeo ? "PARTIAL" : "NOT CONFIGURED";
    }
    const sec = sections[key];
    if (!sec || !sec.body) return "NOT CONFIGURED";
    const body = sec.body && typeof sec.body === "object" && sec.body.body ? sec.body.body : sec.body;

    if (Array.isArray(body)) {
      return body.length > 0 ? "COMPLETE" : "NOT CONFIGURED";
    }
    if (typeof body === "object" && body !== null) {
      const keys = Object.keys(body);
      if (keys.length === 0) return "NOT CONFIGURED";
      const hasValue = keys.some((k) => {
        const v = body[k];
        if (Array.isArray(v)) return v.length > 0;
        if (typeof v === "object" && v !== null) return Object.keys(v).length > 0;
        return v !== undefined && v !== null && String(v).trim() !== "";
      });
      return hasValue ? "COMPLETE" : "PARTIAL";
    }
    return "NOT CONFIGURED";
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-[#E8871A]" />
            <h2 className="font-serif text-3xl font-bold text-[#0A1F44]">GU Edge CMS Center</h2>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Production-grade content management for all 7 GU Edge pages of Geeta University.
          </p>
        </div>

        <Link
          href={currentPageOption.publicRoute}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-[#0A1F44] shadow-xs hover:border-[#E8871A] hover:text-[#E8871A]"
        >
          <span>View Public Page</span>
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      {/* Feedback Alert Banner */}
      {feedback && (
        <div
          className={`flex items-center justify-between rounded-xl border p-4 text-sm font-semibold shadow-xs ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          <div className="flex items-center gap-3">
            {feedback.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs uppercase font-bold text-slate-500 hover:text-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Select GU Edge Page Selector */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Select GU Edge Page to Edit
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {GU_EDGE_PAGES_OPTIONS.map((pageOpt) => {
            const isSelected = pageOpt.slug === selectedPageSlug;
            const Icon = ICON_MAP[pageOpt.iconName] || BookOpen;

            return (
              <button
                key={pageOpt.slug}
                type="button"
                onClick={() => handlePageSelect(pageOpt.slug)}
                className={`flex flex-col items-start justify-between rounded-xl p-3.5 text-left transition-all border ${
                  isSelected
                    ? "border-[#0A1F44] bg-[#0A1F44] text-white shadow-md ring-2 ring-[#E8871A]/40"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <Icon className={`h-5 w-5 ${isSelected ? "text-[#E8871A]" : "text-slate-400"}`} />
                </div>
                <div>
                  <p className="text-xs font-bold leading-snug">{pageOpt.title}</p>
                  <p className={`text-[10px] ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                    {pageOpt.publicRoute}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main CMS Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Page Sections List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <h4 className="font-serif text-lg font-bold text-[#0A1F44] mb-1">
              {currentPageOption.title}
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              {currentPageOption.sectionsList.length} Public Sections + SEO
            </p>

            <div className="space-y-2">
              {currentPageOption.sectionsList.map((secOpt) => {
                const isActive = secOpt.key === activeSectionKey;
                const status = computeSectionStatus(secOpt.key);

                return (
                  <button
                    key={secOpt.key}
                    type="button"
                    onClick={() => handleSectionSelect(secOpt.key)}
                    className={`flex items-center justify-between w-full rounded-lg p-3 text-left text-sm font-semibold transition-all border ${
                      isActive
                        ? "border-[#E8871A] bg-[#E8871A] text-white shadow-sm"
                        : "border-slate-100 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{secOpt.label}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : status === "COMPLETE"
                          ? "bg-emerald-100 text-emerald-800"
                          : status === "PARTIAL"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {status}
                    </span>
                  </button>
                );
              })}

              {/* SEO Tab Option */}
              <button
                type="button"
                onClick={() => handleSectionSelect("seo")}
                className={`flex items-center justify-between w-full rounded-lg p-3 text-left text-sm font-semibold transition-all border ${
                  activeSectionKey === "seo"
                    ? "border-[#E8871A] bg-[#E8871A] text-white shadow-sm"
                    : "border-slate-100 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>SEO &amp; Social Metadata</span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    activeSectionKey === "seo"
                      ? "bg-white/20 text-white"
                      : computeSectionStatus("seo") === "COMPLETE"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {computeSectionStatus("seo")}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Section Content Editor */}
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            {/* Editor Action Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                {activeSectionKey === "seo"
                  ? "Page SEO & Social Sharing Metadata"
                  : currentPageOption.sectionsList.find((s) => s.key === activeSectionKey)?.label ||
                    activeSectionKey}
              </h3>

              <CmsActionButton
                label="Save Section"
                loadingLabel="Saving Section..."
                iconType="save"
                onClick={activeSectionKey === "seo" ? handleSaveSeo : handleSaveSection}
              />
            </div>

            {/* Render Form Editor based on Active Section */}
            {activeSectionKey === "seo" ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Meta Title Tag
                  </label>
                  <input
                    type="text"
                    value={seoState.title}
                    onChange={(e) => setSeoState({ ...seoState, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#E8871A] focus:outline-none"
                    placeholder="e.g. Design Your Own Degree | Geeta University"
                  />
                </div>

                <div>
                  <CmsAutoTextarea
                    label="Meta Description"
                    value={seoState.description}
                    onChange={(val) => setSeoState({ ...seoState, description: val })}
                    placeholder="Compelling search result description..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    value={seoState.keywords}
                    onChange={(e) => setSeoState({ ...seoState, keywords: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#E8871A] focus:outline-none"
                    placeholder="dyod, geeta university, flexible learning"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Canonical URL
                    </label>
                    <input
                      type="text"
                      value={seoState.canonical}
                      onChange={(e) => setSeoState({ ...seoState, canonical: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#E8871A] focus:outline-none"
                      placeholder="https://geetauniversity.edu.in/edge/dyod"
                    />
                  </div>

                  <CmsImagePreviewInput
                    label="OG Social Image"
                    value={seoState.ogImage}
                    onChange={(val) => setSeoState({ ...seoState, ogImage: val })}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. Feature Grid Cards Renderer (Handles Array of Grids OR Single Grid) */}
                {(Array.isArray(activeBodyState) ||
                  activeSectionKey === "features" ||
                  activeSectionKey.startsWith("featureGrid")) ? (
                  <FeatureGridSectionEditor
                    state={activeBodyState}
                    onChange={(newState) => setActiveBodyState(newState)}
                  />
                ) : activeSectionKey.includes("accordion") ? (
                  <AccordionSectionEditor
                    state={activeBodyState}
                    onChange={(newState) => setActiveBodyState(newState)}
                  />
                ) : activeSectionKey === "timeline" ? (
                  <TimelineSectionEditor
                    state={activeBodyState}
                    onChange={(newState) => setActiveBodyState(newState)}
                  />
                ) : activeSectionKey.includes("training") ? (
                  <TrainingModelSectionEditor
                    state={activeBodyState}
                    onChange={(newState) => setActiveBodyState(newState)}
                  />
                ) : activeSectionKey === "videos" ? (
                  <VideoSectionEditor
                    state={activeBodyState}
                    onChange={(newState) => setActiveBodyState(newState)}
                  />
                ) : activeSectionKey === "mentors" ? (
                  <MentorsSectionEditor
                    state={activeBodyState}
                    onChange={(newState) => setActiveBodyState(newState)}
                  />
                ) : activeSectionKey === "testimonials" ? (
                  <TestimonialsSectionEditor
                    state={activeBodyState}
                    onChange={(newState) => setActiveBodyState(newState)}
                  />
                ) : activeSectionKey === "gallery" ? (
                  <GallerySectionEditor
                    state={activeBodyState}
                    onChange={(newState) => setActiveBodyState(newState)}
                  />
                ) : activeSectionKey === "stats" ? (
                  <StatsSectionEditor
                    state={activeBodyState}
                    onChange={(newState) => setActiveBodyState(newState)}
                  />
                ) : activeSectionKey === "cta" ? (
                  <CtaSectionEditor
                    state={activeBodyState}
                    onChange={(newState) => setActiveBodyState(newState)}
                  />
                ) : (
                  /* Universal Fallback Editor for Hero & Custom Sections */
                  <UniversalSectionEditor
                    state={activeBodyState}
                    onChange={(newState) => setActiveBodyState(newState)}
                    activeSectionKey={activeSectionKey}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SUB-EDITORS FOR ALL SECTION TYPES
========================================================= */

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
        <h4 className="text-sm font-bold text-[#0A1F44]">Feature Grid Cards ({gridList.length})</h4>
        <button
          type="button"
          onClick={addGridCard}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Grid Block</span>
        </button>
      </div>

      {gridList.map((grid, gridIdx) => (
        <div key={gridIdx} className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4 relative">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="text-xs font-bold uppercase text-[#0A1F44]">
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-[#0A1F44]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Columns</label>
                <select
                  value={grid.columns || 3}
                  onChange={(e) => updateGridItem(gridIdx, { ...grid, columns: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
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
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
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
              <label className="block text-xs font-bold uppercase text-[#0A1F44]">
                Feature Items (Cards) ({grid.features?.length || 0})
              </label>
              <button
                type="button"
                onClick={() => {
                  const currentFeatures = grid.features || [];
                  const newFeat = { title: "New Feature Title", description: "" };
                  updateGridItem(gridIdx, { ...grid, features: [...currentFeatures, newFeat] });
                }}
                className="inline-flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs font-bold text-white hover:bg-slate-900"
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
                        className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
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
                          className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"
              />
            </div>
            {acc.subtitle !== undefined && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={acc.subtitle || ""}
                  onChange={(e) => updateAcc(accIdx, { ...acc, subtitle: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase text-[#0A1F44]">
                Accordion Program Items ({acc.items?.length || 0})
              </label>
              <button
                type="button"
                onClick={() => {
                  const currentItems = acc.items || [];
                  const newItem = { id: `item-${Date.now()}`, title: "New Academic Course Program", duration: "3-4 Years", eligibility: "10+2", description: "" };
                  updateAcc(accIdx, { ...acc, items: [...currentItems, newItem] });
                }}
                className="inline-flex items-center gap-1 rounded bg-[#E8871A] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#d67a15]"
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
                        className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
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
                        className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
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
  const steps = state.steps || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Timeline Heading</label>
        <input
          type="text"
          value={state.title || ""}
          onChange={(e) => onChange({ ...state, title: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-[#0A1F44]"
        />
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-[#0A1F44]">
          Timeline Process Steps ({steps.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newStep = { stepNumber: steps.length + 1, title: "New Step Title", category: "Core", description: "", points: [], expandedDetails: "" };
            onChange({ ...state, steps: [...steps, newStep] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
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
                  onChange({ ...state, steps: steps.filter((_: any, i: number) => i !== idx) });
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
                    onChange({ ...state, steps: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
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
                    onChange({ ...state, steps: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
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
                    onChange({ ...state, steps: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>

            <CmsAutoTextarea
              label="Step Description"
              value={step.description || ""}
              onChange={(val) => {
                const copy = [...steps];
                copy[idx] = { ...copy[idx], description: val };
                onChange({ ...state, steps: copy });
              }}
              rows={2}
            />

            <CmsStringRepeater
              title="Bullet Points / Highlights"
              items={Array.isArray(step.points) ? step.points : []}
              onChange={(newPoints) => {
                const copy = [...steps];
                copy[idx] = { ...copy[idx], points: newPoints };
                onChange({ ...state, steps: copy });
              }}
            />

            <CmsAutoTextarea
              label="Expanded Details / Takeaways"
              value={Array.isArray(step.expandedDetails) ? step.expandedDetails.join("\n") : (step.expandedDetails || "")}
              onChange={(val) => {
                const copy = [...steps];
                copy[idx] = { ...copy[idx], expandedDetails: val };
                onChange({ ...state, steps: copy });
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
  const stages = state.stages || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Model Heading</label>
        <input
          type="text"
          value={state.title || ""}
          onChange={(e) => onChange({ ...state, title: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-[#0A1F44]"
        />
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-[#0A1F44]">
          Training Stages ({stages.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newStage = { stageNumber: stages.length + 1, stageName: `Stage ${stages.length + 1}`, title: "New Training Stage", description: "", focusAreas: [] };
            onChange({ ...state, stages: [...stages, newStage] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
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
                  onChange({ ...state, stages: stages.filter((_: any, i: number) => i !== idx) });
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
                    onChange({ ...state, stages: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
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
                    onChange({ ...state, stages: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
                />
              </div>
            </div>

            <CmsAutoTextarea
              label="Stage Description"
              value={stage.description || ""}
              onChange={(val) => {
                const copy = [...stages];
                copy[idx] = { ...copy[idx], description: val };
                onChange({ ...state, stages: copy });
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
                  onChange({ ...state, stages: copy });
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
  const playlist = state.playlist || [];
  const featured = state.featuredVideo || {};

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Video Section Title</label>
        <input
          type="text"
          value={state.title || ""}
          onChange={(e) => onChange({ ...state, title: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-[#0A1F44]"
        />
      </div>

      {/* Featured Video */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
        <h4 className="font-bold text-xs uppercase text-[#0A1F44]">Featured Hero Video Spotlight</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-0.5">Video Title</label>
            <input
              type="text"
              value={featured.title || ""}
              onChange={(e) => onChange({ ...state, featuredVideo: { ...featured, title: e.target.value } })}
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-0.5">Video URL (YouTube/Embed)</label>
            <input
              type="text"
              value={featured.videoUrl || ""}
              onChange={(e) => onChange({ ...state, featuredVideo: { ...featured, videoUrl: e.target.value } })}
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
            />
          </div>
        </div>
        <CmsImagePreviewInput
          label="Featured Video Poster / Thumbnail"
          value={featured.thumbnail || ""}
          onChange={(val) => onChange({ ...state, featuredVideo: { ...featured, thumbnail: val } })}
        />
      </div>

      {/* Playlist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <label className="block text-xs font-bold uppercase text-[#0A1F44]">
            Playlist Videos ({playlist.length})
          </label>
          <button
            type="button"
            onClick={() => {
              const newVid = { title: "New Video Story", videoUrl: "", thumbnail: "" };
              onChange({ ...state, playlist: [...playlist, newVid] });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
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
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
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
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
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
  const mentors = state.mentors || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
        <input
          type="text"
          value={state.title || ""}
          onChange={(e) => onChange({ ...state, title: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-[#0A1F44]"
        />
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-[#0A1F44]">
          Corporate Mentors &amp; Faculty ({mentors.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newMentor = { name: "Mentor Name", designation: "Designation / Title", role: "Industry Expert", description: "", image: "" };
            onChange({ ...state, mentors: [...mentors, newMentor] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
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
                  onChange({ ...state, mentors: mentors.filter((_: any, i: number) => i !== idx) });
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
                    onChange({ ...state, mentors: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
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
                    onChange({ ...state, mentors: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
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
                    onChange({ ...state, mentors: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>

            <CmsImagePreviewInput
              label="Mentor Photo URL"
              value={mentor.image || ""}
              onChange={(val) => {
                const copy = [...mentors];
                copy[idx] = { ...copy[idx], image: val };
                onChange({ ...state, mentors: copy });
              }}
            />

            <CmsAutoTextarea
              label="Bio / Description"
              value={mentor.description || mentor.fullBio || ""}
              onChange={(val) => {
                const copy = [...mentors];
                copy[idx] = { ...copy[idx], description: val };
                onChange({ ...state, mentors: copy });
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
  const items = state.testimonials || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
        <input
          type="text"
          value={state.title || ""}
          onChange={(e) => onChange({ ...state, title: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-[#0A1F44]"
        />
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-[#0A1F44]">
          Student Testimonials ({items.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newItem = { name: "Student Name", programOrRole: "B.Tech CSE", quote: "Geeta University empowered me...", image: "" };
            onChange({ ...state, testimonials: [...items, newItem] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
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
                  onChange({ ...state, testimonials: items.filter((_: any, i: number) => i !== idx) });
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
                    onChange({ ...state, testimonials: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
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
                    onChange({ ...state, testimonials: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>

            <CmsImagePreviewInput
              label="Author Photo URL"
              value={item.image || ""}
              onChange={(val) => {
                const copy = [...items];
                copy[idx] = { ...copy[idx], image: val };
                onChange({ ...state, testimonials: copy });
              }}
            />

            <CmsAutoTextarea
              label="Testimonial Quote"
              value={item.quote || ""}
              onChange={(val) => {
                const copy = [...items];
                copy[idx] = { ...copy[idx], quote: val };
                onChange({ ...state, testimonials: copy });
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
  const items = state.items || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Gallery Section Title</label>
        <input
          type="text"
          value={state.title || ""}
          onChange={(e) => onChange({ ...state, title: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-[#0A1F44]"
        />
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-[#0A1F44]">
          Gallery Images ({items.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newItem = { src: "", title: "", caption: "" };
            onChange({ ...state, items: [...items, newItem] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
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
                  onChange({ ...state, items: items.filter((_: any, i: number) => i !== idx) });
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
                onChange({ ...state, items: copy });
              }}
            />

            <input
              type="text"
              placeholder="Caption / Title"
              value={item.title || item.caption || ""}
              onChange={(e) => {
                const copy = [...items];
                copy[idx] = { ...copy[idx], title: e.target.value };
                onChange({ ...state, items: copy });
              }}
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsSectionEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const stats = state.stats || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
        <input
          type="text"
          value={state.title || ""}
          onChange={(e) => onChange({ ...state, title: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-[#0A1F44]"
        />
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-[#0A1F44]">
          Key Statistics Counters ({stats.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newStat = { label: "New Metric", value: "100%", sublabel: "" };
            onChange({ ...state, stats: [...stats, newStat] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
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
                  onChange({ ...state, stats: stats.filter((_: any, i: number) => i !== idx) });
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
                    onChange({ ...state, stats: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-bold text-[#E8871A]"
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
                    onChange({ ...state, stats: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
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
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Banner Heading</label>
        <input
          type="text"
          value={state.heading || state.title || ""}
          onChange={(e) => onChange({ ...state, heading: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-[#0A1F44]"
        />
      </div>

      <CmsAutoTextarea
        label="Description / Supporting Text"
        value={state.description || state.subtitle || ""}
        onChange={(val) => onChange({ ...state, description: val })}
        rows={3}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Primary Button Text</label>
          <input
            type="text"
            value={state.buttonText || "Apply Now"}
            onChange={(e) => onChange({ ...state, buttonText: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Primary Button Link</label>
          <input
            type="text"
            value={state.buttonLink || ""}
            onChange={(e) => onChange({ ...state, buttonLink: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
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
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-[#0A1F44] focus:border-[#E8871A] focus:outline-none"
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
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
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
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
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
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
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
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
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
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
            />
          </div>
        </div>
      )}

      {/* Custom NEP main_content section editor */}
      {activeSectionKey === "main_content" && (
        <div className="space-y-4 rounded-xl border border-slate-200 p-4 bg-slate-50">
          <h4 className="font-bold text-sm text-[#0A1F44]">NEP Main Content &amp; Bullet Points</h4>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">First University Heading</label>
            <input
              type="text"
              value={state.firstUniversityHeading || ""}
              onChange={(e) => onChange({ ...state, firstUniversityHeading: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
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
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                  {propKey} ({val.length})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const newItem = typeof val[0] === "object" ? { title: "New Item" } : "New Item";
                    onChange({ ...state, [propKey]: [...val, newItem] });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
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
                                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
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
