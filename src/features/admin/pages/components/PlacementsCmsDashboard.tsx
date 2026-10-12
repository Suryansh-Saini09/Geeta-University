"use client";

import { useState } from "react";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Trophy,
  Building2,
  GraduationCap,
  TrendingUp,
  UserCheck,
  Video,
  MessageSquareQuote,
  Image as ImageIcon,
  HelpCircle,
} from "lucide-react";
import { updatePageSectionAction, updatePageSeoAction } from "@/features/admin/pages/actions";
import {
  CmsImagePreviewInput,
  CmsAutoTextarea,
  CmsStringRepeater,
} from "@/features/admin/pages/components/CmsFieldHelpers";

interface PlacementsCmsDashboardProps {
  initialData: {
    sections: Record<string, any>;
    seo: any;
  };
}

const SECTION_KEYS = [
  { key: "hero", label: "Hero & Key Metrics", icon: Trophy },
  { key: "recruiters", label: "Top Recruiters", icon: Building2 },
  { key: "cdc", label: "Career Development Cell (CDC)", icon: GraduationCap },
  { key: "placement_snapshot", label: "Salary & Package Breakdown", icon: TrendingUp },
  { key: "student_stories", label: "Student Success Stories", icon: UserCheck },
  { key: "drives", label: "Placement Drives", icon: Video },
  { key: "hr_voices", label: "Recruiter Voices (HR)", icon: MessageSquareQuote },
  { key: "placement_gallery", label: "Placement Day Gallery", icon: ImageIcon },
  { key: "faqs", label: "Placement FAQs", icon: HelpCircle },
  { key: "seo", label: "SEO Metadata", icon: ImageIcon },
];

