"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { FacultyMember } from "@/data/programs/types";
import type { EdgeMentorsSection, EdgeMentorItem } from "@/data/edge/types";

type MentorType = FacultyMember | EdgeMentorItem | any;

interface EdgeMentorsProps {
  section?: EdgeMentorsSection;
  title?: string;
  mentorsSection?: {
    eyebrow?: string;
    title?: string;
    faculty?: FacultyMember[];
    mentors?: EdgeMentorItem[];
  };
  faculty?: FacultyMember[];
}

const CARD_WIDTH = 280;
const CARD_GAP = 24;
const STEP = CARD_WIDTH + CARD_GAP; // 304px

export default function EdgeMentors({
  section,
  title = "Meet our Mentors",
  mentorsSection,
  faculty,
}: EdgeMentorsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedMentor, setSelectedMentor] = useState<MentorType | null>(null);
  const isAnimatingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const rawMentors: MentorType[] =
    section?.mentors ||
    mentorsSection?.faculty ||
    mentorsSection?.mentors ||
    faculty ||
    [];
  if (rawMentors.length === 0) return null;
  const mentors = rawMentors;

  const isCarousel = mentors.length > 4;
  const sectionTitle = section?.title || mentorsSection?.title || title;

  // For carousel mode (5+ mentors), duplicate 3 sets for seamless infinite loop
  const displayMentors = isCarousel
    ? [...mentors, ...mentors, ...mentors]
    : mentors;
  const singleSetWidth = STEP * mentors.length;

  useEffect(() => {
    if (isCarousel && scrollRef.current) {
      // Start in the center set
      scrollRef.current.scrollLeft = singleSetWidth;
    }
  }, [isCarousel, singleSetWidth]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const checkAndAdjustBoundary = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !isCarousel) return;

    // Normalizes scroll position to center set (Set 1) if moved into Set 0 or Set 2
    if (el.scrollLeft >= singleSetWidth * 2) {
      el.scrollLeft -= singleSetWidth;
    } else if (el.scrollLeft < singleSetWidth * 0.5) {
      el.scrollLeft += singleSetWidth;
    }
  }, [isCarousel, singleSetWidth]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !isCarousel) return;

    // If an arrow animation is actively running, do not mutate scrollLeft
    // to avoid interrupting the browser's smooth transition
    if (isAnimatingRef.current) return;

    // Boundary check for manual swipe/touch/trackpad dragging
    if (el.scrollLeft >= singleSetWidth * 2) {
      el.scrollLeft -= singleSetWidth;
    } else if (el.scrollLeft <= 10) {
      el.scrollLeft += singleSetWidth;
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      checkAndAdjustBoundary();
    }, 150);
  }, [isCarousel, singleSetWidth, checkAndAdjustBoundary]);

  const scrollCarousel = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el || !isCarousel) return;

    isAnimatingRef.current = true;

    el.scrollBy({
      left: direction * STEP,
      behavior: "smooth",
    });

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Release animation lock and seamlessly adjust boundary after smooth scroll settles
    scrollTimeoutRef.current = setTimeout(() => {
      isAnimatingRef.current = false;
      checkAndAdjustBoundary();
    }, 400);
  };

  const scrollLeft = () => scrollCarousel(-1);
  const scrollRight = () => scrollCarousel(1);

  const getMentorRole = (m: MentorType) => m.role || m.designation || "Faculty Member";

  const getMentorDesc = (m: MentorType) => {
    if (m.desc) return m.desc;
    if (m.description) return m.description;
    const r = getMentorRole(m);
    if (r && r.includes("Trainer")) {
      return "Technical trainer delivering hands-on instruction and practical upskilling in modern labs.";
    }
    return "Academic educator dedicated to student mentorship, research guidance, and core foundation building.";
  };

  const getMentorImage = (m: MentorType) => m.img || m.image || "/dummy.webp";

  const renderMentorCard = (m: MentorType, key: string | number) => (
    <div
      key={key}
      className="mentor-card"
      style={{
        width: isCarousel ? CARD_WIDTH : "100%",
        maxWidth: 320,
        height: 420,
        background: "#FFFFFF",
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "1px solid #E2E8F0",
        boxShadow: "0 4px 14px rgba(10,31,68,0.04)",
        flexShrink: isCarousel ? 0 : 1,
      }}
    >
      {/* Photo Container */}
      <div
        style={{
          width: "100%",
          height: 240,
          background: "linear-gradient(180deg, #F8FAFC 0%, #EDF2F7 100%)",
          position: "relative",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getMentorImage(m)}
          alt={m.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: m.imagePosition || "center 25%",
            transform: m.imageScale ? `scale(${m.imageScale})` : undefined,
            transformOrigin: "center center",
            transition: "transform 0.3s ease",
            display: "block",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            if (e.currentTarget.parentElement) {
              e.currentTarget.parentElement.innerHTML =
                '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #F1F5F9; color: #64748B; font-weight: 700; font-size: 14px;">[ Faculty Photo ]</div>';
            }
          }}
        />
      </div>

      {/* Card Body - Name, Title & CTA */}
      <div
        style={{
          padding: "18px 18px 20px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%" }}>
          <h3
            style={{
              fontSize: 17.5,
              fontWeight: 800,
              color: "#0A1F44",
              margin: 0,
              minHeight: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1.25,
            }}
          >
            {m.name}
          </h3>

          <p
            style={{
              fontSize: 13,
              color: "#E8871A",
              fontWeight: 700,
              margin: "4px 0 0",
              minHeight: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1.35,
            }}
          >
            {getMentorRole(m)}
          </p>
        </div>

        <div style={{ width: "100%" }}>
          <div style={{ width: "100%", borderBottom: "1px solid #F1F5F9", margin: "12px 0 10px" }} />

          <button
            onClick={() => setSelectedMentor(m)}
            className="read-more-btn"
            style={{
              background: "none",
              border: "none",
              color: "#0A1F44",
              fontSize: 13.5,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              cursor: "pointer",
              width: "100%",
              padding: "4px 0",
            }}
          >
            <span>Read More</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section id="Mentors" style={{ padding: "52px 0 48px", background: "#FFFFFF", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <h2 style={{ fontSize: 44, fontWeight: 800, color: "#0A1F44", lineHeight: 1.2, letterSpacing: "-1px" }}>
          {sectionTitle}
        </h2>

        <div style={{ position: "relative", marginTop: 48 }}>
          {!isCarousel ? (
            /* 1–4 Mentors: Clean Static Responsive Grid (No Carousel, No Duplicates, No Arrows) */
            <div
              className="mentors-static-grid"
              style={{
                display: "grid",
                gridTemplateColumns:
                  mentors.length === 1
                    ? "minmax(280px, 320px)"
                    : mentors.length === 2
                      ? "repeat(auto-fit, minmax(280px, 320px))"
                      : "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 24,
                justifyContent: mentors.length < 3 ? "flex-start" : "stretch",
                width: "100%",
              }}
            >
              {mentors.map((m, i) => renderMentorCard(m, `static-${i}`))}
            </div>
          ) : (
            /* >4 Mentors: Smooth, Seamless Carousel with Left/Right Navigation */
            <div style={{ position: "relative" }}>
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="hide-scroll"
                style={{
                  display: "flex",
                  gap: CARD_GAP,
                  overflowX: "auto",
                  paddingBottom: 24,
                }}
              >
                {displayMentors.map((m, i) => renderMentorCard(m, `carousel-${i}`))}
              </div>

              {/* Slider Controls */}
              <button
                onClick={scrollLeft}
                style={{
                  position: "absolute",
                  left: -20,
                  top: "140px",
                  background: "#FFFFFF",
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #E2E8F0",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                  color: "#0A1F44",
                  zIndex: 10,
                  transition: "all 0.2s ease",
                }}
                aria-label="Previous mentor"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <button
                onClick={scrollRight}
                style={{
                  position: "absolute",
                  right: -20,
                  top: "140px",
                  background: "#FFFFFF",
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #E2E8F0",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                  color: "#0A1F44",
                  zIndex: 10,
                  transition: "all 0.2s ease",
                }}
                aria-label="Next mentor"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Modal - Full Information View */}
        <AnimatePresence>
          {selectedMentor && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
              }}
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedMentor(null)}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(10,31,68,0.55)",
                  backdropFilter: "blur(6px)",
                }}
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ type: "spring", duration: 0.4 }}
                style={{
                  position: "relative",
                  background: "#FFFFFF",
                  borderRadius: 24,
                  padding: "36px 28px 28px",
                  maxWidth: 500,
                  width: "100%",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
                  zIndex: 10000,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedMentor(null)}
                  style={{
                    position: "absolute",
                    top: 18,
                    right: 18,
                    background: "#F1F5F9",
                    border: "none",
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#64748B",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#E2E8F0";
                    e.currentTarget.style.color = "#0F172A";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#F1F5F9";
                    e.currentTarget.style.color = "#64748B";
                  }}
                  aria-label="Close mentor details"
                >
                  <X size={18} />
                </button>

                {/* Profile Image */}
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "#F1F5F9",
                    marginBottom: 18,
                    border: "4px solid #F8FAFC",
                    boxShadow: "0 6px 20px rgba(10,31,68,0.1)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getMentorImage(selectedMentor)}
                    alt={selectedMentor.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center 15%",
                      display: "block",
                    }}
                  />
                </div>

                {/* Name */}
                <h3 style={{ fontSize: 22, fontWeight: 900, color: "#0A1F44", margin: 0, lineHeight: 1.3 }}>
                  {selectedMentor.name}
                </h3>

                {/* Role / Designation Badge */}
                <div
                  style={{
                    display: "inline-block",
                    background: "#FEF3C7",
                    color: "#B45309",
                    padding: "4px 14px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 700,
                    marginTop: 8,
                    marginBottom: 16,
                    lineHeight: 1.4,
                  }}
                >
                  {getMentorRole(selectedMentor)}
                </div>

                {/* Divider */}
                <div style={{ width: "100%", borderBottom: "1px solid #E2E8F0", marginBottom: 18 }} />

                {/* Full Description & Information */}
                <div
                  style={{
                    width: "100%",
                    maxHeight: 260,
                    overflowY: "auto",
                    padding: "0 6px",
                    textAlign: "left",
                  }}
                >
                  <p style={{ fontSize: 14.5, color: "#334155", lineHeight: 1.7, margin: 0, fontWeight: 450, whiteSpace: "pre-line" }}>
                    {getMentorDesc(selectedMentor)}
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => setSelectedMentor(null)}
                  style={{
                    marginTop: 24,
                    padding: "11px 32px",
                    background: "#0A1F44",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#E8871A")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#0A1F44")}
                >
                  Close Profile
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .mentor-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease !important;
        }
        .mentor-card:hover {
          transform: translateY(-5px);
          border-color: #E8871A !important;
          box-shadow: 0 12px 24px rgba(232,135,26,0.12) !important;
        }
        .read-more-btn {
          transition: color 0.2s ease !important;
        }
        .read-more-btn:hover {
          color: #E8871A !important;
        }
      `}</style>
    </section>
  );
}
