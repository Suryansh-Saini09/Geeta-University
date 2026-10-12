"use client";

import { useState } from "react";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  HelpCircle,
  Building2,
  Trophy,
  Calendar,
  Users,
  Image as ImageIcon,
} from "lucide-react";
import { updatePageSectionAction, updatePageSeoAction } from "@/features/admin/pages/actions";
import {
  CmsImagePreviewInput,
  CmsAutoTextarea,
  CmsStringRepeater,
} from "@/features/admin/pages/components/CmsFieldHelpers";

interface CampusLifeCmsDashboardProps {
  initialData: {
    sections: Record<string, any>;
    seo: any;
  };
}

const SECTION_KEYS = [
  { key: "hero", label: "Hero & Overview", icon: Sparkles },
  { key: "facilities", label: "Campus Infrastructure", icon: Building2 },
  { key: "sports", label: "Sports Facilities", icon: Trophy },
  { key: "events", label: "Campus Events & Fests", icon: Calendar },
  { key: "personalities", label: "Eminent Personalities", icon: Users },
  { key: "faqs", label: "Campus FAQs", icon: HelpCircle },
  { key: "seo", label: "SEO Metadata", icon: ImageIcon },
];

export function CampusLifeCmsDashboard({ initialData }: CampusLifeCmsDashboardProps) {
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
        const res = await updatePageSeoAction("campus-life", seoData);
        if (res.success) {
          setFeedback({ type: "success", message: "SEO Metadata updated successfully!" });
        } else {
          setFeedback({ type: "error", message: res.error || "Failed to update SEO" });
        }
      } else {
        const currentBody = sectionsData[key]?.body || {};
        const res = await updatePageSectionAction("campus-life", key, currentBody);
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
            <h1 className="text-2xl font-serif font-bold text-[#0A1F44]">Campus Life CMS Editor</h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Database Backed
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Manage all 6 public sections and SEO metadata for the <code className="font-semibold text-slate-800">/campus-life</code> page.
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
            Campus Life Sections
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
            <HeroEditor
              state={sectionsData.hero?.body || {}}
              onChange={(val) => updateSectionBody("hero", val)}
            />
          )}

          {activeSection === "facilities" && (
            <FacilitiesEditor
              state={sectionsData.facilities?.body || {}}
              onChange={(val) => updateSectionBody("facilities", val)}
            />
          )}

          {activeSection === "sports" && (
            <SportsEditor
              state={sectionsData.sports?.body || {}}
              onChange={(val) => updateSectionBody("sports", val)}
            />
          )}

          {activeSection === "events" && (
            <EventsEditor
              state={sectionsData.events?.body || {}}
              onChange={(val) => updateSectionBody("events", val)}
            />
          )}

          {activeSection === "personalities" && (
            <PersonalitiesEditor
              state={sectionsData.personalities?.body || {}}
              onChange={(val) => updateSectionBody("personalities", val)}
            />
          )}

          {activeSection === "faqs" && (
            <FaqsEditor
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
   SUB-EDITORS FOR CAMPUS LIFE
========================================================= */

function HeroEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const stats = state.stats || [];

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0A1F44]">Hero Banner &amp; Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Page Title</label>
          <input
            type="text"
            value={state.title || "Campus Life"}
            onChange={(e) => onChange({ ...state, title: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-[#0A1F44]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtitle / Tagline</label>
          <input
            type="text"
            value={state.subtitle || ""}
            onChange={(e) => onChange({ ...state, subtitle: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
          />
        </div>
      </div>

      <CmsAutoTextarea
        label="Main Campus Life Description"
        value={state.description || ""}
        onChange={(val) => onChange({ ...state, description: val })}
        rows={4}
      />

      <CmsImagePreviewInput
        label="Top Hero Banner Image URL"
        value={state.bannerImage || ""}
        onChange={(val) => onChange({ ...state, bannerImage: val })}
      />

      {/* Hero Stats */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <label className="block text-xs font-bold uppercase text-[#0A1F44]">
            Hero Highlights &amp; Statistics ({stats.length})
          </label>
          <button
            type="button"
            onClick={() => {
              const newStat = { value: "100%", label: "New Highlight" };
              onChange({ ...state, stats: [...stats, newStat] });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Metric</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stats.map((st: any, idx: number) => (
            <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                <span className="text-xs font-bold text-slate-700">Metric #{idx + 1}</span>
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
                  <label className="block font-bold text-slate-600 mb-0.5">Value</label>
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
    </div>
  );
}

function FacilitiesEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const facilities = state.facilities || [];

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0A1F44]">World Class Infrastructure</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
          <input
            type="text"
            value={state.title || "World Class Infrastructure"}
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
          Campus Facilities ({facilities.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newFacility = {
              id: `fac-${Date.now()}`,
              title: "New Campus Facility",
              category: "Academics",
              description: "",
              image: "",
              features: [],
            };
            onChange({ ...state, facilities: [...facilities, newFacility] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Facility</span>
        </button>
      </div>

      <div className="space-y-4">
        {facilities.map((fac: any, idx: number) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800">
                Facility #{idx + 1}: {fac.title}
              </span>
              <button
                type="button"
                onClick={() => onChange({ ...state, facilities: facilities.filter((_: any, i: number) => i !== idx) })}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Facility Name</label>
                <input
                  type="text"
                  value={fac.title || ""}
                  onChange={(e) => {
                    const copy = [...facilities];
                    copy[idx] = { ...copy[idx], title: e.target.value };
                    onChange({ ...state, facilities: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Category</label>
                <select
                  value={fac.category || "Academics"}
                  onChange={(e) => {
                    const copy = [...facilities];
                    copy[idx] = { ...copy[idx], category: e.target.value };
                    onChange({ ...state, facilities: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs bg-white"
                >
                  <option value="Academics">Academics</option>
                  <option value="Research">Research</option>
                  <option value="Community">Community</option>
                  <option value="Living">Living</option>
                </select>
              </div>
            </div>

            <CmsAutoTextarea
              label="Facility Overview"
              value={fac.description || ""}
              onChange={(val) => {
                const copy = [...facilities];
                copy[idx] = { ...copy[idx], description: val };
                onChange({ ...state, facilities: copy });
              }}
              rows={2}
            />

            <CmsImagePreviewInput
              label="Facility Photo URL"
              value={fac.image || ""}
              onChange={(val) => {
                const copy = [...facilities];
                copy[idx] = { ...copy[idx], image: val };
                onChange({ ...state, facilities: copy });
              }}
            />

            <CmsStringRepeater
              title="Key Feature Highlights"
              items={Array.isArray(fac.features) ? fac.features : []}
              onChange={(newFeats) => {
                const copy = [...facilities];
                copy[idx] = { ...copy[idx], features: newFeats };
                onChange({ ...state, facilities: copy });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SportsEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const sports = state.sports || [];

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0A1F44]">Sports Facilities</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
          <input
            type="text"
            value={state.title || "Sports & Athletics"}
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
          Sports Facilities ({sports.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newSport = {
              id: `sport-${Date.now()}`,
              title: "New Sport Field",
              tagline: "Sport Tagline",
              type: "Outdoor",
              image: "",
              highlights: "",
            };
            onChange({ ...state, sports: [...sports, newSport] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Sport</span>
        </button>
      </div>

      <div className="space-y-4">
        {sports.map((sp: any, idx: number) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800">
                Sport #{idx + 1}: {sp.title}
              </span>
              <button
                type="button"
                onClick={() => onChange({ ...state, sports: sports.filter((_: any, i: number) => i !== idx) })}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Sport Name</label>
                <input
                  type="text"
                  value={sp.title || ""}
                  onChange={(e) => {
                    const copy = [...sports];
                    copy[idx] = { ...copy[idx], title: e.target.value };
                    onChange({ ...state, sports: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Tagline</label>
                <input
                  type="text"
                  value={sp.tagline || ""}
                  onChange={(e) => {
                    const copy = [...sports];
                    copy[idx] = { ...copy[idx], tagline: e.target.value };
                    onChange({ ...state, sports: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Type</label>
                <select
                  value={sp.type || "Outdoor"}
                  onChange={(e) => {
                    const copy = [...sports];
                    copy[idx] = { ...copy[idx], type: e.target.value };
                    onChange({ ...state, sports: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs bg-white"
                >
                  <option value="Outdoor">Outdoor</option>
                  <option value="Indoor">Indoor</option>
                  <option value="Fitness">Fitness</option>
                </select>
              </div>
            </div>

            <CmsImagePreviewInput
              label="Sport Facility Photo URL"
              value={sp.image || ""}
              onChange={(val) => {
                const copy = [...sports];
                copy[idx] = { ...copy[idx], image: val };
                onChange({ ...state, sports: copy });
              }}
            />

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Highlights</label>
              <input
                type="text"
                value={sp.highlights || ""}
                onChange={(e) => {
                  const copy = [...sports];
                  copy[idx] = { ...copy[idx], highlights: e.target.value };
                  onChange({ ...state, sports: copy });
                }}
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const events = state.events || [];
  const spotlight = state.videoSpotlight || {};

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0A1F44]">Campus Events &amp; Fests</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
          <input
            type="text"
            value={state.title || "Campus Events & Fests"}
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

      {/* Video Spotlight Card */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
        <h4 className="font-bold text-xs uppercase text-[#0A1F44]">Event Video Spotlight Card</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-0.5">Spotlight Title</label>
            <input
              type="text"
              value={spotlight.title || ""}
              onChange={(e) => onChange({ ...state, videoSpotlight: { ...spotlight, title: e.target.value } })}
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-0.5">YouTube Video ID / URL</label>
            <input
              type="text"
              value={spotlight.videoUrl || ""}
              onChange={(e) => onChange({ ...state, videoSpotlight: { ...spotlight, videoUrl: e.target.value } })}
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
            />
          </div>
        </div>
        <CmsImagePreviewInput
          label="Spotlight Thumbnail Poster"
          value={spotlight.thumbnail || ""}
          onChange={(val) => onChange({ ...state, videoSpotlight: { ...spotlight, thumbnail: val } })}
        />
      </div>

      {/* Events Repeater */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="block text-xs font-bold uppercase text-[#0A1F44]">
          Campus Events ({events.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newEv = {
              id: `event-${Date.now()}`,
              title: "New Campus Fest",
              tagline: "Event Tagline",
              category: "Cultural",
              image: "",
              description: "",
            };
            onChange({ ...state, events: [...events, newEv] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Event</span>
        </button>
      </div>

      <div className="space-y-4">
        {events.map((ev: any, idx: number) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800">
                Event #{idx + 1}: {ev.title}
              </span>
              <button
                type="button"
                onClick={() => onChange({ ...state, events: events.filter((_: any, i: number) => i !== idx) })}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Event Name</label>
                <input
                  type="text"
                  value={ev.title || ""}
                  onChange={(e) => {
                    const copy = [...events];
                    copy[idx] = { ...copy[idx], title: e.target.value };
                    onChange({ ...state, events: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Tagline</label>
                <input
                  type="text"
                  value={ev.tagline || ""}
                  onChange={(e) => {
                    const copy = [...events];
                    copy[idx] = { ...copy[idx], tagline: e.target.value };
                    onChange({ ...state, events: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-0.5">Category</label>
                <input
                  type="text"
                  value={ev.category || "Cultural"}
                  onChange={(e) => {
                    const copy = [...events];
                    copy[idx] = { ...copy[idx], category: e.target.value };
                    onChange({ ...state, events: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>

            <CmsImagePreviewInput
              label="Event Banner Photo URL"
              value={ev.image || ""}
              onChange={(val) => {
                const copy = [...events];
                copy[idx] = { ...copy[idx], image: val };
                onChange({ ...state, events: copy });
              }}
            />

            <CmsAutoTextarea
              label="Event Description"
              value={ev.description || ""}
              onChange={(val) => {
                const copy = [...events];
                copy[idx] = { ...copy[idx], description: val };
                onChange({ ...state, events: copy });
              }}
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonalitiesEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const items = state.personalities || [];

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0A1F44]">Eminent Personalities</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
          <input
            type="text"
            value={state.title || "Eminent Personalities at GU"}
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
          Dignitaries &amp; Personalities ({items.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newItem = {
              id: `ep-${Date.now()}`,
              title: "Distinguished Dignitary Visit",
              role: "Eminent Guest",
              image: "",
            };
            onChange({ ...state, personalities: [...items, newItem] });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8871A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Personality</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800">Person #{idx + 1}</span>
              <button
                type="button"
                onClick={() => onChange({ ...state, personalities: items.filter((_: any, i: number) => i !== idx) })}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>

            <CmsImagePreviewInput
              label="Photo URL"
              value={item.image || ""}
              onChange={(val) => {
                const copy = [...items];
                copy[idx] = { ...copy[idx], image: val };
                onChange({ ...state, personalities: copy });
              }}
            />

            <input
              type="text"
              placeholder="Title / Event Session Name"
              value={item.title || ""}
              onChange={(e) => {
                const copy = [...items];
                copy[idx] = { ...copy[idx], title: e.target.value };
                onChange({ ...state, personalities: copy });
              }}
              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqsEditor({ state, onChange }: { state: any; onChange: (val: any) => void }) {
  const faqs = state.faqs || [];

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0A1F44]">Campus Life FAQs</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
          <input
            type="text"
            value={state.title || "Frequently Asked Questions"}
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
          FAQ Questions &amp; Answers ({faqs.length})
        </label>
        <button
          type="button"
          onClick={() => {
            const newFaq = {
              id: `faq-${Date.now()}`,
              question: "New Campus Life Question?",
              answer: "Detailed answer goes here...",
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
                value={faq.question || faq.q || ""}
                onChange={(e) => {
                  const copy = [...faqs];
                  copy[idx] = { ...copy[idx], question: e.target.value };
                  onChange({ ...state, faqs: copy });
                }}
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
              />
            </div>

            <CmsAutoTextarea
              label="Answer"
              value={faq.answer || faq.a || ""}
              onChange={(val) => {
                const copy = [...faqs];
                copy[idx] = { ...copy[idx], answer: val };
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
