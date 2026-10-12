"use client";

import React from "react";
import { Globe, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { SUPPORTED_LOCALES, LOCALE_LABELS, Locale, TranslationStatus } from "@/lib/i18n/localization";

interface CmsLanguageTabsProps {
  activeLocale: Locale;
  onSelectLocale: (locale: Locale) => void;
  statusMap?: Record<string, TranslationStatus>;
  onTranslateFromEnglish?: () => Promise<void>;
  isTranslating?: boolean;
  activeStatus?: TranslationStatus;
  onStatusChange?: (status: TranslationStatus) => void;
}

export function CmsLanguageTabs({
  activeLocale,
  onSelectLocale,
  statusMap = {},
  onTranslateFromEnglish,
  isTranslating = false,
  activeStatus = "PUBLISHED",
  onStatusChange,
}: CmsLanguageTabsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 mb-6 space-y-3 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        {/* Language Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mr-1">
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            <span>Language:</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
            {SUPPORTED_LOCALES.map((loc) => {
              const isActive = activeLocale === loc;
              const status = loc === "en" ? "PUBLISHED" : statusMap[loc] || "NOT_TRANSLATED";

              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => onSelectLocale(loc)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span>{LOCALE_LABELS[loc]}</span>
                  {loc === "en" ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Published" />
                  ) : status === "PUBLISHED" ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Published" />
                  ) : status === "DRAFT" ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" title="Draft" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300" title="Not translated" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Translation Action & Status Controls */}
        <div className="flex items-center gap-2.5">
          {activeLocale !== "en" && onTranslateFromEnglish && (
            <button
              type="button"
              onClick={onTranslateFromEnglish}
              disabled={isTranslating}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs disabled:opacity-50"
            >
              {isTranslating ? (
                <RefreshCw className="h-3 w-3 animate-spin text-slate-500" />
              ) : (
                <Sparkles className="h-3 w-3 text-[#E8871A]" />
              )}
              <span>{isTranslating ? "Translating..." : `Auto-translate from English`}</span>
            </button>
          )}

          {activeLocale !== "en" && onStatusChange && (
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500">Status:</span>
              <select
                value={activeStatus}
                onChange={(e) => onStatusChange(e.target.value as TranslationStatus)}
                className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Language Context Helper Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>
          {activeLocale === "en" ? (
            <span className="text-slate-600">
              Editing primary English source content.
            </span>
          ) : (
            <span className="text-slate-600">
              Editing {LOCALE_LABELS[activeLocale]} translation. Missing fields fallback to English.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Published
          </span>
          <span className="inline-flex items-center gap-1 text-amber-700">
            <AlertCircle className="h-3 w-3 text-amber-500" /> Draft
          </span>
        </div>
      </div>
    </div>
  );
}
