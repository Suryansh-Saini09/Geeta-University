"use client";

import { useState } from "react";
import { Save, CheckCircle2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";
import { MediaPickerModal, MediaAssetItem } from "./MediaPickerModal";

interface DeanSectionEditorProps {
  departmentId: string;
  deanData: {
    name?: string;
    designation?: string;
    message?: string;
    image?: string;
    schoolName?: string;
  };
  mediaAssets?: MediaAssetItem[];
  saved?: boolean;
  error?: string;
}

export function DeanSectionEditor({
  departmentId,
  deanData,
  mediaAssets = [],
  saved,
  error,
}: DeanSectionEditorProps) {
  const [name, setName] = useState(deanData.name || "");
  const [designation, setDesignation] = useState(deanData.designation || "");
  const [message, setMessage] = useState(deanData.message || "");
  const [image, setImage] = useState(deanData.image || "");
  const [schoolName, setSchoolName] = useState(deanData.schoolName || "");

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const payload = {
    name,
    designation,
    message,
    image,
    schoolName,
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Dean & Leadership information updated successfully.
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
        <input type="hidden" name="section" value="dean" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
              Dean & Leadership Message
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Update the Dean/Head of School name, title, profile photo portrait, and official welcome message.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Dean Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Full Name"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Designation & Credentials
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="Dean & Professor, Ph.D."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                School / College Affiliation Name
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="School of Computer Science & Engineering"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2 space-y-3">
              <label className="block text-sm font-bold text-[#0A1F44]">
                Dean Portrait Photo
              </label>

              {image ? (
                <div className="relative h-44 w-36 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={name || "Dean portrait"}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/faculty/dean.jpg or image URL"
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
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

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Dean Message / Welcome Address
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Enter the Dean's message to prospective students..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-300 focus:bg-white"
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
            Save Dean's Message
          </button>
        </div>
      </form>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        mediaAssets={mediaAssets}
        onSelect={(url) => setImage(url)}
      />
    </div>
  );
}
