"use client";

import React from "react";
import { CmsImagePreviewInput } from "./CmsFieldHelpers";
import { Globe, Save, Loader2, Sparkles, ExternalLink } from "lucide-react";

interface InstitutionalSeoEditorProps {
  pageSlug: string;
  pageTitle: string;
  seoData: any;
  onChange: (updatedSeo: any) => void;
  onSave: () => void;
  isSaving: boolean;
  publicUrl: string;
}

export function InstitutionalSeoEditor({
  pageSlug,
  pageTitle,
  seoData,
  onChange,
  onSave,
  isSaving,
  publicUrl,
}: InstitutionalSeoEditorProps) {
  const title = seoData?.title || "";
  const description = seoData?.description || "";
  const keywords = Array.isArray(seoData?.keywords)
    ? seoData.keywords.join(", ")
    : seoData?.keywords || "";
  const ogTitle = seoData?.ogTitle || "";
  const ogImage = seoData?.ogImage || "";
  const canonical = seoData?.canonical || `https://geetauniversity.edu.in${publicUrl}`;

  const titleLength = title.length;
  const descLength = description.length;

  const handleKeywordsChange = (val: string) => {
    const list = val.split(",").map((k) => k.trim()).filter(Boolean);
    onChange({
      ...seoData,
      keywords: list,
    });
  };

  return (
    <div className="space-y-8">
      {/* Search Engine Form */}
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
            Search Engine Optimization (SEO)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Configure how <strong className="text-slate-800">{pageTitle}</strong> appears in Google search results and web crawlers.
          </p>
        </div>

        <div className="space-y-5 max-w-3xl">
          {/* Meta Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Meta Title
              </label>
              <span
                className={`text-[11px] font-mono ${
                  titleLength > 65
                    ? "text-rose-500 font-bold"
                    : titleLength >= 40
                    ? "text-emerald-600 font-semibold"
                    : "text-slate-400"
                }`}
              >
                {titleLength} / 60 characters
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => onChange({ ...seoData, title: e.target.value })}
              placeholder={`e.g. ${pageTitle} | Geeta University Panipat, Delhi NCR`}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#0A1F44] focus:border-[#0A1F44] focus:outline-none focus:ring-1 focus:ring-[#0A1F44] transition"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Recommended length: 50–60 characters. Include primary keywords and institution name.
            </p>
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Meta Description
              </label>
              <span
                className={`text-[11px] font-mono ${
                  descLength > 165
                    ? "text-rose-500 font-bold"
                    : descLength >= 120
                    ? "text-emerald-600 font-semibold"
                    : "text-slate-400"
                }`}
              >
                {descLength} / 160 characters
              </span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => onChange({ ...seoData, description: e.target.value })}
              placeholder="Provide a compelling summary of this page for search engine users..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#0A1F44] focus:border-[#0A1F44] focus:outline-none focus:ring-1 focus:ring-[#0A1F44] transition"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Recommended length: 130–160 characters. Summarize key institutional points clearly.
            </p>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Search Keywords (Comma-separated)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => handleKeywordsChange(e.target.value)}
              placeholder="e.g. Geeta University, Anti Ragging, Student Welfare, Haryana"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#0A1F44] focus:border-[#0A1F44] focus:outline-none focus:ring-1 focus:ring-[#0A1F44] transition"
            />
            {Array.isArray(seoData?.keywords) && seoData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {seoData.keywords.map((kw: string, i: number) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-700 border border-slate-200"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Canonical URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Canonical URL
            </label>
            <input
              type="text"
              value={canonical}
              onChange={(e) => onChange({ ...seoData, canonical: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-700 focus:border-[#0A1F44] focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Social Media Sharing (OpenGraph) */}
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
            Social Media Sharing (OpenGraph)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Customize how link previews display on WhatsApp, LinkedIn, Twitter/X, and Facebook.
          </p>
        </div>

        <div className="space-y-5 max-w-3xl">
          {/* OpenGraph Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Social Share Title (og:title)
            </label>
            <input
              type="text"
              value={ogTitle}
              onChange={(e) => onChange({ ...seoData, ogTitle: e.target.value })}
              placeholder={title || pageTitle}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#0A1F44] focus:border-[#0A1F44] focus:outline-none focus:ring-1 focus:ring-[#0A1F44] transition"
            />
          </div>

          {/* OpenGraph Social Image */}
          <CmsImagePreviewInput
            label="Social Share Image (og:image)"
            value={ogImage}
            onChange={(url) => onChange({ ...seoData, ogImage: url })}
            placeholder="/images/og-share.webp"
            helpText="Recommended dimensions: 1200 x 630 pixels (JPG or WebP)."
          />
        </div>
      </div>

      {/* Live Social Share Card Mockup Preview */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#0A1F44]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
            Live Link Preview Mockup
          </h4>
        </div>

        <div className="max-w-md rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          {ogImage ? (
            <div className="relative aspect-video w-full bg-slate-100 overflow-hidden border-b border-slate-100">
              <img
                src={ogImage}
                alt={ogTitle || title || pageTitle}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-gradient-to-br from-[#0A1F44] to-[#1A3A6B] flex items-center justify-center p-6 text-center text-white border-b border-slate-100">
              <div>
                <p className="font-serif text-base font-bold">{pageTitle}</p>
                <p className="text-xs text-blue-200 mt-1">Geeta University</p>
              </div>
            </div>
          )}
          <div className="p-4 space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              geetauniversity.edu.in
            </span>
            <p className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
              {ogTitle || title || pageTitle}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              {description || "Explore official institutional information, resources, and guidelines at Geeta University."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
