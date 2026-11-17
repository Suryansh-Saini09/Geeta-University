"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import type { ProgramPageData } from "@/data/programs/types";

interface ProgramFinalCTAProps {
  cta?: ProgramPageData["cta"];
  schoolName?: string;
}

export default function ProgramFinalCTA({ cta, schoolName }: ProgramFinalCTAProps) {
  const normalizedSchool = schoolName
    ? (schoolName.toLowerCase().startsWith("the ") || schoolName.toLowerCase().startsWith("geeta ")
        ? schoolName
        : `the ${schoolName}`)
    : "";
  const heading = cta?.heading || (normalizedSchool ? `Ready to Join ${normalizedSchool} at Geeta University?` : "Ready to Join Geeta University?");
  const applyLink = cta?.applyLink || "https://admissions.geetauniversity.edu.in/";
  const contactLink = "https://geetauniversity.edu.in/contact-us";

  return (
    <section style={{ background: "#E8871A", padding: "54px 24px", textAlign: "center" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "white", margin: "0 0 28px", letterSpacing: "-0.5px" }}>
          {heading}
        </h2>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href={applyLink}
            target="_blank"
            rel="noreferrer"
            style={{
              background: "#0A1F44",
              color: "white",
              padding: "14px 34px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 14px rgba(10,31,68,0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
            }}
          >
            Apply Now
            <ArrowRight size={16} />
          </a>
          <a
            href={contactLink}
            target="_blank"
            rel="noreferrer"
            style={{
              background: "transparent",
              border: "2px solid white",
              color: "white",
              padding: "14px 26px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Contact Admissions
          </a>
        </div>
      </div>
    </section>
  );
}
