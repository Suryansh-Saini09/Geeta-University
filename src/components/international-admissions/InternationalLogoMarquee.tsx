"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PARTNER_LOGOS } from "@/data/internationalAdmissions";

export interface InternationalLogoMarqueeProps {
  data?: {
    title?: string;
    logos?: string[];
  };
}

export default function InternationalLogoMarquee({ data }: InternationalLogoMarqueeProps = {}) {
  const logos = data?.logos && data.logos.length > 0 ? data.logos : PARTNER_LOGOS;
  if (data && logos.length === 0) return null;
  // Triplicate the partner logos array to guarantee seamless continuous marquee
  const marqueeLogos = [...logos, ...logos, ...logos];

  return (
    <div className="w-full bg-white py-6 border-b border-[#E2E8F0] overflow-hidden shadow-sm">

      {/* Infinite Horizontal Marquee Container */}
      <div className="relative flex w-full overflow-hidden select-none">
        <motion.div
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="flex shrink-0 items-center gap-10 py-2 pr-10"
        >
          {marqueeLogos.map((logo, index) => (
            <div
              key={index}
              className="relative h-16 w-36 flex-shrink-0 transition-transform duration-300 hover:scale-110 drop-shadow-sm"
            >
              <Image
                src={logo}
                alt={`Partner flag ${(index % PARTNER_LOGOS.length) + 1}`}
                fill
                sizes="144px"
                className="object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
