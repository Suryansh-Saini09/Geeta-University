"use client";

import { useState } from "react";
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";
import { MediaPickerModal, MediaAssetItem } from "./MediaPickerModal";

interface LearningSpaceItem {
  title?: string;
  desc?: string;
  image?: string;
}

interface LearningSpacesSectionEditorProps {
  departmentId: string;
  spacesData: {
    eyebrow?: string;
    title?: string;
    description?: string;
    spaces?: LearningSpaceItem[];
  };
  mediaAssets?: MediaAssetItem[];
  saved?: boolean;
  error?: string;
}

export function LearningSpacesSectionEditor({
  departmentId,
  spacesData,
  mediaAssets = [],
  saved,
  error,
}: LearningSpacesSectionEditorProps) {
  const [eyebrow, setEyebrow] = useState(spacesData.eyebrow || "INFRASTRUCTURE & LABS");
  const [title, setTitle] = useState(spacesData.title || "Learning Spaces & Facilities");
  const [description, setDescription] = useState(spacesData.description || "");
  const [spaces, setSpaces] = useState<LearningSpaceItem[]>(spacesData.spaces || []);

  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);

  const handleAddSpace = () => {
    setSpaces([...spaces, { title: "", desc: "", image: "" }]);
  };

  const handleRemoveSpace = (index: number) => {
    setSpaces(spaces.filter((_, i) => i !== index));
  };

  const handleSpaceChange = (index: number, field: keyof LearningSpaceItem, val: string) => {
    const updated = [...spaces];
    updated[index] = { ...updated[index], [field]: val };
    setSpaces(updated);
  };

  const payload = {
    eyebrow,
    title,
    description,
    spaces: spaces.filter((s) => (s.title || "").trim() !== "" || (s.image || "").trim() !== ""),
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Learning Spaces updated successfully.
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
        <input type="hidden" name="section" value="learningSpaces" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
              Learning Spaces & Campus Infrastructure
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Showcase school-specific laboratories, smart classrooms, research centers, and campus facilities.
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
                placeholder="INFRASTRUCTURE"
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
                placeholder="Learning Spaces & Facilities"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white font-serif"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Section Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="State-of-the-art facilities equipped with modern equipment..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#0A1F44]">
                Facilities & Labs ({spaces.length})
              </h4>
              <button
                type="button"
                onClick={handleAddSpace}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#0A1F44] hover:text-white transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Learning Space
              </button>
            </div>

            {spaces.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-xs font-medium text-slate-400">
                No learning spaces defined. Click &quot;Add Learning Space&quot; to highlight campus facilities.
              </div>
            ) : (
              spaces.map((space, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Facility #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpace(idx)}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Space / Lab Title
                      </label>
                      <input
                        type="text"
                        value={space.title || ""}
                        onChange={(e) => handleSpaceChange(idx, "title", e.target.value)}
                        placeholder="e.g. AI & Robotics Lab"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex-1">
                        <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                          Photo URL
                        </label>
                        <input
                          type="text"
                          value={space.image || ""}
                          onChange={(e) => handleSpaceChange(idx, "image", e.target.value)}
                          placeholder="/images/labs/ai.jpg"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveMediaIndex(idx)}
                        className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-700"
                      >
                        <ImageIcon className="h-3.5 w-3.5" />
                        Pick
                      </button>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Description
                      </label>
                      <textarea
                        value={space.desc || ""}
                        onChange={(e) => handleSpaceChange(idx, "desc", e.target.value)}
                        rows={2}
                        placeholder="High-performance GPU servers, high-speed networking..."
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
                      />
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
            Save Learning Spaces
          </button>
        </div>
      </form>

      <MediaPickerModal
        isOpen={activeMediaIndex !== null}
        onClose={() => setActiveMediaIndex(null)}
        mediaAssets={mediaAssets}
        onSelect={(url) => {
          if (activeMediaIndex !== null) {
            handleSpaceChange(activeMediaIndex, "image", url);
          }
        }}
      />
    </div>
  );
}
