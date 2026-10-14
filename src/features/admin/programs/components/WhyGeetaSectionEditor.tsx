"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProgramSectionAction } from "@/features/admin/programs/actions";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";
import { WhyGeetaReason } from "@/data/programs/courses/types";

interface WhyGeetaSectionEditorProps {
  programId: string;
  programName: string;
  whyGeetaData?: {
    title?: string;
    intro?: string;
    paragraphs?: string[];
    reasons?: WhyGeetaReason[];
  };
  saved?: boolean;
  error?: string;
}

export function WhyGeetaSectionEditor({
  programId,
  programName,
  whyGeetaData = {},
  saved,
  error,
}: WhyGeetaSectionEditorProps) {
  const [title, setTitle] = useState(whyGeetaData.title || `Why Choose Geeta University for ${programName}?`);
  const [intro, setIntro] = useState(whyGeetaData.intro || "");
  const [reasons, setReasons] = useState<WhyGeetaReason[]>(
    whyGeetaData.reasons && whyGeetaData.reasons.length > 0
      ? whyGeetaData.reasons
      : [
          { title: "Industry-Driven Curriculum", description: "Aligned with modern industry requirements and certifications." },
          { title: "Advanced Labs & Learning Spaces", description: "High-tech computing facilities, simulation centers, and smart auditoriums." },
          { title: "Experienced Faculty Mentors", description: "Guidance from seasoned researchers, PhD holders, and corporate mentors." },
        ]
  );

  const handleAddReason = () => {
    setReasons([...reasons, { title: "", description: "" }]);
  };

  const handleUpdateReason = (index: number, field: keyof WhyGeetaReason, value: string) => {
    const updated = [...reasons];
    updated[index] = { ...updated[index], [field]: value };
    setReasons(updated);
  };

  const handleRemoveReason = (index: number) => {
    setReasons(reasons.filter((_, i) => i !== index));
  };

  const payload = {
    title,
    intro,
    reasons: reasons.filter((r) => r.title.trim().length > 0),
  };

  return (
    <div className="space-y-6">
      {saved ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          Why Choose Geeta section saved successfully.
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
        <input type="hidden" name="section" value="whyGeeta" />
        <input type="hidden" name="payload" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
            Why Choose Geeta University
          </h3>
          <p className="text-sm text-slate-500">
            Institutional USPs, distinctive advantages, and academic differentiators.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Section Title
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
              Introductory Lead Text (Optional)
            </label>
            <textarea
              rows={2}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="e.g. Geeta University stands at the forefront of higher education with..."
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          {/* Reasons List Repeater */}
          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Differentiator Points & Advantages ({reasons.length})
                </h4>
                <p className="text-xs text-slate-500">Feature cards shown on the course page.</p>
              </div>
              <button
                type="button"
                onClick={handleAddReason}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Reason
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition focus-within:border-slate-300 focus-within:bg-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E8871A]">
                      Feature #{idx + 1}
                    </span>
                    {reasons.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveReason(idx)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-3 space-y-3">
                    <input
                      type="text"
                      value={reason.title}
                      onChange={(e) => handleUpdateReason(idx, "title", e.target.value)}
                      placeholder="Advantage title (e.g. 100% Placement Assistance)"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-slate-400"
                      required
                    />
                    <textarea
                      rows={2}
                      value={reason.description}
                      onChange={(e) => handleUpdateReason(idx, "description", e.target.value)}
                      placeholder="Detailed explanation of this university advantage..."
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <CmsSubmitButton label="Save Why Choose Geeta" loadingLabel="Saving..." />
        </div>
      </form>
    </div>
  );
}
