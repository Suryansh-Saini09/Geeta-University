"use client";

import { useState } from "react";
import { Save, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";

interface SpecialisationItem {
  title: string;
  desc?: string;
  points?: string[];
}

interface SpecialisationsSectionEditorProps {
  departmentId: string;
  specialisationsData: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    items?: SpecialisationItem[];
  };
  saved?: boolean;
  error?: string;
}

export function SpecialisationsSectionEditor({
  departmentId,
  specialisationsData,
  saved,
  error,
}: SpecialisationsSectionEditorProps) {
  const [eyebrow, setEyebrow] = useState(specialisationsData.eyebrow || "ACADEMIC EXCELLENCE");
  const [title, setTitle] = useState(specialisationsData.title || "Specialisations Offered");
  const [subtitle, setSubtitle] = useState(specialisationsData.subtitle || "");
  const [items, setItems] = useState<SpecialisationItem[]>(specialisationsData.items || []);

  const handleAddItem = () => {
    setItems([...items, { title: "", desc: "", points: [""] }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof SpecialisationItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleAddPoint = (itemIndex: number) => {
    const updated = [...items];
    const currentPoints = updated[itemIndex].points || [];
    updated[itemIndex].points = [...currentPoints, ""];
    setItems(updated);
  };

  const handlePointChange = (itemIndex: number, pointIndex: number, val: string) => {
    const updated = [...items];
    const currentPoints = [...(updated[itemIndex].points || [])];
    currentPoints[pointIndex] = val;
    updated[itemIndex].points = currentPoints;
    setItems(updated);
  };

  const handleRemovePoint = (itemIndex: number, pointIndex: number) => {
    const updated = [...items];
    const currentPoints = (updated[itemIndex].points || []).filter((_, i) => i !== pointIndex);
    updated[itemIndex].points = currentPoints;
    setItems(updated);
  };

  const payload = {
    eyebrow,
    title,
    subtitle,
    items: items.filter((it) => it.title.trim() !== ""),
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Specialisations updated successfully.
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
        <input type="hidden" name="section" value="specialisations" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
              Specialisations & Tracks
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Manage specialized study tracks, domains, and academic focus areas. Handle 0, 1, or multiple specialisations seamlessly.
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
                placeholder="SPECIALISATIONS"
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
                placeholder="Specialisations Offered"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white font-serif"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Choose from high-demand industry specialisations..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>
          </div>

          {/* Specialisations Cards */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#0A1F44]">
                Specialisation Tracks ({items.length})
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#0A1F44] hover:text-white transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Specialisation
              </button>
            </div>

            {items.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-xs font-medium text-slate-400">
                No specialisations currently added for this department. Click &quot;Add Specialisation&quot; to create one.
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Track #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Specialisation Title *
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleItemChange(idx, "title", e.target.value)}
                        placeholder="e.g. Artificial Intelligence & Machine Learning"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-300"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Description
                      </label>
                      <textarea
                        value={item.desc || ""}
                        onChange={(e) => handleItemChange(idx, "desc", e.target.value)}
                        rows={2}
                        placeholder="Overview of this specialisation..."
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-300"
                      />
                    </div>

                    {/* Key Highlights Points */}
                    <div className="sm:col-span-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-600">
                          Key Highlights / Points
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddPoint(idx)}
                          className="text-xs font-semibold text-slate-700 hover:underline"
                        >
                          + Add Point
                        </button>
                      </div>

                      {(item.points || []).map((pt, pIdx) => (
                        <div key={pIdx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={pt}
                            onChange={(e) => handlePointChange(idx, pIdx, e.target.value)}
                            placeholder={`Point ${pIdx + 1}`}
                            className="flex-1 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-slate-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePoint(idx, pIdx)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#F5A623]"
          >
            <Save className="h-4 w-4" />
            Save Specialisations
          </button>
        </div>
      </form>
    </div>
  );
}
