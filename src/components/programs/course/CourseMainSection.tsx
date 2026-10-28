"use client";

import React, { useState } from "react";
import { BookOpen, GraduationCap, CheckCircle2 } from "lucide-react";
import type {
  CourseOverview,
  CourseAdmissionProcess,
  CourseWhatIs,
  CourseThrustAreas,
  CourseCollaborationsSection,
  CourseSubjectsSection,
  CourseResearchAchievements,
  FacultyResearchProfilesData,
  NestedListSection,
} from "@/data/programs/courses/types";
import AdmissionFormWrapper from "../AdmissionFormWrapper";

interface CourseMainSectionProps {
  overview?: CourseOverview;
  takeaways?: string[];
  takeawaysTitle?: string;
  subjects?: string[];
  subjectsTitle?: string;
  subjectsParagraphs?: string[];
  learningOutcomes?: string[];
  admission?: CourseAdmissionProcess;
  programName?: string;
  discipline?: string;
  whatIs?: CourseWhatIs;
  thrustAreas?: CourseThrustAreas;
  collaborationsSection?: CourseCollaborationsSection;
  subjectsSection?: CourseSubjectsSection;
  researchAchievements?: CourseResearchAchievements;
  facultyProfilesTable?: FacultyResearchProfilesData;
  whatWeOffer?: NestedListSection;
  additionalStrengths?: NestedListSection;
}

function renderBulletText(text: string) {
  const colonIndex = text.indexOf(":");
  if (colonIndex !== -1) {
    const prefix = text.slice(0, colonIndex + 1);
    const rest = text.slice(colonIndex + 1);
    return (
      <>
        <b className="font-bold text-[#0A1F44]">{prefix}</b>
        <span>{rest}</span>
      </>
    );
  }
  return <span>{text}</span>;
}

