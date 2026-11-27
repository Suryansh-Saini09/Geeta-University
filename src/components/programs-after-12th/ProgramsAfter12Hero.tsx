import React from "react";
import Image from "next/image";
import AdmissionFormWrapper from "@/components/programs/AdmissionFormWrapper";

export default function ProgramsAfter12Hero({ data }: { data?: any }) {
  const bannerImage = data?.bannerImage || "/programs/ug-banner.webp";
  const bannerAlt = data?.bannerAlt || "Explore Undergraduate & Diploma Programs at Geeta University";
  const title = data?.title || "Explore Undergraduate & Diploma Programs at Geeta University";
  const highlightText = data?.highlightText || "Geeta University";
  const paragraphs = data?.paragraphs || [
    "Geeta University offers a wide array of industry-focused undergraduate programs tailored for students after 12th. With strong academic frameworks, experiential learning, and cutting-edge specializations like AI, Cybersecurity, and Forensic Science, GU empowers students to achieve career excellence.",
    "International internships, top-notch faculty, and global exposure ensure students graduate with a competitive edge. Enroll in our 21st-century UG & Diploma courses that promise innovation, entrepreneurship, and employment-readiness from day one.",
  ];

  return (
    <section className="w-full bg-white">
      {/* 1. Large, Impactful Top Banner Image */}
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

      {/* 2. Spacious Hero Header & Overview Description + Right Column Enquiry Card */}
      <div className="gu-container py-12 sm:py-16 md:py-20 lg:py-24 border-b border-[#E2E8F0]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-start">
          {/* Left Column: Heading and Introductory Description (~65%) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            <h1 className="font-serif text-[34px] sm:text-[44px] md:text-[52px] lg:text-[58px] font-black text-[#0A1F44] leading-[1.12] tracking-[-1.5px]">
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

            <div className="space-y-5 text-[17px] sm:text-[19px] leading-[1.8] text-[#334155]">
              {paragraphs.map((p: string, idx: number) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>

          {/* Right Column: Sticky Meritto Enquiry Card (~35%) */}
          <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-28 flex justify-center lg:justify-end">
            <AdmissionFormWrapper initialDiscipline="Undergraduate & Diploma Programs" />
          </div>
        </div>
      </div>
    </section>
  );
}
