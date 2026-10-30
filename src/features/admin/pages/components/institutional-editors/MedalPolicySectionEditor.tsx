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

export function MedalPolicySectionEditor({
  sectionKey,
  body = {},
  onChange,
}: SpecializedSectionEditorProps) {
  /* =========================================================
     1. ACADEMIC MEDALS
  ========================================================= */
  if (sectionKey === "academic_medals") {
    const medalsData = body || {};
    const medals: any[] = medalsData.medals || [];

    const handleUpdateMedal = (idx: number, field: string, val: any) => {
      const next = [...medals];
      next[idx] = { ...next[idx], [field]: val };
      onChange({ ...medalsData, medals: next });
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Academic Medals</h3>
          <p className="text-xs text-slate-500">Configure Gold, Silver, and Bronze medal eligibility rules.</p>
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
  }

  /* =========================================================
     2. THRESHOLDS (TABLE 1)
  ========================================================= */
  if (sectionKey === "thresholds") {
    const thresholdsData = body || {};
    const rows: any[] = thresholdsData.rows || thresholdsData.thresholds || [];
    const tableLabel = thresholdsData.tableLabel || "Table 1";
    const heading = thresholdsData.heading || thresholdsData.title || "Minimum Number of Passing Students Required in Batch";
    const description =
      thresholdsData.description ||
      "For the award of respective academic medals, the minimum number of students successfully passing in the batch must satisfy the following thresholds:";

    const handleUpdateMeta = (field: string, val: string) => {
      const currentRows = thresholdsData.rows || thresholdsData.thresholds || rows;
      const updated: Record<string, any> = {
        ...thresholdsData,
        [field]: val,
        rows: currentRows,
        thresholds: currentRows,
      };
      if (field === "heading") updated.title = val;
      if (field === "title") updated.heading = val;
      onChange(updated);
    };

    const handleUpdateRow = (idx: number, field: string, val: any) => {
      const next = [...rows];
      next[idx] = { ...next[idx], [field]: val };
      onChange({
        ...thresholdsData,
        tableLabel: thresholdsData.tableLabel || tableLabel,
        heading: thresholdsData.heading || thresholdsData.title || heading,
        title: thresholdsData.title || thresholdsData.heading || heading,
        description: thresholdsData.description || description,
        rows: next,
        thresholds: next,
      });
    };

    const handleAddRow = () => {
      const newRow = {
        medal: "New Medal Category",
        pg: "10 students",
        ug: "20 students",
        diploma: "20 students",
      };
      const next = [...rows, newRow];
      onChange({
        ...thresholdsData,
        tableLabel: thresholdsData.tableLabel || tableLabel,
        heading: thresholdsData.heading || thresholdsData.title || heading,
        title: thresholdsData.title || thresholdsData.heading || heading,
        description: thresholdsData.description || description,
        rows: next,
        thresholds: next,
      });
    };

    const handleDeleteRow = (idx: number) => {
      const next = rows.filter((_, i) => i !== idx);
      onChange({
        ...thresholdsData,
        tableLabel: thresholdsData.tableLabel || tableLabel,
        heading: thresholdsData.heading || thresholdsData.title || heading,
        title: thresholdsData.title || thresholdsData.heading || heading,
        description: thresholdsData.description || description,
        rows: next,
        thresholds: next,
      });
    };

    const handleMoveRow = (idx: number, direction: "up" | "down") => {
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= rows.length) return;
      const next = [...rows];
      const [moved] = next.splice(idx, 1);
      next.splice(targetIdx, 0, moved);
      onChange({
        ...thresholdsData,
        tableLabel: thresholdsData.tableLabel || tableLabel,
        heading: thresholdsData.heading || thresholdsData.title || heading,
        title: thresholdsData.title || thresholdsData.heading || heading,
        description: thresholdsData.description || description,
        rows: next,
        thresholds: next,
      });
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Table 1: Cohort Thresholds</h3>
          <p className="text-xs text-slate-500">Minimum number of passing students required in batch for awarding medals.</p>
        </div>

        {/* Table Heading & Descriptions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Table Label Badge
            </label>
            <input
              type="text"
              value={tableLabel}
              onChange={(e) => handleUpdateMeta("tableLabel", e.target.value)}
              placeholder="e.g. Table 1"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Section Heading
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => handleUpdateMeta("heading", e.target.value)}
              placeholder="e.g. Minimum Number of Passing Students Required in Batch"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Section Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => handleUpdateMeta("description", e.target.value)}
              placeholder="For the award of respective academic medals..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:outline-none focus:border-slate-400"
            />
          </div>
        </div>

        {/* Table Rows Management */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs space-y-3 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-serif text-base font-bold text-[#0A1F44]">
                Threshold Rows ({rows.length})
              </h4>
              <p className="text-xs text-slate-500">
                Configure student count requirements for each medal rank across PG, UG, and Diploma programs.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddRow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8871A] text-white text-xs font-bold hover:bg-[#F5A623] transition-colors self-start sm:self-auto shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Row</span>
            </button>
          </div>

          {rows.length === 0 ? (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <p className="text-xs font-semibold">No threshold rows configured.</p>
              <button
                type="button"
                onClick={handleAddRow}
                className="inline-flex items-center gap-1 text-xs text-[#E8871A] font-bold hover:underline"
              >
                <Plus className="h-3 w-3" />
                <span>Add your first row</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#0A1F44] text-white uppercase tracking-wider text-[11px] font-semibold">
                  <tr>
                    <th className="p-3 w-16 text-center">Order</th>
                    <th className="p-3">Medal Category</th>
                    <th className="p-3">Postgraduate (PG)</th>
                    <th className="p-3">Undergraduate (UG)</th>
                    <th className="p-3">Diploma Programs</th>
                    <th className="p-3 w-16 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-mono text-slate-400 font-bold text-[11px] w-4">
                            {idx + 1}
                          </span>
                          <div className="flex flex-col">
                            <button
                              type="button"
                              onClick={() => handleMoveRow(idx, "up")}
                              disabled={idx === 0}
                              title="Move Up"
                              className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveRow(idx, "down")}
                              disabled={idx === rows.length - 1}
                              title="Move Down"
                              className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <input
                          type="text"
                          value={row.medal || ""}
                          onChange={(e) => handleUpdateRow(idx, "medal", e.target.value)}
                          placeholder="e.g. Gold Medal"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#0A1F44] focus:outline-none focus:border-slate-400"
                        />
                      </td>

                      <td className="p-3">
                        <input
                          type="text"
                          value={row.pg || ""}
                          onChange={(e) => handleUpdateRow(idx, "pg", e.target.value)}
                          placeholder="e.g. 10 students"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                        />
                      </td>

                      <td className="p-3">
                        <input
                          type="text"
                          value={row.ug || ""}
                          onChange={(e) => handleUpdateRow(idx, "ug", e.target.value)}
                          placeholder="e.g. 20 students"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                        />
                      </td>

                      <td className="p-3">
                        <input
                          type="text"
                          value={row.diploma || ""}
                          onChange={(e) => handleUpdateRow(idx, "diploma", e.target.value)}
                          placeholder="e.g. 20 students"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                        />
                      </td>

                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(idx)}
                          title="Delete Row"
                          className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* =========================================================
     3. CHANCELLOR'S MEDAL
  ========================================================= */
  if (sectionKey === "chancellor") {
    const chancellorData = body || {};
    const overviewTitle = chancellorData.title || chancellorData.overviewHeading || "";
    const overviewDescription = chancellorData.description || chancellorData.overviewDescription || "";
    const criteriaList = chancellorData.criteria || chancellorData.qualificationPoints || [];

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Chancellor’s Medal Overview</h3>
          <p className="text-xs text-slate-500">Highest university honor for Best All-Rounder candidate.</p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Overview Title
          </label>
          <input
            type="text"
            value={overviewTitle}
            onChange={(e) =>
              onChange({
                ...chancellorData,
                title: e.target.value,
                overviewHeading: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Overview Description
          </label>
          <textarea
            rows={3}
            value={overviewDescription}
            onChange={(e) =>
              onChange({
                ...chancellorData,
                description: e.target.value,
                overviewDescription: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
          />
        </div>

        <CmsStringRepeater
          title="Eligibility & Qualification Points"
          items={criteriaList}
          onChange={(next) =>
            onChange({
              ...chancellorData,
              criteria: next,
              qualificationPoints: next,
            })
          }
          placeholder="e.g., Normal Course Duration (No Extension)..."
        />
      </div>
    );
  }

  /* =========================================================
     4. CHANCELLOR'S WEIGHTAGES
  ========================================================= */
  if (sectionKey === "chancellor_weightage") {
    const weightageData = body || {};
    const weightages: any[] = weightageData.categories || weightageData.weightages || [];
    const heading = weightageData.heading || weightageData.title || "Evaluation Weightage Breakdown";

    const handleUpdateHeading = (val: string) => {
      onChange({
        ...weightageData,
        heading: val,
        title: val,
        categories: weightageData.categories || weightageData.weightages || weightages,
        weightages: weightageData.categories || weightageData.weightages || weightages,
      });
    };

    const handleUpdateWeight = (idx: number, field: string, val: any) => {
      const next = [...weightages];
      next[idx] = { ...next[idx], [field]: val };
      onChange({
        ...weightageData,
        heading: weightageData.heading || weightageData.title || heading,
        title: weightageData.title || weightageData.heading || heading,
        categories: next,
        weightages: next,
      });
    };

    const handleAddWeight = () => {
      const newWeight = {
        category: "New Activity Category",
        weightage: "10%",
        percent: 10,
        iconKey: "award",
      };
      const next = [...weightages, newWeight];
      onChange({
        ...weightageData,
        heading: weightageData.heading || weightageData.title || heading,
        title: weightageData.title || weightageData.heading || heading,
        categories: next,
        weightages: next,
      });
    };

    const handleDeleteWeight = (idx: number) => {
      const next = weightages.filter((_, i) => i !== idx);
      onChange({
        ...weightageData,
        heading: weightageData.heading || weightageData.title || heading,
        title: weightageData.title || weightageData.heading || heading,
        categories: next,
        weightages: next,
      });
    };

    const totalPercent = weightages.reduce((sum, w) => sum + (Number(w.percent) || 0), 0);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Evaluation Weightage Breakdown</h3>
          <p className="text-xs text-slate-500">Categories and percentage weights totaling 100%.</p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Section Heading Title
          </label>
          <input
            type="text"
            value={heading}
            onChange={(e) => handleUpdateHeading(e.target.value)}
            placeholder="e.g. Evaluation Weightage Breakdown"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:outline-none focus:border-slate-400"
          />
        </div>

        {totalPercent !== 100 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-900">
            Notice: Total weightage is currently {totalPercent}%. It should normally sum to 100%.
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="font-serif text-base font-bold text-[#0A1F44]">
              Weightage Categories ({weightages.length})
            </h4>
            <button
              type="button"
              onClick={handleAddWeight}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8871A] text-white text-xs font-bold hover:bg-[#F5A623] transition-colors shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="space-y-3">
            {weightages.map((item, idx) => (
              <div key={item.category || idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
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
                <div className="flex items-center justify-end pt-4 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => handleDeleteWeight(idx)}
                    title="Delete Category"
                    className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     5. RANKERS DOCUMENT
  ========================================================= */
  if (sectionKey === "rankers_document") {
    const docData = body || {};

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Convocation Rankers PDF Document</h3>
          <p className="text-xs text-slate-500">Heading, description, and downloadable PDF link.</p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Section Heading
          </label>
          <input
            type="text"
            value={docData.title || ""}
            onChange={(e) => onChange({ ...docData, title: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={docData.description || ""}
            onChange={(e) => onChange({ ...docData, description: e.target.value })}
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
              value={docData.documentUrl || ""}
              onChange={(e) => onChange({ ...docData, documentUrl: e.target.value })}
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
              value={docData.ctaLabel || ""}
              onChange={(e) => onChange({ ...docData, ctaLabel: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
              placeholder="View Medal List PDF"
            />
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     6. HERO BANNER
  ========================================================= */
  if (sectionKey === "hero") {
    const hero = body || {};

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Hero Banner Settings</h3>
          <p className="text-xs text-slate-500">Page title and background overlay image.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Primary Title
            </label>
            <input
              type="text"
              value={hero.title || ""}
              onChange={(e) => onChange({ ...hero, title: e.target.value })}
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
              value={hero.highlight || ""}
              onChange={(e) => onChange({ ...hero, highlight: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
              placeholder="Medal Policy"
            />
          </div>
        </div>

        <CmsImagePreviewInput
          label="Hero Background Overlay Image"
          value={hero.bgImage || ""}
          onChange={(url) => onChange({ ...hero, bgImage: url })}
          placeholder="/uploads/all/224/conversions/new-building-3-full.webp"
        />
      </div>
    );
  }

  return (
    <div className="p-4 text-xs text-slate-500">
      Select a valid medal policy section to edit.
    </div>
  );
}
