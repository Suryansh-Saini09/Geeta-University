"use client";

import React from "react";
import Image from "next/image";

export default function PostGraduateHero({ data }: { data?: any }) {
  const bannerImage = data?.bannerImage || "/programs/pg-banner.webp";
  const bannerAlt = data?.bannerAlt || "Explore Post Graduate & Master's Degree Programs at Geeta University";
  const title = data?.title || "Explore Post Graduate Programs at Geeta University";
  const highlightText = data?.highlightText || "Geeta University";
  const paragraphs = data?.paragraphs || [
    "Geeta University offers a diverse and dynamic range of Post Graduate Programs designed to build advanced domain knowledge, foster research orientation, and enhance employability. With a focus on innovation, industry integration, and global exposure, our PG courses are led by experienced faculty and powered by cutting-edge curriculum.",
    "Whether you're pursuing careers in management, law, technology, sciences, or humanities, our programs prepare you to lead in a competitive world. Geeta University also provides career services, international exposure, and scholarships to ensure holistic development and career readiness.",
  ];

  return (
    <section className="w-full bg-white">
      {/* 1. Large Top Banner Image */}
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
        </div>
      </div>

      {/* 2. Hero Header & Overview Description */}
      <div className="gu-container py-16 sm:py-20 md:py-24 lg:py-28 border-b border-[#E2E8F0]">
        <div className="max-w-5xl">
          <h1 className="font-serif text-[38px] sm:text-[48px] md:text-[56px] lg:text-[62px] font-black text-[#0A1F44] leading-[1.12] tracking-[-1.5px]">
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

          <div className="mt-8 space-y-5 text-[18px] sm:text-[20px] md:text-[21px] leading-[1.85] text-[#334155]">
            {paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
