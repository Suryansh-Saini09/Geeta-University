
"use client";

import React from "react";
import type { ProgramPageData, SpecialisationItem } from "@/data/programs/types";

interface ProgramSpecialisationsProps {
  specialisations?: ProgramPageData["specialisations"];
}

const ACCENT_COLORS = [
  "#16A34A", // Green
  "#2563EB", // Blue
  "#EAB308", // Yellow / Gold
  "#F97316", // Orange
  "#8B5CF6", // Purple
  "#EC4899", // Pink
];

export const DEFAULT_SPECIALISATIONS_DATA: SpecialisationItem[] = [
  {
    title: "Artificial Intelligence & Machine Learning",
    points: [
      "Specialisation in advanced machine learning areas like Computer Vision, Big Data, Robotics, etc.",
      "Understanding artificial networks",
      "Applications of deep learning in image recognition",
      "Real world projects",
      "AI & ML application competencies in data mining & progression analytics..",
    ],
  },
  {
    title: "Cyber Security",
    points: [
      "Software development security",
      "Network security",
      "Risk management and compliance",
      "Cryptography",
      "Cyber security regulation",
      "Information security (INFOSEC)",
      "Security architecture..",
    ],
  },
  {
    title: "Data Sciences & Business Analytics",
    points: [
      "Certified analytics professional",
      "Data frames",
      "Core programming principles",
      "Data science with R programming",
      "Python for data science",
    ],
  },
  {
    title: "Full Stack Web Development",
    points: [
      "Basics of web development and coding",
      "Introduction to HTML/CSS - creating web pages",
      "JavaScript essentials",
      "Advanced JavaScript",
      "CSS fundamentals and web applications..",
    ],
  },
];

export default function ProgramSpecialisations({ specialisations }: ProgramSpecialisationsProps) {
  if (!specialisations) return null;

  const title = specialisations.title || "GU New-Age Specialisations";
  const rawItems = specialisations.items;
  const items = rawItems && rawItems.length > 0 ? rawItems : DEFAULT_SPECIALISATIONS_DATA;

  if (specialisations.layout === "table") {
    return (
      <section id="Specialisations" style={{ padding: "52px 0 48px", background: "#FFFFFF", position: "relative" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={{ fontSize: "clamp(28px, 3.6vw, 40px)", fontWeight: 900, color: "#0A1F44", margin: 0, lineHeight: 1.15, letterSpacing: "-0.5px" }}>
              {title}
            </h2>
          </div>

          <div
            style={{
              width: "100%",
              overflowX: "auto",
              borderRadius: 16,
              boxShadow: "0 10px 30px rgba(10,31,68,0.06)",
              border: "1px solid #E2E8F0",
              background: "#FFFFFF",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: 600 }}>
              <thead>
                <tr style={{ background: "#0A1F44", color: "#FFFFFF" }}>
                  <th style={{ padding: "20px 28px", fontSize: 15, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, width: "38%" }}>
                    Specialisation
                  </th>
                  <th style={{ padding: "20px 28px", fontSize: 15, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>
                    What You'll Learn
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((spec, i) => {
                  const descText = spec.desc || (spec.points ? spec.points.join(" • ") : "");
                  return (
                    <tr
                      key={i}
                      className="spec-row"
                      style={{
                        borderBottom: i < items.length - 1 ? "1px solid #E2E8F0" : "none",
                        background: i % 2 === 0 ? "#FFFFFF" : "#F8FAFC",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <td style={{ padding: "24px 28px", fontSize: 16, fontWeight: 800, color: "#0A1F44", verticalAlign: "top" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: "#E8871A",
                              flexShrink: 0,
                              display: "inline-block",
                              marginTop: 2,
                            }}
                          />
                          {spec.title}
                        </span>
                      </td>
                      <td style={{ padding: "24px 28px", fontSize: 15, color: "#4A5568", lineHeight: 1.65, fontWeight: 500, verticalAlign: "top" }}>
                        {descText}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <style>{`
          .spec-row:hover {
            background-color: rgba(232, 135, 26, 0.04) !important;
          }
          .spec-row:hover td:first-child {
            color: #E8871A !important;
          }
        `}</style>
      </section>
    );
  }

  return (
    <section
      id="Specialisations"
      style={{
        padding: "52px 0 48px",
        background: "#FFFFFF",
        position: "relative",
        borderTop: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2
            style={{
              fontSize: "clamp(26px, 3.4vw, 36px)",
              fontWeight: 800,
              color: "#0A1F44",
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
            }}
          >
            {title}
          </h2>
        </div>

        {/* 4-Column Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {items.map((card, idx) => {
            const accentColor = ACCENT_COLORS[idx % ACCENT_COLORS.length];

            return (
              <div
                key={idx}
                className="group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300"
                style={{
                  background: "#FFFFFF",
                  borderRadius: 14,
                  padding: "24px 20px",
                  border: "1px solid #E2E8F0",
                  borderLeft: `5px solid ${accentColor}`,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                }}
              >
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: "#0A1F44",
                    margin: "0 0 12px",
                    lineHeight: 1.3,
                  }}
                >
                  {card.title}
                </h3>

                {card.desc && (
                  <p
                    style={{
                      fontSize: 14,
                      color: "#475569",
                      lineHeight: 1.6,
                      fontWeight: 450,
                      margin: 0,
                    }}
                  >
                    {card.desc}
                  </p>
                )}

                {card.points && card.points.length > 0 && (
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: card.desc ? "10px 0 0" : 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {card.points.map((pt, pIdx) => (
                      <li
                        key={pIdx}
                        style={{
                          fontSize: 13.5,
                          color: "#334155",
                          lineHeight: 1.5,
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: "#0A1F44",
                            flexShrink: 0,
                            marginTop: 7,
                            opacity: 0.8,
                          }}
                        />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .spec-discipline-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          align-items: stretch;
        }

        .spec-discipline-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(10, 31, 68, 0.08) !important;
          border-color: #CBD5E1;
        }

        @media (max-width: 1080px) {
          .spec-discipline-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 18px !important;
          }
        }

        @media (max-width: 640px) {
          .spec-discipline-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .spec-discipline-card {
            padding: 20px 18px !important;
          }
        }
      `}</style>
    </section>
  );
}

