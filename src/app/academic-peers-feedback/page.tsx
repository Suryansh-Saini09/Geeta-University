"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";

interface FeedbackFormData {
  peer_name: string;
  designation: string;
  organization: string;
  interaction_type: string;
  interaction_other: string;
  specialization: string;
  specialization_other: string;
  q1_relevance: string;
  q2_research_trends: string;
  q3_teaching_learning: string;
  q4_experiential: string;
  q5_assessment: string;
}

const initialFormData: FeedbackFormData = {
  peer_name: "",
  designation: "",
  organization: "",
  interaction_type: "",
  interaction_other: "",
  specialization: "",
  specialization_other: "",
  q1_relevance: "",
  q2_research_trends: "",
  q3_teaching_learning: "",
  q4_experiential: "",
  q5_assessment: "",
};

const interactionOptions = [
  "I have conducted a Placement Drive",
  "I have conducted an Internship Drive",
  "I have conducted a Workshop",
  "I have delivered an Expert Lecture/Guest Lecture",
  "I have signed an MOU",
  "I have attended a Conference",
  "other",
];

const specializationOptions = [
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
  "other",
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

export default function AcademicPeerFeedbackPage() {
  const [formData, setFormData] = useState<FeedbackFormData>(initialFormData);
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
        peer_name: formData.peer_name.trim(),
        designation: formData.designation.trim(),
        organization: formData.organization.trim(),
        interaction_type:
          formData.interaction_type === "other"
            ? formData.interaction_other.trim()
            : formData.interaction_type,
        specialization:
          formData.specialization === "other"
            ? formData.specialization_other.trim()
            : formData.specialization,
        q1_relevance: formData.q1_relevance,
        q2_research_trends: formData.q2_research_trends,
        q3_teaching_learning: formData.q3_teaching_learning,
        q4_experiential: formData.q4_experiential,
        q5_assessment: formData.q5_assessment,
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
      setErrorMsg("Failed to submit feedback. Please check your connection and try again.");
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
            Academic Peers Feedback on Curriculum
          </h1>

          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Thank You for Your Valuable Feedback!
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Your feedback has been received and recorded.
              </p>
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

              {/* Personal Information */}
              <div>
                <div className="border-l-4 border-[#d6001c] pl-3 text-base sm:text-lg font-bold text-slate-900 mb-4">
                  Personal Information
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Name of Peer Reviewer <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="peer_name"
                      required
                      value={formData.peer_name}
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
                </div>
              </div>

              {/* Interaction Section */}
              <div>
                <div className="border-l-4 border-[#d6001c] pl-3 text-base sm:text-lg font-bold text-slate-900 mb-4">
                  Interaction with Geeta University
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Type of Interaction <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="interaction_type"
                      required
                      value={formData.interaction_type}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {interactionOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt === "other" ? "Other:" : opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.interaction_type === "other" && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Please specify <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="interaction_other"
                        required={formData.interaction_type === "other"}
                        value={formData.interaction_other}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Specialization Section */}
              <div>
                <div className="border-l-4 border-[#d6001c] pl-3 text-base sm:text-lg font-bold text-slate-900 mb-4">
                  Field / Area of Specialization
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Field of Specialization <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="specialization"
                      required
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {specializationOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt === "other" ? "Other:" : opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.specialization === "other" && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Please specify <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="specialization_other"
                        required={formData.specialization === "other"}
                        value={formData.specialization_other}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Curriculum Feedback Section */}
              <div>
                <div className="border-l-4 border-[#d6001c] pl-3 text-base sm:text-lg font-bold text-slate-900 mb-4">
                  Curriculum Feedback
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      The curriculum is relevant &amp; up-to-date. <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="q1_relevance"
                      required
                      value={formData.q1_relevance}
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
                      The curriculum reflects current research trends. <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="q2_research_trends"
                      required
                      value={formData.q2_research_trends}
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
                      Teaching processes support deep learning. <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="q3_teaching_learning"
                      required
                      value={formData.q3_teaching_learning}
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
                      Experiential learning opportunities are effective. <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="q4_experiential"
                      required
                      value={formData.q4_experiential}
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
                      Assessment mechanisms are fair &amp; transparent. <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="q5_assessment"
                      required
                      value={formData.q5_assessment}
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
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-[#d6001c] py-3 text-base font-semibold text-white transition-all hover:bg-[#b00018] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
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

      {/* Legacy & Ecosystem */}
      <LegacyEcosystem id="legacy-ecosystem" />
    </div>
  );
}

