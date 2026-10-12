"use client";

import { useState } from "react";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  BookOpen,
  Library,
  Clock,
  UserCheck,
  Globe,
  FileSpreadsheet,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import { updatePageSectionAction, updatePageSeoAction } from "@/features/admin/pages/actions";
import {
  CmsImagePreviewInput,
  CmsAutoTextarea,
  CmsStringRepeater,
} from "@/features/admin/pages/components/CmsFieldHelpers";

interface LibraryCmsDashboardProps {
  initialData: {
    sections: Record<string, any>;
    seo: any;
  };
}

const SECTION_KEYS = [
  { key: "hero", label: "Hero Banner", icon: Sparkles },
  { key: "metrics", label: "Resource Metrics", icon: BookOpen },
  { key: "overview", label: "Overview & Reference", icon: Library },
  { key: "portals", label: "Digital Portals", icon: Globe },
  { key: "hours_policy", label: "Hours & Policy", icon: Clock },
  { key: "loan_rules", label: "Loan Details Table", icon: FileSpreadsheet },
  { key: "contact", label: "Librarian Contact", icon: UserCheck },
];

export function LibraryCmsDashboard({ initialData }: LibraryCmsDashboardProps) {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [sectionsData, setSectionsData] = useState<Record<string, any>>(initialData.sections || {});
  const [seoData, setSeoData] = useState<any>(initialData.seo || {});

  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSaveSection = async (key: string) => {
    setSavingKey(key);
    setFeedback(null);
    try {
      const section = sectionsData[key];
      const body = section?.body || section || {};
      const res = await updatePageSectionAction("library", key, body);
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
            Central Library CMS
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage public library resources, metrics, loan circulation policies, and digital resource portals.
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

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {SECTION_KEYS.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.key;
          return (
            <button
              key={sec.key}
              type="button"
              onClick={() => setActiveSection(sec.key)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#0A1F44] text-white shadow-md shadow-slate-900/10"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section Editor Panes */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        {/* HERO SECTION */}
        {activeSection === "hero" && (() => {
          const body = getBody("hero");
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Hero Banner Settings</h3>
                  <p className="text-xs text-slate-500">Configure title, subtitle, and background artwork.</p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={body.title || ""}
                    onChange={(e) => updateBody("hero", (b) => ({ ...b, title: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                    placeholder="Central Library & Knowledge Center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Hero Subtitle
                  </label>
                  <input
                    type="text"
                    value={body.subtitle || ""}
                    onChange={(e) => updateBody("hero", (b) => ({ ...b, subtitle: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                    placeholder="Your Gateway to Knowledge"
                  />
                </div>
              </div>

              <CmsImagePreviewInput
                label="Hero Background Image"
                value={body.heroImage || ""}
                onChange={(url) => updateBody("hero", (b) => ({ ...b, heroImage: url }))}
                placeholder="/library/hero-bg.webp"
              />
            </div>
          );
        })()}

        {/* METRICS SECTION */}
        {activeSection === "metrics" && (() => {
          const body = getBody("metrics");
          const items: any[] = body.items || [];

          const handleUpdateItem = (idx: number, field: string, val: any) => {
            const next = [...items];
            next[idx] = { ...next[idx], [field]: val };
            updateBody("metrics", (b) => ({ ...b, items: next }));
          };

          const handleAddItem = () => {
            const next = [
              ...items,
              {
                id: `metric-${Date.now()}`,
                title: "New Metric",
                count: "1,000+",
                description: "Collection description...",
                image: "/library/physical-books.jpg",
              },
            ];
            updateBody("metrics", (b) => ({ ...b, items: next }));
          };

          const handleRemoveItem = (idx: number) => {
            const next = items.filter((_, i) => i !== idx);
            updateBody("metrics", (b) => ({ ...b, items: next }));
          };

          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Resource Metric Cards</h3>
                  <p className="text-xs text-slate-500">Manage printed books, e-books, and research paper counts.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <Plus className="h-4 w-4" /> Add Metric
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSection("metrics")}
                    disabled={savingKey === "metrics"}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#d4760e] disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {savingKey === "metrics" ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={item.id || idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Metric #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-rose-600 hover:text-rose-800 text-xs font-bold inline-flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase">Title</label>
                        <input
                          type="text"
                          value={item.title || ""}
                          onChange={(e) => handleUpdateItem(idx, "title", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-[#0A1F44]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase">Value / Count</label>
                        <input
                          type="text"
                          value={item.count || ""}
                          onChange={(e) => handleUpdateItem(idx, "count", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-[#0A1F44]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">Description</label>
                      <input
                        type="text"
                        value={item.description || ""}
                        onChange={(e) => handleUpdateItem(idx, "description", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-[#0A1F44]"
                      />
                    </div>

                    <CmsImagePreviewInput
                      label="Card Artwork Image"
                      value={item.image || ""}
                      onChange={(url) => handleUpdateItem(idx, "image", url)}
                      placeholder="/library/physical-books.jpg"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* OVERVIEW SECTION */}
        {activeSection === "overview" && (() => {
          const body = getBody("overview");
          const paragraphs: string[] = body.paragraphs || [];
          const refSection = body.referenceSection || {};

          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Library Overview & History</h3>
                  <p className="text-xs text-slate-500">Detailed prose paragraphs and dedicated reference section volume info.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSection("overview")}
                  disabled={savingKey === "overview"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#d4760e] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingKey === "overview" ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Overview Section Heading
                </label>
                <input
                  type="text"
                  value={body.title || ""}
                  onChange={(e) => updateBody("overview", (b) => ({ ...b, title: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                />
              </div>

              <CmsStringRepeater
                title="Overview Paragraphs"
                items={paragraphs}
                onChange={(next) => updateBody("overview", (b) => ({ ...b, paragraphs: next }))}
                placeholder="Enter library narrative paragraph..."
              />

              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Dedicated Reference Section
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">Title</label>
                    <input
                      type="text"
                      value={refSection.title || ""}
                      onChange={(e) =>
                        updateBody("overview", (b) => ({
                          ...b,
                          referenceSection: { ...refSection, title: e.target.value },
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">Book Count</label>
                    <input
                      type="text"
                      value={refSection.count || ""}
                      onChange={(e) =>
                        updateBody("overview", (b) => ({
                          ...b,
                          referenceSection: { ...refSection, count: e.target.value },
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Description</label>
                  <textarea
                    rows={2}
                    value={refSection.description || ""}
                    onChange={(e) =>
                      updateBody("overview", (b) => ({
                        ...b,
                        referenceSection: { ...refSection, description: e.target.value },
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs"
                  />
                </div>
              </div>
            </div>
          );
        })()}

        {/* PORTALS SECTION */}
        {activeSection === "portals" && (() => {
          const body = getBody("portals");
          const items: any[] = body.items || [];

          const handleUpdatePortal = (idx: number, field: string, val: any) => {
            const next = [...items];
            next[idx] = { ...next[idx], [field]: val };
            updateBody("portals", (b) => ({ ...b, items: next }));
          };

          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Library Resource Portals</h3>
                  <p className="text-xs text-slate-500">Configure E-Library databases, NDLI integration, and GU Institutional E-Repository.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSection("portals")}
                  disabled={savingKey === "portals"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#d4760e] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingKey === "portals" ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="space-y-4">
                {items.map((portal, idx) => (
                  <div key={portal.id || idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Portal: {portal.title}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase">Title</label>
                        <input
                          type="text"
                          value={portal.title || ""}
                          onChange={(e) => handleUpdatePortal(idx, "title", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-[#0A1F44]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase">Short Description</label>
                        <input
                          type="text"
                          value={portal.description || ""}
                          onChange={(e) => handleUpdatePortal(idx, "description", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-[#0A1F44]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">Full Modal / In-Depth Content</label>
                      <textarea
                        rows={3}
                        value={portal.fullContent || ""}
                        onChange={(e) => handleUpdatePortal(idx, "fullContent", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-[#0A1F44]"
                      />
                    </div>

                    <CmsImagePreviewInput
                      label="Portal Artwork"
                      value={portal.image || ""}
                      onChange={(url) => handleUpdatePortal(idx, "image", url)}
                      placeholder="/library/elibrary.webp"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* HOURS & POLICY SECTION */}
        {activeSection === "hours_policy" && (() => {
          const body = getBody("hours_policy");
          const infoList: string[] = body.importantInfo || [];

          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Library Hours & Contact Support</h3>
                  <p className="text-xs text-slate-500">Configure operating days, daily timings, working days, and email.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSection("hours_policy")}
                  disabled={savingKey === "hours_policy"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#d4760e] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingKey === "hours_policy" ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Operating Days
                  </label>
                  <input
                    type="text"
                    value={body.operatingDays || ""}
                    onChange={(e) => updateBody("hours_policy", (b) => ({ ...b, operatingDays: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Daily Timings
                  </label>
                  <input
                    type="text"
                    value={body.timings || ""}
                    onChange={(e) => updateBody("hours_policy", (b) => ({ ...b, timings: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Working Days / Year
                  </label>
                  <input
                    type="text"
                    value={body.workingDaysPerYear || ""}
                    onChange={(e) => updateBody("hours_policy", (b) => ({ ...b, workingDaysPerYear: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={body.supportEmail || ""}
                    onChange={(e) => updateBody("hours_policy", (b) => ({ ...b, supportEmail: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                  />
                </div>
              </div>

              <CmsStringRepeater
                title="Important Information Guidelines"
                items={infoList}
                onChange={(next) => updateBody("hours_policy", (b) => ({ ...b, importantInfo: next }))}
                placeholder="Enter policy guideline..."
              />
            </div>
          );
        })()}

        {/* LOAN RULES TABLE SECTION */}
        {activeSection === "loan_rules" && (() => {
          const body = getBody("loan_rules");
          const rules: any[] = body.rules || [];

          const handleUpdateRule = (idx: number, field: string, val: any) => {
            const next = [...rules];
            next[idx] = { ...next[idx], [field]: val };
            updateBody("loan_rules", (b) => ({ ...b, rules: next }));
          };

          const handleAddRule = () => {
            const next = [
              ...rules,
              {
                sn: rules.length + 1,
                category: "New Member Category",
                booksIssued: 3,
                loanPeriod: "14 Days",
              },
            ];
            updateBody("loan_rules", (b) => ({ ...b, rules: next }));
          };

          const handleRemoveRule = (idx: number) => {
            const next = rules.filter((_, i) => i !== idx).map((r, i) => ({ ...r, sn: i + 1 }));
            updateBody("loan_rules", (b) => ({ ...b, rules: next }));
          };

          const handleMoveRule = (idx: number, direction: "up" | "down") => {
            const target = direction === "up" ? idx - 1 : idx + 1;
            if (target < 0 || target >= rules.length) return;
            const next = [...rules];
            const temp = next[idx];
            next[idx] = next[target];
            next[target] = temp;
            const renumbered = next.map((r, i) => ({ ...r, sn: i + 1 }));
            updateBody("loan_rules", (b) => ({ ...b, rules: renumbered }));
          };

          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Library Loan Rules Policy Table</h3>
                  <p className="text-xs text-slate-500">Member categories, max book allowances, and loan circulation durations.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddRule}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <Plus className="h-4 w-4" /> Add Row
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSection("loan_rules")}
                    disabled={savingKey === "loan_rules"}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#d4760e] disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {savingKey === "loan_rules" ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-[#0A1F44] uppercase tracking-wider text-white">
                    <tr>
                      <th className="p-3 w-12 text-center">SN</th>
                      <th className="p-3">Category of Members</th>
                      <th className="p-3 w-28 text-center">Books Issued</th>
                      <th className="p-3 w-36">Loan Period</th>
                      <th className="p-3 w-24 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rules.map((rule, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 text-center font-bold text-[#0A1F44]">{idx + 1}</td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={rule.category || ""}
                            onChange={(e) => handleUpdateRule(idx, "category", e.target.value)}
                            className="w-full rounded-md border border-slate-200 px-2 py-1 text-xs"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={rule.booksIssued || 1}
                            onChange={(e) => handleUpdateRule(idx, "booksIssued", parseInt(e.target.value) || 1)}
                            className="w-16 text-center rounded-md border border-slate-200 px-2 py-1 text-xs font-bold"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={rule.loanPeriod || ""}
                            onChange={(e) => handleUpdateRule(idx, "loanPeriod", e.target.value)}
                            className="w-full rounded-md border border-slate-200 px-2 py-1 text-xs"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveRule(idx, "up")}
                              disabled={idx === 0}
                              className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveRule(idx, "down")}
                              disabled={idx === rules.length - 1}
                              className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveRule(idx)}
                              className="p-1 text-rose-600 hover:text-rose-800"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

        {/* LIBRARIAN CONTACT SECTION */}
        {activeSection === "contact" && (() => {
          const body = getBody("contact");

          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Librarian In-Charge Contact</h3>
                  <p className="text-xs text-slate-500">Official contact card displayed at the bottom of the library page.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSection("contact")}
                  disabled={savingKey === "contact"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#d4760e] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingKey === "contact" ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Librarian Name
                  </label>
                  <input
                    type="text"
                    value={body.name || ""}
                    onChange={(e) => updateBody("contact", (b) => ({ ...b, name: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={body.designation || ""}
                    onChange={(e) => updateBody("contact", (b) => ({ ...b, designation: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={body.email || ""}
                    onChange={(e) => updateBody("contact", (b) => ({ ...b, email: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={body.phone || ""}
                    onChange={(e) => updateBody("contact", (b) => ({ ...b, phone: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Campus Address / Office Location
                </label>
                <input
                  type="text"
                  value={body.address || ""}
                  onChange={(e) => updateBody("contact", (b) => ({ ...b, address: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                />
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
