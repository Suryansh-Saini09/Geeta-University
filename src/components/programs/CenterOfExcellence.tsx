
import React from "react";
import Image from "next/image";

export interface CenterOfExcellenceProps {
  title?: string;
  bg?: string;
}

export default function CenterOfExcellence({
  title = "Centre of Excellence",
  bg = "#E85D1A",
}: CenterOfExcellenceProps) {
  return (
    <section
      id="CenterOfExcellence"
      style={{
        background: bg,
        padding: "48px 0 54px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px" }}>
        {/* Section Heading */}
        <h2
          style={{
            fontSize: "clamp(24px, 3.2vw, 34px)",
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
            margin: "0 0 32px",
            lineHeight: 1.2,
            letterSpacing: "0.2px",
            fontFamily: "'Georgia', 'Merriweather', 'Segoe UI', serif",
          }}
        >
          {title}
        </h2>

        {/* Exact Provided Centre of Excellence Image */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Image
            src="/coe-logos-exact.png"
            alt="Centre of Excellence"
            width={1024}
            height={292}
            sizes="(max-width: 1024px) 100vw, 960px"
            loading="lazy"
            className="w-full max-w-[960px] h-auto block object-contain mix-blend-screen"
          />
        </div>
      </div>
    </section>
  );
}
