"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { FAQ } from "@/data/programs/types";

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs?: FAQ[];
}

export const DEFAULT_FAQS: FAQ[] = [
  {
    q: "Are the placement stories on this page specific to this school's students?",
    a: "Placement stories featured include school students and alumni. University-wide placement statistics reflect institutional data, and school-specific success stories are labelled separately.",
    category: "Placements & Careers",
  },
  {
    q: "Does the curriculum focus only on theory, or is there practical skill development too?",
    a: "The curriculum has a strong practical orientation. Students engage with projects, internships, hackathons, coding tracks, certification programs, professors of practice, and the Geeta Technical Hub — all designed to build applied, job-ready skills alongside academic knowledge.",
    category: "Curriculum & Learning",
  },
  {
    q: "Are there opportunities to learn emerging technologies beyond the core syllabus?",
    a: "Yes. Official specialisations and training tracks cover AI, Machine Learning, Cybersecurity, Data Science, Cloud Computing, and Full Stack Development — giving students exposure to in-demand, future-facing areas.",
    category: "Specialisations & Technology",
  },
  {
    q: "What kinds of industry-linked learning opportunities are available?",
    a: "Students have access to certifications, bootcamps, domain trainers, tool-integrated learning, competitive coding ecosystems, and training partnerships with organizations such as AWS, Cisco, Oracle, Microsoft Azure, GitHub, and Red Hat Academy.",
    category: "Curriculum & Learning",
  },
  {
    q: "Is there mentorship beyond regular faculty teaching?",
    a: "Yes. We offer a multi-layered mentorship model including academic faculty, professors of practice from industry, technical hub trainers, and leadership support.",
    category: "Curriculum & Learning",
  },
  {
    q: "Can students from non-engineering backgrounds apply to postgraduate programs?",
    a: "For postgraduate programs, eligibility includes different graduation backgrounds with mathematics-related conditions where applicable. Students are encouraged to review program-specific eligibility requirements or speak with the admissions team.",
    category: "Admissions & Eligibility",
  },
  {
    q: "Is hostel accommodation available for students from other states?",
    a: "Yes. Modern hostel accommodation is available with 24/7 security, Wi-Fi, dining halls, and recreational amenities. Out-of-state students can inquire about room types and availability during admissions counseling.",
    category: "Student Facilities",
  },
  {
    q: "Are scholarships available?",
    a: "Scholarships are applicable to eligible programs based on merit, national entrance test scores (GUTS / JEE / CUET), sports achievements, and category criteria.",
    category: "Admissions & Eligibility",
  },
];

