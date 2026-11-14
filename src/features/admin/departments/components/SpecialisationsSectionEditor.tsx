"use client";

import { useState } from "react";
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";

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
  const [actionError, setActionError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleAddItem = () => {
    setIsDirty(true);
    setItems([...items, { title: "", desc: "", points: [""] }]);
  };

  const handleRemoveItem = (index: number) => {
    setIsDirty(true);
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof SpecialisationItem, value: any) => {
    setIsDirty(true);
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleAddPoint = (itemIndex: number) => {
    setIsDirty(true);
    const updated = [...items];
    const currentPoints = updated[itemIndex].points || [];
    updated[itemIndex].points = [...currentPoints, ""];
    setItems(updated);
  };

  const handlePointChange = (itemIndex: number, pointIndex: number, val: string) => {
    setIsDirty(true);
    const updated = [...items];
    const currentPoints = [...(updated[itemIndex].points || [])];
    currentPoints[pointIndex] = val;
    updated[itemIndex].points = currentPoints;
    setItems(updated);
  };

  const handleRemovePoint = (itemIndex: number, pointIndex: number) => {
    setIsDirty(true);
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

  const handleFormAction = async (formData: FormData) => {
    setActionError(null);
    try {
      await updateDepartmentSectionAction(formData);
    } catch (err: any) {
      if (err?.message?.includes("NEXT_REDIRECT")) {
        throw err;
      }
      const msg = (err?.message || "").toLowerCase();
      const digest = (err?.digest || "").toLowerCase();
      if (
        err?.name === "UnrecognizedActionError" ||
        msg.includes("was not found on the server") ||
        msg.includes("failed to find server action") ||
        digest.includes("unrecognizedactionerror")
      ) {
        setActionError(
          "The website was redeployed on the server while this editing session was active. Please refresh the page (Ctrl+F5) to synchronize with the new server version before saving."
        );
        return;
      }
      setActionError(err?.message || "Failed to save specialisations. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {saved && !isDirty && !actionError && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Specialisations updated successfully.
        </div>
      )}

      {(actionError || error) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <span>{actionError || error}</span>
          </div>
          {actionError?.includes("redeployed") && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition shrink-0 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh Page
            </button>
          )}
        </div>
      )}

      <form action={handleFormAction} className="space-y-6">
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
                onChange={(e) => {
                  setEyebrow(e.target.value);
                  setIsDirty(true);
                }}
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
                onChange={(e) => {
                  setTitle(e.target.value);
                  setIsDirty(true);
                }}
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
                onChange={(e) => {
                  setSubtitle(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Choose from high-demand industry specialisations..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#0A1F44]">
                Specialisation Cards ({items.length})
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Specialisation
              </button>
            </div>

            {items.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                No specialisations configured. Click &quot;Add Specialisation&quot; to create your first track.
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-4 transition hover:border-slate-300"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Track #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleItemChange(idx, "title", e.target.value)}
                        placeholder="e.g. Artificial Intelligence & Machine Learning"
                        className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-slate-300"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Description
                      </label>
                      <textarea
                        value={item.desc || ""}
                        onChange={(e) => handleItemChange(idx, "desc", e.target.value)}
                        placeholder="Brief summary of this specialized track..."
                        rows={2}
                        className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-slate-300 resize-none"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700">
                          Bullet Points / Features
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddPoint(idx)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                          Add Point
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
                            className="text-slate-400 hover:text-red-500 cursor-pointer"
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
          <CmsSubmitButton
            label="Save Specialisations"
            loadingLabel="Saving Specialisations..."
            iconType="save"
          />
        </div>
      </form>
    </div>
  );
}
