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
  ArrowUp,
  ArrowDown,
  Layers,
} from "lucide-react";

import { ADMISSIONS_PAGES_OPTIONS } from "../admissionsConfig";

const ICON_MAP: Record<string, any> = {
  GraduationCap,
  BookOpen,
  HelpCircle,
  Award,
  Globe,
  FileText,
};

interface AdmissionsCmsDashboardProps {
  initialPageSlug?: string;
  adminDataBySlug: Record<string, { sections: Record<string, any>; seo: any }>;
}

export function AdmissionsCmsDashboard({
  initialPageSlug = "programs-after-12th",
  adminDataBySlug,
}: AdmissionsCmsDashboardProps) {
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>(initialPageSlug);

  const currentPageOption =
    ADMISSIONS_PAGES_OPTIONS.find((p) => p.slug === selectedPageSlug) || ADMISSIONS_PAGES_OPTIONS[0];

  const currentAdminData = adminDataBySlug[selectedPageSlug] || { sections: {}, seo: null };
  const sections = currentAdminData.sections || {};
  const pageSeo = currentAdminData.seo || {};

  const [activeSectionKey, setActiveSectionKey] = useState<string>(
    currentPageOption.sectionsList[0]?.key || "hero"
  );

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Dynamic Section Body State
  const getSectionBody = (key: string) => {
    return sections[key]?.body || {};
  };

  const [activeBodyState, setActiveBodyState] = useState<any>(
    getSectionBody(currentPageOption.sectionsList[0]?.key || "hero")
  );

  // Switch Page Handler
  const handlePageSelect = (slug: string) => {
    setSelectedPageSlug(slug);
    const targetOption = ADMISSIONS_PAGES_OPTIONS.find((p) => p.slug === slug) || ADMISSIONS_PAGES_OPTIONS[0];
    const firstSecKey = targetOption.sectionsList[0]?.key || "hero";
    setActiveSectionKey(firstSecKey);
    const nextSections = adminDataBySlug[slug]?.sections || {};
    setActiveBodyState(nextSections[firstSecKey]?.body || {});
    setFeedback(null);
  };

  // Switch Section Handler
  const handleSectionSelect = (secKey: string) => {
    setActiveSectionKey(secKey);
    const secBody = sections[secKey]?.body || {};
    setActiveBodyState(secBody);
    setFeedback(null);
  };

  // Save Current Section Handler
  const handleSaveSection = async () => {
    try {
      setIsSaving(true);
      setFeedback(null);

      const res = await updatePageSectionAction(selectedPageSlug, activeSectionKey, activeBodyState);

      if (res.success) {
        setFeedback({ type: "success", text: `${activeSectionKey} section updated successfully!` });
        // Update local memory state
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

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-[#E8871A]" />
            <h2 className="font-serif text-3xl font-bold text-[#0A1F44]">Admissions CMS Center</h2>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Production-grade content management for all 10 Admissions pages of Geeta University.
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

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center justify-between rounded-xl p-4 text-sm font-semibold shadow-xs ${
            feedback.type === "success"
              ? "border border-emerald-300 bg-emerald-50 text-emerald-900"
              : "border border-rose-300 bg-rose-50 text-rose-900"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-600" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs uppercase font-bold text-slate-400 hover:text-slate-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Admissions Page Selection Cards/Tabs */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
          Select Admissions Page to Edit
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {ADMISSIONS_PAGES_OPTIONS.map((opt) => {
            const Icon = ICON_MAP[opt.iconName] || GraduationCap;
            const isSelected = opt.slug === selectedPageSlug;

            return (
              <button
                key={opt.slug}
                type="button"
                onClick={() => handlePageSelect(opt.slug)}
                className={`flex flex-col items-start gap-1.5 rounded-xl border p-3.5 text-left transition-all ${
                  isSelected
                    ? "border-[#E8871A] bg-[#0A1F44] text-white shadow-md"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Icon className={`h-5 w-5 ${isSelected ? "text-[#E8871A]" : "text-slate-400"}`} />
                <span className="text-xs font-bold leading-tight">{opt.title}</span>
                <span className={`text-[10px] ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                  {opt.publicRoute}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Two-Column CMS Layout: Sections List (Left 4 cols) & Field Editor (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Sections List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44] mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#E8871A]" />
              {currentPageOption.title} Sections
            </h3>

            <div className="space-y-1.5">
              {currentPageOption.sectionsList.map((sec) => {
                const isActive = sec.key === activeSectionKey;
                const hasBody = sections[sec.key]?.body && Object.keys(sections[sec.key].body).length > 0;

                return (
                  <button
                    key={sec.key}
                    type="button"
                    onClick={() => handleSectionSelect(sec.key)}
                    className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold text-left transition-all ${
                      isActive
                        ? "bg-[#E8871A] text-white shadow-sm"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{sec.label}</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        hasBody
                          ? isActive
                            ? "bg-white"
                            : "bg-emerald-500"
                          : "bg-slate-300"
                      }`}
                    />
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => handleSectionSelect("seo")}
                className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold text-left transition-all mt-3 border ${
                  activeSectionKey === "seo"
                    ? "border-[#0A1F44] bg-[#0A1F44] text-white shadow-sm"
                    : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>SEO & Meta Tags</span>
                <FileText className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Section Field Editor */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8871A]">
                  Editing Section
                </span>
                <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                  {activeSectionKey === "seo"
                    ? `SEO Metadata — ${currentPageOption.title}`
                    : currentPageOption.sectionsList.find((s) => s.key === activeSectionKey)?.label ||
                      activeSectionKey}
                </h3>
              </div>

              {activeSectionKey !== "seo" ? (
                <CmsActionButton
                  label="Save Section"
                  loadingLabel="Saving Section..."
                  onClick={handleSaveSection}
                  disabled={isSaving}
                  iconType="save"
                  className="rounded-lg px-5 py-2.5 text-sm"
                />
              ) : (
                <CmsActionButton
                  label="Save SEO Metadata"
                  loadingLabel="Saving SEO..."
                  onClick={handleSaveSeo}
                  disabled={isSaving}
                  iconType="save"
                  className="rounded-lg px-5 py-2.5 text-sm"
                />
              )}
            </div>

            {/* Dynamic Editor Body Rendering */}
            {activeSectionKey === "seo" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={seoState.title}
                    onChange={(e) => setSeoState({ ...seoState, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44] focus:border-[#E8871A] focus:outline-none"
                    placeholder="Page Meta Title"
                  />
                </div>

                <CmsAutoTextarea
                  label="Meta Description"
                  value={seoState.description}
                  onChange={(val) => setSeoState({ ...seoState, description: val })}
                  placeholder="Enter compelling meta description for search engine results..."
                  rows={3}
                />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={seoState.keywords}
                    onChange={(e) => setSeoState({ ...seoState, keywords: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44] focus:border-[#E8871A] focus:outline-none"
                    placeholder="Admissions, Scholarships, Geeta University..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Canonical URL
                  </label>
                  <input
                    type="text"
                    value={seoState.canonical}
                    onChange={(e) => setSeoState({ ...seoState, canonical: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44] focus:border-[#E8871A] focus:outline-none"
                    placeholder={`https://geetauniversity.edu.in${currentPageOption.publicRoute}`}
                  />
                </div>

                <CmsImagePreviewInput
                  label="OpenGraph Social Sharing Image"
                  value={seoState.ogImage}
                  onChange={(val) => setSeoState({ ...seoState, ogImage: val })}
                  placeholder="/og-image.jpg"
                />
              </div>
            ) : (
              <GenericSectionObjectEditor
                bodyState={activeBodyState}
                onChange={setActiveBodyState}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Generic Manager-Friendly Object & Field Editor
 * Renders primitive string/number inputs, auto-growing textareas, image preview inputs,
 * and array repeaters without forcing manager to type raw JSON.
 */
function GenericSectionObjectEditor({
  bodyState,
  onChange,
}: {
  bodyState: any;
  onChange: (newState: any) => void;
}) {
  if (typeof bodyState !== "object" || bodyState === null) {
    return (
      <div className="p-4 text-center text-slate-500 text-sm italic">
        No structured content object found for this section.
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

  return (
    <div className="space-y-5">
      {keys.map((key) => {
        const value = bodyState[key];
        const keyLower = key.toLowerCase();

        // Image Field Detection
        const isImageField =
          keyLower.includes("image") ||
          keyLower.includes("banner") ||
          keyLower.includes("logo") ||
          keyLower.includes("poster") ||
          keyLower.includes("portrait");

        // Long Text Field Detection
        const isLongText =
          keyLower.includes("description") ||
          keyLower.includes("paragraph") ||
          keyLower.includes("intro") ||
          keyLower.includes("text") ||
          keyLower.includes("notice") ||
          keyLower.includes("subtitle") ||
          keyLower.includes("quote") ||
          keyLower.includes("bio") ||
          keyLower.includes("eligibility") ||
          keyLower.includes("selection");

        // String Array Detection (e.g. paragraphs, checklist, strengths)
        if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
          return (
            <CmsStringRepeater
              key={key}
              title={formatLabel(key)}
              items={value}
              onChange={(newItems) => updateField(key, newItems)}
            />
          );
        }

        // Object Array Detection (e.g. cards, FAQs, items, steps, schools, etc.)
        if (Array.isArray(value)) {
          return (
            <GenericArrayRepeater
              key={key}
              title={formatLabel(key)}
              items={value}
              onChange={(newItems) => updateField(key, newItems)}
            />
          );
        }

        // Image Field
        if (typeof value === "string" && isImageField) {
          return (
            <CmsImagePreviewInput
              key={key}
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
          );
        }

        // Long Text / Textarea
        if (typeof value === "string" && (isLongText || value.length > 80)) {
          return (
            <CmsAutoTextarea
              key={key}
              label={formatLabel(key)}
              value={value}
              onChange={(val) => updateField(key, val)}
              rows={3}
            />
          );
        }

        // Short String or Number
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          if (typeof value === "boolean") {
            return (
              <div key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={key}
                  checked={value}
                  onChange={(e) => updateField(key, e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#E8871A] focus:ring-[#E8871A]"
                />
                <label htmlFor={key} className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                  {formatLabel(key)}
                </label>
              </div>
            );
          }

          return (
            <div key={key}>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                {formatLabel(key)}
              </label>
              <input
                type={typeof value === "number" ? "number" : "text"}
                value={value as any}
                onChange={(e) =>
                  updateField(
                    key,
                    typeof value === "number" ? parseFloat(e.target.value) || 0 : e.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44] focus:border-[#E8871A] focus:outline-none"
              />
            </div>
          );
        }

        // Nested Object
        if (typeof value === "object" && value !== null) {
          return (
            <div key={key} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                {formatLabel(key)}
              </h4>
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

/**
 * Array Repeater for Cards, Steps, FAQs, Items & Nested Objects
 */
function GenericArrayRepeater({
  title,
  items = [],
  onChange,
}: {
  title: string;
  items: any[];
  onChange: (newItems: any[]) => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleItemChange = (idx: number, newItem: any) => {
    const updated = [...items];
    updated[idx] = newItem;
    onChange(updated);
  };

  const handleAddItem = () => {
    const sampleItem = items.length > 0 ? createSampleFromPattern(items[0]) : { title: "New Item", description: "" };
    const updated = [...items, sampleItem];
    onChange(updated);
    setOpenIndex(updated.length - 1);
  };

  const handleDeleteItem = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
    if (openIndex === idx) setOpenIndex(null);
  };

  const handleMove = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const updated = [...items];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange(updated);
    if (openIndex === idx) setOpenIndex(targetIdx);
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
          {title} ({items.length})
        </h4>
        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-[#0A1F44] hover:bg-slate-100"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Card/Item
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          const displayHeader =
            item?.title ||
            item?.name ||
            item?.q ||
            item?.question ||
            item?.schoolName ||
            item?.program ||
            item?.categoryName ||
            `Item #${idx + 1}`;

          return (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/70 overflow-hidden">
              <div className="flex items-center justify-between p-3 bg-white border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex items-center gap-2 text-xs font-bold text-[#0A1F44] hover:text-[#E8871A] text-left flex-1"
                >
                  <span className="text-slate-400">#{idx + 1}</span>
                  <span>{String(displayHeader).slice(0, 60)}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === items.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(idx)}
                    className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="p-4 bg-white/50 border-t border-slate-100 space-y-4">
                  <GenericSectionObjectEditor
                    bodyState={item}
                    onChange={(updatedItem) => handleItemChange(idx, updatedItem)}
                  />
                </div>
              )}
            </div>
          );
        })}

        {items.length === 0 && (
          <p className="text-center py-3 text-xs italic text-slate-400">
            No items in list. Click "Add Card/Item" to create one.
          </p>
        )}
      </div>
    </div>
  );
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

function createSampleFromPattern(patternObj: any): any {
  if (typeof patternObj !== "object" || patternObj === null) return "";
  const sample: any = {};
  for (const k of Object.keys(patternObj)) {
    const val = patternObj[k];
    if (typeof val === "string") sample[k] = "";
    else if (typeof val === "number") sample[k] = 0;
    else if (typeof val === "boolean") sample[k] = false;
    else if (Array.isArray(val)) sample[k] = [];
    else if (typeof val === "object") sample[k] = {};
  }
  return sample;
}
