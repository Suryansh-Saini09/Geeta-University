"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";

interface EmployerFormData {
  employer_name: string;
  designation: string;
  organization: string;
  program_reviewed: string;
  q1_industry_alignment: string;
  q2_industry_trends: string;
  q3_critical_thinking: string;
  q4_experiential_learning: string;
  q5_assessment_alignment: string;
}

const initialFormData: EmployerFormData = {
  employer_name: "",
  designation: "",
  organization: "",
  program_reviewed: "",
  q1_industry_alignment: "",
  q2_industry_trends: "",
  q3_critical_thinking: "",
  q4_experiential_learning: "",
  q5_assessment_alignment: "",
};

const programOptions = [
  "Computer Science & Engineering",
  "Commerce & Business Management",
  "Pharmacy",
  "Nutrition & Dietetics",
  "Forensic Sciences",
  "Sciences",
  "Humanities & Social Sciences",
  "Agriculture",
  "Hospitality & Hotel Management",
  "Law",
];

const ratingOptions = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree",
];

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzgxcb-eVzIMdGNsCYADGyPMIzBIkdhryGD6rIvIQPF1Bjq-KpIzJ4IpXuOYtbZXSY3/exec";

export default function EmployerFeedbackPage() {
  const [formData, setFormData] = useState<EmployerFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload: Record<string, string> = {
        employer_name: formData.employer_name.trim(),
        designation: formData.designation.trim(),
        organization: formData.organization.trim(),
        program_reviewed: formData.program_reviewed,
        q1_industry_alignment: formData.q1_industry_alignment,
        q2_industry_trends: formData.q2_industry_trends,
        q3_critical_thinking: formData.q3_critical_thinking,
        q4_experiential_learning: formData.q4_experiential_learning,
        q5_assessment_alignment: formData.q5_assessment_alignment,
      };

      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(payload),
      });

      setIsSubmitted(true);
      setFormData(initialFormData);
    } catch {
      setErrorMsg("Failed to submit feedback. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData(initialFormData);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="gu-container">
        {/* Simple Form Card */}
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 sm:p-10 shadow-lg border border-slate-200/80 my-8">
          <h1 className="text-center font-serif text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
            Employer Feedback on Curriculum
          </h1>

          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Thank you! Your feedback has been successfully submitted.
              </h2>
              <button
                onClick={resetForm}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#d6001c] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#b00018]"
              >
                <RotateCcw className="h-4 w-4" />
                Submit Another Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                  {errorMsg}
                </div>
              )}

              {/* Section: Employer Details */}
              <div>
                <div className="border-l-4 border-[#d6001c] pl-3 text-base sm:text-lg font-bold text-slate-900 mb-4">
                  Employer Details
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Name of the Employer <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="employer_name"
                      required
                      value={formData.employer_name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Designation / Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="designation"
                      required
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Institution / Organization <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="organization"
                      required
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Name of the Program Reviewed <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="program_reviewed"
                      required
                      value={formData.program_reviewed}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                    >
                      <option value="" disabled>
                        Select Program
                      </option>
                      {programOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section: Feedback on Curriculum & Industry Alignment */}
              <div>
                <div className="border-l-4 border-[#d6001c] pl-3 text-base sm:text-lg font-bold text-slate-900 mb-4">
                  Feedback on Curriculum &amp; Industry Alignment
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      The curriculum is well-structured and aligned with current industry standards. <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="q1_industry_alignment"
                      required
                      value={formData.q1_industry_alignment}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {ratingOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      The course content reflects advancements in the discipline as per industry trends. <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="q2_industry_trends"
                      required
                      value={formData.q2_industry_trends}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {ratingOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Teaching-learning methods encourage critical thinking required in the industry. <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="q3_critical_thinking"
                      required
                      value={formData.q3_critical_thinking}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {ratingOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Laboratory, project work, field work, and experiential components enhance learning outcomes. <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="q4_experiential_learning"
                      required
                      value={formData.q4_experiential_learning}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {ratingOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Assessment processes are in line with what industry expects from candidates. <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="q5_assessment_alignment"
                      required
                      value={formData.q5_assessment_alignment}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {ratingOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-[#d6001c] py-3 px-6 text-white font-bold text-base transition-all hover:bg-[#b00018] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Feedback</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Legacy & Ecosystem Section */}
      <LegacyEcosystem id="legacy-ecosystem" />
    </div>
  );
}
