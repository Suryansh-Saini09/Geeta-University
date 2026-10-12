"use client";

import { useState } from "react";
import { Save, CheckCircle2, AlertCircle, FileText, Image as ImageIcon } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";
import { MediaPickerModal, MediaAssetItem } from "./MediaPickerModal";

interface BrochureSectionEditorProps {
  departmentId: string;
  brochureData?: {
    title?: string;
    description?: string;
    fileUrl?: string;
    fileName?: string;
  };
  mediaAssets?: MediaAssetItem[];
  saved?: boolean;
  error?: string;
}

export function BrochureSectionEditor({
  departmentId,
  brochureData = {},
  mediaAssets = [],
  saved,
  error,
}: BrochureSectionEditorProps) {
  const [title, setTitle] = useState(brochureData.title || "Want to know more?");
  const [description, setDescription] = useState(brochureData.description || "");
  const [fileUrl, setFileUrl] = useState(brochureData.fileUrl || "");
  const [fileName, setFileName] = useState(brochureData.fileName || "");

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const payload = {
    title,
    description,
    fileUrl,
    fileName,
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Brochure download settings updated successfully.
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
        <input type="hidden" name="section" value="brochure" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-700" />
              <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                School Brochure & Prospectus Download
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Configure brochure title, description summary, PDF download file URL, and download filename.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Section Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Want to know more?"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white font-serif"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Brochure Download Filename
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="School_of_Computer_Science_Brochure.pdf"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Brochure Description Text
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Download the official brochure for detailed information on programs..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2 space-y-3">
              <label className="block text-sm font-bold text-[#0A1F44]">
                Brochure PDF Document URL
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://geetauniversity.edu.in/uploads/pdf/GU-Brochure.pdf"
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-mono outline-none transition focus:border-slate-300 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-700"
                >
                  <ImageIcon className="h-4 w-4" />
                  Media Library
                </button>
              </div>
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
            Save Brochure Settings
          </button>
        </div>
      </form>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        mediaAssets={mediaAssets}
        onSelect={(url) => setFileUrl(url)}
      />
    </div>
  );
}
