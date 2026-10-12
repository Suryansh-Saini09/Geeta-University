"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function PhdHero({ data }: { data?: any }) {
  const bannerImage = data?.bannerImage || "https://geetauniversity.edu.in/uploads/all/1871/Ph.d.webp";
  const bannerAlt = data?.bannerAlt || "PhD Admissions at Geeta University";
  const badgeText = data?.badgeText || "Part Time for Working Professionals in Corporate & Academia";

  return (
    <section className="w-full bg-[#0A1F44]">
      {/* 1. Large Top Banner with Promo Badge */}
      <div className="relative w-full overflow-hidden bg-[#0A1F44]">
        <div className="relative h-[340px] sm:h-[440px] md:h-[540px] lg:h-[640px] xl:h-[720px] w-full">
          <Image
            src={bannerImage}
            alt={bannerAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          {/* Clean gradient overlay for top badge clarity and image visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20" />

          {/* Top Promo Badge */}
          <div className="absolute top-6 sm:top-8 md:top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 text-center z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-[#BC7A3E]/95 px-5 py-2 sm:px-8 sm:py-3 shadow-2xl backdrop-blur-md">
              <span className="text-[13px] sm:text-[16px] md:text-[18px] font-bold text-white tracking-wide">
                {badgeText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