export function PlacementsCmsDashboard({ initialData }: PlacementsCmsDashboardProps) {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [sectionsData, setSectionsData] = useState<Record<string, any>>(initialData.sections || {});
  const [seoData, setSeoData] = useState<any>(initialData.seo || {});

  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const getSectionStatus = (key: string) => {
    if (key === "seo") {
      return seoData && Object.keys(seoData).length > 0 ? "COMPLETE" : "NOT CONFIGURED";
    }
    const sec = sectionsData[key];
    if (!sec || !sec.body || Object.keys(sec.body).length === 0) return "NOT CONFIGURED";
    return "COMPLETE";
  };

  const handleSaveSection = async (key: string) => {
    setSavingKey(key);
    setFeedback(null);
    try {
      if (key === "seo") {
        const res = await updatePageSeoAction("placements", seoData);
        if (res.success) {
          setFeedback({ type: "success", message: "SEO Metadata updated successfully!" });
        } else {
          setFeedback({ type: "error", message: res.error || "Failed to update SEO" });
        }
      } else {
        const currentBody = sectionsData[key]?.body || {};
        const res = await updatePageSectionAction("placements", key, currentBody);
        if (res.success) {
          setFeedback({ type: "success", message: `Section '${key}' updated successfully!` });
          setSectionsData((prev) => ({
            ...prev,
            [key]: {
              ...(prev[key] || {}),
              body: currentBody,
              status: "PUBLISHED",
              updatedAt: new Date().toISOString(),
            },
          }));
        } else {
          setFeedback({ type: "error", message: res.error || "Failed to update section" });
        }
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "An unexpected error occurred" });
    } finally {
      setSavingKey(null);
    }
  };

  const updateSectionBody = (key: string, newBody: any) => {
    setSectionsData((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        body: newBody,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-white p-6 shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-[#0A1F44]">Placements CMS Editor</h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Database Backed
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Manage all 9 public sections and SEO metadata for the <code className="font-semibold text-slate-800">/placements</code> page.
          </p>
        </div>

        <button
          type="button"
          disabled={savingKey !== null}
          onClick={() => handleSaveSection(activeSection)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#d67a15] disabled:opacity-50 transition-all cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>{savingKey === activeSection ? "Saving Section..." : `Save ${activeSection.toUpperCase()}`}</span>
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`flex items-center gap-3 rounded-xl p-4 text-sm font-medium border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-rose-50 text-rose-900 border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Grid: Sidebar Tabs + Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1.5 rounded-2xl bg-white p-3 shadow-xs border border-slate-200 h-fit">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            Placements Sections
          </div>
          {SECTION_KEYS.map((item) => {
            const Icon = item.icon;
            const status = getSectionStatus(item.key);
            const isActive = activeSection === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveSection(item.key)}
                className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#0A1F44] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#E8871A]" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    status === "COMPLETE"
                      ? isActive
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-emerald-100 text-emerald-700"
                      : isActive
                      ? "bg-slate-700 text-slate-300"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {status}
                </span>
              </button>
            );
          })}
        </div>

        {/* Section Content Editor */}
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200 min-h-[500px]">
          {activeSection === "hero" && (
            <PlacementHeroEditor
              state={sectionsData.hero?.body || {}}
              onChange={(val) => updateSectionBody("hero", val)}
            />
          )}

          {activeSection === "recruiters" && (
            <RecruitersEditor
              state={sectionsData.recruiters?.body || {}}
              onChange={(val) => updateSectionBody("recruiters", val)}
            />
          )}

          {activeSection === "cdc" && (
            <CdcEditor
              state={sectionsData.cdc?.body || {}}
              onChange={(val) => updateSectionBody("cdc", val)}
            />
          )}

          {activeSection === "placement_snapshot" && (
            <SnapshotEditor
              state={sectionsData.placement_snapshot?.body || {}}
              onChange={(val) => updateSectionBody("placement_snapshot", val)}
            />
          )}

          {activeSection === "student_stories" && (
            <StudentStoriesEditor
              state={sectionsData.student_stories?.body || {}}
              onChange={(val) => updateSectionBody("student_stories", val)}
            />
          )}

          {activeSection === "drives" && (
            <DrivesEditor
              state={sectionsData.drives?.body || {}}
              onChange={(val) => updateSectionBody("drives", val)}
            />
          )}

          {activeSection === "hr_voices" && (
            <HrVoicesEditor
              state={sectionsData.hr_voices?.body || {}}
              onChange={(val) => updateSectionBody("hr_voices", val)}
            />
          )}

          {activeSection === "placement_gallery" && (
            <PlacementGalleryEditor
              state={sectionsData.placement_gallery?.body || {}}
              onChange={(val) => updateSectionBody("placement_gallery", val)}
            />
          )}

          {activeSection === "faqs" && (
            <PlacementFaqsEditor
              state={sectionsData.faqs?.body || {}}
              onChange={(val) => updateSectionBody("faqs", val)}
            />
          )}

          {activeSection === "seo" && (
            <SeoEditor state={seoData} onChange={(val) => setSeoData(val)} />
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SUB-EDITORS FOR PLACEMENTS
========================================================= */

function PlacementHeroEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const stats = state.stats || [];

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0A1F44]">Placement Hero &amp; Metrics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Title Headline</label>
          <input
            type="text"
            value={state.title || "Career & Placement Cell"}
            onChange={(e) => onChange({ ...state, title: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtitle</label>
          <input
            type="text"
            value={state.subtitle || ""}
            onChange={(e) => onChange({ ...state, subtitle: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
          />
        </div>
      </div>

      <CmsAutoTextarea
        label="Overview Description"
        value={state.description || ""}
        onChange={(val) => onChange({ ...state, description: val })}
        rows={4}
      />

      <CmsImagePreviewInput
        label="Hero Featured Image URL"
        value={state.heroImage || ""}
        onChange={(val) => onChange({ ...state, heroImage: val })}
      />

      {/* Stats Repeater */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <label className="block text-xs font-bold uppercase text-[#0A1F44]">
            Placement Stat Counters ({stats.length})
          </label>
          <button
            type="button"
            onClick={() => {
              const newStat = { label: "Highest Package", value: "₹1.4 Cr", description: "International Offer", icon: "trophy" };
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
                  onClick={() => onChange({ ...state, stats: stats.filter((_: any, i: number) => i !== idx) })}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-600 mb-0.5">Value (e.g. ₹1.4 Cr)</label>
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

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Description</label>
                <input
                  type="text"
                  value={st.description || ""}
                  onChange={(e) => {
                    const copy = [...stats];
                    copy[idx] = { ...copy[idx], description: e.target.value };
                    onChange({ ...state, stats: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecruitersEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const companies = state.companies || [];

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0A1F44]">Top Recruiters &amp; Companies</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
          <input
            type="text"
            value={state.title || "Top Recruiters"}
            onChange={(e) => onChange({ ...state, title: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtitle</label>
          <input
            type="text"
            value={state.subtitle || ""}
            onChange={(e) => onChange({ ...state, subtitle: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
          />
        </div>
      </div>

      <CmsStringRepeater
        title="Recruiting Partner Companies Directory"
        items={companies.map((c: any) => (typeof c === "object" ? c.name : String(c)))}
        onChange={(newCompNames) => {
          onChange({ ...state, companies: newCompNames });
        }}
        placeholder="Company Name (e.g. Infosys, TCS, Amazon...)"
      />
    </div>
  );
}

function CdcEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const pillars = state.pillars || [];
  const features = state.features || [];
  const director = state.director || {};

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-[#0A1F44]">Career Development Cell (CDC)</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Heading</label>
          <input
            type="text"
            value={state.title || "Career Development Cell (CDC)"}
            onChange={(e) => onChange({ ...state, title: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtitle</label>
          <input
            type="text"
            value={state.subtitle || ""}
            onChange={(e) => onChange({ ...state, subtitle: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
          />
        </div>
      </div>

      <CmsAutoTextarea
        label="CDC Main Overview Description"
        value={state.description || ""}
        onChange={(val) => onChange({ ...state, description: val })}
        rows={4}
      />

      {/* 3 Core Pillars Cards Repeater */}
      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <label className="block text-xs font-bold uppercase text-[#0A1F44]">
            CDC Core Pillars Cards ({pillars.length})
          </label>
          <button
            type="button"
            onClick={() => {
              const newPillar = { title: "New Pillar", description: "Pillar subtitle..." };
              onChange({ ...state, pillars: [...pillars, newPillar] });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Pillar Card</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {pillars.map((pil: any, idx: number) => (
            <div key={idx} className="rounded-lg border border-slate-200 bg-white p-3 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <span className="text-xs font-bold text-slate-800">Pillar #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => onChange({ ...state, pillars: pillars.filter((_: any, i: number) => i !== idx) })}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800"
                >
                  Remove
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-0.5 text-[10px] uppercase">Title</label>
                <input
                  type="text"
                  value={pil.title || ""}
                  onChange={(e) => {
                    const copy = [...pillars];
                    copy[idx] = { ...copy[idx], title: e.target.value };
                    onChange({ ...state, pillars: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-0.5 text-[10px] uppercase">Subtitle / Description</label>
                <input
                  type="text"
                  value={pil.description || pil.subtitle || ""}
                  onChange={(e) => {
                    const copy = [...pillars];
                    copy[idx] = { ...copy[idx], description: e.target.value };
                    onChange({ ...state, pillars: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <CmsAutoTextarea
        label="CDC Expandable Read-More Details Paragraphs"
        value={state.expandedText || ""}
        onChange={(val) => onChange({ ...state, expandedText: val })}
        rows={4}
        helpText="This text appears when visitors click 'Read More Details' on the CDC section."
      />

      {/* Director Profile Card Controls */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
        <h4 className="font-bold text-xs uppercase text-[#0A1F44]">Training &amp; Placement Director Profile Card</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-0.5">Director Full Name</label>
            <input
              type="text"
              value={director.name || ""}
              onChange={(e) => onChange({ ...state, director: { ...director, name: e.target.value } })}
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-0.5">Designation / Title</label>
            <input
              type="text"
              value={director.designation || ""}
              onChange={(e) => onChange({ ...state, director: { ...director, designation: e.target.value } })}
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-0.5">Email Address</label>
            <input
              type="text"
              value={director.email || ""}
              onChange={(e) => onChange({ ...state, director: { ...director, email: e.target.value } })}
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-0.5">Phone / Helpline</label>
            <input
              type="text"
              value={director.phone || ""}
              onChange={(e) => onChange({ ...state, director: { ...director, phone: e.target.value } })}
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
            />
          </div>
        </div>

        <CmsImagePreviewInput
          label="Director Photo URL"
          value={director.image || ""}
          onChange={(val) => onChange({ ...state, director: { ...director, image: val } })}
        />
      </div>

      <CmsImagePreviewInput
        label="CDC Hierarchy / Overview Diagram Image URL"
        value={state.image || ""}
        onChange={(val) => onChange({ ...state, image: val })}
      />

      {/* Features / Training Modules Repeater */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <label className="block text-xs font-bold uppercase text-[#0A1F44]">
            CDC Key Training Modules &amp; Initiatives ({features.length})
          </label>
          <button
            type="button"
            onClick={() => {
              const newFeat = { title: "New Training Module", description: "Module details...", icon: "shield" };
              onChange({ ...state, features: [...features, newFeat] });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Initiative</span>
          </button>
        </div>

        <div className="space-y-3">
          {features.map((feat: any, idx: number) => (
            <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="text-xs font-bold text-slate-800">Initiative #{idx + 1}: {feat.title}</span>
                <button
                  type="button"
                  onClick={() => onChange({ ...state, features: features.filter((_: any, i: number) => i !== idx) })}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800"
                >
                  Remove
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-0.5 text-xs">Title</label>
                <input
                  type="text"
                  value={feat.title || ""}
                  onChange={(e) => {
                    const copy = [...features];
                    copy[idx] = { ...copy[idx], title: e.target.value };
                    onChange({ ...state, features: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
                />
              </div>

              <CmsAutoTextarea
                label="Description"
                value={feat.description || ""}
                onChange={(val) => {
                  const copy = [...features];
                  copy[idx] = { ...copy[idx], description: val };
                  onChange({ ...state, features: copy });
                }}
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SnapshotEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const packages = state.packages || [];

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0A1F44]">Salary &amp; Package Breakdown</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
          <input
            type="text"
            value={state.title || "Placement Package Breakdown"}
            onChange={(e) => onChange({ ...state, title: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtitle</label>
          <input
            type="text"
            value={state.subtitle || ""}
            onChange={(e) => onChange({ ...state, subtitle: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-[#0A1F44]">
          Package Tiers ({packages.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newTier = {
              tier: `Tier 0${packages.length + 1}`,
              range: "₹6 – ₹8 LPA",
              category: "Corporate Roles",
              description: "",
              isAverage: false,
              isTopTier: false,
            };
            onChange({ ...state, packages: [...packages, newTier] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Package Tier</span>
        </button>
      </div>

      <div className="space-y-3">
        {packages.map((pkg: any, idx: number) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800">
                {pkg.tier}: {pkg.range} ({pkg.category})
              </span>
              <button
                type="button"
                onClick={() => onChange({ ...state, packages: packages.filter((_: any, i: number) => i !== idx) })}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Tier Label</label>
                <input
                  type="text"
                  value={pkg.tier || ""}
                  onChange={(e) => {
                    const copy = [...packages];
                    copy[idx] = { ...copy[idx], tier: e.target.value };
                    onChange({ ...state, packages: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Salary Range</label>
                <input
                  type="text"
                  value={pkg.range || ""}
                  onChange={(e) => {
                    const copy = [...packages];
                    copy[idx] = { ...copy[idx], range: e.target.value };
                    onChange({ ...state, packages: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-bold text-[#E8871A]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Category</label>
                <input
                  type="text"
                  value={pkg.category || ""}
                  onChange={(e) => {
                    const copy = [...packages];
                    copy[idx] = { ...copy[idx], category: e.target.value };
                    onChange({ ...state, packages: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>

            <CmsAutoTextarea
              label="Tier Description"
              value={pkg.description || ""}
              onChange={(val) => {
                const copy = [...packages];
                copy[idx] = { ...copy[idx], description: val };
                onChange({ ...state, packages: copy });
              }}
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentStoriesEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const stories = state.stories || [];

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0A1F44]">Student Success Stories</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
          <input
            type="text"
            value={state.title || "Student Placement Stories"}
            onChange={(e) => onChange({ ...state, title: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtitle</label>
          <input
            type="text"
            value={state.subtitle || ""}
            onChange={(e) => onChange({ ...state, subtitle: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-[#0A1F44]">
          Student Achievers ({stories.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newStory = {
              id: `story-${Date.now()}`,
              name: "Student Name",
              package: "INR 20 LPA",
              company: "MNC Corporation",
              role: "Software Engineer",
              image: "",
              quote: "Geeta University empowered me...",
            };
            onChange({ ...state, stories: [...stories, newStory] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Story</span>
        </button>
      </div>

      <div className="space-y-4">
        {stories.map((st: any, idx: number) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800">
                #{idx + 1}: {st.name} — {st.package}
              </span>
              <button
                type="button"
                onClick={() => onChange({ ...state, stories: stories.filter((_: any, i: number) => i !== idx) })}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Student Name</label>
                <input
                  type="text"
                  value={st.name || ""}
                  onChange={(e) => {
                    const copy = [...stories];
                    copy[idx] = { ...copy[idx], name: e.target.value };
                    onChange({ ...state, stories: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Package</label>
                <input
                  type="text"
                  value={st.package || ""}
                  onChange={(e) => {
                    const copy = [...stories];
                    copy[idx] = { ...copy[idx], package: e.target.value };
                    onChange({ ...state, stories: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-bold text-[#E8871A]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Company / Role</label>
                <input
                  type="text"
                  value={st.company || st.role || ""}
                  onChange={(e) => {
                    const copy = [...stories];
                    copy[idx] = { ...copy[idx], company: e.target.value };
                    onChange({ ...state, stories: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>

            <CmsImagePreviewInput
              label="Student Photo URL"
              value={st.image || ""}
              onChange={(val) => {
                const copy = [...stories];
                copy[idx] = { ...copy[idx], image: val };
                onChange({ ...state, stories: copy });
              }}
            />

            <CmsAutoTextarea
              label="Student Testimonial Quote"
              value={st.quote || ""}
              onChange={(val) => {
                const copy = [...stories];
                copy[idx] = { ...copy[idx], quote: val };
                onChange({ ...state, stories: copy });
              }}
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function DrivesEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const drives = state.drives || [];

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0A1F44]">Placement Drives &amp; Highlights</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
          <input
            type="text"
            value={state.title || "Placement Drives"}
            onChange={(e) => onChange({ ...state, title: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtitle</label>
          <input
            type="text"
            value={state.subtitle || ""}
            onChange={(e) => onChange({ ...state, subtitle: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-[#0A1F44]">
          Placement Drives ({drives.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newDrive = {
              src: "",
              title: "Infosys Campus Drive",
              subtitle: "Drive details...",
              videoUrl: "",
            };
            onChange({ ...state, drives: [...drives, newDrive] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Drive</span>
        </button>
      </div>

      <div className="space-y-4">
        {drives.map((drv: any, idx: number) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800">Drive #{idx + 1}: {drv.title}</span>
              <button
                type="button"
                onClick={() => onChange({ ...state, drives: drives.filter((_: any, i: number) => i !== idx) })}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Drive Title</label>
                <input
                  type="text"
                  value={drv.title || ""}
                  onChange={(e) => {
                    const copy = [...drives];
                    copy[idx] = { ...copy[idx], title: e.target.value };
                    onChange({ ...state, drives: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Video URL (Optional)</label>
                <input
                  type="text"
                  value={drv.videoUrl || ""}
                  onChange={(e) => {
                    const copy = [...drives];
                    copy[idx] = { ...copy[idx], videoUrl: e.target.value };
                    onChange({ ...state, drives: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>

            <CmsImagePreviewInput
              label="Drive Photo / Poster URL"
              value={drv.src || ""}
              onChange={(val) => {
                const copy = [...drives];
                copy[idx] = { ...copy[idx], src: val };
                onChange({ ...state, drives: copy });
              }}
            />

            <CmsAutoTextarea
              label="Subtitle / Description"
              value={drv.subtitle || ""}
              onChange={(val) => {
                const copy = [...drives];
                copy[idx] = { ...copy[idx], subtitle: val };
                onChange({ ...state, drives: copy });
              }}
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function HrVoicesEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const voices = state.voices || [];

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0A1F44]">Recruiter Voices &amp; HR Testimonials</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
          <input
            type="text"
            value={state.title || "Recruiter Voices"}
            onChange={(e) => onChange({ ...state, title: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtitle</label>
          <input
            type="text"
            value={state.subtitle || ""}
            onChange={(e) => onChange({ ...state, subtitle: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-[#0A1F44]">
          HR &amp; Corporate Testimonials ({voices.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newVoice = {
              id: `hr-${Date.now()}`,
              name: "HR Executive",
              designation: "Talent Acquisition Head",
              company: "Corporate Company",
              image: "",
              quote: "Geeta University students exhibit excellent technical proficiency...",
            };
            onChange({ ...state, voices: [...voices, newVoice] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add HR Voice</span>
        </button>
      </div>

      <div className="space-y-4">
        {voices.map((v: any, idx: number) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800">
                #{idx + 1}: {v.name} ({v.company})
              </span>
              <button
                type="button"
                onClick={() => onChange({ ...state, voices: voices.filter((_: any, i: number) => i !== idx) })}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">HR Name</label>
                <input
                  type="text"
                  value={v.name || ""}
                  onChange={(e) => {
                    const copy = [...voices];
                    copy[idx] = { ...copy[idx], name: e.target.value };
                    onChange({ ...state, voices: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Designation</label>
                <input
                  type="text"
                  value={v.designation || ""}
                  onChange={(e) => {
                    const copy = [...voices];
                    copy[idx] = { ...copy[idx], designation: e.target.value };
                    onChange({ ...state, voices: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Company</label>
                <input
                  type="text"
                  value={v.company || ""}
                  onChange={(e) => {
                    const copy = [...voices];
                    copy[idx] = { ...copy[idx], company: e.target.value };
                    onChange({ ...state, voices: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
                />
              </div>
            </div>

            <CmsImagePreviewInput
              label="HR Photo URL"
              value={v.image || ""}
              onChange={(val) => {
                const copy = [...voices];
                copy[idx] = { ...copy[idx], image: val };
                onChange({ ...state, voices: copy });
              }}
            />

            <CmsAutoTextarea
              label="HR Endorsement Quote"
              value={v.quote || ""}
              onChange={(val) => {
                const copy = [...voices];
                copy[idx] = { ...copy[idx], quote: val };
                onChange({ ...state, voices: copy });
              }}
              rows={3}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PlacementGalleryEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const items = state.items || [];

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0A1F44]">Placement Day Gallery</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
          <input
            type="text"
            value={state.title || "Placement Day Celebrations"}
            onChange={(e) => onChange({ ...state, title: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtitle</label>
          <input
            type="text"
            value={state.subtitle || ""}
            onChange={(e) => onChange({ ...state, subtitle: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-[#0A1F44]">
          Gallery Photos ({items.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newItem = {
              src: "",
              title: "Placement Celebration",
              tag: "Milestone",
              caption: "Celebration details...",
            };
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
          <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800">Photo #{idx + 1}</span>
              <button
                type="button"
                onClick={() => onChange({ ...state, items: items.filter((_: any, i: number) => i !== idx) })}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>

            <CmsImagePreviewInput
              label="Photo File / URL"
              value={item.src || ""}
              onChange={(val) => {
                const copy = [...items];
                copy[idx] = { ...copy[idx], src: val };
                onChange({ ...state, items: copy });
              }}
            />

            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                placeholder="Title"
                value={item.title || ""}
                onChange={(e) => {
                  const copy = [...items];
                  copy[idx] = { ...copy[idx], title: e.target.value };
                  onChange({ ...state, items: copy });
                }}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs font-semibold"
              />
              <input
                type="text"
                placeholder="Tag / Badge"
                value={item.tag || ""}
                onChange={(e) => {
                  const copy = [...items];
                  copy[idx] = { ...copy[idx], tag: e.target.value };
                  onChange({ ...state, items: copy });
                }}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlacementFaqsEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const faqs = state.faqs || [];

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0A1F44]">Placement FAQs</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
          <input
            type="text"
            value={state.title || "Frequently Asked Questions (FAQs)"}
            onChange={(e) => onChange({ ...state, title: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtitle</label>
          <input
            type="text"
            value={state.subtitle || ""}
            onChange={(e) => onChange({ ...state, subtitle: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-[#0A1F44]">
          Placement FAQs ({faqs.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newFaq = {
              q: "New Placement Question?",
              a: "Detailed answer...",
              category: "Placements",
            };
            onChange({ ...state, faqs: [...faqs, newFaq] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add FAQ</span>
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq: any, idx: number) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800">FAQ #{idx + 1}</span>
              <button
                type="button"
                onClick={() => onChange({ ...state, faqs: faqs.filter((_: any, i: number) => i !== idx) })}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-0.5 text-xs">Question</label>
              <input
                type="text"
                value={faq.q || faq.question || ""}
                onChange={(e) => {
                  const copy = [...faqs];
                  copy[idx] = { ...copy[idx], q: e.target.value };
                  onChange({ ...state, faqs: copy });
                }}
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
              />
            </div>

            <CmsAutoTextarea
              label="Answer"
              value={faq.a || faq.answer || ""}
              onChange={(val) => {
                const copy = [...faqs];
                copy[idx] = { ...copy[idx], a: val };
                onChange({ ...state, faqs: copy });
              }}
              rows={3}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SeoEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-[#0A1F44]">SEO &amp; Social Metadata</h3>

      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Meta Title</label>
        <input
          type="text"
          value={state.title || ""}
          onChange={(e) => onChange({ ...state, title: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold"
        />
      </div>

      <CmsAutoTextarea
        label="Meta Description"
        value={state.description || ""}
        onChange={(val) => onChange({ ...state, description: val })}
        rows={3}
      />

      <CmsImagePreviewInput
        label="Open Graph Share Image URL"
        value={state.ogImage || ""}
        onChange={(val) => onChange({ ...state, ogImage: val })}
      />
    </div>
  );
}
