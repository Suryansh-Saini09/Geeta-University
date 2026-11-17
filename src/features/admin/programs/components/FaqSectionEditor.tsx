"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProgramSectionAction } from "@/features/admin/programs/actions";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";
import { CourseFAQItem } from "@/data/programs/courses/types";

interface FaqSectionEditorProps {
  programId: string;
  programName: string;
  faqsData?: CourseFAQItem[];
  saved?: boolean;
  error?: string;
}

export function FaqSectionEditor({
  programId,
  programName,
  faqsData = [],
  saved,
  error,
}: FaqSectionEditorProps) {
  const [faqs, setFaqs] = useState<CourseFAQItem[]>(
    faqsData.length > 0
      ? faqsData
      : [
          {
            question: `What is the eligibility criteria for ${programName}?`,
            answer: "Candidates must have successfully completed their qualifying degree/10+2 from a recognized educational board/university with the requisite minimum aggregate marks.",
            category: "Admissions",
          },
          {
            question: "What are the scholarship opportunities available for this course?",
            answer: "Merit scholarships based on academic scores and the Geeta University Talent Search (GUTS) examination are available, providing fee waivers of up to 100%.",
            category: "Scholarships",
          },
        ]
  );

  const handleAddFaq = () => {
    setFaqs([
      ...faqs,
      {
        question: "",
        answer: "",
        category: "General",
      },
    ]);
  };

  const handleUpdateFaq = (idx: number, field: keyof CourseFAQItem, val: string) => {
    const next = [...faqs];
    next[idx] = { ...next[idx], [field]: val };
    setFaqs(next);
  };

  const handleRemoveFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const payload = {
    faqs: faqs.filter((f) => f.question.trim().length > 0 && f.answer.trim().length > 0),
  };

  return (
    <div className="space-y-6">
      {saved ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          Frequently Asked Questions saved successfully.
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
        <input type="hidden" name="section" value="faqs" />
        <input type="hidden" name="payload" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                Frequently Asked Questions ({faqs.length})
              </h3>
              <p className="mt-0.5 text-sm text-slate-500">
                Answer common applicant questions regarding admission, fee structure, placements, and hostels.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddFaq}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#12366E]"
            >
              <Plus className="h-4 w-4" />
              Add FAQ Question
            </button>
          </div>

          <div className="space-y-4">
            {faqs.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No FAQs configured yet.</p>
            ) : (
              faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition hover:border-slate-300"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E8871A]">
                      Question #{idx + 1}
                    </span>
                    {faqs.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(idx)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-3 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Question Prompt
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                          placeholder="e.g. What is the average package for this course?"
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-slate-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Category / Group
                        </label>
                        <input
                          type="text"
                          value={faq.category || ""}
                          onChange={(e) => handleUpdateFaq(idx, "category", e.target.value)}
                          placeholder="Admissions / Placements / Hostel"
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Detailed Answer
                      </label>
                      <textarea
                        rows={3}
                        value={faq.answer}
                        onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                        placeholder="Comprehensive, accurate reply explaining policy..."
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <CmsSubmitButton label="Save FAQs" loadingLabel="Saving..." />
        </div>
      </form>
    </div>
  );
}
