"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProgramSectionAction } from "@/features/admin/programs/actions";
import { MediaPickerModal, MediaAssetItem } from "@/features/admin/departments/components/MediaPickerModal";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";
import { CourseSEO } from "@/data/programs/courses/types";

interface SeoSectionEditorProps {
  programId: string;
  programName: string;
  seoData?: CourseSEO;
  mediaAssets?: MediaAssetItem[];
  saved?: boolean;
  error?: string;
}

export function SeoSectionEditor({
  programId,
  programName,
  seoData,
  mediaAssets = [],
  saved,
  error,
}: SeoSectionEditorProps) {
  const [title, setTitle] = useState(seoData?.title || `${programName} | Geeta University`);
  const [description, setDescription] = useState(
    seoData?.description ||
      `Pursue ${programName} at Geeta University, Delhi-NCR. Discover curriculum, eligibility criteria, laboratory infrastructure, and top campus placement records.`
  );
  const [keywords, setKeywords] = useState(
    Array.isArray(seoData?.keywords)
      ? seoData.keywords.join(", ")
      : typeof seoData?.keywords === "string"
      ? seoData.keywords
      : `${programName}, Geeta University courses, admission 2026, top university panipat`
  );
  const [canonical, setCanonical] = useState(seoData?.canonical || "");
  const [ogImage, setOgImage] = useState(seoData?.ogImage || "");

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const payload = {
    title,
    description,
    keywords,
    canonical,
    ogImage,
  };

  return (
    <div className="space-y-6">
      {saved ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          SEO and social OpenGraph metadata saved to Aiven database and synchronized with SeoMetadata.
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
        <input type="hidden" name="section" value="seo" />
        <input type="hidden" name="payload" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
            SEO & Search Engine Metadata
          </h3>
          <p className="text-sm text-slate-500">
            Control Google search ranking tags, SERP snippets, canonical URLs, and social media share previews.
          </p>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Page Meta Title ({title.length} characters)
              </label>
              <span className={`text-xs ${title.length > 60 ? "text-amber-600" : "text-slate-400"}`}>
                Recommended: 50-60 chars
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Meta Description ({description.length} characters)
              </label>
              <span className={`text-xs ${description.length > 160 ? "text-amber-600" : "text-slate-400"}`}>
                Recommended: 140-160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Target SEO Keywords (Comma Separated)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. B.Tech Computer Science, Geeta University CSE, Engineering Admissions Haryana"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Canonical URL (Optional)
              </label>
              <input
                type="text"
                value={canonical}
                onChange={(e) => setCanonical(e.target.value)}
                placeholder="https://www.geetauniversity.edu.in/..."
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Social Share Image (OpenGraph Image)
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="text"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="/images/programs/... or https://..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  Select
                </button>
              </div>

              {ogImage ? (
                <div className="mt-2.5 relative h-24 w-44 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  <Image
                    src={ogImage}
                    alt="OG Image preview"
                    fill
                    sizes="176px"
                    className="object-cover"
                    unoptimized={ogImage.startsWith("http")}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <CmsSubmitButton label="Save SEO Metadata" loadingLabel="Saving..." />
        </div>
      </form>

      {/* Media Picker Modal */}
      {isMediaPickerOpen ? (
        <MediaPickerModal
          isOpen={true}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={(url) => {
            setOgImage(url);
            setIsMediaPickerOpen(false);
          }}
          mediaAssets={mediaAssets}
        />
      ) : null}
    </div>
  );
}
