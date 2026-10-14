"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProgramSectionAction } from "@/features/admin/programs/actions";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";

interface AdmissionsSectionEditorProps {
  programId: string;
  programName: string;
  admissionData?: {
    eligibility?: string;
    whyChooseHeading?: string;
    whyChooseParagraphs?: string[];
    applicationUrl?: string;
    process?: string[];
  };
  saved?: boolean;
  error?: string;
}

export function AdmissionsSectionEditor({
  programId,
  programName,
  admissionData = {},
  saved,
  error,
}: AdmissionsSectionEditorProps) {
  const [eligibility, setEligibility] = useState(admissionData.eligibility || "");
  const [whyChooseHeading, setWhyChooseHeading] = useState(admissionData.whyChooseHeading || `Why Study ${programName} at Geeta?`);
  const [whyChooseParagraphs, setWhyChooseParagraphs] = useState<string[]>(
    admissionData.whyChooseParagraphs && admissionData.whyChooseParagraphs.length > 0
      ? admissionData.whyChooseParagraphs
      : [""]
  );
  const [applicationUrl, setApplicationUrl] = useState(admissionData.applicationUrl || "/admissions");
  const [process, setProcess] = useState<string[]>(
    admissionData.process && admissionData.process.length > 0
      ? admissionData.process
      : [
          "Submit Online Application",
          "Verification of Academic Credentials",
          "Merit Assessment / Entrance Counselling",
          "Seat Allotment & Provisional Admission",
        ]
  );

  const handleAddWhyParagraph = () => setWhyChooseParagraphs([...whyChooseParagraphs, ""]);
  const handleUpdateWhyParagraph = (idx: number, val: string) => {
    const next = [...whyChooseParagraphs];
    next[idx] = val;
    setWhyChooseParagraphs(next);
  };
  const handleRemoveWhyParagraph = (idx: number) => {
    setWhyChooseParagraphs(whyChooseParagraphs.filter((_, i) => i !== idx));
  };

  const handleAddProcessStep = () => setProcess([...process, ""]);
  const handleUpdateProcessStep = (idx: number, val: string) => {
    const next = [...process];
    next[idx] = val;
    setProcess(next);
  };
  const handleRemoveProcessStep = (idx: number) => {
    setProcess(process.filter((_, i) => i !== idx));
  };

  const payload = {
    eligibility,
    whyChooseHeading,
    whyChooseParagraphs: whyChooseParagraphs.filter((p) => p.trim().length > 0),
    applicationUrl,
    process: process.filter((s) => s.trim().length > 0),
  };

  return (
    <div className="space-y-6">
      {saved ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          Admissions, Eligibility criteria, and Application instructions saved successfully.
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
        <input type="hidden" name="section" value="admissions" />
        <input type="hidden" name="payload" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
            Admissions & Eligibility Criteria
          </h3>
          <p className="text-sm text-slate-500">
            Define entry prerequisites, admission procedure steps, and application portal links.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Detailed Eligibility Requirements
            </label>
            <textarea
              rows={4}
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              placeholder="e.g. Candidates must have passed 10+2 examination from recognized Board with minimum 50% marks in aggregate with Physics and Mathematics..."
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Admission Application URL
            </label>
            <input
              type="text"
              value={applicationUrl}
              onChange={(e) => setApplicationUrl(e.target.value)}
              placeholder="/admissions or https://admissions.geetauniversity.edu.in"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          {/* Admission Process Steps */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Step-by-Step Admission Process ({process.length})
              </label>
              <button
                type="button"
                onClick={handleAddProcessStep}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#E8871A] hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Step
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {process.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleUpdateProcessStep(idx, e.target.value)}
                    placeholder={`Step ${idx + 1} instruction...`}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                  {process.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveProcessStep(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Sub-heading and paragraphs */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Admission Callout Heading
              </label>
              <input
                type="text"
                value={whyChooseHeading}
                onChange={(e) => setWhyChooseHeading(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Callout Explanation Paragraphs
                </label>
                <button
                  type="button"
                  onClick={handleAddWhyParagraph}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#E8871A] hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Paragraph
                </button>
              </div>

              <div className="mt-2 space-y-2.5">
                {whyChooseParagraphs.map((para, idx) => (
                  <div key={idx} className="flex gap-2">
                    <textarea
                      rows={2}
                      value={para}
                      onChange={(e) => handleUpdateWhyParagraph(idx, e.target.value)}
                      placeholder="Admission perspective note..."
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />
                    {whyChooseParagraphs.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveWhyParagraph(idx)}
                        className="self-center p-2 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <CmsSubmitButton label="Save Admissions Information" loadingLabel="Saving..." />
        </div>
      </form>
    </div>
  );
}
