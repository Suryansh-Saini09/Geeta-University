"use client";

import React from "react";
import Image from "next/image";

export default function ConfusedHero({ data }: { data?: any }) {
  const bannerImage = data?.bannerImage || "/courses/confused-banner.png";
  const bannerAlt = data?.bannerAlt || "Are You Confused About Courses? - Geeta University Career Guidance";
  const title = data?.title || "Are You Confused About Courses?";
  const highlightText = data?.highlightText || "Courses?";
  const paragraphs = data?.paragraphs || [
    "Every successful person in the world will tell you one thing in common: Find something you love and follow it with your whole heart. Success is the product of hard work, passion, taking risks, and not being afraid of failure.",
    "At Geeta University, our expert career counsellors and psychometric assessment tools guide students to identify their best-fit degree program and build high-demand skills for a fulfilling future.",
  ];

  return (
    <section className="w-full bg-white">
      {/* 1. Full-Width Top Banner Image (Responsive without fixed height / dark letterbox) */}
      <div className="relative w-full overflow-hidden bg-white">
        <Image
          src={bannerImage}
          alt={bannerAlt}
          width={1920}
          height={680}
          priority
          sizes="100vw"
          className="w-full h-auto object-cover object-center block"
        />
      </div>

      {/* 2. Hero Header & Overview Description */}
      <div className="gu-container py-14 sm:py-18 md:py-22 border-b border-[#E2E8F0]">
        <div className="max-w-5xl">
          <h1 className="font-serif text-[36px] sm:text-[46px] md:text-[54px] lg:text-[60px] font-black text-[#0A1F44] leading-[1.12] tracking-[-1.5px]">
            {title.includes(highlightText) ? (
              <>
                {title.split(highlightText)[0]}
                <span className="text-[#E8871A]">{highlightText}</span>
                {title.split(highlightText)[1]}
              </>
            ) : (
              title
            )}
          </h1>

          <div className="mt-6 space-y-4 text-[18px] sm:text-[19px] md:text-[20px] leading-[1.85] text-[#334155]">
            {paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
