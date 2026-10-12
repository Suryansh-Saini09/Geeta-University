"use client";

import { useState } from "react";
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Video } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";

interface VideoItem {
  id: string;
  title?: string;
}

interface CorporateConnectSectionEditorProps {
  departmentId: string;
  corporateConnectData?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    videos?: VideoItem[];
  };
  saved?: boolean;
  error?: string;
}

export function CorporateConnectSectionEditor({
  departmentId,
  corporateConnectData = {},
  saved,
  error,
}: CorporateConnectSectionEditorProps) {
  const [eyebrow, setEyebrow] = useState(
    corporateConnectData.eyebrow || "INDUSTRY SESSIONS & WORKSHOPS"
  );
  const [title, setTitle] = useState(corporateConnectData.title || "Corporate Connect");
  const [description, setDescription] = useState(
    corporateConnectData.description || ""
  );
  const [videos, setVideos] = useState<VideoItem[]>(corporateConnectData.videos || []);

  const handleAddVideo = () => {
    setVideos([...videos, { id: "", title: "" }]);
  };

  const handleRemoveVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleVideoChange = (index: number, field: keyof VideoItem, val: string) => {
    const updated = [...videos];
    updated[index] = { ...updated[index], [field]: val };
    setVideos(updated);
  };

  const payload = {
    eyebrow,
    title,
    description,
    videos: videos.filter((v) => v.id.trim() !== ""),
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Corporate Connect updated successfully.
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
        <input type="hidden" name="section" value="corporateConnect" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-slate-700" />
              <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                Corporate Connect & Video Sessions
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Manage YouTube video IDs and session titles for industry keynotes and tech summits.
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
                placeholder="INDUSTRY SESSIONS & WORKSHOPS"
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
                placeholder="Corporate Connect"
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
                placeholder="Watch interactive tech sessions, industry talks, and workshops..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>
          </div>

          {/* Videos List */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#0A1F44]">
                Video Sessions ({videos.length})
              </h4>
              <button
                type="button"
                onClick={handleAddVideo}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#0A1F44] hover:text-white transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Video Session
              </button>
            </div>

            {videos.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-xs font-medium text-slate-400">
                No video sessions added. Click &quot;Add Video Session&quot; to feature industry talks.
              </div>
            ) : (
              <div className="space-y-3">
                {videos.map((vid, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <span className="text-xs font-bold text-slate-700">#{idx + 1}</span>
                    <input
                      type="text"
                      value={vid.id}
                      onChange={(e) => handleVideoChange(idx, "id", e.target.value)}
                      placeholder="YouTube Video ID (e.g. FfF5LPxqH-Q)"
                      className="w-48 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono outline-none focus:border-slate-300"
                    />
                    <input
                      type="text"
                      value={vid.title || ""}
                      onChange={(e) => handleVideoChange(idx, "title", e.target.value)}
                      placeholder="Video Title (e.g. Executive Tech Talk)"
                      className="flex-1 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(idx)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
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
            Save Corporate Connect
          </button>
        </div>
      </form>
    </div>
  );
}
