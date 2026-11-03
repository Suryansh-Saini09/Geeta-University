"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { BRAND_DATA } from "./TopRecruiters";
import type { PartnerItem } from "@/data/programs/types";

function PartnerLogoCard({ name, brandKey, customLogo }: { name: string; brandKey?: string | null; customLogo?: string }) {
  const brand = brandKey ? BRAND_DATA[brandKey] : null;
  const imageSrc = customLogo || brand?.src;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 64,
        padding: "0 24px",
        borderRadius: 14,
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: "0 4px 12px rgba(10,31,68,0.03)",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        cursor: "default",
      }}
      className="gth-partner-card"
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={brand?.label || name}
          width={brand?.width || 120}
          height={brand?.height || 36}
          sizes="150px"
          loading="lazy"
          className="max-w-[150px] max-h-[55px] w-auto h-auto object-contain opacity-85 transition-all duration-300 gth-partner-img"
        />
      ) : (
        <span
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: "#0A1F44",
            letterSpacing: "0.02em",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </span>
      )}
    </div>
  );
}

interface InternationalPartnersProps {
  title?: string;
  subtitle?: string;
  partners?: PartnerItem[];
  infoBannerText?: string;
}

export default function InternationalPartners({
  title = "International & Industry Partners",
  subtitle = "Learning Powered by Global Ecosystems — Skill development and training supported by recognized global partners.",
  partners,
  infoBannerText = "These partnerships support student skill development through certifications, training programs, and platform-integrated learning.",
}: InternationalPartnersProps) {
  if (!partners || partners.length === 0) return null;
  const items = partners;

  return (
    <section
      id="InternationalPartners"
      style={{
        background: "#F8FAFC",
        padding: "90px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative radial glows */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: "100%",
          background: "radial-gradient(circle, rgba(232, 135, 26, 0.03) 0%, transparent 80%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          <h2
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: "#0A1F44",
              margin: "0",
              lineHeight: 1.1,
              letterSpacing: "-1px",
            }}
          >
            {title}
          </h2>

          {/* Subtitle commented out
          <p
            style={{
              color: "#4A5568",
              fontSize: 16,
              lineHeight: 1.7,
              margin: "0 auto",
              fontWeight: 500,
              maxWidth: 800,
            }}
          >
            {subtitle}
          </p>
          */}
        </motion.div>

        {/* Partners Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 18,
            marginBottom: 44,
          }}
          className="partners-grid"
        >
          {items.map((partner, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (idx % 5) * 0.05 }}
            >
              <PartnerLogoCard name={partner.name} brandKey={partner.brandKey} customLogo={partner.logo} />
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner info */}
        {infoBannerText && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              background: "rgba(232, 135, 26, 0.06)",
              border: "1px solid rgba(232, 135, 26, 0.15)",
              borderRadius: 14,
              padding: "16px 24px",
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            <Award style={{ width: 20, height: 20, color: "#E8871A", flexShrink: 0 }} />
            <span
              style={{
                fontSize: 14,
                color: "#2D3748",
                fontWeight: 600,
                lineHeight: 1.5,
                textAlign: "center",
              }}
            >
              {infoBannerText}
            </span>
          </motion.div>
        )}
      </div>

      <style>{`
        @media (max-width: 960px) {
          .partners-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .partners-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        .gth-partner-card:hover {
          border-color: #E8871A !important;
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(10,31,68,0.08) !important;
        }
        .gth-partner-card:hover .gth-partner-img {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
