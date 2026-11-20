"use client";

import React, { useState } from "react";
import { updatePredictorSettingsAction } from "../actions";
import { Save, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

interface CalculatorOverviewTabProps {
  initialSettings: any;
}

export function CalculatorOverviewTab({ initialSettings }: CalculatorOverviewTabProps) {
  const [formData, setFormData] = useState({
    calculatorTitle: initialSettings?.calculatorTitle || "Scholarship Calculator",
    calculatorEyebrow: initialSettings?.calculatorEyebrow || "",
    instructionText:
      initialSettings?.instructionText ||
      "Select your discipline, academic program, and qualifying eligibility criteria to instantly view your custom tuition waiver and payable semester fee breakdown.",
    formHeading: initialSettings?.formHeading || "Program & Eligibility Selection",
    schoolSelectorLabel: initialSettings?.schoolSelectorLabel || "Area of Interest",
    programSelectorLabel: initialSettings?.programSelectorLabel || "Program",
    academicLevelLabel: initialSettings?.academicLevelLabel || "Academic Level",
    categorySelectorLabel: initialSettings?.categorySelectorLabel || "Scholarship Category",
    subcategorySelectorLabel: initialSettings?.subcategorySelectorLabel || "Scholarship Subcategory",
    slabSelectorLabel: initialSettings?.slabSelectorLabel || "Scholarship Slab / Criteria",
    calculateButtonText: initialSettings?.calculateButtonText || "Calculate Scholarship",
    resetButtonText: initialSettings?.resetButtonText || "Reset",
    resultsHeading: initialSettings?.resultsHeading || "Calculation Breakdown",
    totalFeeLabel: initialSettings?.totalFeeLabel || "Fee Per Semester",
    tuitionFeeLabel: initialSettings?.tuitionFeeLabel || "",
    developmentFeeLabel: initialSettings?.developmentFeeLabel || "",
    scholarshipAmountLabel: initialSettings?.scholarshipAmountLabel || "Scholarship Amount",
    payableFeeLabel: initialSettings?.payableFeeLabel || "Payable Fee After Scholarship",
    explanatoryNotes:
      initialSettings?.explanatoryNotes ||
      "GUTS Scholarship is not valid for Pharmacy and Postgraduate (PG) / Ph.D. Programs.",
    disclaimer: initialSettings?.disclaimer || "",
    ctaLabel: initialSettings?.ctaLabel || "Apply for Admission",
    ctaUrl: initialSettings?.ctaUrl || "/admissions",
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const payload = {
      ...formData,
      calculatorEyebrow: formData.calculatorEyebrow?.trim() || null,
      disclaimer: formData.disclaimer?.trim() || null,
      tuitionFeeLabel: formData.tuitionFeeLabel?.trim() || null,
      developmentFeeLabel: formData.developmentFeeLabel?.trim() || null,
      explanatoryNotes: formData.explanatoryNotes?.trim() || null,
    };

    const res = await updatePredictorSettingsAction(payload as any);
    setLoading(false);

    if (res.success) {
      setStatusMessage({ type: "success", text: "Calculator content and instructions saved successfully to MySQL!" });
      setTimeout(() => setStatusMessage(null), 5000);
    } else {
      setStatusMessage({ type: "error", text: res.error || "Failed to update settings" });
    }
  };

  return (
    <div className="bg-white rounded-[16px] border border-slate-200 p-6 md:p-8 shadow-xs">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Calculator Content & Labels CMS</h2>
        <p className="text-sm text-slate-500 mt-1">
          Edit public headings, instructions, field labels, and explanatory notes for the Scholarship Predictor. All updates are loaded dynamically by public pages.
        </p>
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Section Headings */}
        <div>
          <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            1. Section Header & Introductory Narrative
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Eyebrow Text (Optional)
              </label>
              <input
                type="text"
                name="calculatorEyebrow"
                value={formData.calculatorEyebrow}
                onChange={handleChange}
                placeholder="Leave blank to omit eyebrow"
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Main Calculator Title
              </label>
              <input
                type="text"
                name="calculatorTitle"
                value={formData.calculatorTitle}
                onChange={handleChange}
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Instruction Text (Subtitle)
              </label>
              <textarea
                name="instructionText"
                rows={3}
                value={formData.instructionText}
                onChange={handleChange}
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Input Form Labels */}
        <div>
          <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            2. Calculator Form Labels & Dropdowns
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Form Heading
              </label>
              <input
                type="text"
                name="formHeading"
                value={formData.formHeading}
                onChange={handleChange}
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                School / Area Selector Label
              </label>
              <input
                type="text"
                name="schoolSelectorLabel"
                value={formData.schoolSelectorLabel}
                onChange={handleChange}
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Program Selector Label
              </label>
              <input
                type="text"
                name="programSelectorLabel"
                value={formData.programSelectorLabel}
                onChange={handleChange}
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Category Selector Label
              </label>
              <input
                type="text"
                name="categorySelectorLabel"
                value={formData.categorySelectorLabel}
                onChange={handleChange}
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Subcategory Selector Label
              </label>
              <input
                type="text"
                name="subcategorySelectorLabel"
                value={formData.subcategorySelectorLabel}
                onChange={handleChange}
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Slab / Criteria Label
              </label>
              <input
                type="text"
                name="slabSelectorLabel"
                value={formData.slabSelectorLabel}
                onChange={handleChange}
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Results Card Labels */}
        <div>
          <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            3. Results Breakdown Card Labels
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Results Header
              </label>
              <input
                type="text"
                name="resultsHeading"
                value={formData.resultsHeading}
                onChange={handleChange}
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Total Semester Fee Label
              </label>
              <input
                type="text"
                name="totalFeeLabel"
                value={formData.totalFeeLabel}
                onChange={handleChange}
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Tuition Fee Label (Internal / Optional)
              </label>
              <input
                type="text"
                name="tuitionFeeLabel"
                value={formData.tuitionFeeLabel}
                onChange={handleChange}
                placeholder="Hidden on public calculator"
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Development Fee Label (Internal / Optional)
              </label>
              <input
                type="text"
                name="developmentFeeLabel"
                value={formData.developmentFeeLabel}
                onChange={handleChange}
                placeholder="Hidden on public calculator"
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Scholarship Amount Label
              </label>
              <input
                type="text"
                name="scholarshipAmountLabel"
                value={formData.scholarshipAmountLabel}
                onChange={handleChange}
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Payable Fee Label
              </label>
              <input
                type="text"
                name="payableFeeLabel"
                value={formData.payableFeeLabel}
                onChange={handleChange}
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Footnotes & CTA */}
        <div>
          <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            4. Supporting Notes, Disclaimers & Action Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Explanatory Footnote
              </label>
              <textarea
                name="explanatoryNotes"
                rows={3}
                value={formData.explanatoryNotes}
                onChange={handleChange}
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Policy Disclaimer
              </label>
              <textarea
                name="disclaimer"
                rows={3}
                value={formData.disclaimer}
                onChange={handleChange}
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                CTA Button Text
              </label>
              <input
                type="text"
                name="ctaLabel"
                value={formData.ctaLabel}
                onChange={handleChange}
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                CTA Destination URL
              </label>
              <input
                type="text"
                name="ctaUrl"
                value={formData.ctaUrl}
                onChange={handleChange}
                className="w-full rounded-[10px] border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#066191] focus:ring-2 focus:ring-[#066191]/20 outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-[10px] bg-[#066191] hover:bg-[#054d74] text-white px-6 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving to MySQL...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Calculator Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
