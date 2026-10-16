"use client";

import { useState } from "react";
import { Save, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";

interface StatItem {
  value: string;
  label: string;
}

interface PlacementSectionEditorProps {
  departmentId: string;
  placementData: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    avgPackage?: string;
    highestPackage?: string;
    heroNoteText?: string;
    stats?: StatItem[];
    recruiters?: any[];
  };
  saved?: boolean;
  error?: string;
}

export function PlacementSectionEditor({
  departmentId,
  placementData,
  saved,
  error,
}: PlacementSectionEditorProps) {
  const [eyebrow, setEyebrow] = useState(placementData.eyebrow || "CAREER SUCCESS");
  const [title, setTitle] = useState(placementData.title || "Placement & Career Highlights");
  const [subtitle, setSubtitle] = useState(placementData.subtitle || "");
  const [avgPackage, setAvgPackage] = useState(placementData.avgPackage || "");
  const [highestPackage, setHighestPackage] = useState(placementData.highestPackage || "");
  const [heroNoteText, setHeroNoteText] = useState(placementData.heroNoteText || "");
  
  const [stats, setStats] = useState<StatItem[]>(
    placementData.stats || [
      { value: "40 LPA", label: "Highest Package" },
      { value: "350+", label: "Top Recruiters" },
      { value: "95%", label: "Placement Rate" },
    ]
  );

  const initialRecruiters: string[] = (placementData.recruiters || []).map((r: any) => {
    if (typeof r === "string") return r;
    if (r && typeof r === "object" && typeof r.name === "string") return r.name;
    return String(r || "");
  });

  const [recruiters, setRecruiters] = useState<string[]>(
    initialRecruiters.length > 0
      ? initialRecruiters
      : ["Google", "Amazon", "Microsoft", "TCS", "Infosys"]
  );

  const handleAddStat = () => {
    setStats([...stats, { value: "", label: "" }]);
  };

  const handleRemoveStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const handleStatChange = (index: number, field: keyof StatItem, val: string) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: val };
    setStats(updated);
  };

  const handleAddRecruiter = () => {
    setRecruiters([...recruiters, ""]);
  };

  const handleRemoveRecruiter = (index: number) => {
    setRecruiters(recruiters.filter((_, i) => i !== index));
  };

  const handleRecruiterChange = (index: number, val: string) => {
    const updated = [...recruiters];
    updated[index] = val;
    setRecruiters(updated);
  };

  const payload = {
    eyebrow,
    title,
    subtitle,
    avgPackage,
    highestPackage,
    heroNoteText,
    stats: stats.filter((s) => (s.value || "").trim() !== "" || (s.label || "").trim() !== ""),
    recruiters: recruiters.filter((r) => typeof r === "string" && r.trim() !== ""),
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Placement statistics & recruiters updated successfully.
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600" />
          {error}
        </div>
      )}

      <form action={updateDepartmentSectionAction} className="space-y-6">
        <input type="hidden" name="id" value={departmentId} />
        <input type="hidden" name="section" value="placement" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
              Placement & Career Opportunities
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Manage highest/average package figures, recruiter lists, and placement statistics for the school.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Eyebrow
              </label>
              <input
                type="text"
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
                placeholder="PLACEMENT HIGHLIGHTS"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Section Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Placement & Career Highlights"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white font-serif"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Highest Package Offered
              </label>
              <input
                type="text"
                value={highestPackage}
                onChange={(e) => setHighestPackage(e.target.value)}
                placeholder="e.g. 40 LPA"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Average Package Offered
              </label>
              <input
                type="text"
                value={avgPackage}
                onChange={(e) => setAvgPackage(e.target.value)}
                placeholder="e.g. 6.5 LPA"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Placement Hero Note / Subtitle
              </label>
              <input
                type="text"
                value={heroNoteText}
                onChange={(e) => setHeroNoteText(e.target.value)}
                placeholder="Consistent track record of placements across Fortune 500 companies..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>
          </div>

          {/* Key Placement Stats */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#0A1F44]">
                Placement Key Statistics ({stats.length})
              </h4>
              <button
                type="button"
                onClick={handleAddStat}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#0A1F44] hover:text-white transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Stat
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((stat, idx) => (
                <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Stat #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStat(idx)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                    placeholder="Value (e.g. 500+)"
                    className="w-full rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold outline-none focus:border-slate-300"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                    placeholder="Label (e.g. Corporate Partners)"
                    className="w-full rounded border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-slate-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Top Recruiters */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#0A1F44]">
                Top Recruiting Partners ({recruiters.length})
              </h4>
              <button
                type="button"
                onClick={handleAddRecruiter}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#0A1F44] hover:text-white transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Recruiter
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {recruiters.map((rec, idx) => (
                <div key={idx} className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <input
                    type="text"
                    value={rec}
                    onChange={(e) => handleRecruiterChange(idx, e.target.value)}
                    placeholder="Company name"
                    className="w-32 border-none bg-transparent text-xs font-semibold text-slate-800 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRecruiter(idx)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#F5A623]"
          >
            <Save className="h-4 w-4" />
            Save Placement Data
          </button>
        </div>
      </form>
    </div>
  );
}
