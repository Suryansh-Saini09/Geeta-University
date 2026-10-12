"use client";

import React, { useState, useMemo, ChangeEvent, FormEvent } from "react";
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

export default function CareersForm({ formConfig }: CareersFormProps) {
  const [formData, setFormData] = useState<FormDataState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate mandatory fields
    if (!formData.full_name.trim()) {
      setErrorMessage("Please enter your Full Name.");
      return;
    }
    if (!formData.email_address.trim()) {
      setErrorMessage("Please enter a valid Email Address.");
      return;
    }
    if (!formData.mobile_number.trim()) {
      setErrorMessage("Please enter your Mobile Number.");
      return;
    }
    if (!formData.current_city.trim()) {
      setErrorMessage("Please enter your Current City.");
      return;
    }
    if (!formData.highest_qualification.trim()) {
      setErrorMessage("Please specify your Highest Qualification.");
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission asynchronously
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleReset = () => {
    setFormData(initialFormState);
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
                className="rounded-[24px] border border-emerald-200 bg-gradient-to-b from-emerald-50/50 to-white p-8 text-center shadow-[0_20px_50px_rgba(16,185,129,0.1)] sm:p-12"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="font-serif text-[30px] font-black text-[#0A1F44]">
                  Application Submitted Successfully!
                </h3>
                <p className="mx-auto mt-4 max-w-xl text-[16px] leading-[1.7] text-[#475569]">
                  Thank you, <strong className="text-[#0A1F44]">{formData.full_name}</strong>. Your career application has been registered with Geeta University HR Department. Our team will review your application and reach out to you shortly.
                </p>
                <div className="mt-8 flex justify-center">
                  <button
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
                  {/* Error Notification */}
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
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          placeholder="e.g. Dr. Rajesh Sharma"
                          required
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        />
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email_address"
                          value={formData.email_address}
                          onChange={handleInputChange}
                          placeholder="e.g. rajesh.sharma@example.com"
                          required
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        />
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="mobile_number"
                          value={formData.mobile_number}
                          onChange={handleInputChange}
                          placeholder="e.g. 9876543210"
                          required
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        />
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Date of Birth
                        </label>
                        <input
                          type="text"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleInputChange}
                          placeholder="DD/MM/YYYY"
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        />
                      </div>

                      {/* Marital Status */}
                      <div>
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Marital Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="marital_status"
                          value={formData.marital_status}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        >
                          <option value="">Select Marital Status</option>
                          {MARITAL_STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        >
                          <option value="">Select Gender</option>
                          {GENDER_OPTIONS.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Current City */}
                      <div>
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Current City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="current_city"
                          value={formData.current_city}
                          onChange={handleInputChange}
                          placeholder="e.g. Panipat / New Delhi"
                          required
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        />
                      </div>

                      {/* Current State */}
                      <div>
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Current State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="current_state"
                          value={formData.current_state}
                          onChange={handleInputChange}
                          placeholder="e.g. Haryana"
                          required
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        />
                      </div>

                      {/* Home State */}
                      <div>
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Home State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="home_state"
                          value={formData.home_state}
                          onChange={handleInputChange}
                          placeholder="e.g. Haryana"
                          required
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        />
                      </div>

                      {/* Highest Qualification */}
                      <div>
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Highest Qualification <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="highest_qualification"
                          value={formData.highest_qualification}
                          onChange={handleInputChange}
                          placeholder="e.g. Ph.D. in Computer Science / M.Tech"
                          required
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        />
                      </div>

                      {/* LinkedIn Profile */}
                      <div className="sm:col-span-2 lg:col-span-2">
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          LinkedIn Profile URL
                        </label>
                        <input
                          type="text"
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
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Current Employer
                        </label>
                        <input
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
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Previous Employer
                        </label>
                        <input
                          type="text"
                          name="previous_employer"
                          value={formData.previous_employer}
                          onChange={handleInputChange}
                          placeholder="e.g. XYZ University"
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        />
                      </div>

                      {/* Total Experience */}
                      <div>
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Total Experience <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="total_experience"
                          value={formData.total_experience}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        >
                          <option value="">Select Total Experience</option>
                          {EXPERIENCE_TYPE_OPTIONS.map((exp) => (
                            <option key={exp} value={exp}>
                              {exp}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Designation */}
                      <div>
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Designation
                        </label>
                        <input
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
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Key Skills
                        </label>
                        <input
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
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Notice Period
                        </label>
                        <input
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
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Current CTC
                        </label>
                        <input
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
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Expected CTC
                        </label>
                        <input
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
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Job Application For <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="job_application_for"
                          value={formData.job_application_for}
                          onChange={handleCategoryChange}
                          required
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
                        >
                          <option value="">Select Job Category</option>
                          {JOB_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Department Dropdown (Filtered dynamically) */}
                      <div>
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Select Department <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14.5px] text-[#0A1F44] transition-all focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20"
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
                      </div>

                      {/* Reference / Source */}
                      <div>
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0A1F44]">
                          Reference / Source of Information
                        </label>
                        <input
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
