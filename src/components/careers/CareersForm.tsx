"use client";

import React, { useState, useMemo, useRef, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  DEPARTMENTS,
  GENDER_OPTIONS,
  JOB_CATEGORIES,
  MARITAL_STATUS_OPTIONS,
  EXPERIENCE_TYPE_OPTIONS,
} from "@/data/careers";

interface FormDataState {
  full_name: string;
  email_address: string;
  mobile_number: string;
  date_of_birth: string;
  marital_status: string;
  gender: string;
  current_city: string;
  current_state: string;
  home_state: string;
  highest_qualification: string;
  linked_in_profile: string;
  current_employer: string;
  previous_employer: string;
  total_experience: string;
  designation: string;
  key_skills: string;
  notice_period: string;
  current_ctc: string;
  expected_ctc: string;
  job_application_for: string;
  department: string;
  reference_source: string;
}

const initialFormState: FormDataState = {
  full_name: "",
  email_address: "",
  mobile_number: "",
  date_of_birth: "",
  marital_status: "",
  gender: "",
  current_city: "",
  current_state: "",
  home_state: "",
  highest_qualification: "",
  linked_in_profile: "",
  current_employer: "",
  previous_employer: "",
  total_experience: "",
  designation: "",
  key_skills: "",
  notice_period: "",
  current_ctc: "",
  expected_ctc: "",
  job_application_for: "",
  department: "",
  reference_source: "",
};

interface CareersFormProps {
  formConfig?: {
    heading?: string;
    description?: string;
    categories?: string[];
    departments?: Array<{
      value: string;
      label: string;
      categories: ("Teaching" | "Non Teaching" | "Admissions & Marketing" | "Essentials")[];
    }>;
  } | null;
}

function validateDobString(val: string): string | null {
  if (!val || !val.trim()) {
    return "Date of birth is required.";
  }

  const trimmed = val.trim();
  let day: number, month: number, year: number;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const parts = trimmed.split("-").map(Number);
    year = parts[0];
    month = parts[1];
    day = parts[2];
  } else if (/^\d{2}[/-]\d{2}[/-]\d{4}$/.test(trimmed)) {
    const parts = trimmed.split(/[/-]/).map(Number);
    day = parts[0];
    month = parts[1];
    year = parts[2];
  } else {
    return "Enter date as DD/MM/YYYY or use the date picker.";
  }

  if (month < 1 || month > 12) return "Invalid month in date of birth.";
  if (day < 1 || day > 31) return "Invalid day in date of birth.";

  const dt = new Date(year, month - 1, day);
  if (dt.getFullYear() !== year || dt.getMonth() !== month - 1 || dt.getDate() !== day) {
    return "Impossible calendar date (e.g., Feb 31 does not exist).";
  }

  const now = new Date();
  if (dt >= now) {
    return "Date of birth cannot be in the future.";
  }

  const eighteenYearsAgo = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
  if (dt > eighteenYearsAgo) {
    return "Applicant must be at least 18 years of age.";
  }

  return null;
}

