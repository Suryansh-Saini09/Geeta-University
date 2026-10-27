"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Data ──────────────────────────────────────────────────────────────────────
const OUTCOMES = [
  {
    num: "01",
    title: "Core Computing Knowledge",
    short: "Theoretical & Applied Foundations",
    desc: "Apply core computing knowledge to solve practical problems in software, data, systems, and digital environments.",
    tags: ["Systems Design", "Databases", "Architecture", "OS & Networks"],
  },
  {
    num: "02",
    title: "Modern Technology Tools",
    short: "Full Stack, Cloud & Security",
    desc: "Use contemporary tools, platforms, and workflows relevant to software development, cloud technologies, cybersecurity, and analytics.",
    tags: ["Full Stack Tools", "Cloud Labs", "Cybersecurity Essentials", "Analytics"],
  },
  {
    num: "03",
    title: "Coding & DSA Excellence",
    short: "Algorithms, Logic & Problem Solving",
    desc: "Build logical thinking, coding proficiency, and Data Structure & Algorithm capability through structured practice.",
    tags: ["DSA", "Competitive Coding", "Time Complexity", "Data Structures"],
  },
  {
    num: "04",
    title: "Real-World Industry Exposure",
    short: "Projects, Hackathons & Internships",
    desc: "Work on projects, hackathons, internships, and certification pathways that strengthen employability and real-world confidence.",
    tags: ["Hackathons", "Internships", "Certifications", "Portfolio Projects"],
  },
  {
    num: "05",
    title: "Career & Placement Readiness",
    short: "Mentorship, Interviews & Hiring",
    desc: "Step into technology careers with the industry-linked learning, mentorship, and placement support needed to grow from day one.",
    tags: ["Industry Mentorship", "Mock Interviews", "Placement Support", "Resume Building"],
  },
];

const STATS = [
  { value: "500+",    label: "Internships Secured"  },
  { value: "3,000+", label: "Global Certifications" },
  { value: "350+",   label: "Projects Delivered"    },
  { value: "25+",    label: "Hackathons Conducted"  },
  { value: "₹1.4 Cr", label: "Highest Package"      },
];

interface CounterProps {
  value: string;
  duration?: number;
}