export default function FAQSection({
  title = "Frequently Asked Questions",
  subtitle = "Find answers to common questions about eligibility, courses, placements, and campus facilities.",
  faqs,
}: FAQSectionProps) {
  // Normalize FAQs
  const rawList = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;
  const normalizedFaqs = rawList.map((f) => ({
    q: f.q || f.question || "",
    a: f.a || f.answer || "",
    category: f.category || "General",
  }));

  // Extract unique categories
  const rawCategories = Array.from(
    new Set(normalizedFaqs.map((f) => f.category).filter(Boolean))
  );
  const categories = ["All", ...rawCategories];

  // Default to "Admissions & Eligibility" (or category containing admission/eligibility)
  const defaultCategory =
    rawCategories.find((cat) => {
      const lower = cat.toLowerCase();
      return lower.includes("admission") || lower.includes("eligibility");
    }) ||
    rawCategories[0] ||
    "All";

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const filteredFaqs = normalizedFaqs.filter((faq) => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch =
      faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="FAQ"
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
        padding: "52px 0 48px",
        position: "relative",
        borderTop: "1px solid #E2E8F0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 32, height: 2, background: "#E8871A", borderRadius: 2 }} />
            <span
              style={{
                color: "#E8871A",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Have Questions?
            </span>
            <div style={{ width: 32, height: 2, background: "#E8871A", borderRadius: 2 }} />
          </div> */}
          <h2
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "#0A1F44",
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: 16, color: "#64748B", maxWidth: 640, margin: "14px auto 0", lineHeight: 1.6 }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: 600, margin: "0 auto 48px", position: "relative" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search questions or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="faq-search-input"
              style={{
                width: "100%",
                padding: "16px 20px 16px 52px",
                borderRadius: "16px",
                border: "2px solid #E2E8F0",
                fontSize: "16px",
                fontWeight: 500,
                color: "#0A1F44",
                outline: "none",
                background: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                transition: "all 0.3s ease",
              }}
            />
            {/* Search Icon */}
            <div style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "#64748B" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            {/* Clear Button */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={{
                  position: "absolute",
                  right: 18,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94A3B8",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Categories Tabs */}
        {categories.length > 2 && (
          <div
            className="faq-categories-scroll hide-scroll"
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 40,
              overflowX: "auto",
              paddingBottom: 12,
              justifyContent: "flex-start",
              flexWrap: "nowrap",
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenQuestion(null);
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "100px",
                  background: activeCategory === cat ? "#0A1F44" : "#FFFFFF",
                  color: activeCategory === cat ? "#FFFFFF" : "#475569",
                  border: "1.5px solid",
                  borderColor: activeCategory === cat ? "#0A1F44" : "#E2E8F0",
                  fontSize: "14px",
                  fontWeight: 650,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: activeCategory === cat ? "0 4px 12px rgba(10,31,68,0.15)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = "#0A1F44";
                    e.currentTarget.style.color = "#0A1F44";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = "#E2E8F0";
                    e.currentTarget.style.color = "#475569";
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* FAQ Accordion List */}
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {filteredFaqs.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openQuestion === faq.q;
                return (
                  <div
                    key={idx}
                    style={{
                      background: "#FFFFFF",
                      borderRadius: "16px",
                      border: "1px solid #E2E8F0",
                      boxShadow: isOpen ? "0 10px 25px rgba(10,31,68,0.05)" : "0 2px 8px rgba(0,0,0,0.01)",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <button
                      onClick={() => setOpenQuestion(isOpen ? null : faq.q)}
                      style={{
                        width: "100%",
                        background: "none",
                        border: "none",
                        padding: "24px 28px",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 20,
                        textAlign: "left",
                        outline: "none",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "17px",
                          fontWeight: 750,
                          color: isOpen ? "#E8871A" : "#0A1F44",
                          lineHeight: 1.4,
                          transition: "color 0.25s ease",
                        }}
                      >
                        {faq.q}
                      </span>
                      {/* Plus/Minus Indicator */}
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: isOpen ? "rgba(232,135,26,0.1)" : "#F1F5F9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.25s ease",
                          color: isOpen ? "#E8871A" : "#64748B",
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{
                            transform: isOpen ? "rotate(180deg)" : "none",
                            transition: "transform 0.3s ease",
                          }}
                        >
                          {isOpen ? (
                            <line x1="5" y1="12" x2="19" y2="12" />
                          ) : (
                            <>
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </>
                          )}
                        </svg>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: "easeInOut" }}
                        >
                          <div
                            style={{
                              padding: "0 28px 24px",
                              fontSize: "15px",
                              lineHeight: 1.7,
                              color: "#475569",
                              fontWeight: 450,
                              borderTop: "1px solid #F1F5F9",
                              whiteSpace: "pre-line",
                            }}
                          >
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "48px 24px",
                background: "#FFFFFF",
                borderRadius: "16px",
                border: "1px dashed #CBD5E1",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <Search size={40} color="#94A3B8" />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0A1F44", margin: "0 0 8px" }}>No Results Found</h3>
              <p style={{ color: "#64748B", fontSize: "14px", margin: 0 }}>
                We couldn't find any questions matching &ldquo;{searchTerm}&rdquo;. Try another search term or clear the filter.
              </p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .faq-search-input:focus {
          border-color: #E8871A !important;
          box-shadow: 0 4px 20px rgba(232,135,26,0.1) !important;
        }
        @media (max-width: 768px) {
          .faq-categories-scroll {
            justify-content: flex-start !important;
            padding-left: 4px;
          }
        }
      `}</style>
    </section>
  );
}