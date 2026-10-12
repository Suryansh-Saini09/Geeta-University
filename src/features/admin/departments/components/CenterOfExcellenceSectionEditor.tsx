"use client";

import { useState } from "react";
import { Save, CheckCircle2, AlertCircle, Award } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";

interface CenterOfExcellenceSectionEditorProps {
  departmentId: string;
  centerData?: any;
  saved?: boolean;
  error?: string;
}

export function CenterOfExcellenceSectionEditor({
  departmentId,
  centerData = {},
  saved,
  error,
}: CenterOfExcellenceSectionEditorProps) {
  const initialTitle =
    typeof centerData === "string"
      ? centerData
      : centerData?.title || "Centre of Excellence";
  const initialDesc = centerData?.description || "";

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDesc);

  const payload = {
    title,
    description,
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Centre of Excellence updated successfully.
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
        <input type="hidden" name="section" value="centerOfExcellence" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-slate-700" />
              <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                Centre of Excellence
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Highlight school-specific research centers, specialized computing hubs, and research excellence badges.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Centre Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Centre of Excellence in Computing"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white font-serif"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Centre Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="State-of-the-art facilities for robotics, intelligent systems, data sciences, and enterprise cloud solutions..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
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
            Save Centre of Excellence
          </button>
        </div>
      </form>
    </div>
  );
}
