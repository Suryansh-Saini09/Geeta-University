
import React from "react";
import type { RankingItem } from "@/data/programs/types";

export const DEFAULT_RANKINGS: RankingItem[] = [
  {
    title: "UGC",
    subtitleLine1: "UNIVERSITY",
    subtitleLine2: "GRANTS COMMISSION",
    subtitleLine3: "approved",
    rankLabel: "Status",
    rankValue: "Approved",
    desc: "UGC-Approved University",
    highlight: "(Government Recognized)",
  },
  {
    title: "CSR",
    subtitleLine1: "COMPETITION",
    subtitleLine2: "SUCCESS REVIEW",
    subtitleLine3: "by ranking",
    rankLabel: "Ranked",
    rankValue: "#6",
    desc: "Ranked 6th Among Top Universities of India — Competition Success Review",
    highlight: "(Top University)",
  },
  {
    title: "C360",
    subtitleLine1: "CAREER 360",
    subtitleLine2: "ACADEMIC RATING",
    subtitleLine3: "premium",
    rankLabel: "Rating",
    rankValue: "AAA",
    desc: "AAA Rating — Career360",
    highlight: "(Overall Excellence)",
  },
];

const BrandLogo = ({
  title,
  subtitleLine1,
  subtitleLine2,
  subtitleLine3,
}: {
  title: string;
  subtitleLine1: string;
  subtitleLine2?: string;
  subtitleLine3?: string;
}) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
    <div
      style={{
        background: "#F1B434",
        color: "white",
        padding: "10px 14px",
        fontWeight: 900,
        fontSize: 36,
        letterSpacing: -1,
        lineHeight: 1,
      }}
    >
      {title}
    </div>
    <div
      style={{
        color: "#000",
        fontWeight: 800,
        fontSize: 13,
        lineHeight: 1.2,
        letterSpacing: 0.5,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <span>{subtitleLine1}</span>
      {subtitleLine2 && <span>{subtitleLine2}</span>}
      {subtitleLine3 && (
        <span
          style={{
            fontFamily: "cursive",
            fontSize: 18,
            fontWeight: 400,
            marginTop: 2,
            color: "#333",
            letterSpacing: 0,
          }}
        >
          {subtitleLine3}
        </span>
      )}
    </div>
  </div>
);

interface RankingsAccreditationsProps {
  title?: string;
  subtitle?: string;
  rankings?: RankingItem[];
}

export default function RankingsAccreditations({
  title = "Trusted. Recognised. Ranked.",
  subtitle = "Geeta University's academic quality and institutional standing are reflected across multiple independent assessments:",
  rankings = DEFAULT_RANKINGS,
}: RankingsAccreditationsProps) {
  const items = rankings && rankings.length > 0 ? rankings : DEFAULT_RANKINGS;

  return (
    <section
      id="Rankings"
      style={{
        background: "#FDF1D6",
        padding: "48px 0 52px",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <h2
            style={{
              fontSize: 46,
              color: "#000",
              lineHeight: 1.2,
              letterSpacing: "-1px",
              marginBottom: 0,
            }}
          >
            <span style={{ fontWeight: 800 }}>{title}</span>
          </h2>
          {/* Subtitle commented out
          <p
            style={{
              fontSize: 18,
              color: "#333333",
              maxWidth: 800,
              margin: "0 auto",
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            {subtitle}
          </p>
          */}
        </div>

        <div>
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                borderBottom: idx === items.length - 1 ? "none" : "1px solid rgba(0,0,0,0.8)",
                padding: "40px 0",
                gap: 40,
              }}
              className="ranking-row"
            >
              <div style={{ flex: "0 0 260px" }}>
                <BrandLogo
                  title={item.title}
                  subtitleLine1={item.subtitleLine1}
                  subtitleLine2={item.subtitleLine2}
                  subtitleLine3={item.subtitleLine3}
                />
              </div>

              <div style={{ flex: "0 0 180px" }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#000" }}>{item.rankLabel}</div>
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: 48,
                    color: "#000",
                    lineHeight: 1,
                    marginTop: 4,
                    letterSpacing: -1.5,
                  }}
                >
                  {item.rankValue}
                </div>
              </div>

              <div style={{ flex: "1", paddingRight: 32 }}>
                <div style={{ fontSize: 15, color: "#111", lineHeight: 1.5, fontWeight: 500 }}>
                  {item.desc}
                </div>
                <div style={{ fontSize: 14, color: "#E31E24", fontWeight: 800, marginTop: 6 }}>
                  {item.highlight}
                </div>
              </div>

              <div style={{ opacity: 0.6 }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .ranking-row {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 24px !important;
            padding: 32px 0 !important;
          }
          .ranking-row > div {
            flex: auto !important;
            padding-right: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
