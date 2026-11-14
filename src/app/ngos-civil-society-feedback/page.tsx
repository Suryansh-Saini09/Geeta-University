"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";

interface NgoFeedbackFormData {
  organization_name: string;
  representative_name: string;
  designation: string;
  q1_community_needs: string;
  q2_social_responsibility: string;
  q3_outreach_effectiveness: string;
  q4_feedback_incorporation: string;
  q5_long_term_impact: string;
}

const initialFormData: NgoFeedbackFormData = {
  organization_name: "",
  representative_name: "",
  designation: "",
  q1_community_needs: "",
  q2_social_responsibility: "",
  q3_outreach_effectiveness: "",
  q4_feedback_incorporation: "",
  q5_long_term_impact: "",
};

const ratingOptions = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree",
];

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzgxcb-eVzIMdGNsCYADGyPMIzBIkdhryGD6rIvIQPF1Bjq-KpIzJ4IpXuOYtbZXSY3/exec";

export default function NgoCivilSocietyFeedbackPage() {
  const [formData, setFormData] = useState<NgoFeedbackFormData>(initialFormData);
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
        organization_name: formData.organization_name.trim(),
        representative_name: formData.representative_name.trim(),
        designation: formData.designation.trim(),
        q1_community_needs: formData.q1_community_needs,
        q2_social_responsibility: formData.q2_social_responsibility,
        q3_outreach_effectiveness: formData.q3_outreach_effectiveness,
        q4_feedback_incorporation: formData.q4_feedback_incorporation,
        q5_long_term_impact: formData.q5_long_term_impact,
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
            Civil Society, NGOs Feedback Form on Curriculum
          </h1>

          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Thank you! Your feedback has been submitted.
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

              {/* Section: Organization Details */}
              <div>
                <div className="border-l-4 border-[#d6001c] pl-3 text-base sm:text-lg font-bold text-slate-900 mb-4">
                  Organization Details
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Name of Organization / NGO <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="organization_name"
                      required
                      value={formData.organization_name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Name of the Representative <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="representative_name"
                      required
                      value={formData.representative_name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Designation / Role <span className="text-red-500">*</span>
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
                </div>
              </div>

              {/* Section: Feedback on Outreach & Curriculum */}
              <div>
                <div className="border-l-4 border-[#d6001c] pl-3 text-base sm:text-lg font-bold text-slate-900 mb-4">
                  Feedback on Outreach &amp; Curriculum
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      The community engagement activities conducted by Geeta University address relevant community needs and societal issues. <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="q1_community_needs"
                      required
                      value={formData.q1_community_needs}
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
                      Geeta University demonstrates strong commitment to social responsibility and community development. <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="q2_social_responsibility"
                      required
                      value={formData.q2_social_responsibility}
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
                      Outreach activities are well-organized and effectively implemented in collaboration with your organization. <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="q3_outreach_effectiveness"
                      required
                      value={formData.q3_outreach_effectiveness}
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
                      Geeta University values and incorporates feedback from NGOs/Civil Society to improve extension activities. <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="q4_feedback_incorporation"
                      required
                      value={formData.q4_feedback_incorporation}
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
                      Collaborative initiatives help strengthen community partnerships and foster long-term societal impact. <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="q5_long_term_impact"
                      required
                      value={formData.q5_long_term_impact}
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
                  className="w-full rounded-lg bg-[#d6001c] py-3 px-6 text-white font-bold text-base transition-all hover:bg-[#b00018] hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
