"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Award,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Globe2,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function IcnfprAbout() {
  const [showMoreUni, setShowMoreUni] = useState(false);
  const [showMoreGip, setShowMoreGip] = useState(false);

  return (
    <div className="bg-white text-[#0A1F44]">
      {/* 1. ABOUT THE UNIVERSITY (Clean Light Section with High-Contrast Text & Key Highlights) */}
      <section id="about-university" className="py-20 lg:py-24 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text & University Campus Photo */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 mb-3 text-[#E8871A] font-extrabold text-xs tracking-widest uppercase">
                <span className="w-6 h-0.5 bg-[#E8871A]" />
                <span>Institutional Heritage</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A1F44] mb-6 leading-tight">
                About Geeta <span className="text-[#E8871A]">University</span>
              </h2>

              <div className="space-y-4 text-[#334155] text-[15.5px] leading-relaxed text-justify">
                <p>
                  Geeta University (GU) is raising the bar for excellence in the field of education. Geeta University comes from the rich legacy of Geeta Group of Institutions, a K.R Education Society initiative, with 41 years of experience in bringing focused higher education to the forefront for the generation next. XEDGE at GU enables our students to go out in the world as Complete Corporate Citizens. Our students are the Future and Future thrives on passion, dedication and application to become a wonderful present.
                </p>

                <div className={`${showMoreUni ? "block" : "hidden sm:block"} space-y-4`}>
                  <p>
                    Furthermore, the University is poised to take you to great heights because its wings are made of the vision of higher global knowledge and it is rooted in the philosophy of Karma. It represents the culmination of aspiration, ambitions, and an honest attempt at creating a world class professional curriculum rendered through an invigorating campus environment.
                  </p>
                  <p>
                    The University is charting a different road map for the future of the students by laying a runway of brilliant faculty across the best of their fields in the country. With holistic student development being its prime pivot, the University creates benchmarks of excellence by placing them with the finest career skills, social skills, and life skills to take off for where the sky is not the limit.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMoreUni(!showMoreUni)}
                  className="sm:hidden inline-flex items-center gap-1.5 text-xs font-bold text-[#E8871A] hover:underline pt-1"
                >
                  <span>{showMoreUni ? "Read Less" : "Read More"}</span>
                  <ChevronDown size={14} className={`transform transition-transform ${showMoreUni ? "rotate-180" : ""}`} />
                </button>
              </div>

              {/* University Campus Image */}
              <div className="mt-8 relative w-full h-[260px] sm:h-[320px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <Image
                  src="/uploads/all/2057/img.webp"
                  alt="Geeta University Campus"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            {/* Right Column: Quick Register / Highlights Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-7 sm:p-9 border border-[#E8871A]/25 shadow-[0_12px_35px_rgba(10,31,68,0.06)] relative overflow-hidden">
                {/* Top Accent Strip */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF5F19] to-[#E8871A]" />

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-[#E8871A] font-bold text-xs uppercase tracking-wider mb-4 border border-amber-200/60">
                  <Calendar size={13} />
                  <span>Conference Registration</span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#0A1F44] mb-2">
                  Key Dates &amp; Quick Register
                </h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  Join researchers, academicians, and pharmacy professionals at ICNFPR-2026.
                </p>

                <div className="space-y-3.5 mb-8">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#E8871A]">Event Dates</p>
                      <p className="font-bold text-sm text-[#0A1F44]">1st – 2nd May 2026</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-semibold">2 Days</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#E8871A]">Abstract Deadline</p>
                      <p className="font-bold text-sm text-[#0A1F44]">26th April 2026</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-[#E8871A] font-bold">Important</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#E8871A]">Early Bird Pricing</p>
                      <p className="font-bold text-sm text-[#0A1F44]">Upto 30th April 2026</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">Save 20%+</span>
                  </div>
                </div>

                <a
                  href="https://forms.gle/uFAwmSXBCNWdaSpy6"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "16px 20px",
                    borderRadius: "14px",
                    background: "#E8871A",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "16px",
                    textDecoration: "none",
                    boxShadow: "0 8px 20px rgba(232, 135, 26, 0.28)",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#d47813";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#E8871A";
                    e.currentTarget.style.transform = "translateY(0px)";
                  }}
                >
                  <span style={{ color: "#FFFFFF", fontWeight: 800 }}>Register for Conference</span>
                  <ArrowRight size={18} style={{ color: "#FFFFFF" }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT THE CONFERENCE & GEETA INSTITUTE OF PHARMACY */}
      <section id="about-conference" className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Card: About The Conference */}
            <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200">
              <div className="inline-flex items-center gap-2 mb-3 text-[#E8871A] font-extrabold text-xs tracking-widest uppercase">
                <span className="w-6 h-0.5 bg-[#E8871A]" />
                <span>Scope &amp; Objectives</span>
              </div>
              <h2 className="font-serif text-3xl font-black text-[#0A1F44] mb-5 leading-tight">
                About The <span className="text-[#E8871A]">Conference</span>
              </h2>

              <div className="space-y-4 text-[#334155] text-[15px] leading-relaxed text-justify">
                <p>
                  Geeta Institute of Pharmacy, Geeta University, Panipat, in collaboration with the IPA, Haryana Branch, proudly presents the <strong>Third International Conference ICNFPR-2026</strong>. This two-day conference, scheduled from <strong>1st to 2nd May 2026</strong>, promises to be a landmark event in the realm of pharmaceutical research and drug discovery, offering a platform for profound insights and invaluable connections.
                </p>
                <p>
                  <strong className="text-[#0A1F44]">Aim of the Conference:</strong> ICNFPR-2026 aims to ignite a spark of curiosity and innovation by refreshing the knowledge of students and faculty members while facilitating dynamic discussions on recent advancements and developments in pharmaceutical sciences.
                </p>

                <div className="pt-3">
                  <p className="font-bold text-[#0A1F44] mb-3">What to Expect:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-[#E8871A] flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles size={13} />
                      </span>
                      <span>
                        <strong className="text-[#0A1F44]">Plenary &amp; Keynote Talks:</strong> Renowned experts and pioneers in pharmacy sharing breakthrough perspectives.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-[#E8871A] flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen size={13} />
                      </span>
                      <span>
                        <strong className="text-[#0A1F44]">Poster Presentations:</strong> Witness the latest discoveries in pharmaceutical sciences through engaging research showcases.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-[#E8871A] flex items-center justify-center shrink-0 mt-0.5">
                        <Globe2 size={13} />
                      </span>
                      <span>
                        <strong className="text-[#0A1F44]">Networking Opportunities:</strong> Forge meaningful connections with fellow scholars, academicians, and pharma regulators.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Card: Geeta Institute of Pharmacy */}
            <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200">
              <div className="inline-flex items-center gap-2 mb-3 text-[#E8871A] font-extrabold text-xs tracking-widest uppercase">
                <span className="w-6 h-0.5 bg-[#E8871A]" />
                <span>Host Institute</span>
              </div>
              <h3 className="font-serif text-3xl font-black text-[#0A1F44] mb-5 leading-tight">
                Geeta Institute of <span className="text-[#E8871A]">Pharmacy</span>
              </h3>

              <div className="space-y-4 text-[#334155] text-[15px] leading-relaxed text-justify">
                <p>
                  Geeta Institute of Pharmacy (GIP) was established in 2019 &amp; is located in the historical city of Panipat. The institute was <strong>ranked 1st among the Top 10 Pharmacy Colleges in India</strong> by Higher Education Digest in 2022. The Institute is approved by <strong>Pharmacy Council of India (PCI)</strong>, New Delhi.
                </p>

                <div className={`${showMoreGip ? "block" : "hidden sm:block"} space-y-4`}>
                  <p>
                    The mission of the Institute is to be recognized as a premier pharmacy institute for Pharmacy Education &amp; Research in the NCR Region. The vision of the Institute is to produce competent pharmacists fulfilling the future needs of Society, Industry, Academics &amp; Research. It has highly accomplished faculty members from premier Govt. Institutes/Universities. It offers UG programs (B. Pharmacy &amp; D. Pharmacy) &amp; PG program M. Pharmacy, Ph.D (Pharm. Sciences).
                  </p>
                  <p>
                    The Institute has well-equipped laboratories with modern instruments and amenities to provide practical exposure in learning for its students. There is a central library with text books, e-journals, and e-books available online 24×7. Separate hostels for boys and girls, fully air-conditioned smart classrooms, and a dedicated Training &amp; Placement cell ensure holistic student success.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMoreGip(!showMoreGip)}
                  className="sm:hidden inline-flex items-center gap-1.5 text-xs font-bold text-[#E8871A] hover:underline pt-1"
                >
                  <span>{showMoreGip ? "Read Less" : "Read More"}</span>
                  <ChevronDown size={14} className={`transform transition-transform ${showMoreGip ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Full-width Pharmacy Infrastructure Showcase Image */}
          <div className="mt-12 relative w-full h-[280px] sm:h-[400px] lg:h-[480px] rounded-3xl overflow-hidden border border-slate-200 shadow-md">
            <Image
              src="/uploads/all/2226/1.webp"
              alt="Geeta Institute of Pharmacy Campus and Facilities"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          {/* IPA Strip */}
          <div className="mt-10 bg-slate-50 rounded-3xl p-8 border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4 flex items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative w-full h-24">
                  <Image
                    src="/uploads/all/2059/ipa.webp"
                    alt="Indian Pharmacist Association (IPA) Haryana Branch"
                    fill
                    className="object-contain object-center"
                  />
                </div>
              </div>
              <div className="md:col-span-8">
                <div className="inline-flex items-center gap-2 mb-2 text-[#E8871A] font-extrabold text-xs tracking-widest uppercase">
                  <span>Collaborating Partner</span>
                </div>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#0A1F44] mb-3">
                  Indian Pharmacist Association (IPA) – Haryana Branch
                </h4>
                <p className="text-[#334155] text-sm sm:text-base leading-relaxed text-justify">
                  The Indian Pharmacist Association (IPA), Haryana Branch is the professional body for pharmacists of India. Members include hospital pharmacists, manufacturing pharmacists, teachers and clinical pharmacists. Founded in 2011, the association is a member of the Global Health Workforce Alliance (WHO). The IPA is emerging as one of the largest organizations of pharmacists in India dedicated to elevating healthcare standards and professional opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
