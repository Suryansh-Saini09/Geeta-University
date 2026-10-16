"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProgramSectionAction } from "@/features/admin/programs/actions";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";
import { CourseScholarshipsData } from "@/data/programs/courses/types";

interface ScholarshipsSectionEditorProps {
  programId: string;
  programName: string;
  scholarshipsData?: CourseScholarshipsData;
  saved?: boolean;
  error?: string;
}

export function ScholarshipsSectionEditor({
  programId,
  scholarshipsData,
  saved,
  error,
}: ScholarshipsSectionEditorProps) {
  // Scholarships Block
  const [scholarshipTitle, setScholarshipTitle] = useState(
    scholarshipsData?.scholarships?.title || "Merit & Academic Scholarships"
  );
  const [scholarshipDesc, setScholarshipDesc] = useState(
    scholarshipsData?.scholarships?.description ||
      "Geeta University rewards academic brilliance, sports achievement, and socioeconomic equity with generous fee concessions."
  );
  const [criteria, setCriteria] = useState<string[]>(
    scholarshipsData?.scholarships?.criteria && scholarshipsData.scholarships.criteria.length > 0
      ? scholarshipsData.scholarships.criteria
      : [
          "Up to 100% tuition fee waiver for 95%+ marks in qualifying examinations",
          "50% scholarship for 85% to 94.9% marks",
          "Special concessions for national and state sports medalists",
        ]
  );
  const [scholarshipLinkText, setScholarshipLinkText] = useState(
    scholarshipsData?.scholarships?.linkText || "View Scholarship Policy"
  );
  const [scholarshipLinkUrl, setScholarshipLinkUrl] = useState(
    scholarshipsData?.scholarships?.linkUrl || "/admissions/scholarships"
  );

  // GUTS (Geeta University Talent Search) Block
  const [gutsTitle, setGutsTitle] = useState(
    scholarshipsData?.guts?.title || "G.U.T.S. (Geeta University Talent Search Examination)"
  );
  const [gutsSubtitle, setGutsSubtitle] = useState(
    scholarshipsData?.guts?.subtitle || "National Level Scholarship Test"
  );
  const [gutsDesc, setGutsDesc] = useState(
    scholarshipsData?.guts?.description ||
      "Appear for GUTS online or offline to secure scholarships worth up to ₹11 Crores across degree courses."
  );
  const [gutsLinkText, setGutsLinkText] = useState(scholarshipsData?.guts?.linkText || "Apply for GUTS Exam");
  const [gutsLinkUrl, setGutsLinkUrl] = useState(scholarshipsData?.guts?.linkUrl || "/guts");

  const handleAddCriteria = () => setCriteria([...criteria, ""]);
  const handleUpdateCriteria = (idx: number, val: string) => {
    const next = [...criteria];
    next[idx] = val;
    setCriteria(next);
  };
  const handleRemoveCriteria = (idx: number) => {
    setCriteria(criteria.filter((_, i) => i !== idx));
  };

  const payload = {
    scholarships: {
      title: scholarshipTitle,
      description: scholarshipDesc,
      criteria: criteria.filter((c) => c.trim().length > 0),
      linkText: scholarshipLinkText,
      linkUrl: scholarshipLinkUrl,
    },
    guts: {
      title: gutsTitle,
      subtitle: gutsSubtitle,
      description: gutsDesc,
      linkText: gutsLinkText,
      linkUrl: gutsLinkUrl,
    },
  };

  return (
    <div className="space-y-6">
      {saved ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          Scholarships and GUTS examination details saved successfully.
        </div>
      ) : null}

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          {error}
        </div>
      ) : null}

      <form action={updateProgramSectionAction} className="space-y-8">
        <input type="hidden" name="id" value={programId} />
        <input type="hidden" name="section" value="scholarships" />
        <input type="hidden" name="payload" value={JSON.stringify(payload)} />

        {/* Scholarships Block */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
            Merit & Category Scholarships
          </h3>
          <p className="text-sm text-slate-500">
            Define institutional scholarship slabs, eligibility bands, and policy links.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Scholarship Heading
            </label>
            <input
              type="text"
              value={scholarshipTitle}
              onChange={(e) => setScholarshipTitle(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Scholarship Policy Summary
            </label>
            <textarea
              rows={2}
              value={scholarshipDesc}
              onChange={(e) => setScholarshipDesc(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          {/* Criteria Repeater */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Merit Slabs & Criteria ({criteria.length})
              </label>
              <button
                type="button"
                onClick={handleAddCriteria}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#E8871A] hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Slab
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {criteria.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleUpdateCriteria(idx, e.target.value)}
                    placeholder="Criteria or scholarship percentage slab..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                  {criteria.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveCriteria(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Link Button Label
              </label>
              <input
                type="text"
                value={scholarshipLinkText}
                onChange={(e) => setScholarshipLinkText(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Link URL
              </label>
              <input
                type="text"
                value={scholarshipLinkUrl}
                onChange={(e) => setScholarshipLinkUrl(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </div>

        {/* GUTS Block */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
            G.U.T.S. (Geeta University Talent Search)
          </h3>
          <p className="text-sm text-slate-500">
            National entrance scholarship examination callout for prospective applicants.
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                GUTS Title
              </label>
              <input
                type="text"
                value={gutsTitle}
                onChange={(e) => setGutsTitle(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                GUTS Subtitle
              </label>
              <input
                type="text"
                value={gutsSubtitle}
                onChange={(e) => setGutsSubtitle(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              GUTS Examination Overview
            </label>
            <textarea
              rows={2}
              value={gutsDesc}
              onChange={(e) => setGutsDesc(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                GUTS Button Text
              </label>
              <input
                type="text"
                value={gutsLinkText}
                onChange={(e) => setGutsLinkText(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                GUTS Button Link
              </label>
              <input
                type="text"
                value={gutsLinkUrl}
                onChange={(e) => setGutsLinkUrl(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <CmsSubmitButton label="Save Scholarships" loadingLabel="Saving..." />
        </div>
      </form>
    </div>
  );
}
