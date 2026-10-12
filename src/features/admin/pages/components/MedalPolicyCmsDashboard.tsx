"use client";

import { useState } from "react";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Medal,
  Trophy,
  FileSpreadsheet,
  Download,
  Sparkles,
  PieChart,
} from "lucide-react";
import { updatePageSectionAction } from "@/features/admin/pages/actions";
import {
  CmsImagePreviewInput,
  CmsStringRepeater,
} from "@/features/admin/pages/components/CmsFieldHelpers";

interface MedalPolicyCmsDashboardProps {
  initialData: {
    sections: Record<string, any>;
    seo: any;
  };
}

const TABS = [
  { key: "academic_medals", label: "Academic Medals", icon: Medal },
  { key: "thresholds", label: "Cohort Thresholds (Table 1)", icon: FileSpreadsheet },
  { key: "chancellor", label: "Chancellor’s Medal", icon: Trophy },
  { key: "chancellor_weightage", label: "Evaluation Weightages", icon: PieChart },
  { key: "rankers_document", label: "Rankers PDF Document", icon: Download },
  { key: "hero", label: "Hero Banner", icon: Sparkles },
];

export function MedalPolicyCmsDashboard({ initialData }: MedalPolicyCmsDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("academic_medals");
  const [sectionsData, setSectionsData] = useState<Record<string, any>>(initialData.sections || {});

  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSaveSection = async (key: string) => {
    setSavingKey(key);
    setFeedback(null);
    try {
      const section = sectionsData[key];
      const body = section?.body || section || {};
      const res = await updatePageSectionAction("medal-policy", key, body);
      if (res.success) {
        setFeedback({ type: "success", message: `Saved ${key} section successfully!` });
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to save section" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "An unexpected error occurred" });
    } finally {
      setSavingKey(null);
    }
  };

  const updateBody = (key: string, updater: (prev: any) => any) => {
    setSectionsData((prev) => {
      const current = prev[key]?.body || prev[key] || {};
      const nextBody = updater(current);
      return {
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          body: nextBody,
        },
      };
    });
  };

  const getBody = (key: string) => {
    return sectionsData[key]?.body || sectionsData[key] || {};
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#0A1F44]">
            GU Medal Policy CMS
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage academic medals, batch cohort size thresholds, Chancellor's Medal weightages, and convocation ranker PDFs.
          </p>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          role="status"
          className={`flex items-center gap-3 rounded-xl p-4 text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
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

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#0A1F44] text-white shadow-md shadow-slate-900/10"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        {/* ACADEMIC MEDALS */}
        {activeTab === "academic_medals" && (() => {
          const body = getBody("academic_medals");
          const medals: any[] = body.medals || [];

          const handleUpdateMedal = (idx: number, field: string, val: any) => {
            const next = [...medals];
            next[idx] = { ...next[idx], [field]: val };
            updateBody("academic_medals", (b) => ({ ...b, medals: next }));
          };

          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Academic Medals</h3>
                  <p className="text-xs text-slate-500">Configure Gold, Silver, and Bronze medal eligibility rules.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSection("academic_medals")}
                  disabled={savingKey === "academic_medals"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#d4760e] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingKey === "academic_medals" ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="space-y-6">
                {medals.map((medal, idx) => (
                  <div key={medal.typeKey || idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                      <span className="font-serif text-base font-bold text-[#0A1F44]">
                        {medal.type} ({medal.badge})
                      </span>
                      <span className="text-xs font-mono font-bold uppercase text-slate-500">
                        Theme Key: {medal.typeKey}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Medal Name
                        </label>
                        <input
                          type="text"
                          value={medal.type || ""}
                          onChange={(e) => handleUpdateMedal(idx, "type", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Rank Badge Label
                        </label>
                        <input
                          type="text"
                          value={medal.badge || ""}
                          onChange={(e) => handleUpdateMedal(idx, "badge", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44]"
                        />
                      </div>
                    </div>

                    <CmsStringRepeater
                      title={`${medal.type} Eligibility Requirements`}
                      items={medal.eligibility || []}
                      onChange={(next) => handleUpdateMedal(idx, "eligibility", next)}
                      placeholder="Enter eligibility rule..."
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* THRESHOLDS TABLE */}
        {activeTab === "thresholds" && (() => {
          const body = getBody("thresholds");
          const rows: any[] = body.thresholds || [];

          const handleUpdateRow = (idx: number, field: string, val: any) => {
            const next = [...rows];
            next[idx] = { ...next[idx], [field]: val };
            updateBody("thresholds", (b) => ({ ...b, thresholds: next }));
          };

          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Table 1: Cohort Thresholds</h3>
                  <p className="text-xs text-slate-500">Minimum number of passing students required in batch for awarding medals.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSection("thresholds")}
                  disabled={savingKey === "thresholds"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#d4760e] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingKey === "thresholds" ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-[#0A1F44] uppercase tracking-wider text-white">
                    <tr>
                      <th className="p-3">Medal Category</th>
                      <th className="p-3 text-center">Postgraduate (PG)</th>
                      <th className="p-3 text-center">Undergraduate (UG)</th>
                      <th className="p-3 text-center">Diploma Programs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-[#0A1F44]">{row.medal}</td>
                        <td className="p-3 text-center">
                          <input
                            type="text"
                            value={row.pg || ""}
                            onChange={(e) => handleUpdateRow(idx, "pg", e.target.value)}
                            className="w-32 text-center rounded-md border border-slate-200 px-2 py-1 text-xs"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="text"
                            value={row.ug || ""}
                            onChange={(e) => handleUpdateRow(idx, "ug", e.target.value)}
                            className="w-32 text-center rounded-md border border-slate-200 px-2 py-1 text-xs"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="text"
                            value={row.diploma || ""}
                            onChange={(e) => handleUpdateRow(idx, "diploma", e.target.value)}
                            className="w-32 text-center rounded-md border border-slate-200 px-2 py-1 text-xs"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

        {/* CHANCELLOR'S MEDAL */}
        {activeTab === "chancellor" && (() => {
          const body = getBody("chancellor");

          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Chancellor’s Medal Overview</h3>
                  <p className="text-xs text-slate-500">Highest university honor for Best All-Rounder candidate.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSection("chancellor")}
                  disabled={savingKey === "chancellor"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#d4760e] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingKey === "chancellor" ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Overview Title
                </label>
                <input
                  type="text"
                  value={body.title || ""}
                  onChange={(e) => updateBody("chancellor", (b) => ({ ...b, title: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Overview Description
                </label>
                <textarea
                  rows={3}
                  value={body.description || ""}
                  onChange={(e) => updateBody("chancellor", (b) => ({ ...b, description: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                />
              </div>

              <CmsStringRepeater
                title="Eligibility & Qualification Points"
                items={body.criteria || []}
                onChange={(next) => updateBody("chancellor", (b) => ({ ...b, criteria: next }))}
                placeholder="e.g., Normal Course Duration (No Extension)..."
              />
            </div>
          );
        })()}

        {/* CHANCELLOR'S WEIGHTAGES */}
        {activeTab === "chancellor_weightage" && (() => {
          const body = getBody("chancellor_weightage");
          const weightages: any[] = body.weightages || [];

          const handleUpdateWeight = (idx: number, field: string, val: any) => {
            const next = [...weightages];
            next[idx] = { ...next[idx], [field]: val };
            updateBody("chancellor_weightage", (b) => ({ ...b, weightages: next }));
          };

          const totalPercent = weightages.reduce((sum, w) => sum + (Number(w.percent) || 0), 0);

          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Evaluation Weightage Breakdown</h3>
                  <p className="text-xs text-slate-500">Categories and percentage weights totaling 100%.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSection("chancellor_weightage")}
                  disabled={savingKey === "chancellor_weightage"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#d4760e] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingKey === "chancellor_weightage" ? "Saving..." : "Save Changes"}
                </button>
              </div>

              {totalPercent !== 100 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-900">
                  Notice: Total weightage is currently {totalPercent}%. It should normally sum to 100%.
                </div>
              )}

              <div className="space-y-4">
                {weightages.map((item, idx) => (
                  <div key={item.category || idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">Category Name</label>
                      <input
                        type="text"
                        value={item.category || ""}
                        onChange={(e) => handleUpdateWeight(idx, "category", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-[#0A1F44]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">Weightage Text</label>
                      <input
                        type="text"
                        value={item.weightage || ""}
                        onChange={(e) => handleUpdateWeight(idx, "weightage", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-[#0A1F44]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">Percentage Number</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={item.percent || 0}
                        onChange={(e) => handleUpdateWeight(idx, "percent", parseInt(e.target.value) || 0)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-[#0A1F44]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* RANKERS DOCUMENT */}
        {activeTab === "rankers_document" && (() => {
          const body = getBody("rankers_document");

          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Convocation Rankers PDF Document</h3>
                  <p className="text-xs text-slate-500">Heading, description, and downloadable PDF link.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSection("rankers_document")}
                  disabled={savingKey === "rankers_document"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#d4760e] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingKey === "rankers_document" ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={body.title || ""}
                  onChange={(e) => updateBody("rankers_document", (b) => ({ ...b, title: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={body.description || ""}
                  onChange={(e) => updateBody("rankers_document", (b) => ({ ...b, description: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Download / View Document URL (PDF)
                  </label>
                  <input
                    type="url"
                    value={body.documentUrl || ""}
                    onChange={(e) => updateBody("rankers_document", (b) => ({ ...b, documentUrl: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                    placeholder="https://geetauniversity.edu.in/.../Medal-List.pdf"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={body.ctaLabel || ""}
                    onChange={(e) => updateBody("rankers_document", (b) => ({ ...b, ctaLabel: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                    placeholder="View Medal List PDF"
                  />
                </div>
              </div>
            </div>
          );
        })()}

        {/* HERO BANNER */}
        {activeTab === "hero" && (() => {
          const body = getBody("hero");

          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Hero Banner Settings</h3>
                  <p className="text-xs text-slate-500">Page title and background overlay image.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSection("hero")}
                  disabled={savingKey === "hero"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#d4760e] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingKey === "hero" ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Primary Title
                  </label>
                  <input
                    type="text"
                    value={body.title || ""}
                    onChange={(e) => updateBody("hero", (b) => ({ ...b, title: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                    placeholder="Geeta University"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Highlighted Title (Orange)
                  </label>
                  <input
                    type="text"
                    value={body.highlight || ""}
                    onChange={(e) => updateBody("hero", (b) => ({ ...b, highlight: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                    placeholder="Medal Policy"
                  />
                </div>
              </div>

              <CmsImagePreviewInput
                label="Hero Background Overlay Image"
                value={body.bgImage || ""}
                onChange={(url) => updateBody("hero", (b) => ({ ...b, bgImage: url }))}
                placeholder="https://geetauniversity.edu.in/uploads/all/224/conversions/new-building-3-full.webp"
              />
            </div>
          );
        })()}
      </div>
    </div>
  );
}
