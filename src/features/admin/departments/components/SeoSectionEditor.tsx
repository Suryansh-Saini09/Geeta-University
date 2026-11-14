"use client";

import { useState } from "react";
import { Save, CheckCircle2, AlertCircle, Globe } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";

interface SeoSectionEditorProps {
  departmentId: string;
  departmentName: string;
  seoData: {
    title?: string;
    description?: string;
    keywords?: string[] | string;
  };
  saved?: boolean;
  error?: string;
}

export function SeoSectionEditor({
  departmentId,
  departmentName,
  seoData,
  saved,
  error,
}: SeoSectionEditorProps) {
  const [title, setTitle] = useState(seoData.title || `${departmentName} | Geeta University`);
  const [description, setDescription] = useState(seoData.description || "");
  const [keywords, setKeywords] = useState(
    Array.isArray(seoData.keywords)
      ? seoData.keywords.join(", ")
      : seoData.keywords || ""
  );

  const payload = {
    title,
    description,
    keywords,
  };

  const descLength = description.length;
  const isDescWarning = descLength > 160;

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          SEO metadata updated successfully. Search engines revalidated.
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
        <input type="hidden" name="section" value="seo" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-slate-700" />
              <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                Search Engine Optimization (SEO)
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Configure search engine titles, meta descriptions, and indexing keywords for high ranking visibility.
            </p>
          </div>

          <div className="grid gap-5">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Page Title Tag
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Best Computer Science Engineering College in Delhi NCR"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
              <p className="mt-1 text-xs text-slate-400">
                Recommended length: 50-60 characters.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-bold text-[#0A1F44]">
                  Meta Description Tag
                </label>
                <span
                  className={`text-xs font-semibold ${
                    isDescWarning ? "text-amber-600" : "text-slate-400"
                  }`}
                >
                  {descLength} / 160 characters
                </span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief summary appearing in Google search result snippets..."
                className={`w-full rounded-lg border bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:bg-white ${
                  isDescWarning
                    ? "border-amber-300 focus:border-amber-500"
                    : "border-slate-200 focus:border-slate-300"
                }`}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="computer science, btech cse, geeta university, admissions 2026"
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
            Save SEO Metadata
          </button>
        </div>
      </form>
    </div>
  );
}
