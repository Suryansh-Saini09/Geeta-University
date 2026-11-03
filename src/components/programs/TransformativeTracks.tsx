
"use client";

import React from "react";
import Image from "next/image";

export interface ImmersionCardItem {
  title: string;
  image: string;
  points: string[];
}

export interface TransformativeTrackCard {
  title: string;
  points: string[];
}

export interface TransformativeTracksSection {
  title?: string;
  subtitle?: string;
  cards: TransformativeTrackCard[];
  immersionCards?: ImmersionCardItem[];
}

interface TransformativeTracksProps {
  tracks: TransformativeTracksSection;
}

export default function TransformativeTracks({ tracks }: TransformativeTracksProps) {
  if (!tracks || !tracks.cards || tracks.cards.length === 0) return null;

  const title = tracks.title || "We Don't Just Educate We Transform Futures !";

  return (
    <section
      id="TransformativeTracks"
      style={{
        padding: "48px 0 52px",
        background: "#FFFFFF",
        position: "relative",
        borderTop: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: 46 }}>
          <h2
            style={{
              fontSize: "clamp(26px, 3.4vw, 38px)",
              fontWeight: 900,
              color: "#0A1F44",
              lineHeight: 1.25,
              letterSpacing: "-0.5px",
              margin: 0,
            }}
          >
            {title}
          </h2>
          {tracks.subtitle && (
            <p
              style={{
                fontSize: "clamp(15px, 1.2vw, 17px)",
                color: "#475569",
                margin: "12px auto 0",
                maxWidth: 780,
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              {tracks.subtitle}
            </p>
          )}
        </div>

        {/* 4-Column Grid */}
        <div className="transform-tracks-grid">
          {tracks.cards.map((card, idx) => {
            const match = card.title.match(/^(Phase\s*\d+)\s*:\s*(.+)$/i);
            const phaseBadge = match ? match[1] : null;
            const displayTitle = match ? match[2] : card.title;

            return (
              <div
                key={idx}
                className="transform-track-card"
                style={{
                  background: "#FFFFFF",
                  borderRadius: 16,
                  padding: "32px 24px 28px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                }}
              >
                {/* Card Title */}
                <div style={{ textAlign: "center", marginBottom: 14 }}>
                  {phaseBadge && (
                    <div
                      style={{
                        display: "inline-block",
                        padding: "3px 12px",
                        borderRadius: 9999,
                        background: "#0E395C",
                        color: "#FFFFFF",
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: 10,
                      }}
                    >
                      {phaseBadge}
                    </div>
                  )}
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#0A1F44",
                      textAlign: "center",
                      margin: 0,
                      lineHeight: 1.35,
                      minHeight: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {displayTitle}
                  </h3>
                </div>

              {/* Title Divider */}
              <div
                style={{
                  width: "100%",
                  height: 1,
                  background: "#E2E8F0",
                  marginBottom: 20,
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
                  gap: 11,
                  flex: 1,
                }}
              >
                {card.points.map((pt, pIdx) => (
                  <li
                    key={pIdx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      fontSize: 14.5,
                      color: "#334155",
                      lineHeight: 1.55,
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "#0A1F44",
                        flexShrink: 0,
                        marginTop: 8,
                        opacity: 0.85,
                      }}
                    />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        </div>

        {/* Optional Immersion & Global Certification Cards (in continuous flow) */}
        {tracks.immersionCards && tracks.immersionCards.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {tracks.immersionCards.map((card, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-[#0A1F44]/15 bg-[#0E395C] shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col"
              >
                <div className="relative w-full h-[210px] sm:h-[240px] overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Dark Blue Content Container */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 bg-[#0E395C]">
                  <h3 className="text-xl sm:text-[22px] font-bold text-white mb-3 tracking-tight font-serif">
                    {card.title}
                  </h3>
                  <ul className="space-y-2.5 p-0 m-0 list-none">
                    {card.points.map((pt, pIdx) => (
                      <li
                        key={pIdx}
                        className="flex items-start gap-2.5 text-sm sm:text-[15px] text-white/90 leading-relaxed font-medium"
                      >
                        <span className="text-[#FF5F19] font-bold text-base leading-none select-none mt-0.5">
                          ✓
                        </span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .transform-tracks-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
          align-items: stretch;
        }

        .transform-track-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(10, 31, 68, 0.08) !important;
          border-color: #CBD5E1;
        }

        @media (max-width: 1080px) {
          .transform-tracks-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .transform-track-card h3 {
            min-height: auto !important;
          }
        }

        @media (max-width: 640px) {
          .transform-tracks-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </section>
  );
}
