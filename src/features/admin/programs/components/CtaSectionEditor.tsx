"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { updateProgramSectionAction } from "@/features/admin/programs/actions";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";
import { CourseCTAData } from "@/data/programs/courses/types";

interface CtaSectionEditorProps {
  programId: string;
  programName: string;
  ctaData?: CourseCTAData;
  saved?: boolean;
  error?: string;
}

export function CtaSectionEditor({
  programId,
  programName,
  ctaData,
  saved,
  error,
}: CtaSectionEditorProps) {
  const [title, setTitle] = useState(ctaData?.title || "Shape Your Future at Geeta University");
  const [heading, setHeading] = useState(ctaData?.heading || `Begin Your Journey in ${programName}`);
  const [description, setDescription] = useState(
    ctaData?.description ||
      "Admissions are open for the upcoming academic session. Connect with our counselors or submit your online application today."
  );
  const [applyUrl, setApplyUrl] = useState(ctaData?.applyUrl || "/admissions");
  const [brochureUrl, setBrochureUrl] = useState(ctaData?.brochureUrl || "");
  const [helpline, setHelpline] = useState(ctaData?.helpline || "+91 99960 51000");

  const payload = {
    title,
    heading,
    description,
    applyUrl,
    brochureUrl,
    helpline,
  };

  return (
    <div className="space-y-6">
      {saved ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          Final Call to Action section saved successfully.
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
        <input type="hidden" name="section" value="cta" />
        <input type="hidden" name="payload" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
            Final Call-to-Action (CTA) Banner
          </h3>
          <p className="text-sm text-slate-500">
            The prominent closing section at the bottom of the course page driving student applications.
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Primary CTA Heading
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Secondary Heading / Eyebrow
              </label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Supporting Lead Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Apply Online URL
              </label>
              <input
                type="text"
                value={applyUrl}
                onChange={(e) => setApplyUrl(e.target.value)}
                placeholder="/admissions"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Brochure Download URL (Optional)
              </label>
              <input
                type="text"
                value={brochureUrl}
                onChange={(e) => setBrochureUrl(e.target.value)}
                placeholder="/downloads/course-brochure.pdf"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Admission Helpline / Phone
              </label>
              <input
                type="text"
                value={helpline}
                onChange={(e) => setHelpline(e.target.value)}
                placeholder="+91 99960 51000"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <CmsSubmitButton label="Save CTA Banner" loadingLabel="Saving..." />
        </div>
      </form>
    </div>
  );
}
