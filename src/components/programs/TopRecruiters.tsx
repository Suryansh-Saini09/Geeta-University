"use client";

import React from "react";
import Image from "next/image";
import type { RecruiterItem } from "@/data/programs/types";

export const BRAND_DATA: Record<string, { src: string; width: number; height: number; label: string }> = {
  "Cincooni Systems": {
    src: "/cincooni.svg",
    width: 140,
    height: 44,
    label: "Cincooni Systems",
  },
  "Kerakoll India": {
    src: "/kerakoll.svg",
    width: 110,
    height: 32,
    label: "Kerakoll India",
  },
  "Tenhard India": {
    src: "/tenhard_india.svg",
    width: 140,
    height: 44,
    label: "Tenhard India",
  },
  "Edu-Versity": {
    src: "/edu_versity.svg",
    width: 150,
    height: 44,
    label: "Edu-Versity",
  },
  "Academor Edutech": {
    src: "/academor.svg",
    width: 140,
    height: 44,
    label: "Academor Edutech",
  },
  "Hoping Minds": {
    src: "/hoping_minds.png",
    width: 110,
    height: 32,
    label: "Hoping Minds",
  },
  "Chegg India": {
    src: "/chegg.svg",
    width: 90,
    height: 34,
    label: "Chegg India",
  },
  "Profunnel Technology": {
    src: "/profunnel.svg",
    width: 100,
    height: 32,
    label: "Profunnel Technology",
  },
  "Hike Education": {
    src: "/hike_education.png",
    width: 110,
    height: 36,
    label: "Hike Education",
  },
  "Centricity Wealth Tech": {
    src: "/centricity.svg",
    width: 120,
    height: 32,
    label: "Centricity Wealth Tech",
  },
  "PayU Payments": {
    src: "/payu.svg",
    width: 80,
    height: 32,
    label: "PayU Payments",
  },
  Thales: {
    src: "/thales.svg",
    width: 100,
    height: 32,
    label: "Thales",
  },
  "Amazon AWS": {
    src: "/aws.svg",
    width: 80,
    height: 42,
    label: "Amazon AWS",
  },
  "Red Hat": {
    src: "/redhat.svg",
    width: 100,
    height: 32,
    label: "Red Hat",
  },
  Cisco: {
    src: "/cisco.svg",
    width: 90,
    height: 40,
    label: "Cisco",
  },
  Oracle: {
    src: "/oracle.svg",
    width: 100,
    height: 30,
    label: "Oracle",
  },
  "Microsoft Azure": {
    src: "/azure.svg",
    width: 44,
    height: 44,
    label: "Microsoft Azure",
  },
  GitHub: {
    src: "/github.svg",
    width: 44,
    height: 44,
    label: "GitHub",
  },
  HubSpot: {
    src: "/hubspot.svg",
    width: 100,
    height: 32,
    label: "HubSpot",
  },
  "EC-Council": {
    src: "/eccouncil.png",
    width: 90,
    height: 40,
    label: "EC-Council",
  },
  VMware: {
    src: "/vmware.svg",
    width: 120,
    height: 28,
    label: "VMware",
  },
  CompTIA: {
    src: "/comptia.svg",
    width: 110,
    height: 32,
    label: "CompTIA",
  },
  SAP: {
    src: "/sap.svg",
    width: 90,
    height: 44,
    label: "SAP",
  },
  Coursera: {
    src: "/coursera.svg",
    width: 140,
    height: 30,
    label: "Coursera",
  },
  edX: {
    src: "/edx.svg",
    width: 80,
    height: 40,
    label: "edX",
  },
  Autodesk: {
    src: "/autodesk.svg",
    width: 140,
    height: 30,
    label: "Autodesk",
  },
  IFFCO: {
    src: "/programs/agriculture/recruiters/iffco.svg",
    width: 130,
    height: 38,
    label: "IFFCO",
  },
  "Mahindra Agri Solutions": {
    src: "/programs/agriculture/recruiters/mahindra_agri.svg",
    width: 140,
    height: 36,
    label: "Mahindra Agri Solutions",
  },
  "Bayer CropScience": {
    src: "/programs/agriculture/recruiters/bayer.svg",
    width: 130,
    height: 38,
    label: "Bayer CropScience",
  },
  "Syngenta India": {
    src: "/programs/agriculture/recruiters/syngenta.svg",
    width: 130,
    height: 36,
    label: "Syngenta India",
  },
  "Coromandel International": {
    src: "/programs/agriculture/recruiters/coromandel.svg",
    width: 140,
    height: 36,
    label: "Coromandel International",
  },
  "UPL Limited": {
    src: "/programs/agriculture/recruiters/upl.svg",
    width: 120,
    height: 38,
    label: "UPL Limited",
  },
  "Godrej Agrovet": {
    src: "/programs/agriculture/recruiters/godrej_agrovet.svg",
    width: 140,
    height: 36,
    label: "Godrej Agrovet",
  },
  "ITC Agri Business": {
    src: "/programs/agriculture/recruiters/itc_agri.svg",
    width: 130,
    height: 36,
    label: "ITC Agri Business",
  },
  "Cargill India": {
    src: "/programs/agriculture/recruiters/cargill.svg",
    width: 130,
    height: 36,
    label: "Cargill India",
  },
  "Nestle India": {
    src: "/programs/agriculture/recruiters/nestle.svg",
    width: 130,
    height: 36,
    label: "Nestle India",
  },
  "Dhanuka Agritech": {
    src: "/programs/agriculture/recruiters/dhanuka.svg",
    width: 140,
    height: 36,
    label: "Dhanuka Agritech",
  },
  "National Seeds Corporation": {
    src: "/programs/agriculture/recruiters/nsc.svg",
    width: 140,
    height: 38,
    label: "National Seeds Corporation",
  },
  "PI Industries": {
    src: "/programs/agriculture/recruiters/pi_industries.svg",
    width: 140,
    height: 38,
    label: "PI Industries",
  },
  "Escorts Kubota": {
    src: "/programs/agriculture/recruiters/escorts.svg",
    width: 140,
    height: 36,
    label: "Escorts Kubota",
  },
  "Jain Irrigation Systems": {
    src: "/programs/agriculture/recruiters/jain_irrigation.svg",
    width: 150,
    height: 38,
    label: "Jain Irrigation Systems",
  },
  "Mother Dairy": {
    src: "/programs/agriculture/recruiters/mother_dairy.svg",
    width: 150,
    height: 36,
    label: "Mother Dairy",
  },
};

