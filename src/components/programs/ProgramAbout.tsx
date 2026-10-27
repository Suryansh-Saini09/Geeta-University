"use client";

import React from "react";
import Link from "next/link";
import type { ProgramPageData } from "@/data/programs/types";
import VisionMissionSection from "./VisionMissionSection";
import DeanNoteCard from "./DeanNoteCard";
import AdmissionFormWrapper from "./AdmissionFormWrapper";
import { sanitizeRichText } from "@/lib/security/htmlSanitizer";

interface ProgramAboutProps {
  about?: ProgramPageData["about"];
  intro?: ProgramPageData["intro"];
  visionMission?: ProgramPageData["visionMission"];
  dean?: ProgramPageData["dean"];
  schoolTitle?: string;
}

export default function ProgramAbout({ about, intro, visionMission, dean, schoolTitle }: ProgramAboutProps) {
  const data = about || (intro ? {
    eyebrow: intro.eyebrow,
    title: intro.title,
    paragraphs: intro.paragraphs,
    careers: undefined,
    closingText: undefined,
  } : null);

  if (!data) return null;

  return (
    <section id="About" className="w-full bg-[#FFFFFF] text-[#1A1A2E] py-10 sm:py-14 border-b border-slate-200/80">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
          
          {/* Left Column: School Overview, Vision & Mission, Dean / Leadership Note */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6 sm:space-y-8">
            <div>
              <h2
                style={{
                  fontSize: "clamp(26px, 3.2vw, 42px)",
                  fontWeight: 800,
                  color: "#0A1F44",
                  lineHeight: 1.16,
                  letterSpacing: "-0.5px",
                  marginBottom: data.subtitle ? 12 : 20,
                }}
              >
                {data.title}
              </h2>
              {data.subtitle && (
                <div style={{ marginBottom: 20 }}>
                  {data.subtitle.split("\n").map((line, i) => (
                    <h3
                      key={i}
                      style={{
                        fontSize: i === 0 ? 20 : 18,
                        fontWeight: 700,
                        color: "#1E293B",
                        lineHeight: 1.35,
                        marginTop: i > 0 ? 6 : 0,
                        fontFamily: "var(--font-serif), serif",
                      }}
                    >
                      {line}
                    </h3>
                  ))}
                </div>
              )}
              {data.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  style={{
                    fontSize: 16,
                    color: "#4A5568",
                    lineHeight: 1.75,
                    fontWeight: 450,
                    marginBottom: idx < data.paragraphs.length - 1 ? 16 : 0,
                  }}
                  dangerouslySetInnerHTML={{ __html: sanitizeRichText(p) }}
                />
              ))}

              {data.links && data.links.length > 0 && (
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                  {data.links.map((link, idx) => {
                    const isExternal = link.href.startsWith("http://") || link.href.startsWith("https://");
                    return (
                      <Link
                        key={idx}
                        href={link.href}
                        target={link.target || (isExternal ? "_blank" : undefined)}
                        rel={link.rel || (isExternal ? "noopener noreferrer" : undefined)}
                        style={{
                          color: "#1a73e8",
                          fontSize: 16,
                          fontWeight: 600,
                          textDecoration: "underline",
                          textUnderlineOffset: "4px",
                          display: "inline-block",
                          lineHeight: 1.6,
                          cursor: "pointer",
                          transition: "color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#1557b0";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#1a73e8";
                        }}
                      >
                        {link.text}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Vision & Mission Section */}
            <VisionMissionSection data={visionMission} />
          </div>

          {/* Right Column: Sticky Enquire Now Admission Form */}
          <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-28">
            <AdmissionFormWrapper initialDiscipline={schoolTitle} />
          </div>

        </div>

        {/* Leadership Note Card - Full Width */}
        {dean && <DeanNoteCard dean={dean} schoolName={schoolTitle} />}
      </div>
    </section>
  );
}
