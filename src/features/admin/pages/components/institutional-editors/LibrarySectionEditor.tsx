"use client";

import React from "react";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  CmsImagePreviewInput,
  CmsStringRepeater,
} from "@/features/admin/pages/components/CmsFieldHelpers";
import type { SpecializedSectionEditorProps } from "./types";

export function LibrarySectionEditor({
  sectionKey,
  body = {},
  onChange,
}: SpecializedSectionEditorProps) {
  /* =========================================================
     1. HERO SECTION
  ========================================================= */
  if (sectionKey === "hero") {
    const hero = body || {};
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Hero Banner Settings</h3>
          <p className="text-xs text-slate-500">Configure title, subtitle, and background artwork.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Hero Title
            </label>
            <input
              type="text"
              value={hero.title || ""}
              onChange={(e) => onChange({ ...hero, title: e.target.value })}
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
              value={hero.subtitle || ""}
              onChange={(e) => onChange({ ...hero, subtitle: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
              placeholder="Your Gateway to Knowledge"
            />
          </div>
        </div>

        <CmsImagePreviewInput
          label="Hero Background Image"
          value={hero.heroImage || ""}
          onChange={(url) => onChange({ ...hero, heroImage: url })}
          placeholder="/library/hero-bg.webp"
        />
      </div>
    );
  }

  /* =========================================================
     2. METRICS SECTION
  ========================================================= */
  if (sectionKey === "metrics") {
    const metrics = body || {};
    const items: any[] = metrics.items || [];

    const handleUpdateItem = (idx: number, field: string, val: any) => {
      const next = [...items];
      next[idx] = { ...next[idx], [field]: val };
      onChange({ ...metrics, items: next });
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
      onChange({ ...metrics, items: next });
    };

    const handleRemoveItem = (idx: number) => {
      const next = items.filter((_, i) => i !== idx);
      onChange({ ...metrics, items: next });
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Resource Metric Cards</h3>
            <p className="text-xs text-slate-500">Manage printed books, e-books, and research paper counts.</p>
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs self-start sm:self-auto transition"
          >
            <Plus className="h-4 w-4" /> Add Metric
          </button>
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

          {items.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
              No metrics defined. Click &ldquo;Add Metric&rdquo; above to create one.
            </div>
          )}
        </div>
      </div>
    );
  }

  /* =========================================================
     3. OVERVIEW SECTION
  ========================================================= */
  if (sectionKey === "overview") {
    const overview = body || {};
    const paragraphs: string[] = overview.paragraphs || [];
    const refSection = overview.referenceSection || {};

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Library Overview &amp; History</h3>
          <p className="text-xs text-slate-500">Detailed prose paragraphs and dedicated reference section volume info.</p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Overview Section Heading
          </label>
          <input
            type="text"
            value={overview.title || ""}
            onChange={(e) => onChange({ ...overview, title: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
          />
        </div>

        <CmsStringRepeater
          title="Overview Paragraphs"
          items={paragraphs}
          onChange={(next) => onChange({ ...overview, paragraphs: next })}
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
                  onChange({
                    ...overview,
                    referenceSection: { ...refSection, title: e.target.value },
                  })
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
                  onChange({
                    ...overview,
                    referenceSection: { ...refSection, count: e.target.value },
                  })
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
                onChange({
                  ...overview,
                  referenceSection: { ...refSection, description: e.target.value },
                })
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs"
            />
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     4. PORTALS SECTION
  ========================================================= */
  if (sectionKey === "portals") {
    const portals = body || {};
    const items: any[] = portals.items || [];

    const handleUpdatePortal = (idx: number, field: string, val: any) => {
      const next = [...items];
      next[idx] = { ...next[idx], [field]: val };
      onChange({ ...portals, items: next });
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Library Resource Portals</h3>
          <p className="text-xs text-slate-500">Configure E-Library databases, NDLI integration, and GU Institutional E-Repository.</p>
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
  }

  /* =========================================================
     5. HOURS & POLICY SECTION
  ========================================================= */
  if (sectionKey === "hours_policy") {
    const hours = body || {};
    const infoList: string[] = hours.importantInfo || [];

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Library Hours &amp; Contact Support</h3>
          <p className="text-xs text-slate-500">Configure operating days, daily timings, working days, and email.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Operating Days
            </label>
            <input
              type="text"
              value={hours.operatingDays || ""}
              onChange={(e) => onChange({ ...hours, operatingDays: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Daily Timings
            </label>
            <input
              type="text"
              value={hours.timings || ""}
              onChange={(e) => onChange({ ...hours, timings: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Working Days / Year
            </label>
            <input
              type="text"
              value={hours.workingDaysPerYear || ""}
              onChange={(e) => onChange({ ...hours, workingDaysPerYear: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Support Email
            </label>
            <input
              type="email"
              value={hours.supportEmail || ""}
              onChange={(e) => onChange({ ...hours, supportEmail: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
            />
          </div>
        </div>

        <CmsStringRepeater
          title="Important Information Guidelines"
          items={infoList}
          onChange={(next) => onChange({ ...hours, importantInfo: next })}
          placeholder="Enter policy guideline..."
        />
      </div>
    );
  }

  /* =========================================================
     6. LOAN RULES SECTION
  ========================================================= */
  if (sectionKey === "loan_rules") {
    const loanRules = body || {};
    const rules: any[] = loanRules.rules || [];

    const handleUpdateRule = (idx: number, field: string, val: any) => {
      const next = [...rules];
      next[idx] = { ...next[idx], [field]: val };
      onChange({ ...loanRules, rules: next });
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
      onChange({ ...loanRules, rules: next });
    };

    const handleRemoveRule = (idx: number) => {
      const next = rules.filter((_, i) => i !== idx).map((r, i) => ({ ...r, sn: i + 1 }));
      onChange({ ...loanRules, rules: next });
    };

    const handleMoveRule = (idx: number, direction: "up" | "down") => {
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= rules.length) return;
      const next = [...rules];
      const temp = next[idx];
      next[idx] = next[target];
      next[target] = temp;
      const renumbered = next.map((r, i) => ({ ...r, sn: i + 1 }));
      onChange({ ...loanRules, rules: renumbered });
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Library Loan Rules Policy Table</h3>
            <p className="text-xs text-slate-500">Member categories, max book allowances, and loan circulation durations.</p>
          </div>
          <button
            type="button"
            onClick={handleAddRule}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs self-start sm:self-auto transition"
          >
            <Plus className="h-4 w-4" /> Add Row
          </button>
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
                      className="w-full rounded-md border border-slate-200 px-2 py-1 text-xs text-[#0A1F44]"
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
              {rules.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    No loan rules configured. Click &ldquo;Add Row&rdquo; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* =========================================================
     7. CONTACT SECTION
  ========================================================= */
  if (sectionKey === "contact") {
    const contact = body || {};

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Librarian In-Charge Contact</h3>
          <p className="text-xs text-slate-500">Official contact card displayed at the bottom of the library page.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Librarian Name
            </label>
            <input
              type="text"
              value={contact.name || ""}
              onChange={(e) => onChange({ ...contact, name: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Designation
            </label>
            <input
              type="text"
              value={contact.designation || ""}
              onChange={(e) => onChange({ ...contact, designation: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Official Email
            </label>
            <input
              type="email"
              value={contact.email || ""}
              onChange={(e) => onChange({ ...contact, email: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={contact.phone || ""}
              onChange={(e) => onChange({ ...contact, phone: e.target.value })}
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
            value={contact.address || ""}
            onChange={(e) => onChange({ ...contact, address: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 text-xs text-slate-500">
      Select a valid library section to edit.
    </div>
  );
}