export const DEFAULT_BRAND_KEYS_ROW1 = [
  "Cincooni Systems",
  "Kerakoll India",
  "Chegg India",
  "PayU Payments",
  "Amazon AWS",
  "Cisco",
  "Microsoft Azure",
  "HubSpot",
  "Tenhard India",
  "Edu-Versity",
];

export const DEFAULT_BRAND_KEYS_ROW2 = [
  "Academor Edutech",
  "Hoping Minds",
  "Profunnel Technology",
  "Centricity Wealth Tech",
  "Thales",
  "Red Hat",
  "Oracle",
  "GitHub",
  "EC-Council",
];

function RecruiterCard({ name, customLogo }: { name: string; customLogo?: string | null }) {
  const brand = BRAND_DATA[name];
  const imageSrc = customLogo || brand?.src;

  return (
    <div
      style={{
        display: "inline-flex",
        flexShrink: 0,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        width: 220,
        height: 110,
        margin: "0 12px",
        padding: "0 28px",
        borderRadius: 16,
        background: "#FFFFFF",
        boxShadow: "0 4px 20px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.04)",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px) scale(1.03)";
        e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)";
      }}
    >
      {imageSrc ? (
        <div className="relative flex items-center justify-center w-full h-[56px]">
          <Image
            src={imageSrc}
            alt={brand?.label || name}
            fill
            sizes="160px"
            loading="lazy"
            className="object-contain pointer-events-none"
            onError={(e) => {
              const parent = e.currentTarget.parentElement;
              const card = parent?.parentElement;
              if (parent && card) {
                parent.style.display = "none";
                const span = document.createElement("span");
                span.textContent = name;
                span.style.cssText = "font-size:14px;font-weight:700;color:#1A1A2E;text-align:center;";
                card.appendChild(span);
              }
            }}
          />
        </div>
      ) : (
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", textAlign: "center" }}>{name}</span>
      )}
    </div>
  );
}

