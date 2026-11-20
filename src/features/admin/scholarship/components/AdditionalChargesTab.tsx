"use client";

import React, { useState } from "react";
import { saveAdditionalChargeAction, deleteAdditionalChargeAction } from "../actions";
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, DollarSign, X, Save } from "lucide-react";

interface AdditionalChargeRecord {
  id: string;
  title: string;
  amount: number;
  frequency: string;
  description?: string | null;
  applicability?: string | null;
  isMandatory: boolean;
  status: string;
  sortOrder: number;
}

interface AdditionalChargesTabProps {
  charges: AdditionalChargeRecord[];
  onRefresh: () => void;
}

export function AdditionalChargesTab({ charges, onRefresh }: AdditionalChargesTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharge, setEditingCharge] = useState<AdditionalChargeRecord | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    id: "",
    title: "",
    amount: 0,
    frequency: "One Time",
    description: "",
    applicability: "ALL",
    isMandatory: true,
    status: "PUBLISHED",
    sortOrder: 0,
  });

  const openCreate = () => {
    setEditingCharge(null);
    setForm({
      id: "",
      title: "",
      amount: 1000,
      frequency: "One Time",
      description: "",
      applicability: "ALL",
      isMandatory: true,
      status: "PUBLISHED",
      sortOrder: charges.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEdit = (c: AdditionalChargeRecord) => {
    setEditingCharge(c);
    setForm({
      id: c.id,
      title: c.title,
      amount: c.amount,
      frequency: c.frequency,
      description: c.description || "",
      applicability: c.applicability || "ALL",
      isMandatory: c.isMandatory,
      status: c.status,
      sortOrder: c.sortOrder,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveAdditionalChargeAction({
      id: form.id || undefined,
      title: form.title,
      amount: Number(form.amount),
      frequency: form.frequency,
      description: form.description || undefined,
      applicability: form.applicability,
      isMandatory: form.isMandatory,
      status: form.status as any,
      sortOrder: Number(form.sortOrder),
    });

    if (res.success) {
      setIsModalOpen(false);
      setStatusMessage({ type: "success", text: "Additional charge saved to MySQL." });
      onRefresh();
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      alert(res.error || "Failed to save additional charge");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete charge "${title}"?`)) return;
    const res = await deleteAdditionalChargeAction(id);
    if (res.success) {
      setStatusMessage({ type: "success", text: "Additional charge removed." });
      onRefresh();
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      alert(res.error || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[16px] border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Additional Charges Management</h2>
            <p className="text-sm text-slate-500 mt-1">
              Configure one-time admission charges, semester fees, student facility charges, and ACCA professional fees. These are displayed transparently and separately from tuition calculations.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 rounded-[10px] bg-[#066191] hover:bg-[#054d74] text-white px-4 py-2 text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add Additional Charge
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

        {/* Table of Charges */}
        <div className="overflow-x-auto rounded-[12px] border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">Charge Name</th>
                <th className="py-3 px-3.5 text-right font-black text-[#0A1F44]">Amount (INR)</th>
                <th className="py-3 px-3.5">Frequency</th>
                <th className="py-3 px-3.5">Applicability</th>
                <th className="py-3 px-3 text-center">Mandatory</th>
                <th className="py-3 px-3.5">Explanatory Notes</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white font-medium text-slate-700">
              {charges.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3.5 font-bold text-slate-900">
                    {c.title}
                  </td>
                  <td className="py-3 px-3.5 text-right font-bold text-[#0A1F44] whitespace-nowrap">
                    ₹ {c.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-3.5 whitespace-nowrap text-slate-600">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold">
                      {c.frequency}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span className="rounded-full bg-blue-100 text-[#066191] px-2 py-0.5 text-[10.5px] font-bold">
                      {c.applicability || "ALL"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {c.isMandatory ? (
                      <span className="text-emerald-700 font-bold text-[11px]">Yes</span>
                    ) : (
                      <span className="text-slate-400 font-medium text-[11px]">Optional</span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 text-slate-500 max-w-[280px] text-[11.5px] leading-relaxed">
                    {c.description || "-"}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-1.5 text-slate-400 hover:text-[#066191] rounded-md"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.title)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-md"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-[16px] border border-slate-200 shadow-xl max-w-lg w-full p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {editingCharge ? `Edit: ${editingCharge.title}` : "Add Additional Charge"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Charge Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Amount (INR) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Frequency *
                  </label>
                  <input
                    type="text"
                    placeholder="One Time, Per Semester, Annually"
                    value={form.frequency}
                    onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                    className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Applicability Scope
                </label>
                <input
                  type="text"
                  placeholder="ALL, ACCA, HARYANA_DOMICILE_VERIFICATION"
                  value={form.applicability}
                  onChange={(e) => setForm({ ...form, applicability: e.target.value })}
                  className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Explanatory Notes
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Includes medical insurance, library, ERP..."
                  className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is-mandatory-toggle"
                  checked={form.isMandatory}
                  onChange={(e) => setForm({ ...form, isMandatory: e.target.checked })}
                  className="h-4 w-4 rounded-sm text-[#066191]"
                />
                <label htmlFor="is-mandatory-toggle" className="text-xs font-semibold text-slate-800 cursor-pointer">
                  Mandatory for all admissions
                </label>
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
                  Save Charge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
