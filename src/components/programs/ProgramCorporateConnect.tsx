"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { CorporateConnectData } from "@/data/programs/types";

interface ProgramCorporateConnectProps {
  corporateConnect?: CorporateConnectData;
}

export default function ProgramCorporateConnect({ corporateConnect }: ProgramCorporateConnectProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const videoScrollRef = useRef<HTMLDivElement>(null);

  if (!corporateConnect) return null;

  const eyebrow = corporateConnect.eyebrow || "INDUSTRY INTERACTION & CORPORATE SESSIONS";
  const title = corporateConnect.title || "Corporate Connect";
  const description = corporateConnect.description;
  const videos = corporateConnect.videos || [];
  const events = corporateConnect.events || [];

  if (videos.length === 0 && events.length === 0) return null;

  const scrollVideos = (direction: 1 | -1) => {
    if (videoScrollRef.current) {
      videoScrollRef.current.scrollBy({
        left: direction * 320,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="CorporateConnect"
      style={{
        padding: "85px 0 95px",
        background: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          {/* Eyebrow commented out
          {eyebrow && (
            <span
              style={{
                color: "#E8871A",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: 2,
                textTransform: "uppercase",
                display: "inline-block",
                marginBottom: 10,
              }}
            >
              {eyebrow}
            </span>
          )}
          */}
          <h2
            style={{
              fontSize: "clamp(32px, 3.8vw, 44px)",
              fontWeight: 800,
              color: "#0A1F44",
              lineHeight: 1.15,
              letterSpacing: "-1px",
              margin: 0,
            }}
          >
            {title}
          </h2>
          {/* Description commented out
          {description && (
            <p
              style={{
                fontSize: 16.5,
                color: "#4A5568",
                lineHeight: 1.75,
                fontWeight: 450,
                margin: "0 auto",
              }}
            >
              {description}
            </p>
          )}
          */}
        </div>

        {/* 1. CORPORATE VIDEOS SHOWCASE */}
        {videos.length > 0 && (
          <div style={{ position: "relative", marginBottom: events.length > 0 ? 56 : 0 }}>
            {/* Carousel Navigation Buttons */}
            {videos.length > 4 && (
              <>
                <button
                  type="button"
                  onClick={() => scrollVideos(-1)}
                  aria-label="Previous Videos"
                  style={{
                    position: "absolute",
                    left: -18,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "#0A1F44",
                    color: "#FFFFFF",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10,
                    boxShadow: "0 4px 14px rgba(10,31,68,0.25)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#E8871A";
                    e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0A1F44";
                    e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                  }}
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  type="button"
                  onClick={() => scrollVideos(1)}
                  aria-label="Next Videos"
                  style={{
                    position: "absolute",
                    right: -18,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "#0A1F44",
                    color: "#FFFFFF",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10,
                    boxShadow: "0 4px 14px rgba(10,31,68,0.25)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#E8871A";
                    e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0A1F44";
                    e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                  }}
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Scrollable / Grid Video Container */}
            <div
              ref={videoScrollRef}
              className="hide-scroll"
              style={{
                display: "flex",
                gap: 20,
                overflowX: "auto",
                padding: "8px 4px 20px",
                scrollSnapType: "x mandatory",
              }}
            >
              {videos.map((vid, idx) => {
                const thumb = vid.thumbnail || `https://img.youtube.com/vi/${vid.id}/hqdefault.jpg`;

                return (
                  <div
                    key={idx}
                    className="video-card-item"
                    onClick={() => setActiveVideoId(vid.id)}
                    style={{
                      flex: "0 0 270px",
                      maxWidth: 290,
                      height: 180,
                      borderRadius: 14,
                      position: "relative",
                      overflow: "hidden",
                      cursor: "pointer",
                      background: "#000000",
                      boxShadow: "0 6px 18px rgba(10,31,68,0.12)",
                      scrollSnapAlign: "start",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                  >
                    {/* Video Thumbnail */}
                    <Image
                      src={thumb}
                      alt={vid.title || `Corporate video ${idx + 1}`}
                      fill
                      sizes="280px"
                      loading="lazy"
                      className="object-cover transition-transform duration-400"
                    />

                    {/* Dark gradient overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)",
                      }}
                    />

                    {/* Play Button Icon */}
                    <div
                      className="play-btn-circle"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 54,
                        height: 54,
                        borderRadius: "50%",
                        background: "rgba(232, 135, 26, 0.92)",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                        transition: "transform 0.25s ease, background 0.25s ease",
                      }}
                    >
                      <Play size={24} fill="#FFFFFF" style={{ marginLeft: 3 }} />
                    </div>

                    {/* {vid.title && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: "8px 12px",
                          background: "rgba(10, 31, 68, 0.85)",
                          color: "#FFFFFF",
                          fontSize: 13,
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        {vid.title}
                      </div>
                    )} */}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. CORPORATE EVENTS & WORKSHOPS */}
        {events.length > 0 && (
          <div
            className="corporate-connect-list"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32,
            }}
          >
            {events.map((evt, idx) => {
              const isImageFirst = evt.imageFirst !== undefined ? evt.imageFirst : idx % 2 === 0;

              return (
                <div
                  key={idx}
                  className={`corporate-card ${isImageFirst ? "img-first" : "img-last"}`}
                  style={{
                    background: "#F8FAFC",
                    borderRadius: 18,
                    border: "1px solid #E2E8F0",
                    overflow: "hidden",
                    boxShadow: "0 4px 18px rgba(10,31,68,0.04)",
                    display: "grid",
                    gridTemplateColumns: isImageFirst ? "minmax(300px, 0.75fr) 1fr" : "1fr minmax(300px, 0.75fr)",
                    alignItems: "stretch",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                  }}
                >
                  {/* Media Column (when imageFirst) */}
                  {isImageFirst && (
                    <div
                      className="corporate-card-media"
                      style={{
                        position: "relative",
                        minHeight: 280,
                        width: "100%",
                        overflow: "hidden",
                        background: "#EDF2F7",
                      }}
                    >
                      <Image
                        src={evt.image}
                        alt={evt.alt || evt.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 900px) 100vw, 480px"
                      />
                    </div>
                  )}

                  {/* Content Column */}
                  <div
                    className="corporate-card-content"
                    style={{
                      padding: "32px 36px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "clamp(20px, 2.2vw, 26px)",
                        fontWeight: 800,
                        color: "#0A1F44",
                        margin: "0 0 14px",
                        lineHeight: 1.25,
                        borderBottom: "1.5px dashed #CBD5E1",
                        paddingBottom: 12,
                      }}
                    >
                      {evt.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 15.5,
                        color: "#334155",
                        lineHeight: 1.65,
                        margin: 0,
                        fontWeight: 450,
                      }}
                    >
                      {evt.text}
                    </p>

                    {evt.points && evt.points.length > 0 && (
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: "16px 0 0",
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {evt.points.map((pt, pIdx) => (
                          <li
                            key={pIdx}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                              fontSize: 14.5,
                              color: "#334155",
                              lineHeight: 1.5,
                            }}
                          >
                            <span
                              style={{
                                color: "#E8871A",
                                fontWeight: 700,
                                fontSize: 14,
                                flexShrink: 0,
                                marginTop: 2,
                              }}
                            >
                              ✔
                            </span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Media Column (when !imageFirst) */}
                  {!isImageFirst && (
                    <div
                      className="corporate-card-media"
                      style={{
                        position: "relative",
                        minHeight: 280,
                        width: "100%",
                        overflow: "hidden",
                        background: "#EDF2F7",
                      }}
                    >
                      <Image
                        src={evt.image}
                        alt={evt.alt || evt.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 900px) 100vw, 480px"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* VIDEO POPUP MODAL */}
      {activeVideoId && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setActiveVideoId(null)}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 880,
              background: "#000000",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveVideoId(null)}
              aria-label="Close Video"
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                color: "#FFFFFF",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#E8871A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              }}
            >
              <X size={20} />
            </button>

            {/* Responsive 16:9 Iframe */}
            <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", height: 0 }}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                title="Corporate Connect Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .video-card-item:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 28px rgba(10, 31, 68, 0.2) !important;
        }
        .video-card-item:hover img {
          transform: scale(1.08);
        }
        .video-card-item:hover .play-btn-circle {
          background: #e8871a !important;
          transform: translate(-50%, -50%) scale(1.15) !important;
        }
        .corporate-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(10, 31, 68, 0.08) !important;
          border-color: #cbd5e1 !important;
        }
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 860px) {
          .corporate-card,
          .corporate-card.img-first,
          .corporate-card.img-last {
            grid-template-columns: 1fr !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .corporate-card.img-last .corporate-card-media {
            order: -1 !important;
          }
          .corporate-card-media {
            min-height: 220px !important;
            height: 220px !important;
          }
          .corporate-card-content {
            padding: 24px 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
