"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";

interface AlumniFormData {
  alumni_name: string;
  contact_no: string;
  email: string;
  employment_type: string;
  organisation: string;
  current_role: string;
  year_of_passout: string;
  programme_level: string;
  school: string;
  q1_career_development: string;
  q2_entrepreneur_support: string;
  q3_real_world: string;
  q4_ethics: string;
  q5_teamwork: string;
}

const initialFormData: AlumniFormData = {
  alumni_name: "",
  contact_no: "",
  email: "",
  employment_type: "",
  organisation: "",
  current_role: "",
  year_of_passout: "",
  programme_level: "",
  school: "",
  q1_career_development: "",
  q2_entrepreneur_support: "",
  q3_real_world: "",
  q4_ethics: "",
  q5_teamwork: "",
};

const schoolOptions = [
  "School of Computer Science & Engineering",
  "School of Commerce & Business Management",
  "Geeta Institute of Pharmacy",
  "School of Agricultural Sciences",
  "School of Sciences",
  "School of Health & Allied Sciences",
  "School of Humanities & Social Sciences",
  "Geeta Global Law School",
  "School of Hospitality & Hotel Management",
  "School of Engineering",
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

export default function AlumniFeedbackPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<AlumniFormData>(initialFormData);
  const [contactError, setContactError] = useState<string | null>(null);
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

    if (name === "contact_no") {
      setContactError(null);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = formData.contact_no.trim();
    if (!/^[6-9][0-9]{9}$/.test(cleanMobile)) {
      setContactError("Mobile number must start with 6, 7, 8, or 9 and be 10 digits.");
      return;
    }
    setContactError(null);
    setStep(2);
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep(1);
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload: Record<string, string> = {
        alumni_name: formData.alumni_name.trim(),
        contact_no: formData.contact_no.trim(),
        email: formData.email.trim(),
        employment_type: formData.employment_type,
        organisation: formData.organisation.trim(),
        current_role: formData.current_role.trim(),
        year_of_passout: formData.year_of_passout,
        programme_level: formData.programme_level,
        school: formData.school,
        q1_career_development: formData.q1_career_development,
        q2_entrepreneur_support: formData.q2_entrepreneur_support,
        q3_real_world: formData.q3_real_world,
        q4_ethics: formData.q4_ethics,
        q5_teamwork: formData.q5_teamwork,
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
      setStep(1);
    } catch {
      setErrorMsg("Failed to submit feedback. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData(initialFormData);
    setStep(1);
    setErrorMsg(null);
    setContactError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="gu-container">
        {/* Simple Form Card */}
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 sm:p-10 shadow-lg border border-slate-200/80 my-8">
          <h1 className="text-center font-serif text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
            Alumni Feedback on Curriculum
          </h1>

          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Thank you! Your response has been successfully submitted.
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
            <div>
              {errorMsg && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700 mb-6">
                  {errorMsg}
                </div>
              )}

              {/* STEP 1: Personal Information */}
              {step === 1 && (
                <form onSubmit={handleNext} className="space-y-6">
                  <div>
                    <div className="border-l-4 border-[#d6001c] pl-3 text-base sm:text-lg font-bold text-slate-900 mb-4">
                      Personal Information
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Name of the Alumni <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="alumni_name"
                          required
                          value={formData.alumni_name}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Contact Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="contact_no"
                          required
                          maxLength={10}
                          inputMode="numeric"
                          placeholder="Enter 10 digit mobile number"
                          value={formData.contact_no}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                        />
                        {contactError && (
                          <small className="text-red-600 mt-1 block">
                            {contactError}
                          </small>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Employment Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="employment_type"
                          required
                          value={formData.employment_type}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          <option value="working_professional">Working Professional</option>
                          <option value="self_employed">Self-employed / Entrepreneur</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Organisation / Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="organisation"
                          required
                          value={formData.organisation}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Current Role / Designation <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="current_role"
                          required
                          value={formData.current_role}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Year of Pass Out <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="year_of_passout"
                          required
                          value={formData.year_of_passout}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                        >
                          <option value="" disabled>
                            Select Year
                          </option>
                          <option value="2022">2022</option>
                          <option value="2023">2023</option>
                          <option value="2024">2024</option>
                          <option value="before_2022">Before 2022</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Programme Level <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="programme_level"
                          required
                          value={formData.programme_level}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                        >
                          <option value="" disabled>
                            Select Level
                          </option>
                          <option value="UG">Undergraduate (UG)</option>
                          <option value="PG">Postgraduate (PG)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          School for which feedback is given <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="school"
                          required
                          value={formData.school}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#d6001c] focus:outline-none focus:ring-1 focus:ring-[#d6001c]"
                        >
                          <option value="" disabled>
                            Select your School
                          </option>
                          {schoolOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#d6001c] py-3 px-6 text-white font-bold text-base transition-all hover:bg-[#b00018]"
                  >
                    Next &rarr;
                  </button>
                </form>
              )}

              {/* STEP 2: Curriculum Feedback */}
              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <div className="border-l-4 border-[#d6001c] pl-3 text-base sm:text-lg font-bold text-slate-900 mb-4">
                      Curriculum Feedback
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          The program provides knowledge essential for career development. <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="q1_career_development"
                          required
                          value={formData.q1_career_development}
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
                          The program supports students in pursuing business or entrepreneurial ventures. <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="q2_entrepreneur_support"
                          required
                          value={formData.q2_entrepreneur_support}
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
                          Seminars, workshops, and guest lectures help link course knowledge to real-world applications. <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="q3_real_world"
                          required
                          value={formData.q3_real_world}
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
                          Courses on ethics, sustainability, and CSR contribute to professional growth. <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="q4_ethics"
                          required
                          value={formData.q4_ethics}
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
                          Group assignments and collaborative projects foster teamwork skills. <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="q5_teamwork"
                          required
                          value={formData.q5_teamwork}
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

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-1/2 rounded-lg border border-slate-300 bg-slate-100 py-3 px-6 text-slate-700 font-bold text-base transition-all hover:bg-slate-200"
                    >
                      &larr; Back
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-1/2 rounded-lg bg-[#d6001c] py-3 px-6 text-white font-bold text-base transition-all hover:bg-[#b00018] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          )}
        </div>
      </div>

      {/* Legacy & Ecosystem Section */}
      <LegacyEcosystem id="legacy-ecosystem" />
    </div>
  );
}
