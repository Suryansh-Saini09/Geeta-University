"use client";

import React, { useState } from "react";
import { saveScholarshipFaqAction, deleteScholarshipFaqAction } from "../actions";
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, HelpCircle, X, Save } from "lucide-react";

interface FaqRecord {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  displayOrder: number;
  status: string;
}

interface ScholarshipFaqsTabProps {
  faqs: FaqRecord[];
  onRefresh: () => void;
}

export function ScholarshipFaqsTab({ faqs, onRefresh }: ScholarshipFaqsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqRecord | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    id: "",
    question: "",
    answer: "",
    category: "General",
    displayOrder: 0,
    status: "PUBLISHED",
  });

  const openCreate = () => {
    setEditingFaq(null);
    setForm({
      id: "",
      question: "",
      answer: "",
      category: "General",
      displayOrder: faqs.length + 1,
      status: "PUBLISHED",
    });
    setIsModalOpen(true);
  };

  const openEdit = (f: FaqRecord) => {
    setEditingFaq(f);
    setForm({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: f.category || "General",
      displayOrder: f.displayOrder,
      status: f.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveScholarshipFaqAction({
      id: form.id || undefined,
      question: form.question,
      answer: form.answer,
      category: form.category,
      displayOrder: Number(form.displayOrder),
      status: form.status as any,
    });

    if (res.success) {
      setIsModalOpen(false);
      setStatusMessage({ type: "success", text: "Scholarship FAQ saved to MySQL!" });
      onRefresh();
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      alert(res.error || "Failed to save FAQ");
    }
  };

  const handleDelete = async (id: string, q: string) => {
    if (!confirm(`Are you sure you want to delete FAQ "${q.slice(0, 40)}..."?`)) return;
    const res = await deleteScholarshipFaqAction(id);
    if (res.success) {
      setStatusMessage({ type: "success", text: "FAQ deleted." });
      onRefresh();
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      alert(res.error || "Failed to delete FAQ");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[16px] border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Scholarship FAQs Management</h2>
            <p className="text-sm text-slate-500 mt-1">
              Add, update, or reorder frequently asked questions displayed at the bottom of the Scholarship Predictor page.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 rounded-[10px] bg-[#066191] hover:bg-[#054d74] text-white px-4 py-2 text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add FAQ
          </button>
        </div>

        {statusMessage && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-[12px] p-4 text-sm font-medium ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={faq.id}
              className="rounded-[12px] border border-slate-200 bg-white p-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{faq.question}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{faq.answer}</p>
                    <span className="inline-block mt-2 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10.5px] font-medium text-slate-500">
                      {faq.category || "General"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(faq)}
                    className="p-1.5 text-slate-400 hover:text-[#066191] rounded-md"
                    title="Edit FAQ"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id, faq.question)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-md"
                    title="Delete FAQ"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-[16px] border border-slate-200 shadow-xl max-w-lg w-full p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {editingFaq ? "Edit FAQ" : "Add New FAQ"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="e.g. How is the scholarship amount calculated?"
                  className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  placeholder="Full explanatory answer..."
                  className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-[8px] border border-slate-300 px-3 py-1.5 text-xs text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                    className="w-full rounded-[8px] border border-slate-300 px-3 py-1.5 text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-[8px] bg-[#066191] hover:bg-[#054d74] text-white px-4 py-2 text-xs font-semibold"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