export default function CourseMainSection({
  overview,
  takeaways = [],
  takeawaysTitle,
  subjects = [],
  subjectsTitle,
  subjectsParagraphs = [],
  learningOutcomes = [],
  admission,
  programName,
  discipline,
  whatIs,
  thrustAreas,
  collaborationsSection,
  subjectsSection,
  researchAchievements,
  facultyProfilesTable,
  whatWeOffer,
  additionalStrengths,
}: CourseMainSectionProps) {
  const title = overview?.title || programName || "Course Overview";
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if expandable content exists
  const hasHiddenContent =
    Boolean(whatIs) ||
    Boolean(admission?.whyChooseHeading) ||
    Boolean(admission?.whyChooseParagraphs?.length) ||
    Boolean(admission?.title) ||
    Boolean(admission?.whyPreferTitle) ||
    Boolean(researchAchievements?.categories?.length) ||
    Boolean(facultyProfilesTable?.table?.length) ||
    Boolean(whatWeOffer?.items?.length) ||
    Boolean(additionalStrengths?.items?.length);

  return (
    <section className="w-full bg-[#FFFFFF] py-8 md:py-12 border-b border-slate-200/80">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Sequence identical to Geeta University official site */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6 text-[#334155]">
            {/* 1. Overview Header & Paragraphs */}
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: "clamp(26px, 3.2vw, 36px)",
                  fontWeight: 800,
                  color: "#0A1F44",
                  lineHeight: 1.2,
                  letterSpacing: "-0.5px",
                  marginBottom: 14,
                }}
              >
                {title}
              </h1>

              {overview?.paragraphs && overview.paragraphs.length > 0 && (
                <div className="space-y-3.5">
                  {overview.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      style={{
                        fontSize: "15px",
                        color: "#334155",
                        lineHeight: 1.7,
                        fontWeight: 400,
                      }}
                      className="text-justify"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              )}

              {/* Overview Bullet Points if provided */}
              {overview?.bullets && overview.bullets.length > 0 && (
                <div className="mt-3.5 space-y-2">
                  {overview.bullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F8FAFC] border border-slate-100 text-[#334155] text-[13.5px] sm:text-[14px] leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8871A] shrink-0 mt-2" />
                      <span>{renderBulletText(bullet)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Overview Outro if provided */}
              {overview?.outro && (
                <p
                  style={{
                    fontSize: "15px",
                    color: "#334155",
                    lineHeight: 1.7,
                    fontWeight: 400,
                  }}
                  className="text-justify mt-3.5"
                >
                  {overview.outro}
                </p>
              )}
            </div>

            {/* 2. Key Takeaways / USP Cards */}
            {takeaways.length > 0 && (
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 14,
                  padding: "18px 20px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.02)",
                }}
              >
                <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
                  <BookOpen size={18} className="text-[#0A1F44]" />
                  <h3
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#0A1F44",
                      margin: 0,
                    }}
                  >
                    {takeawaysTitle || "Key Takeaways"}
                  </h3>
                </div>
                <div className="space-y-2">
                  {takeaways.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F8FAFC] border border-slate-100 text-[#334155] text-[13.5px] sm:text-[14px] leading-relaxed"
                    >
                      <CheckCircle2
                        size={16}
                        className="text-[#E8871A] shrink-0 mt-0.5"
                      />
                      <span>{renderBulletText(point)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Program Structure / Key Subjects Covered */}
            {subjects.length > 0 && !subjectsSection && (
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 14,
                  padding: "18px 20px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.02)",
                }}
              >
                <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
                  <BookOpen size={18} className="text-[#0A1F44]" />
                  <h3
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#0A1F44",
                      margin: 0,
                    }}
                  >
                    {subjectsTitle || "Key Subjects Covered"}
                  </h3>
                </div>
                {subjectsParagraphs.length > 0 && (
                  <div className="mb-3.5 space-y-2 text-[#4A5568] text-[14.5px] sm:text-[15px] leading-relaxed">
                    {subjectsParagraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {subjects.map((sub, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-[#F8FAFC] border border-slate-200/80 text-[#1E293B] text-[13px] sm:text-[13.5px] font-semibold transition-all hover:bg-amber-50/60 hover:border-[#E8871A]/40 min-h-[38px]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8871A] shrink-0" />
                      <span className="leading-snug">{renderBulletText(sub)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Thrust Research Areas */}
            {thrustAreas && (
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 14,
                  padding: "18px 20px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.02)",
                }}
              >
                <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
                  <h3
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#0A1F44",
                      margin: 0,
                    }}
                  >
                    {thrustAreas.title}
                  </h3>
                </div>
                {thrustAreas.intro && (
                  <p className="text-[14.5px] text-[#334155] leading-relaxed text-justify mb-3.5">
                    {thrustAreas.intro}
                  </p>
                )}
                <div className="space-y-2.5">
                  {thrustAreas.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80 text-[13.5px] sm:text-[14px] leading-relaxed"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#0A1F44] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {item.number || idx + 1}
                      </span>
                      <div className="text-[#334155]">
                        <b className="font-bold text-[#0A1F44]">{item.title}: </b>
                        <span>{item.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* National & International Collaborations */}
            {collaborationsSection && (
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 14,
                  padding: "18px 20px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.02)",
                }}
              >
                <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
                  <h3
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#0A1F44",
                      margin: 0,
                    }}
                  >
                    {collaborationsSection.title}
                  </h3>
                </div>
                {collaborationsSection.intro && (
                  <p className="text-[14.5px] text-[#334155] leading-relaxed text-justify mb-3.5">
                    {collaborationsSection.intro}
                  </p>
                )}
                <div className="space-y-2.5">
                  {collaborationsSection.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80 text-[13.5px] sm:text-[14px] leading-relaxed"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#E8871A] shrink-0 mt-2" />
                      <div className="text-[#334155]">
                        <b className="font-bold text-[#0A1F44]">{item.title}: </b>
                        <span>{item.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {collaborationsSection.outro && (
                  <p className="text-[14.5px] text-[#334155] leading-relaxed text-justify mt-3.5">
                    {collaborationsSection.outro}
                  </p>
                )}
              </div>
            )}

            {/* PhD in Agriculture – Subjects (or custom subjectsSection) */}
            {subjectsSection && (
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 14,
                  padding: "18px 20px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.02)",
                }}
              >
                <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
                  <BookOpen size={18} className="text-[#0A1F44]" />
                  <h3
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#0A1F44",
                      margin: 0,
                    }}
                  >
                    {subjectsSection.title}
                  </h3>
                </div>
                {subjectsSection.intro && (
                  <p className="text-[14.5px] text-[#334155] leading-relaxed text-justify mb-3">
                    {subjectsSection.intro}
                  </p>
                )}
                <div className="space-y-2">
                  {subjectsSection.items.map((sub, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-[#F8FAFC] border border-slate-200/80 text-[#1E293B] text-[13.5px] font-semibold transition-all hover:bg-amber-50/60 hover:border-[#E8871A]/40 min-h-[38px]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8871A] shrink-0" />
                      <span className="leading-snug">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Program Learning Outcomes */}
            {learningOutcomes.length > 0 && (
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 14,
                  padding: "18px 20px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.02)",
                }}
              >
                <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
                  <GraduationCap size={18} className="text-[#0A1F44]" />
                  <h3
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#0A1F44",
                      margin: 0,
                    }}
                  >
                    Program Learning Outcomes
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {learningOutcomes.map((outcome, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 py-2 px-3 rounded-lg bg-[#F8FAFC] border border-slate-200 text-[#334155] text-[13px] sm:text-[13.5px] leading-snug min-h-[38px]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0A1F44] shrink-0 mt-1" />
                      <span>{renderBulletText(outcome)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Expandable Content (What Is, Admission Details, Why Prefer) */}
            {hasHiddenContent && isExpanded && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* 5a. What is Program / Degree */}
                {whatIs && (
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 14,
                      padding: "18px 20px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
                      <BookOpen size={18} className="text-[#0A1F44]" />
                      <h3
                        style={{
                          fontFamily: "var(--font-serif), Georgia, serif",
                          fontSize: 18,
                          fontWeight: 800,
                          color: "#0A1F44",
                          margin: 0,
                        }}
                      >
                        {whatIs.title}
                      </h3>
                    </div>
                    {whatIs.description && (
                      <p className="text-[14.5px] text-[#334155] leading-relaxed text-justify mb-3">
                        {whatIs.description}
                      </p>
                    )}
                    {whatIs.points && whatIs.points.length > 0 && (
                      <div className="space-y-2">
                        {whatIs.points.map((pt, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F8FAFC] border border-slate-100 text-[#334155] text-[13.5px] sm:text-[14px] leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E8871A] shrink-0 mt-2" />
                            <span>{renderBulletText(pt)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 5b. Admission Process & Eligibility */}
                {admission && (
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 14,
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.02)",
                      padding: "18px 20px",
                    }}
                    className="space-y-3.5"
                  >
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                      <GraduationCap size={18} className="text-[#0A1F44] shrink-0" />
                      <h3
                        style={{
                          fontFamily: "var(--font-serif), Georgia, serif",
                          fontSize: 18,
                          fontWeight: 800,
                          color: "#0A1F44",
                          margin: 0,
                        }}
                      >
                        {admission.title || admission.whyChooseHeading || "Admission Process"}
                      </h3>
                    </div>

                    {admission.whyChooseIntro && (
                      <p className="text-[14.5px] text-[#334155] leading-relaxed text-justify mb-2">
                        {admission.whyChooseIntro}
                      </p>
                    )}

                    {admission.eligibility && (
                      <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-[#0A1F44] text-[13.5px] sm:text-[14px] font-medium leading-relaxed">
                        {!admission.eligibility.toLowerCase().startsWith("eligibility") && (
                          <span className="font-bold text-[#E8871A] mr-1.5">
                            Eligibility:
                          </span>
                        )}
                        <span>{renderBulletText(admission.eligibility)}</span>
                      </div>
                    )}

                    {admission.whyChooseHeading && admission.title && (
                      <div className="pt-2">
                        <h4
                          style={{
                            fontFamily: "var(--font-serif), Georgia, serif",
                            fontSize: 16,
                            fontWeight: 800,
                            color: "#0A1F44",
                            marginBottom: 8,
                          }}
                        >
                          {admission.whyChooseHeading}
                        </h4>
                      </div>
                    )}

                    {admission.whyChooseParagraphs &&
                      admission.whyChooseParagraphs.length > 0 && (
                        <div className="space-y-3 pt-0.5">
                          {admission.whyChooseParagraphs.map((step, idx) => (
                            <p
                              key={idx}
                              style={{
                                fontSize: "14.5px",
                                color: "#334155",
                                lineHeight: 1.7,
                                fontWeight: 400,
                              }}
                              className="text-justify"
                            >
                              {step}
                            </p>
                          ))}
                        </div>
                      )}

                    {admission.whyChooseOutro && (
                      <p className="text-[14px] text-[#334155] leading-relaxed text-justify mt-2">
                        {admission.whyChooseOutro}
                      </p>
                    )}
                  </div>
                )}

                {/* 5c. Why Prefer Geeta University */}
                {admission?.whyPreferTitle && (
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 14,
                      padding: "18px 20px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-serif), Georgia, serif",
                        fontSize: 18,
                        fontWeight: 800,
                        color: "#0A1F44",
                        marginBottom: 10,
                      }}
                    >
                      {admission.whyPreferTitle}
                    </h3>
                    {admission.whyPreferParagraphs &&
                      admission.whyPreferParagraphs.length > 0 && (
                        <div className="space-y-2.5">
                          {admission.whyPreferParagraphs.map((p, idx) => (
                            <p
                              key={idx}
                              className="text-[14.5px] text-[#334155] leading-relaxed text-justify"
                            >
                              {p}
                            </p>
                          ))}
                        </div>
                      )}
                  </div>
                )}

                {/* 5d. Research Achievements */}
                {researchAchievements && (
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 14,
                      padding: "20px 22px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.02)",
                    }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                      <h3
                        style={{
                          fontFamily: "var(--font-serif), Georgia, serif",
                          fontSize: 18,
                          fontWeight: 800,
                          color: "#0A1F44",
                          margin: 0,
                        }}
                      >
                        {researchAchievements.title}
                      </h3>
                    </div>
                    {researchAchievements.categories.map((cat, cIdx) => (
                      <div key={cIdx} className="space-y-2">
                        <h4 className="font-bold text-[#0A1F44] text-[15px]">
                          {cat.title}
                        </h4>
                        <div className="space-y-2 pl-2">
                          {cat.items.map((item, iIdx) => (
                            <div
                              key={iIdx}
                              className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F8FAFC] border border-slate-100 text-[#334155] text-[13.5px] sm:text-[14px] leading-relaxed"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E8871A] shrink-0 mt-2" />
                              <span>{renderBulletText(item)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5e. Faculty Research Profiles */}
                {facultyProfilesTable && (
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 14,
                      padding: "20px 22px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.02)",
                    }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                      <h3
                        style={{
                          fontFamily: "var(--font-serif), Georgia, serif",
                          fontSize: 18,
                          fontWeight: 800,
                          color: "#0A1F44",
                          margin: 0,
                        }}
                      >
                        {facultyProfilesTable.title}
                      </h3>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="min-w-full text-left text-sm text-[#334155]">
                        <thead className="bg-[#0A1F44] text-white text-[13px] uppercase tracking-wider font-semibold">
                          <tr>
                            <th className="px-4 py-3 border-b border-slate-200">Name</th>
                            <th className="px-4 py-3 border-b border-slate-200">Profile</th>
                            <th className="px-4 py-3 border-b border-slate-200 whitespace-nowrap">Number of publication</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-[13px] sm:text-[13.5px] bg-white">
                          {facultyProfilesTable.table.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-4 py-3 align-top font-bold text-[#0A1F44] whitespace-nowrap">
                                {row.name}
                              </td>
                              <td className="px-4 py-3 align-top leading-relaxed">
                                {row.profileUrl ? (
                                  <a
                                    href={row.profileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#073d6b] hover:text-[#E8871A] font-semibold underline block mb-1 break-all"
                                  >
                                    {row.profileName || row.name}
                                  </a>
                                ) : row.profileName ? (
                                  <div className="font-semibold text-[#0A1F44] mb-1">
                                    {row.profileName}
                                  </div>
                                ) : null}
                                {row.profileDetails &&
                                  row.profileDetails.map((det, dIdx) => (
                                    <div key={dIdx} className="text-[#475569] text-[12.5px] sm:text-[13px]">
                                      {det}
                                    </div>
                                  ))}
                              </td>
                              <td className="px-4 py-3 align-top leading-relaxed text-[#1E293B] whitespace-nowrap">
                                {row.publications.map((pub, pIdx) => (
                                  <div key={pIdx}>{pub}</div>
                                ))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {facultyProfilesTable.afterText && (
                      <p className="text-[14.5px] text-[#334155] leading-relaxed mt-4 font-medium">
                        {facultyProfilesTable.afterText}
                      </p>
                    )}

                    {facultyProfilesTable.afterBullets && (
                      <div className="space-y-2 mt-2">
                        {facultyProfilesTable.afterBullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="space-y-1.5">
                            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F8FAFC] border border-slate-100 text-[#334155] text-[13.5px] sm:text-[14px] leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E8871A] shrink-0 mt-2" />
                              <span>{renderBulletText(bullet.text)}</span>
                            </div>
                            {bullet.subItems && (
                              <div className="pl-6 space-y-1.5">
                                {bullet.subItems.map((sub, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="flex items-start gap-2 text-[13px] sm:text-[13.5px] text-[#475569] leading-relaxed"
                                  >
                                    <span className="w-1 h-1 rounded-full bg-[#0A1F44] shrink-0 mt-2" />
                                    <span>{sub}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 5f. What We Offer to Phd in Agriculture Scholars */}
                {whatWeOffer && (
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 14,
                      padding: "20px 22px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.02)",
                    }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                      <h3
                        style={{
                          fontFamily: "var(--font-serif), Georgia, serif",
                          fontSize: 18,
                          fontWeight: 800,
                          color: "#0A1F44",
                          margin: 0,
                        }}
                      >
                        {whatWeOffer.title}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {whatWeOffer.items.map((item, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-100 text-[#334155] text-[13.5px] sm:text-[14px] leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E8871A] shrink-0 mt-2" />
                            <span>{renderBulletText(item.text)}</span>
                          </div>
                          {item.subItems && (
                            <div className="pl-6 space-y-1.5">
                              {item.subItems.map((sub, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="flex items-start gap-2 text-[13px] sm:text-[13.5px] text-[#475569] leading-relaxed"
                                >
                                  <span className="w-1 h-1 rounded-full bg-[#0A1F44] shrink-0 mt-2" />
                                  <span>{sub}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5g. Additional Unique Strengths */}
                {additionalStrengths && (
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 14,
                      padding: "20px 22px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.02)",
                    }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                      <h3
                        style={{
                          fontFamily: "var(--font-serif), Georgia, serif",
                          fontSize: 18,
                          fontWeight: 800,
                          color: "#0A1F44",
                          margin: 0,
                        }}
                      >
                        {additionalStrengths.title}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {additionalStrengths.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-100 text-[#334155] text-[13.5px] sm:text-[14px] leading-relaxed"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E8871A] shrink-0 mt-2" />
                          <span>{renderBulletText(item.text)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. Centered Read More / Read Less button */}
            {hasHiddenContent && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  id="readMoreBtn"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-[#0A1F44] font-bold text-xs sm:text-[13.5px] shadow-sm hover:border-[#E8871A] hover:text-[#E8871A] transition-all duration-200 cursor-pointer active:scale-95"
                >
                  <span>{isExpanded ? "Read Less" : "Read More"}</span>
                  <span className="text-[13px] font-bold">
                    {isExpanded ? "↑" : "↓"}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Enquire Now Admission Form & Degree Design Banner */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-6 lg:sticky lg:top-24">
            <AdmissionFormWrapper
              initialDiscipline={discipline || "School of Humanities and Social Science"}
              initialCourse={programName || title}
            />

            {/* Design Your Own Degree with GU - Below Inquiry Form */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 20,
                padding: "24px 20px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.04)",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0A1F44",
                  lineHeight: 1.25,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                DESIGN YOUR OWN DEGREE WITH GU
              </h3>

              <div className="relative w-full rounded-xl overflow-hidden bg-[#F8FAFC] border border-slate-100 p-3 sm:p-4 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://geetauniversity.edu.in/uploads/all/1830/1__1_-removebg-preview.png"
                  alt="Design Your Own Degree With GU - Industry Ready Curriculum"
                  className="w-full h-auto object-contain block mx-auto"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
