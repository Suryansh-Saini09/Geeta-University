"use client";

import { useState } from "react";
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";
import { MediaPickerModal, MediaAssetItem } from "./MediaPickerModal";
import { CmsImageField } from "@/components/admin/CmsImageField";

interface AboutSectionEditorProps {
  departmentId: string;
  aboutData: {
    title?: string;
    eyebrow?: string;
    subtitle?: string;
    paragraphs?: string[];
    image?: string;
    badgeText?: string;
    closingText?: string;
  };
  mediaAssets?: MediaAssetItem[];
  saved?: boolean;
  error?: string;
}

export function AboutSectionEditor({
  departmentId,
  aboutData,
  mediaAssets = [],
  saved,
  error,
}: AboutSectionEditorProps) {
  const [title, setTitle] = useState(aboutData.title || "About the School");
  const [eyebrow, setEyebrow] = useState(aboutData.eyebrow || "OVERVIEW");
  const [subtitle, setSubtitle] = useState(aboutData.subtitle || "");
  const [paragraphs, setParagraphs] = useState<string[]>(
    aboutData.paragraphs && aboutData.paragraphs.length > 0
      ? aboutData.paragraphs
      : [""]
  );
  const [image, setImage] = useState(aboutData.image || "");
  const [badgeText, setBadgeText] = useState(aboutData.badgeText || "");
  const [closingText, setClosingText] = useState(aboutData.closingText || "");

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const handleAddParagraph = () => {
    setParagraphs([...paragraphs, ""]);
  };

  const handleRemoveParagraph = (index: number) => {
    if (paragraphs.length <= 1) return;
    setParagraphs(paragraphs.filter((_, i) => i !== index));
  };

  const handleParagraphChange = (index: number, val: string) => {
    const updated = [...paragraphs];
    updated[index] = val;
    setParagraphs(updated);
  };

  const payload = {
    title,
    eyebrow,
    subtitle,
    paragraphs: paragraphs.filter((p) => p.trim() !== ""),
    image,
    badgeText,
    closingText,
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          About Section updated successfully.
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
        <input type="hidden" name="section" value="about" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
              About & Introduction Content
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Manage descriptive paragraphs, overview headings, and feature imagery for the school intro section.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Eyebrow Label
              </label>
              <input
                type="text"
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
                placeholder="ABOUT THE SCHOOL"
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
                placeholder="Empowering Tomorrow's Leaders"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white font-serif"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Subtitle / Secondary Kicker
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Leading academic excellence and world-class research..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            {/* Paragraphs List */}
            <div className="sm:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#0A1F44]">
                  Content Paragraphs ({paragraphs.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddParagraph}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#0A1F44] hover:text-white transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Paragraph
                </button>
              </div>

              {paragraphs.map((p, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <span className="text-xs font-bold text-slate-400">
                      Paragraph {idx + 1}
                    </span>
                    <textarea
                      value={p}
                      onChange={(e) => handleParagraphChange(idx, e.target.value)}
                      rows={3}
                      placeholder={`Enter text for paragraph ${idx + 1}...`}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm leading-6 outline-none transition focus:border-slate-300 focus:bg-white"
                    />
                  </div>
                  {paragraphs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveParagraph(idx)}
                      className="mt-6 self-start rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                      title="Remove paragraph"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="sm:col-span-2">
              <CmsImageField
                label="Featured Section Image"
                value={image}
                onChange={(url) => setImage(url)}
                contentArea="departments"
                section="about"
                placeholder="/images/schools/about.jpg"
                helpText="Featured visual image for the school about section."
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Image Highlight Badge
              </label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="e.g. 100% Placement Record"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Closing Summary Text
              </label>
              <input
                type="text"
                value={closingText}
                onChange={(e) => setClosingText(e.target.value)}
                placeholder="Optional closing quote or key takeaway"
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
            Save About Section
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
