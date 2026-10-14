"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProgramSectionAction } from "@/features/admin/programs/actions";
import { MediaPickerModal, MediaAssetItem } from "@/features/admin/departments/components/MediaPickerModal";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";
import { LearningSpaceItem } from "@/data/programs/courses/types";

interface LearningSpacesSectionEditorProps {
  programId: string;
  programName: string;
  learningSpacesData?: {
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
  programId,
  programName,
  learningSpacesData = {},
  mediaAssets = [],
  saved,
  error,
}: LearningSpacesSectionEditorProps) {
  const [eyebrow, setEyebrow] = useState(learningSpacesData.eyebrow || "World-Class Infrastructure");
  const [title, setTitle] = useState(learningSpacesData.title || `Specialized Learning Spaces for ${programName}`);
  const [description, setDescription] = useState(
    learningSpacesData.description || "State-of-the-art laboratory infrastructure and experiential computing hubs."
  );
  const [spaces, setSpaces] = useState<LearningSpaceItem[]>(
    learningSpacesData.spaces && learningSpacesData.spaces.length > 0
      ? learningSpacesData.spaces
      : [
          {
            title: "Advanced Computer Lab",
            description: "Equipped with high-performance workstations and modern software suites.",
            image: "/images/learning-spaces/lab-1.webp",
          },
        ]
  );

  const [activeSpaceIdx, setActiveSpaceIdx] = useState<number | null>(null);

  const handleAddSpace = () => {
    setSpaces([
      ...spaces,
      {
        title: "",
        description: "",
        image: "",
      },
    ]);
  };

  const handleUpdateSpace = (idx: number, field: keyof LearningSpaceItem, val: string) => {
    const next = [...spaces];
    next[idx] = { ...next[idx], [field]: val };
    setSpaces(next);
  };

  const handleRemoveSpace = (idx: number) => {
    setSpaces(spaces.filter((_, i) => i !== idx));
  };

  const payload = {
    eyebrow,
    title,
    description,
    spaces: spaces.filter((s) => s.title.trim().length > 0),
  };

  return (
    <div className="space-y-6">
      {saved ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          Learning spaces and campus laboratory facilities saved successfully.
        </div>
      ) : null}

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          {error}
        </div>
      ) : null}

      <form action={updateProgramSectionAction} className="space-y-6">
        <input type="hidden" name="id" value={programId} />
        <input type="hidden" name="section" value="learningSpaces" />
        <input type="hidden" name="payload" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
            Learning Spaces & Laboratory Facilities
          </h3>
          <p className="text-sm text-slate-500">
            Showcase classrooms, specialized studios, simulators, and laboratory infrastructure.
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Eyebrow Text
              </label>
              <input
                type="text"
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Section Heading
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Overview Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          {/* Spaces Repeater */}
          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Facility Spaces ({spaces.length})
                </h4>
                <p className="text-xs text-slate-500">Interactive gallery cards on the course page.</p>
              </div>
              <button
                type="button"
                onClick={handleAddSpace}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Facility Space
              </button>
            </div>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              {spaces.map((space, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#E8871A]">
                        Space #{idx + 1}
                      </span>
                      {spaces.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveSpace(idx)}
                          className="text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>

                    <input
                      type="text"
                      value={space.title}
                      onChange={(e) => handleUpdateSpace(idx, "title", e.target.value)}
                      placeholder="Space Name (e.g. IoT & Embedded Systems Lab)"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-slate-400"
                      required
                    />

                    <textarea
                      rows={2}
                      value={space.description || ""}
                      onChange={(e) => handleUpdateSpace(idx, "description", e.target.value)}
                      placeholder="Space description and equipment highlights..."
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-slate-400"
                    />

                    {/* Image selector */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={space.image}
                        onChange={(e) => handleUpdateSpace(idx, "image", e.target.value)}
                        placeholder="Image URL..."
                        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setActiveSpaceIdx(idx)}
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <ImageIcon className="h-3.5 w-3.5 text-slate-500" />
                        Select
                      </button>
                    </div>

                    {space.image ? (
                      <div className="relative h-28 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                        <Image
                          src={space.image}
                          alt={space.title || "Facility preview"}
                          fill
                          sizes="300px"
                          className="object-cover"
                          unoptimized={space.image.startsWith("http")}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <CmsSubmitButton label="Save Learning Spaces" loadingLabel="Saving..." />
        </div>
      </form>

      {/* Media Picker Modal */}
      {activeSpaceIdx !== null ? (
        <MediaPickerModal
          isOpen={true}
          onClose={() => setActiveSpaceIdx(null)}
          onSelect={(url) => {
            handleUpdateSpace(activeSpaceIdx, "image", url);
            setActiveSpaceIdx(null);
          }}
          mediaAssets={mediaAssets}
        />
      ) : null}
    </div>
  );
}
