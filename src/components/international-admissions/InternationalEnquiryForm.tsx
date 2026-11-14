"use client";

import React, { useState, FormEvent, useRef } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2, Globe, Mail, Phone, User, BookOpen } from "lucide-react";

export interface InternationalEnquiryFormProps {
  data?: {
    title?: string;
    subtitle?: string;
  };
}

export default function InternationalEnquiryForm({ data }: InternationalEnquiryFormProps = {}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    country: "",
    course: "",
    message: "",
    agree: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const countryInputRef = useRef<HTMLInputElement>(null);
  const courseInputRef = useRef<HTMLSelectElement>(null);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = "Full name is required.";
    }
    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile/WhatsApp number is required.";
    } else if (!/^\+?[0-9]{8,16}$/.test(formData.mobile.trim().replace(/[\s-]/g, ""))) {
      errors.mobile = "Enter a valid international phone number (8-16 digits with country code).";
    }
    if (!formData.country.trim()) {
      errors.country = "Country of residence is required.";
    }
    if (!formData.course.trim()) {
      errors.course = "Please select a program or level of study.";
    }
    if (!formData.agree) {
      errors.agree = "Please confirm your consent to be contacted by international admissions.";
    }
    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      if (errors.name) nameInputRef.current?.focus();
      else if (errors.email) emailInputRef.current?.focus();
      else if (errors.mobile) mobileInputRef.current?.focus();
      else if (errors.country) countryInputRef.current?.focus();
      else if (errors.course) courseInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          mobile: formData.mobile.trim().replace(/[\s-]/g, ""),
          state: formData.country.trim(),
          city: formData.country.trim(),
          course: formData.course.trim(),
          discipline: "International Admissions",
          agree: formData.agree,
          type: "INTERNATIONAL_ADMISSION_ENQUIRY",
          page_url: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to submit enquiry. Please try again.");
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred while submitting your enquiry.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      country: "",
      course: "",
      message: "",
      agree: false,
    });
    setFieldErrors({});
    setErrorMessage(null);
    setIsSubmitted(false);
  };

  return (
    <section id="enquiry-form" className="scroll-mt-24 py-16 md:py-24 bg-white border-b border-[#E2E8F0]">
      <div className="gu-container max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E0F0FF] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0A5A8A] mb-3">
            <Globe className="h-4 w-4 text-[#E8871A]" />
            Global Admissions Desk
          </div>
          <h2 className="font-serif text-[32px] sm:text-[40px] font-black text-[#0A1F44] tracking-tight">
            {data?.title || "International Student Admission Enquiry"}
          </h2>
          <p className="mt-3 text-base text-[#64748B] max-w-2xl mx-auto">
            {data?.subtitle ||
              "Ready to join a vibrant community of scholars from 30+ nations? Share your details with our International Office for curriculum guidance, visa assistance, and merit scholarships."}
          </p>
        </div>

        {isSubmitted ? (
          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/50 p-8 sm:p-12 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-[26px] font-black text-[#0A1F44]">
              Enquiry Received Successfully!
            </h3>
            <p className="mt-3 text-[15.5px] text-[#475569] max-w-lg mx-auto leading-relaxed">
              Thank you, <strong className="text-[#0A1F44]">{formData.name}</strong>. An international admissions officer will review your background and reach out via email and WhatsApp with admission eligibility and fee details.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-[12px] bg-[#0A1F44] px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#1E3A8A]"
              >
                Submit Another Enquiry
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-[24px] border border-[#E2E8F0] bg-white p-6 sm:p-10 shadow-lg"
          >
            {errorMessage && (
              <div className="mb-6 flex items-center gap-3 rounded-[12px] border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label htmlFor="intl-name" className="block text-[13px] font-bold text-[#0A1F44] mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-[#94A3B8]" />
                  <input
                    ref={nameInputRef}
                    id="intl-name"
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Johnathan Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full rounded-[10px] border pl-10 pr-4 py-2.5 text-[14.5px] text-[#0A1F44] transition-all focus:outline-none focus:ring-2 ${
                      fieldErrors.name
                        ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-200"
                        : "border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#0A5A8A] focus:bg-white focus:ring-[#0A5A8A]/20"
                    }`}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="intl-email" className="block text-[13px] font-bold text-[#0A1F44] mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#94A3B8]" />
                  <input
                    ref={emailInputRef}
                    id="intl-email"
                    name="email"
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full rounded-[10px] border pl-10 pr-4 py-2.5 text-[14.5px] text-[#0A1F44] transition-all focus:outline-none focus:ring-2 ${
                      fieldErrors.email
                        ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-200"
                        : "border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#0A5A8A] focus:bg-white focus:ring-[#0A5A8A]/20"
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              {/* Mobile / WhatsApp with Country Code */}
              <div>
                <label htmlFor="intl-mobile" className="block text-[13px] font-bold text-[#0A1F44] mb-1.5">
                  Mobile / WhatsApp (with Country Code) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-[#94A3B8]" />
                  <input
                    ref={mobileInputRef}
                    id="intl-mobile"
                    name="mobile"
                    type="tel"
                    required
                    placeholder="e.g. +977 9801234567"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className={`w-full rounded-[10px] border pl-10 pr-4 py-2.5 text-[14.5px] text-[#0A1F44] transition-all focus:outline-none focus:ring-2 ${
                      fieldErrors.mobile
                        ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-200"
                        : "border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#0A5A8A] focus:bg-white focus:ring-[#0A5A8A]/20"
                    }`}
                  />
                </div>
                {fieldErrors.mobile && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.mobile}</p>
                )}
              </div>

              {/* Country of Residence */}
              <div>
                <label htmlFor="intl-country" className="block text-[13px] font-bold text-[#0A1F44] mb-1.5">
                  Country of Residence <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-[#94A3B8]" />
                  <input
                    ref={countryInputRef}
                    id="intl-country"
                    name="country"
                    type="text"
                    required
                    placeholder="e.g. Nepal, Nigeria, Bhutan, UAE"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className={`w-full rounded-[10px] border pl-10 pr-4 py-2.5 text-[14.5px] text-[#0A1F44] transition-all focus:outline-none focus:ring-2 ${
                      fieldErrors.country
                        ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-200"
                        : "border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#0A5A8A] focus:bg-white focus:ring-[#0A5A8A]/20"
                    }`}
                  />
                </div>
                {fieldErrors.country && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.country}</p>
                )}
              </div>

              {/* Program of Interest */}
              <div className="sm:col-span-2">
                <label htmlFor="intl-course" className="block text-[13px] font-bold text-[#0A1F44] mb-1.5">
                  Program of Interest <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-3.5 h-4 w-4 text-[#94A3B8]" />
                  <select
                    ref={courseInputRef}
                    id="intl-course"
                    name="course"
                    required
                    aria-label="Program of Interest"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className={`w-full rounded-[10px] border pl-10 pr-4 py-2.5 text-[14.5px] text-[#0A1F44] transition-all focus:outline-none focus:ring-2 ${
                      fieldErrors.course
                        ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-200"
                        : "border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#0A5A8A] focus:bg-white focus:ring-[#0A5A8A]/20"
                    }`}
                  >
                    <option value="">Select Level &amp; Program</option>
                    <option value="B.Tech Computer Science & Engineering">B.Tech Computer Science &amp; Engineering</option>
                    <option value="B.Tech AI & Machine Learning">B.Tech AI &amp; Machine Learning</option>
                    <option value="BBA / MBA Business Administration">BBA / MBA Business Administration</option>
                    <option value="BCA / MCA Computer Applications">BCA / MCA Computer Applications</option>
                    <option value="B.Sc (Hons.) Agriculture">B.Sc (Hons.) Agriculture</option>
                    <option value="B.Pharm / D.Pharm Pharmacy">B.Pharm / D.Pharm Pharmacy</option>
                    <option value="BA LL.B / BBA LL.B Law">BA LL.B / BBA LL.B Law</option>
                    <option value="Hotel Management & Tourism">Hotel Management &amp; Tourism</option>
                    <option value="Forensic Sciences">Forensic Sciences</option>
                    <option value="Ph.D Doctoral Studies">Ph.D. Doctoral Studies</option>
                    <option value="Other Programs">Other Programs</option>
                  </select>
                </div>
                {fieldErrors.course && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.course}</p>
                )}
              </div>
            </div>

            {/* Consent Checkbox (Opt-in) */}
            <div className="mt-6 border-t border-[#E2E8F0] pt-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="intl-agree"
                  name="agree"
                  checked={formData.agree}
                  onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0A5A8A] focus:ring-[#0A5A8A]"
                />
                <span className="text-[13px] text-[#475569] leading-snug">
                  I give my explicit consent to Geeta University International Admissions Office to contact me via email, telephone, and WhatsApp regarding academic programs, scholarships, and visa guidelines.
                </span>
              </label>
              {fieldErrors.agree && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.agree}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#E8871A] px-8 py-3.5 text-[15px] font-extrabold text-white shadow-md transition-all hover:bg-[#d47814] active:scale-95 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit International Enquiry</span>
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