interface TopRecruitersProps {
  title?: string;
  badgeText?: string;
  recruiters?: RecruiterItem[];
  row1?: string[];
  row2?: string[];
}

export default function TopRecruiters({
  title = "100+ Companies. Endless Possibilities.",
  recruiters,
  row1,
  row2,
}: TopRecruitersProps) {
  type RowItem = { name: string; logo?: string | null };
  let listRow1: RowItem[] = (row1 || DEFAULT_BRAND_KEYS_ROW1).map((name) => ({ name }));
  let listRow2: RowItem[] = (row2 || DEFAULT_BRAND_KEYS_ROW2).map((name) => ({ name }));

  if (recruiters && recruiters.length > 0) {
    const half = Math.ceil(recruiters.length / 2);
    listRow1 = recruiters.slice(0, half).map((r) => ({ name: r.name, logo: r.logo }));
    listRow2 = recruiters.slice(half).map((r) => ({ name: r.name, logo: r.logo }));
  }

  return (
    <section
      id="TopRecruiters"
      style={{
        background: "linear-gradient(135deg, #C94210 0%, #D94E1A 35%, #E8771A 70%, #D4500F 100%)",
        padding: "52px 0 48px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes marqueeLoop {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeLoopRev {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .rec-marquee:hover { animation-play-state: paused !important; }
        @keyframes recFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Subtle noise overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          opacity: 0.5,
          mixBlendMode: "overlay",
        }}
      />
      {/* Light radial highlight top-left */}
      <div
        style={{
          position: "absolute",
          top: -120,
          left: "5%",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 52,
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
          animation: "recFadeUp 0.6s ease both",
        }}
      >
        <h2
          style={{
            margin: "0 0 10px",
            fontSize: 36,
            fontWeight: 800,
            color: "#FFFFFF",
            lineHeight: 1.1,
            letterSpacing: "-0.5px",
            textShadow: "0 2px 12px rgba(0,0,0,0.2)",
          }}
        >
          {title}
        </h2>
      </div>

      {/* Row 1 — scrolls left */}
      <div style={{ position: "relative", overflow: "hidden", paddingBottom: 8, zIndex: 1 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: 180,
            zIndex: 2,
            pointerEvents: "none",
            background: "linear-gradient(90deg, #D94E1A 0%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            left: "auto",
            right: 0,
            width: 180,
            zIndex: 2,
            pointerEvents: "none",
            background: "linear-gradient(-90deg, #D94E1A 0%, transparent 100%)",
          }}
        />
        <div
          className="rec-marquee"
          style={{
            display: "flex",
            width: "max-content",
            padding: "10px 0",
            animation: "marqueeLoop 30s linear infinite",
          }}
        >
          {[...listRow1, ...listRow1].map((item, i) => (
            <RecruiterCard key={`r1-${item.name}-${i}`} name={item.name} customLogo={item.logo} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div style={{ position: "relative", overflow: "hidden", marginTop: 16, zIndex: 1 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: 180,
            zIndex: 2,
            pointerEvents: "none",
            background: "linear-gradient(90deg, #D94E1A 0%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            left: "auto",
            right: 0,
            width: 180,
            zIndex: 2,
            pointerEvents: "none",
            background: "linear-gradient(-90deg, #D94E1A 0%, transparent 100%)",
          }}
        />
        <div
          className="rec-marquee"
          style={{
            display: "flex",
            width: "max-content",
            padding: "10px 0",
            animation: "marqueeLoopRev 36s linear infinite",
          }}
        >
          {[...listRow2, ...listRow2].map((item, i) => (
            <RecruiterCard key={`r2-${item.name}-${i}`} name={item.name} customLogo={item.logo} />
          ))}
        </div>
      </div>
    </section>
  );
}
