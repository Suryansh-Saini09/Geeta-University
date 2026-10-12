"use client";

import { useState } from "react";
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FaqSectionEditorProps {
  departmentId: string;
  faqsData: any[];
  saved?: boolean;
  error?: string;
}

export function FaqSectionEditor({
  departmentId,
  faqsData = [],
  saved,
  error,
}: FaqSectionEditorProps) {
  // Normalize existing FAQs to { question, answer, category }
  const normalizedFaqs: FAQItem[] = faqsData.map((f) => ({
    question: f.question || f.q || "",
    answer: f.answer || f.a || "",
    category: f.category || "General",
  }));

  const [faqs, setFaqs] = useState<FAQItem[]>(normalizedFaqs);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("ALL");

  const categories = Array.from(
    new Set(faqs.map((f) => f.category?.trim() || "General"))
  );

  const handleAddFaq = () => {
    setFaqs([
      ...faqs,
      {
        question: "",
        answer: "",
        category: selectedCategoryFilter !== "ALL" ? selectedCategoryFilter : "General",
      },
    ]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: keyof FAQItem, val: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: val };
    setFaqs(updated);
  };

  const filteredFaqs = faqs.map((f, originalIndex) => ({ ...f, originalIndex })).filter((f) => {
    if (selectedCategoryFilter === "ALL") return true;
    return (f.category || "General").toLowerCase() === selectedCategoryFilter.toLowerCase();
  });

  const payload = {
    faqs: faqs.filter((f) => f.question.trim() !== "" && f.answer.trim() !== ""),
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          FAQs updated successfully ({payload.faqs.length} active questions saved).
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
        <input type="hidden" name="section" value="faqs" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-slate-700" />
                <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                  Frequently Asked Questions (FAQs)
                </h3>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Manage admissions, eligibility, fee structure, and course FAQs. Total FAQs: {faqs.length}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddFaq}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#F5A623]"
            >
              <Plus className="h-4 w-4" />
              Add FAQ Question
            </button>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-400 mr-2">Filter by Category:</span>
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter("ALL")}
                className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                  selectedCategoryFilter === "ALL"
                    ? "bg-[#0A1F44] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All ({faqs.length})
              </button>
              {categories.map((cat) => {
                const count = faqs.filter(
                  (f) => (f.category || "General").toLowerCase() === cat.toLowerCase()
                ).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                      selectedCategoryFilter === cat
                        ? "bg-[#0A1F44] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* FAQs List */}
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 py-10 text-center text-xs font-medium text-slate-400">
                No FAQs found for this filter. Click &quot;Add FAQ Question&quot; above to create one.
              </div>
            ) : (
              filteredFaqs.map(({ originalIndex, question, answer, category }) => (
                <div
                  key={originalIndex}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      FAQ #{originalIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(originalIndex)}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                      title="Delete FAQ"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Question *
                      </label>
                      <input
                        type="text"
                        value={question}
                        onChange={(e) =>
                          handleFaqChange(originalIndex, "question", e.target.value)
                        }
                        placeholder="e.g. What are the eligibility criteria for B.Tech CSE?"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Category
                      </label>
                      <input
                        type="text"
                        value={category || "General"}
                        onChange={(e) =>
                          handleFaqChange(originalIndex, "category", e.target.value)
                        }
                        placeholder="Admissions, Eligibility, Fees..."
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Answer *
                      </label>
                      <textarea
                        value={answer}
                        onChange={(e) =>
                          handleFaqChange(originalIndex, "answer", e.target.value)
                        }
                        rows={3}
                        placeholder="Detailed answer provided to students..."
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-slate-300"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#F5A623]"
          >
            <Save className="h-4 w-4" />
            Save FAQs ({payload.faqs.length})
          </button>
        </div>
      </form>
    </div>
  );
}
