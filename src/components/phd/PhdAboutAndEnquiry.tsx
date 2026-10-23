"use client";

import React, { useState } from "react";
import Link from "next/link";
import { phdDisciplines } from "@/data/phdData";
import { INDIAN_STATES, getCitiesForState } from "@/data/indianLocations";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export interface PhdAboutAndEnquiryProps {
  data?: {
    title?: string;
    description?: string;
    disciplines?: Array<{ name: string; href?: string } | string>;
  };
}

export default function PhdAboutAndEnquiry({ data }: PhdAboutAndEnquiryProps = {}) {
  const disciplines = data?.disciplines && data.disciplines.length > 0
    ? data.disciplines.map((d) => (typeof d === "string" ? { name: d, href: "#enquire" } : { name: d.name, href: d.href || "#enquire" }))
    : phdDisciplines;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stName = e.target.value;
    setSelectedState(stName);
    setSelectedCity("");
    setFilteredCities(getCitiesForState(stName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (name.trim().length < 3) {
      setStatusMsg({ type: "error", text: "Please enter a valid full name." });
      return;
    }
    if (mobile.trim().length < 10 || !/^\d+$/.test(mobile.trim())) {
      setStatusMsg({
        type: "error",
        text: "Please enter a valid 10-digit mobile number.",
      });
      return;
    }
    if (!selectedState) {
      setStatusMsg({ type: "error", text: "Please select your state." });
      return;
    }
    if (!selectedCity) {
      setStatusMsg({ type: "error", text: "Please select your city." });
      return;
    }
    if (!selectedProgram) {
      setStatusMsg({
        type: "error",
        text: "Please select a Ph.D. program discipline.",
      });
      return;
    }

    setLoading(true);
    setStatusMsg({ type: "info", text: "Submitting your application..." });

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          mobile: mobile.trim(),
          state: selectedState,
          city: selectedCity,
          discipline: "Doctoral Programs (Ph.D.)",
          course: selectedProgram,
          type: "PHD_ENQUIRY",
          page_url:
            typeof window !== "undefined"
              ? window.location.href
              : "https://geetauniversity.edu.in/phd",
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setStatusMsg({
          type: "success",
          text:
            "Thank you! Your enquiry has been submitted successfully. The Ph.D. cell will contact you shortly.",
        });
        setSubmitted(true);
      } else {
        setStatusMsg({
          type: "error",
          text: data.message || "Submission failed. Please try again.",
        });
      }
    } catch {
      setStatusMsg({
        type: "error",
        text: "Submission failed due to a network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="about-phd" className="w-full bg-[#F3F5F6] py-14 sm:py-18 md:py-22">
      <div className="gu-container">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10 items-start">
          {/* Left Column: About Program & Disciplines */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            <div>
              <h2 className="font-serif text-[32px] sm:text-[40px] md:text-[46px] font-black text-[#0A1F44] leading-tight">
                ABOUT THE PROGRAM
              </h2>
            </div>

            <p className="text-[16.5px] sm:text-[18px] leading-[1.8] text-[#334155]">
              Geeta University offers interdisciplinary, research-driven Ph.D. programs. With advanced infrastructure,
              expert faculty, and a strong focus on innovation, our Ph.D. programs are designed to produce future-ready
              scholars and researchers. The following are the disciplines in which Ph.D. is being offered in this academic year:
            </p>

            {/* Disciplines Grid / List */}
            <div className="rounded-[20px] bg-white p-6 sm:p-8 border border-[#E2E8F0] shadow-sm">
              <h3 className="font-serif text-[20px] sm:text-[22px] font-bold text-[#0A1F44] mb-4 pb-3 border-b border-[#F1F5F9]">
                Available Ph.D. Disciplines
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {disciplines.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group flex items-center justify-between rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 transition-all duration-200 hover:border-[#E8871A] hover:bg-[#FFF8F2] hover:shadow-sm"
                  >
                    <span className="text-[14.5px] sm:text-[15px] font-semibold text-[#06355F] group-hover:text-[#E8871A] transition-colors leading-snug">
                      {item.name}
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#94A3B8] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#E8871A] shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Enquiry Form Card */}
          <div id="enquire" className="lg:col-span-5 xl:col-span-5">
            <div className="sticky top-24 rounded-[24px] border border-[#CBD5E1] bg-white p-6 sm:p-8 shadow-[0_10px_35px_rgba(10,31,68,0.08)]">
              <div className="mb-6 text-center border-b border-[#F1F5F9] pb-4">
                <h3 className="font-serif text-[26px] sm:text-[30px] font-black text-[#0A1F44] leading-tight">
                  Enquire Now
                </h3>
                <p className="mt-1 text-[14px] text-[#64748B]">
                  Fill the details below to apply for Ph.D. Admissions Open
                </p>
              </div>

              {submitted ? (
                <div className="rounded-[16px] bg-[#ECFDF5] border border-[#10B981]/20 p-6 text-center text-[#065F46]">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-[#10B981] mb-3" />
                  <h4 className="font-bold text-[18px]">Form Submitted!</h4>
                  <p className="text-[14px] mt-1 text-[#047857]">
                    Your Ph.D. application inquiry has been registered. Our admissions counselor will contact you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setEmail("");
                      setMobile("");
                      setSelectedState("");
                      setSelectedCity("");
                      setSelectedProgram("");
                      setStatusMsg(null);
                    }}
                    className="mt-4 inline-block rounded-[10px] bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#1A3A6B]"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-11 pr-4 text-[15px] font-medium text-[#0A1F44] placeholder:text-[#94A3B8] focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20 transition-all"
                    />
                  </div>

                  {/* Email Address (Optional) */}
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-11 pr-4 text-[15px] font-medium text-[#0A1F44] placeholder:text-[#94A3B8] focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20 transition-all"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                    <input
                      type="tel"
                      placeholder="Contact Number (10 digits)"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      maxLength={10}
                      required
                      className="w-full rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-11 pr-4 text-[15px] font-medium text-[#0A1F44] placeholder:text-[#94A3B8] focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20 transition-all"
                    />
                  </div>

                  {/* State */}
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                    <select
                      value={selectedState}
                      onChange={handleStateChange}
                      required
                      className="w-full rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-11 pr-8 text-[15px] font-medium text-[#0A1F44] focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      required
                      disabled={!selectedState}
                      className="w-full rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-11 pr-8 text-[15px] font-medium text-[#0A1F44] focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20 transition-all appearance-none cursor-pointer disabled:opacity-60"
                    >
                      <option value="">{selectedState ? "Select City" : "Select State First"}</option>
                      {filteredCities.map((cityName, idx) => (
                        <option key={idx} value={cityName}>
                          {cityName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Program */}
                  <div className="relative">
                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                    <select
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(e.target.value)}
                      required
                      className="w-full rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-11 pr-8 text-[15px] font-medium text-[#0A1F44] focus:border-[#E8871A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Ph.D. Program</option>
                      {phdDisciplines.map((d, idx) => (
                        <option key={idx} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-[12px] bg-[#E8871A] py-3.5 text-center text-[16px] font-bold text-white shadow-md transition-all hover:bg-[#D47309] hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>

                  {/* Status Alerts */}
                  {statusMsg && (
                    <div
                      className={`flex items-start gap-2.5 rounded-[12px] p-3 text-[13.5px] font-medium ${
                        statusMsg.type === "success"
                          ? "bg-[#ECFDF5] text-[#065F46] border border-[#10B981]/20"
                          : statusMsg.type === "info"
                          ? "bg-[#EFF6FF] text-[#1E40AF] border border-[#3B82F6]/20"
                          : "bg-[#FEF2F2] text-[#991B1B] border border-[#EF4444]/20"
                      }`}
                    >
                      {statusMsg.type === "success" ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-[#10B981]" />
                      ) : (
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      )}
                      <span>{statusMsg.text}</span>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