function Counter({ value, duration = 1.5 }: CounterProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const startCounting = useCallback(() => {
    let prefix = "";
    let suffix = "";
    let numberStr = value;

    if (value.startsWith("₹")) {
      prefix = "₹";
      numberStr = value.substring(1);
    }
    if (value.endsWith("+")) {
      suffix = "+";
      numberStr = numberStr.substring(0, numberStr.length - 1);
    } else if (value.endsWith(" Cr")) {
      suffix = " Cr";
      numberStr = numberStr.substring(0, numberStr.length - 3);
    }

    const hasCommas = numberStr.includes(",");
    numberStr = numberStr.replace(/,/g, "");

    const targetNumber = parseFloat(numberStr);
    if (isNaN(targetNumber)) {
      setDisplayValue(value);
      return;
    }

    const startTime = performance.now();
    const isFloat = numberStr.includes(".");

    const updateCount = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress * (2 - progress);
      const current = targetNumber * easeProgress;

      let formattedNumber = "";
      if (isFloat) {
        formattedNumber = current.toFixed(1);
      } else {
        const rounded = Math.floor(current);
        if (hasCommas) {
          formattedNumber = rounded.toLocaleString();
        } else {
          formattedNumber = rounded.toString();
        }
      }

      setDisplayValue(`${prefix}${formattedNumber}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(updateCount);
  }, [value, duration]);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          startCounting();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, hasAnimated, startCounting]);

  return <span ref={nodeRef}>{displayValue}</span>;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function LearningOutcomes() {
  const [expanded, setExpanded] = useState<string | null>("01");

  return (
    <section
      id="LearningOutcomes"
      style={{
        background: "linear-gradient(160deg, #071428 0%, #0A1F44 50%, #0d1f3c 100%)",
        padding: "110px 0 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── decorative radial glow ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 50% at 10% 60%, rgba(232,135,26,0.07) 0%, transparent 70%)",
      }} />
      {/* thin orange top edge */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 3,
        background: "linear-gradient(90deg, transparent, #E8871A 30%, #F5A623 60%, transparent)",
      }} />

      {/* ── main container ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 1 }}>

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65 }}
          style={{ marginBottom: 72 }}
        >
          {/* eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 32, height: 2, background: "#E8871A", borderRadius: 2 }} />
          
          </div>

          {/* two-col heading + intro */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "flex-end" }}
            className="lo-header-grid">
            <h2 style={{
              fontSize: 52, fontWeight: 950, color: "#FFFFFF",
              margin: 0, lineHeight: 1.1, letterSpacing: "-1.5px",
            }}>
              What You'll <span style={{ color: "#E8871A" }}>Be Able to Do</span>
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.55)", fontSize: 15.5,
              lineHeight: 1.85, margin: 0, fontWeight: 400,
            }}>
              Students graduating from SCSE build theoretical understanding,
              practical skills, and domain expertise — with deep emphasis on{" "}
              <strong style={{ color: "#F5A623", fontWeight: 700 }}>DSA</strong>,{" "}
              <strong style={{ color: "#F5A623", fontWeight: 700 }}>competitive coding</strong>,{" "}
              <strong style={{ color: "#F5A623", fontWeight: 700 }}>full stack tools</strong>,{" "}
              <strong style={{ color: "#F5A623", fontWeight: 700 }}>cybersecurity</strong>,{" "}
              <strong style={{ color: "#F5A623", fontWeight: 700 }}>cloud labs</strong>,
              projects, and internships.
            </p>
          </div>
        </motion.div>

        {/* ── ACCORDION ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {OUTCOMES.map((item, idx) => {
            const isOpen = expanded === item.num;
            return (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  background: isOpen
                    ? "linear-gradient(90deg, rgba(232,135,26,0.06) 0%, transparent 60%)"
                    : "transparent",
                  transition: "background 0.35s ease",
                }}
              >
                {/* ── row trigger ── */}
                <button
                  onClick={() => setExpanded(isOpen ? null : item.num)}
                  style={{
                    width: "100%", background: "none", border: "none",
                    padding: "32px 0 32px 0", cursor: "pointer",
                    display: "grid",
                    gridTemplateColumns: "88px 1fr auto",
                    alignItems: "center",
                    gap: 28, textAlign: "left",
                  }}
                  className="lo-row-btn"
                >
                  {/* ghost number: orange when open */}
                  <span style={{
                    fontSize: 52, fontWeight: 900, lineHeight: 1,
                    letterSpacing: "-3px",
                    color: isOpen ? "#E8871A" : "rgba(255,255,255,0.07)",
                    transition: "color 0.35s ease",
                    userSelect: "none",
                  }}>
                    {item.num}
                  </span>

                  {/* title block */}
                  <div>
                    <div style={{
                      fontSize: 10.5, fontWeight: 700,
                      color: isOpen ? "#E8871A" : "rgba(255,255,255,0.3)",
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      marginBottom: 5, transition: "color 0.3s",
                    }}>
                      {item.short}
                    </div>
                    <div style={{
                      fontSize: 22, fontWeight: 800, lineHeight: 1.25,
                      color: isOpen ? "#FFFFFF" : "rgba(255,255,255,0.72)",
                      letterSpacing: "-0.4px", transition: "color 0.3s ease",
                    }}>
                      {item.title}
                    </div>
                  </div>

                  {/* icon */}
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                    border: `1.5px solid ${isOpen ? "#E8871A" : "rgba(255,255,255,0.14)"}`,
                    background: isOpen ? "rgba(232,135,26,0.12)" : "rgba(255,255,255,0.02)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.3s ease",
                  }}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
                      style={{ transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.3s ease" }}>
                      <line x1="6.5" y1="1" x2="6.5" y2="12" stroke={isOpen ? "#E8871A" : "rgba(255,255,255,0.45)"}
                        strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="1" y1="6.5" x2="12" y2="6.5" stroke={isOpen ? "#E8871A" : "rgba(255,255,255,0.45)"}
                        strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </button>

                {/* ── expandable body ── */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="body"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          paddingLeft: 88 + 28,   /* align under title */
                          paddingBottom: 36,
                          paddingRight: 66,
                          display: "flex", gap: 48, alignItems: "flex-start",
                        }}
                        className="lo-expand-inner"
                      >
                        {/* description */}
                        <p style={{
                          flex: 1, maxWidth: 500,
                          color: "rgba(255,255,255,0.55)", fontSize: 15,
                          lineHeight: 1.8, margin: 0, fontWeight: 400,
                        }}>
                          {item.desc}
                        </p>

                        {/* tag pills */}
                        <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 9, paddingTop: 2 }}>
                          {item.tags.map((tag) => (
                            <span key={tag} style={{
                              padding: "6px 15px",
                              background: "rgba(232,135,26,0.09)",
                              border: "1px solid rgba(232,135,26,0.28)",
                              borderRadius: 100,
                              color: "#F0A040",
                              fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em",
                            }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── STATS STRIP (full-width flush to section bottom) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.15 }}
        style={{
          marginTop: 88,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
        }}
        className="lo-stats-grid"
      >
        {STATS.map((stat, i) => (
          <div
            key={i}
            style={{
              padding: "44px 28px",
              textAlign: "center",
              borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
              transition: "background 0.3s",
              cursor: "default",
            }}
            className="lo-stat-cell"
          >
            {/* orange top accent on hover */}
            <div className="lo-stat-bar" style={{
              height: 2, background: "#E8871A",
              marginBottom: 24, width: 28, borderRadius: 2,
            }} />
            <div style={{
              fontSize: 38, fontWeight: 900, color: "#FFFFFF",
              letterSpacing: "-1.5px", lineHeight: 1, marginBottom: 10,
            }}>
              <Counter value={stat.value} />
            </div>
            <div style={{
              fontSize: 12.5, color: "rgba(255,255,255,0.4)",
              fontWeight: 500, letterSpacing: "0.03em", textTransform: "uppercase",
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── responsive + hover CSS ── */}
      <style>{`
        @media (max-width: 960px) {
          .lo-header-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
        @media (max-width: 768px) {
          .lo-row-btn {
            grid-template-columns: 60px 1fr auto !important;
            gap: 18px !important;
            padding: 24px 0 !important;
          }
          .lo-expand-inner {
            padding-left: 60px !important;
            flex-direction: column !important;
            gap: 20px !important;
            padding-right: 0 !important;
          }
          .lo-stats-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .lo-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .lo-stat-cell:hover {
          background: rgba(255,255,255,0.03) !important;
        }
        .lo-stat-cell:hover .lo-stat-bar {
          width: 44px !important;
          transition: width 0.3s ease;
        }
        .lo-stat-bar {
          transition: width 0.3s ease;
        }
      `}</style>
    </section>
  );
}
