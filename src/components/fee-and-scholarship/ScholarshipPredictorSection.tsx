"use client";

import React from "react";
import ScholarshipCalculator from "@/components/scholarship-predictor/ScholarshipCalculator";

interface ScholarshipPredictorSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    rulesDatabase?: any;
  };
  programsData?: Record<string, any>;
  rulesData?: Record<string, any>;
  cuetData?: any;
}

export default function ScholarshipPredictorSection({
  data,
  programsData,
  rulesData,
  cuetData,
}: ScholarshipPredictorSectionProps = {}) {
  return (
    <section className="py-8 bg-white" id="scholarship-calculator">
      <style>{`
        .finder-heading {
          color: #06355F;
          font-weight: 800;
          font-size: 1.4rem;
          margin-bottom: 0.8rem;
          font-family: 'Zilla Slab', serif;
        }

        .finder-content p {
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          color: #333;
        }

        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .benefits-list li {
          position: relative;
          padding-left: 25px;
          margin-bottom: 10px;
          font-size: 0.95rem;
          color: #444;
        }

        .benefits-list li::before {
          content: "\\2713";
          position: absolute;
          left: 0;
          color: #06355F;
          font-weight: bold;
        }
      `}</style>

      <div className="max-w-[1320px] mx-auto px-4">
        <div className="scholarship-finder-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: FINDER CONTENT & PRAGATI SCHOLARSHIP */}
            <div className="lg:col-span-7 finder-content">
              <h3 className="finder-heading">{data?.title || "Find out your exact scholarship in seconds!"}</h3>
              {data?.subtitle && (
                <p className="font-semibold text-[#06355F] mb-3">{data.subtitle}</p>
              )}
              <p>
                Find your true potential by using our simple-to-use scholarship
                Predictor Tool created to assist you in determining the amount
                of scholarships you&apos;re qualified for on Geeta University. Just a
                couple of quick selections--your category, your program and
                academic record--you&apos;ll get an exact, precise estimation in just
                a few seconds.
              </p>

              <div className="space-y-4">
                <p className="font-semibold text-[#333] mb-2">
                  After you have entered your information The tool will immediately present:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <ul className="benefits-list">
                      <li>Your applicable scholarship slab</li>
                      <li>Revisionized tuition fees after deducting the scholarship</li>
                      <li>Savings per semester total</li>
                    </ul>
                  </div>
                  <div className="md:col-span-7">
                    <ul className="benefits-list">
                      <li>Final payment fees</li>
                      <li>Transparency in fees for greater decision-making</li>
                      <li>
                        This powerful and user-friendly tool lets you make plans
                        for your future through Geeta University with complete
                        clarity trust, certainty, and transparency.
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="pt-2">
                  Explore your scholarships right now, and make your first step to build an impressive&nbsp;career!
                </p>

                {/* Pragati Scholarship Card */}
                <div
                  className="card mb-4 border-0 shadow-lg overflow-hidden"
                  style={{ borderRadius: "1rem", backgroundColor: "#ffffff", border: "1px solid #eee" }}
                >
                  <div style={{ height: "6px", background: "#FF7A00" }} />
                  <div className="p-6 md:p-8">
                    <span
                      className="inline-block rounded-full mb-3"
                      style={{
                        backgroundColor: "#f0f7ff",
                        color: "#06355F",
                        fontWeight: 600,
                        padding: "0.4rem 1rem",
                        border: "1px solid #cce0ff",
                        fontSize: "0.85rem",
                      }}
                    >
                      Special Program
                    </span>

                    <h3 className="font-bold mb-3 font-serif" style={{ color: "#06355F", fontSize: "1.6rem" }}>
                      Pragati Scholarship 2026–27
                    </h3>

                    <p className="mb-4" style={{ color: "#444", fontSize: "1.05rem", lineHeight: 1.6 }}>
                      A special scholarship program of Geeta University.<br />
                      <strong style={{ color: "#06355F" }}>
                        For the students of Himachal Pradesh, Jammu &amp; Kashmir, Ladakh, and Northeast India.
                      </strong>
                    </p>

                    <ul className="space-y-3 mb-4 list-none p-0">
                      <li className="flex items-start">
                        <div
                          className="mr-3 mt-1 flex justify-center items-center rounded-full shrink-0"
                          style={{
                            width: "24px",
                            height: "24px",
                            backgroundColor: "#FFF2E5",
                            color: "#FF7A00",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span style={{ color: "#333" }}>
                          5 students eligible for <strong style={{ color: "#FF7A00" }}>100% Scholarship</strong>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div
                          className="mr-3 mt-1 flex justify-center items-center rounded-full shrink-0"
                          style={{
                            width: "24px",
                            height: "24px",
                            backgroundColor: "#FFF2E5",
                            color: "#FF7A00",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span style={{ color: "#333" }}>
                          5 students eligible for <strong style={{ color: "#FF7A00" }}>50% Scholarship</strong>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div
                          className="mr-3 mt-1 flex justify-center items-center rounded-full shrink-0"
                          style={{
                            width: "24px",
                            height: "24px",
                            backgroundColor: "#FFF2E5",
                            color: "#FF7A00",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span style={{ color: "#333" }}>
                          Hon&apos;ble MLAs/MPs make recommendations for funding scholarships.
                        </span>
                      </li>
                    </ul>

                    <div
                      className="p-3 rounded-lg mb-4"
                      style={{ backgroundColor: "#f8fbff", borderLeft: "4px solid #06355F" }}
                    >
                      <p className="mb-0" style={{ color: "#444", fontSize: "0.95rem" }}>
                        <strong>Conditions:</strong> Pragati Scholarship is awarded on a first-come, first-served basis per State/UT.
                      </p>
                    </div>

                    <div
                      className="p-3 rounded-lg flex items-center"
                      style={{
                        backgroundColor: "#FFF8F0",
                        border: "1px dashed #FF7A00",
                      }}
                    >
                      <div
                        className="flex justify-center items-center rounded-full mr-3 shrink-0"
                        style={{ width: "32px", height: "32px", backgroundColor: "#FF7A00", color: "white" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <div>
                        <div style={{ color: "#FF7A00", fontWeight: 700, fontSize: "0.9rem" }}>
                          Admissions Open
                        </div>
                        <div style={{ color: "#666", fontSize: "0.85rem", fontWeight: 500 }}>
                          Limited Seat availability.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: UNIFIED FEE & SCHOLARSHIP PREDICTOR */}
            <div className="lg:col-span-5">
              <ScholarshipCalculator
                variant="card"
                programsData={programsData}
                rulesData={rulesData}
                cuetData={cuetData}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
