"use client";

import { useState } from "react";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";

interface CtaSectionEditorProps {
  departmentId: string;
  ctaData: {
    heading?: string;
    quote?: string;
    paragraphs?: string[];
    applyLink?: string;
    helpline?: string;
    website?: string;
    campusAddress?: string;
  };
  saved?: boolean;
  error?: string;
}

export function CtaSectionEditor({
  departmentId,
  ctaData,
  saved,
  error,
}: CtaSectionEditorProps) {
  const [heading, setHeading] = useState(ctaData.heading || "Ready to Transform Your Future?");
  const [quote, setQuote] = useState(ctaData.quote || "");
  const [applyLink, setApplyLink] = useState(ctaData.applyLink || "#apply");
  const [helpline, setHelpline] = useState(ctaData.helpline || "1800-123-4567");
  const [website, setWebsite] = useState(ctaData.website || "www.geetauniversity.edu.in");
  const [campusAddress, setCampusAddress] = useState(ctaData.campusAddress || "NH-44, Delhi-NCR, Panipat, Haryana");

  const payload = {
    heading,
    quote,
    applyLink,
    helpline,
    website,
    campusAddress,
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Final Call To Action section updated successfully.
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
        <input type="hidden" name="section" value="cta" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
              Bottom Page Call To Action (CTA)
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Customize the closing banner, contact helpline, application links, and campus address.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                CTA Heading
              </label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="Ready to Start Your Educational Journey?"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white font-serif"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Inspirational Quote / Motto
              </label>
              <input
                type="text"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Join India's fastest growing innovation university..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Apply Link URL
              </label>
              <input
                type="text"
                value={applyLink}
                onChange={(e) => setApplyLink(e.target.value)}
                placeholder="#apply or https://admissions.geeta.edu.in"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Admissions Helpline Number
              </label>
              <input
                type="text"
                value={helpline}
                onChange={(e) => setHelpline(e.target.value)}
                placeholder="1800-123-4567"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Website Domain
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="www.geetauniversity.edu.in"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Campus Address
              </label>
              <input
                type="text"
                value={campusAddress}
                onChange={(e) => setCampusAddress(e.target.value)}
                placeholder="NH-44, Delhi-NCR, Panipat"
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
            Save Final CTA
          </button>
        </div>
      </form>
    </div>
  );
}