export default function CareersForm({ formConfig }: CareersFormProps) {
  const [formData, setFormData] = useState<FormDataState>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Field refs for focus management upon validation error (GU-06)
  const refs = {
    full_name: useRef<HTMLInputElement>(null),
    email_address: useRef<HTMLInputElement>(null),
    mobile_number: useRef<HTMLInputElement>(null),
    date_of_birth: useRef<HTMLInputElement>(null),
    marital_status: useRef<HTMLSelectElement>(null),
    gender: useRef<HTMLSelectElement>(null),
    current_city: useRef<HTMLInputElement>(null),
    current_state: useRef<HTMLInputElement>(null),
    home_state: useRef<HTMLInputElement>(null),
    highest_qualification: useRef<HTMLInputElement>(null),
    total_experience: useRef<HTMLSelectElement>(null),
    job_application_for: useRef<HTMLSelectElement>(null),
    department: useRef<HTMLSelectElement>(null),
  };

  const availableDepts =
    formConfig?.departments && formConfig.departments.length > 0
      ? formConfig.departments
      : DEPARTMENTS;

  // Filter available departments dynamically based on chosen job application category
  const filteredDepartments = useMemo(() => {
    if (!formData.job_application_for) return availableDepts;
    return availableDepts.filter((dept) =>
      dept.categories.includes(
        formData.job_application_for as "Teaching" | "Non Teaching" | "Admissions & Marketing" | "Essentials"
      )
    );
  }, [formData.job_application_for, availableDepts]);

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setFormData((prev) => ({
      ...prev,
      job_application_for: category,
      department: "", // reset department selection when category changes
    }));
    if (fieldErrors.job_application_for) {
      setFieldErrors((prev) => ({ ...prev, job_application_for: "" }));
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Full name validation
    const trimmedName = formData.full_name.trim();
    if (!trimmedName) {
      errors.full_name = "Full Name is required.";
    } else if (trimmedName.length < 2) {
      errors.full_name = "Full Name must be at least 2 characters.";
    } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
      errors.full_name = "Name must contain letters only.";
    }

    // Email validation
    const trimmedEmail = formData.email_address.trim();
    if (!trimmedEmail) {
      errors.email_address = "Email Address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email_address = "Enter a valid email address.";
    }

    // Mobile number validation
    const trimmedMobile = formData.mobile_number.trim().replace(/[\s-]/g, "");
    if (!trimmedMobile) {
      errors.mobile_number = "Mobile Number is required.";
    } else if (!/^\+?[0-9]{10,15}$/.test(trimmedMobile)) {
      errors.mobile_number = "Enter a valid mobile number (10 to 15 digits).";
    }

    // Date of birth validation (impossible dates like 31/02/2026 rejected)
    const dobError = validateDobString(formData.date_of_birth);
    if (dobError) {
      errors.date_of_birth = dobError;
    }

    // Required dropdowns & inputs
    if (!formData.marital_status) {
      errors.marital_status = "Please select your marital status.";
    }
    if (!formData.gender) {
      errors.gender = "Please select your gender.";
    }
    if (!formData.current_city.trim()) {
      errors.current_city = "Current City is required.";
    }
    if (!formData.current_state.trim()) {
      errors.current_state = "Current State is required.";
    }
    if (!formData.home_state.trim()) {
      errors.home_state = "Home State is required.";
    }
    if (!formData.highest_qualification.trim()) {
      errors.highest_qualification = "Highest Qualification is required.";
    }
    if (!formData.total_experience) {
      errors.total_experience = "Please select your experience type.";
    }
    if (!formData.job_application_for) {
      errors.job_application_for = "Please select a job category.";
    }
    if (!formData.department) {
      errors.department = "Please select a department.";
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const errors = validateForm();
    setFieldErrors(errors);

    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      setErrorMessage("Please correct the highlighted fields before submitting.");
      // Focus the first invalid input element
      const firstErrorField = errorFields[0] as keyof typeof refs;
      if (refs[firstErrorField]?.current) {
        refs[firstErrorField].current.focus();
        refs[firstErrorField].current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          full_name: formData.full_name.trim(),
          email_address: formData.email_address.trim(),
          mobile_number: formData.mobile_number.trim(),
          current_city: formData.current_city.trim(),
          current_state: formData.current_state.trim(),
          home_state: formData.home_state.trim(),
          highest_qualification: formData.highest_qualification.trim(),
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit career application.");
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "An error occurred while submitting your application."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setFieldErrors({});
    setIsSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <section id="careers-form-section" className="scroll-mt-20 bg-white py-10 md:py-14 border-t border-[#E2E8F0]">
      <div className="gu-container">
        {/* Section Title */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="font-serif text-[36px] font-black text-[#0A1F44] sm:text-[44px]">
            {formConfig?.heading ? (
              formConfig.heading.includes("Faculty & Staff") ? (
                <>
                  {formConfig.heading.replace("Faculty & Staff", "").trim()}{" "}
                  <span className="text-[#E8871A]">Faculty & Staff</span>
                </>
              ) : (
                formConfig.heading
              )
            ) : (
              <>
                Join the <span className="text-[#E8871A]">Geeta Faculty & Staff</span>
              </>
            )}
          </h2>
          <p className="mt-3 text-[16px] leading-[1.7] text-[#64748B]">
            {formConfig?.description ||
              "Fill out the form below to register your application. Fields marked with an asterisk (*) are mandatory."}
          </p>
        </div>

        {/* Form Container */}
        <div className="mx-auto max-w-5xl">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-[24px] border border-emerald-200 bg-gradient-to-b from-emerald-50/50 to-white p-8 text-center shadow-[0_20px_50px_rgba(10,185,129,0.1)] sm:p-12"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="font-serif text-[30px] font-black text-[#0A1F44]">
                  Application Submitted Successfully!
                </h3>
                <p className="mx-auto mt-4 max-w-xl text-[16px] leading-[1.7] text-[#475569]">
                  Thank you, <strong className="text-[#0A1F44]">{formData.full_name}</strong>. Your career application has been registered with the Geeta University HR Department. Our team will review your qualifications and reach out to you shortly.
                </p>
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 rounded-[10px] bg-[#0A1F44] px-8 py-3.5 text-[15px] font-bold text-white transition-all hover:bg-[#1E3A8A]"
                  >
                    Submit Another Application
                  </button>
                </div>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_15px_45px_rgba(10,31,68,0.06)]"
              >
                {/* Form Top Header Banner */}
                <div className="bg-[#0A1F44] px-8 py-6 text-white sm:px-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-[22px] font-extrabold sm:text-[26px]">
                        Career Registration Form
                      </h3>
                      <p className="mt-1 text-[13.5px] text-white/70">
                        Please provide accurate information for quick processing.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-10 space-y-12">
                  {/* Error Notification Banner */}
                  {errorMessage && (
                    <div className="flex items-center gap-3 rounded-[12px] border border-red-200 bg-red-50 p-4 text-red-700">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <span className="text-[14px] font-medium">{errorMessage}</span>
                    </div>
                  )}

                  {/* SECTION 1: Personal Information */}
                  <div>
                    <div className="mb-6 flex items-center gap-3 border-b border-[#E2E8F0] pb-3">
                      <h4 className="font-serif text-[20px] font-bold text-[#0A1F44]">
                        Personal Information
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {/* Full Name */}
                      <div>
                        <label htmlFor="careers-full-name" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          ref={refs.full_name}
                          id="careers-full-name"
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          placeholder="e.g. Dr. Rajesh Sharma"
                          required
                          className={`w-full rounded-[10px] border px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:outline-none focus:ring-2 ${
                            fieldErrors.full_name
                              ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-200"
                              : "border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#E8871A] focus:bg-white focus:ring-[#E8871A]/20"
                          }`}
                        />
                        {fieldErrors.full_name && (
                          <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.full_name}</p>
                        )}
                      </div>

                      {/* Email Address */}
                      <div>
                        <label htmlFor="careers-email-address" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          ref={refs.email_address}
                          id="careers-email-address"
                          type="email"
                          name="email_address"
                          value={formData.email_address}
                          onChange={handleInputChange}
                          placeholder="e.g. rajesh.sharma@example.com"
                          required
                          className={`w-full rounded-[10px] border px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:outline-none focus:ring-2 ${
                            fieldErrors.email_address
                              ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-200"
                              : "border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#E8871A] focus:bg-white focus:ring-[#E8871A]/20"
                          }`}
                        />
                        {fieldErrors.email_address && (
                          <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.email_address}</p>
                        )}
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label htmlFor="careers-mobile-number" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          ref={refs.mobile_number}
                          id="careers-mobile-number"
                          type="tel"
                          name="mobile_number"
                          value={formData.mobile_number}
                          onChange={handleInputChange}
                          placeholder="e.g. 9876543210"
                          required
                          className={`w-full rounded-[10px] border px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:outline-none focus:ring-2 ${
                            fieldErrors.mobile_number
                              ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-200"
                              : "border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#E8871A] focus:bg-white focus:ring-[#E8871A]/20"
                          }`}
                        />
                        {fieldErrors.mobile_number && (
                          <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.mobile_number}</p>
                        )}
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label htmlFor="careers-date-of-birth" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          ref={refs.date_of_birth}
                          id="careers-date-of-birth"
                          type="date"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleInputChange}
                          className={`w-full rounded-[10px] border px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:outline-none focus:ring-2 ${
                            fieldErrors.date_of_birth
                              ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-200"
                              : "border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#E8871A] focus:bg-white focus:ring-[#E8871A]/20"
                          }`}
                        />
                        {fieldErrors.date_of_birth && (
                          <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.date_of_birth}</p>
                        )}
                      </div>

                      {/* Marital Status */}
                      <div>
                        <label htmlFor="careers-marital-status" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Marital Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          ref={refs.marital_status}
                          id="careers-marital-status"
                          name="marital_status"
                          aria-label="Marital Status"
                          value={formData.marital_status}
                          onChange={handleInputChange}
                          required
                          className={`w-full rounded-[10px] border px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:outline-none focus:ring-2 ${
                            fieldErrors.marital_status
                              ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-200"
                              : "border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#E8871A] focus:bg-white focus:ring-[#E8871A]/20"
                          }`}
                        >
                          <option value="">Select Marital Status</option>
                          {MARITAL_STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        {fieldErrors.marital_status && (
                          <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.marital_status}</p>
                        )}
                      </div>

                      {/* Gender */}
                      <div>
                        <label htmlFor="careers-gender" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                          ref={refs.gender}
                          id="careers-gender"
                          name="gender"
                          aria-label="Gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          required
                          className={`w-full rounded-[10px] border px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:outline-none focus:ring-2 ${
                            fieldErrors.gender
                              ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-200"
                              : "border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#E8871A] focus:bg-white focus:ring-[#E8871A]/20"
                          }`}
                        >
                          <option value="">Select Gender</option>
                          {GENDER_OPTIONS.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                        {fieldErrors.gender && (
                          <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.gender}</p>
                        )}
                      </div>

                      {/* Current City */}
                      <div>
                        <label htmlFor="careers-current-city" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Current City <span className="text-red-500">*</span>
                        </label>
                        <input
                          ref={refs.current_city}
                          id="careers-current-city"
                          type="text"
                          name="current_city"
                          value={formData.current_city}
                          onChange={handleInputChange}
                          placeholder="e.g. Panipat / New Delhi"
                          required
                          className={`w-full rounded-[10px] border px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:outline-none focus:ring-2 ${
                            fieldErrors.current_city
                              ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-200"
                              : "border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#E8871A] focus:bg-white focus:ring-[#E8871A]/20"
                          }`}
                        />
                        {fieldErrors.current_city && (
                          <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.current_city}</p>
                        )}
                      </div>

                      {/* Current State */}
                      <div>
                        <label htmlFor="careers-current-state" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Current State <span className="text-red-500">*</span>
                        </label>
                        <input
                          ref={refs.current_state}
                          id="careers-current-state"
                          type="text"
                          name="current_state"
                          value={formData.current_state}
                          onChange={handleInputChange}
                          placeholder="e.g. Haryana"
                          required
                          className={`w-full rounded-[10px] border px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:outline-none focus:ring-2 ${
                            fieldErrors.current_state
                              ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-200"
                              : "border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#E8871A] focus:bg-white focus:ring-[#E8871A]/20"
                          }`}
                        />
                        {fieldErrors.current_state && (
                          <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.current_state}</p>
                        )}
                      </div>

                      {/* Home State */}
                      <div>
                        <label htmlFor="careers-home-state" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Home State <span className="text-red-500">*</span>
                        </label>
                        <input
                          ref={refs.home_state}
                          id="careers-home-state"
                          type="text"
                          name="home_state"
                          value={formData.home_state}
                          onChange={handleInputChange}
                          placeholder="e.g. Haryana"
                          required
                          className={`w-full rounded-[10px] border px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:outline-none focus:ring-2 ${
                            fieldErrors.home_state
                              ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-200"
                              : "border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#E8871A] focus:bg-white focus:ring-[#E8871A]/20"
                          }`}
                        />
                        {fieldErrors.home_state && (
                          <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.home_state}</p>
                        )}
                      </div>

                      {/* Highest Qualification */}
                      <div>
                        <label htmlFor="careers-highest-qualification" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Highest Qualification <span className="text-red-500">*</span>
                        </label>
                        <input
                          ref={refs.highest_qualification}
                          id="careers-highest-qualification"
                          type="text"
                          name="highest_qualification"
                          value={formData.highest_qualification}
                          onChange={handleInputChange}
                          placeholder="e.g. Ph.D. in Computer Science / M.Tech"
                          required
                          className={`w-full rounded-[10px] border px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:outline-none focus:ring-2 ${
                            fieldErrors.highest_qualification
                              ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-200"
                              : "border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#E8871A] focus:bg-white focus:ring-[#E8871A]/20"
                          }`}
                        />
                        {fieldErrors.highest_qualification && (
                          <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.highest_qualification}</p>
                        )}
                      </div>

                      {/* LinkedIn Profile */}
                      <div className="sm:col-span-2 lg:col-span-2">
                        <label htmlFor="careers-linkedin-profile" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          LinkedIn Profile URL
                        </label>
                        <input
                          id="careers-linkedin-profile"
                          type="url"
                          name="linked_in_profile"
                          value={formData.linked_in_profile}
                          onChange={handleInputChange}
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Employer Details */}
                  <div>
                    <div className="mb-6 flex items-center gap-3 border-b border-[#E2E8F0] pb-3">
                      <h4 className="font-serif text-[20px] font-bold text-[#0A1F44]">
                        Employer Details
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {/* Current Employer */}
                      <div>
                        <label htmlFor="careers-current-employer" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Current Employer
                        </label>
                        <input
                          id="careers-current-employer"
                          type="text"
                          name="current_employer"
                          value={formData.current_employer}
                          onChange={handleInputChange}
                          placeholder="e.g. ABC Institute"
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        />
                      </div>

                      {/* Previous Employer */}
                      <div>
                        <label htmlFor="careers-previous-employer" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Previous Employer
                        </label>
                        <input
                          id="careers-previous-employer"
                          type="text"
                          name="previous_employer"
                          value={formData.previous_employer}
                          onChange={handleInputChange}
                          placeholder="e.g. XYZ University"
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        />
                      </div>

                      {/* Experience Type (GU-11: Corrected from "Total Experience" to "Experience Type") */}
                      <div>
                        <label htmlFor="careers-experience-type" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Experience Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          ref={refs.total_experience}
                          id="careers-experience-type"
                          name="total_experience"
                          aria-label="Experience Type"
                          value={formData.total_experience}
                          onChange={handleInputChange}
                          required
                          className={`w-full rounded-[10px] border px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:outline-none focus:ring-2 ${
                            fieldErrors.total_experience
                              ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-200"
                              : "border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#E8871A] focus:bg-white focus:ring-[#E8871A]/20"
                          }`}
                        >
                          <option value="">Select Experience Type</option>
                          {EXPERIENCE_TYPE_OPTIONS.map((exp) => (
                            <option key={exp} value={exp}>
                              {exp}
                            </option>
                          ))}
                        </select>
                        {fieldErrors.total_experience && (
                          <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.total_experience}</p>
                        )}
                      </div>

                      {/* Designation */}
                      <div>
                        <label htmlFor="careers-designation" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Designation
                        </label>
                        <input
                          id="careers-designation"
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleInputChange}
                          placeholder="e.g. Assistant Professor"
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        />
                      </div>

                      {/* Key Skills */}
                      <div>
                        <label htmlFor="careers-key-skills" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Key Skills
                        </label>
                        <input
                          id="careers-key-skills"
                          type="text"
                          name="key_skills"
                          value={formData.key_skills}
                          onChange={handleInputChange}
                          placeholder="e.g. AI, Python, Curriculum Design"
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        />
                      </div>

                      {/* Notice Period */}
                      <div>
                        <label htmlFor="careers-notice-period" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Notice Period
                        </label>
                        <input
                          id="careers-notice-period"
                          type="text"
                          name="notice_period"
                          value={formData.notice_period}
                          onChange={handleInputChange}
                          placeholder="e.g. 1 Month / Immediate"
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        />
                      </div>

                      {/* Current CTC */}
                      <div>
                        <label htmlFor="careers-current-ctc" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Current CTC
                        </label>
                        <input
                          id="careers-current-ctc"
                          type="text"
                          name="current_ctc"
                          value={formData.current_ctc}
                          onChange={handleInputChange}
                          placeholder="e.g. 8.5 LPA"
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        />
                      </div>

                      {/* Expected CTC */}
                      <div>
                        <label htmlFor="careers-expected-ctc" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Expected CTC
                        </label>
                        <input
                          id="careers-expected-ctc"
                          type="text"
                          name="expected_ctc"
                          value={formData.expected_ctc}
                          onChange={handleInputChange}
                          placeholder="e.g. 11 LPA"
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: Job Application & Department Selection */}
                  <div>
                    <div className="mb-6 flex items-center gap-3 border-b border-[#E2E8F0] pb-3">
                      <h4 className="font-serif text-[20px] font-bold text-[#0A1F44]">
                        Job Application &amp; Department Selection
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {/* Job Application Category */}
                      <div>
                        <label htmlFor="careers-job-category" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Job Application For <span className="text-red-500">*</span>
                        </label>
                        <select
                          ref={refs.job_application_for}
                          id="careers-job-category"
                          name="job_application_for"
                          aria-label="Job Application Category"
                          value={formData.job_application_for}
                          onChange={handleCategoryChange}
                          required
                          className={`w-full rounded-[10px] border px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:outline-none focus:ring-2 ${
                            fieldErrors.job_application_for
                              ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-200"
                              : "border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#E8871A] focus:bg-white focus:ring-[#E8871A]/20"
                          }`}
                        >
                          <option value="">Select Job Category</option>
                          {JOB_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        {fieldErrors.job_application_for && (
                          <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.job_application_for}</p>
                        )}
                      </div>

                      {/* Department Dropdown (Filtered dynamically) */}
                      <div>
                        <label htmlFor="careers-department" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Select Department <span className="text-red-500">*</span>
                        </label>
                        <select
                          ref={refs.department}
                          id="careers-department"
                          name="department"
                          aria-label="Department"
                          value={formData.department}
                          onChange={handleInputChange}
                          required
                          className={`w-full rounded-[10px] border px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:outline-none focus:ring-2 ${
                            fieldErrors.department
                              ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-200"
                              : "border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#E8871A] focus:bg-white focus:ring-[#E8871A]/20"
                          }`}
                        >
                          <option value="">
                            {formData.job_application_for
                              ? `Select Department (${filteredDepartments.length} available)`
                              : "Select Job Category First"}
                          </option>
                          {filteredDepartments.map((dept) => (
                            <option key={dept.value} value={dept.value}>
                              {dept.label}
                            </option>
                          ))}
                        </select>
                        {fieldErrors.department && (
                          <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.department}</p>
                        )}
                      </div>

                      {/* Reference / Source */}
                      <div>
                        <label htmlFor="careers-reference-source" className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Reference / Source of Information
                        </label>
                        <input
                          id="careers-reference-source"
                          type="text"
                          name="reference_source"
                          value={formData.reference_source}
                          onChange={handleInputChange}
                          placeholder="e.g. Website, Newspaper, LinkedIn"
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button Block */}
                  <div className="pt-4 text-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group inline-flex min-w-[220px] items-center justify-center gap-3 rounded-[12px] bg-[#0A1F44] px-10 py-4 text-[16px] font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#073C70] hover:shadow-[0_10px_25px_rgba(10,31,68,0.25)] disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin text-[#E8871A]" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Submit Application</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}