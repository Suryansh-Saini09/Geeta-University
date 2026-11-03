import React from "react";
import Image from "next/image";

interface LegacyEcosystemProps {
  id?: string;
  contextText?: string;
  data?: {
    heading?: string;
    contextText?: string;
    description?: string;
    items?: Array<{ name: string; detail: string; color: string }>;
    footerText?: string;
    image?: string;
  } | null;
}

export default function LegacyEcosystem({
  id = "legacy-ecosystem",
  contextText = "Students benefit from the integrated ecosystem of:",
  data,
}: LegacyEcosystemProps) {
  const headingText = data?.heading || "Legacy & Ecosystem";
  const context = data?.contextText || contextText;
  const desc = data?.description || "Founded in 1985, the Geeta Group of Institutions has emerged as a major educational hub with institutions spanning school education to doctoral programs.";
  const itemList = data?.items && data.items.length > 0 ? data.items : [
    { name: "Geeta University", detail: "AI-enabled multidisciplinary campus", color: "#E85C2D" },
    { name: "Geeta Finishing School (GFS)", detail: "Communication & Corporate Readiness", color: "#07589f" },
    { name: "Geeta Technical Hub (GTH)", detail: "Advanced Technology, Certifications, and Industry Skills", color: "#013d55" },
  ];
  const footerText = data?.footerText || "Together, they form a holistic, future-ready talent development ecosystem.";
  const imageSrc = data?.image || "/campus-life/ecosystem-campus.webp";

  return (
    <section id={id} className="scroll-mt-[190px] bg-white py-12 md:py-16 border-t border-[#E2E8F0]">
      <div className="gu-container">
        {/* Section Header with exact site typography */}
        <div className="mx-auto mb-14 max-w-4xl text-center md:mb-16">
          <h2 className="font-serif text-[42px] font-black leading-[1.05] tracking-[-1.5px] text-[#0A1F44] sm:text-[50px] md:text-[58px]">
            {headingText}
          </h2>
        </div>

        {/* 50/50 Balanced Grid */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Content Column */}
          <div className="lg:col-span-6 xl:col-span-6">
            <p className="text-[16px] leading-[1.8] text-[#64748B] md:text-[17px]">
              {desc} {context}
            </p>

            {/* List of 3 Ecosystem Cards */}
            <div className="mt-8 flex flex-col gap-4">
              {itemList.map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="group flex items-stretch gap-2.5">
                  <div
                    className="flex-1 rounded-[14px] p-5 shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5 sm:p-6"
                    style={{ backgroundColor: item.color }}
                  >
                    <h3 className="font-serif text-[22px] font-black text-white">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[14.5px] font-medium leading-[1.6] text-white/90">
                      {item.detail}
                    </p>
                  </div>
                  <div className="w-1.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                </div>
              ))}
            </div>

            <p className="mt-6 text-[15.5px] font-medium leading-[1.7] text-[#64748B]">
              {footerText}
            </p>
          </div>

          {/* Right Campus Image (Increased size, static without animation) */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] border border-[#E2E8F0] shadow-[0_15px_40px_rgba(0,0,0,0.10)] sm:min-h-[420px]">
              <Image
                src={imageSrc}
                alt="Geeta Group Campus"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}