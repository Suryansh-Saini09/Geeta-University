
import React from "react";
import { Check } from "lucide-react";
import type { SchoolUspsSection } from "@/data/programs/types";

interface ProgramUspsProps {
  usps: SchoolUspsSection;
}

export default function ProgramUsps({ usps }: ProgramUspsProps) {
  if (!usps || !usps.cards || usps.cards.length === 0) return null;

  return (
    <section
      id="USPs"
      style={{
        background: "#FDF1D6",
        padding: "56px 0 60px",
        position: "relative",
        borderTop: "1px solid rgba(0, 0, 0, 0.05)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", position: "relative" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          {usps.eyebrow && (
            <span
              style={{
                color: "#E8871A",
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                display: "inline-block",
                marginBottom: 8,
              }}
            >
              {usps.eyebrow}
            </span>
          )}

          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 900,
              color: "#0A1F44",
              lineHeight: 1.2,
              letterSpacing: "-0.8px",
              margin: 0,
            }}
          >
            {usps.title}
          </h2>

          {usps.subtitle && (
            <p
              style={{
                fontSize: 15.5,
                color: "#475569",
                maxWidth: 800,
                margin: "10px auto 0",
                lineHeight: 1.6,
                fontWeight: 450,
              }}
            >
              {usps.subtitle}
            </p>
          )}
        </div>

        {/* Simple & Clean 4-Column USP Cards Grid */}
        <div className="usps-grid">
          {usps.cards.map((card, idx) => (
            <div
              key={idx}
              className="usp-simple-card"
              style={{
                background: "#FFFFFF",
                borderRadius: 20,
                padding: "28px 24px 26px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 16px rgba(10, 31, 68, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
                border: "1px solid rgba(10, 31, 68, 0.08)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                height: "100%",
              }}
            >
              {/* Subtle Top Accent */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3.5,
                  background: "linear-gradient(90deg, #E8871A 0%, #F59E0B 100%)",
                }}
              />

              {/* Card Title */}
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0A1F44",
                  lineHeight: 1.35,
                  margin: "0 0 14px",
                  letterSpacing: "-0.3px",
                  minHeight: 48,
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                {card.title}
              </h3>

              {/* Subtle Divider */}
              <div
                style={{
                  height: 1,
                  background: "rgba(10, 31, 68, 0.06)",
                  marginBottom: 16,
                }}
              />

              {/* Bullet Points */}
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  flex: 1,
                }}
              >
                {card.points.map((pt, pIdx) => (
                  <li
                    key={pIdx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 9,
                      fontSize: 13.5,
                      color: "#334155",
                      lineHeight: 1.55,
                      fontWeight: 450,
                    }}
                  >
                    <span
                      style={{
                        width: 17,
                        height: 17,
                        borderRadius: "50%",
                        background: "rgba(232, 135, 26, 0.12)",
                        color: "#E8871A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2.5,
                      }}
                    >
                      <Check size={10} strokeWidth={3} />
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .usps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          align-items: stretch;
        }

        .usp-simple-card:hover {
          transform: translateY(-4px);
          border-color: rgba(232, 135, 26, 0.3) !important;
          box-shadow: 0 12px 28px rgba(10, 31, 68, 0.07), 0 2px 6px rgba(0, 0, 0, 0.03) !important;
        }

        @media (max-width: 1100px) {
          .usps-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 18px;
          }
        }

        @media (max-width: 640px) {
          .usps-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </section>
  );
}
