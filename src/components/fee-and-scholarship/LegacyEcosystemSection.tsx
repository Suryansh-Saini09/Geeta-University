"use client";

import React from "react";
import Image from "next/image";
import { Building, Rocket, GraduationCap } from "lucide-react";

interface LegacyEcosystemSectionProps {
  data?: {
    contextText?: string;
  };
}

export default function LegacyEcosystemSection({ data }: LegacyEcosystemSectionProps = {}) {
  const ecosystem = [
    {
      title: "Geeta University",
      subtitle: "AI-enabled multidisciplinary campus",
      bgClass: "bg-[#E85C2D]",
      barColor: "bg-[#E85C2D]",
      icon: <GraduationCap className="h-5 w-5 text-white" />,
    },
    {
      title: "G-EDGE",
      subtitle: "Corporate Readiness, Army Strength & Life Skills",
      bgClass: "bg-[#066191]",
      barColor: "bg-[#066191]",
      icon: <Rocket className="h-5 w-5 text-white" />,
    },
    {
      title: "XEDGE",
      subtitle: "Advanced Technology, Certifications, and Industry Skills",
      bgClass: "bg-[#013D55]",
      barColor: "bg-[#013D55]",
      icon: <Building className="h-5 w-5 text-white" />,
    },
  ];

  return (
    <section className="w-full bg-white py-12 md:py-16 border-b border-[#E2E8F0]">
      <div className="gu-container">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-serif text-[30px] sm:text-[38px] md:text-[44px] font-black text-[#0A1F44]">
            Legacy &amp; Ecosystem
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-[17px] sm:text-[18px] leading-[1.8] text-[#475569]">
              {data?.contextText || (
                <>
                  Founded in 1985, the{" "}
                  <strong className="text-[#0A1F44]">Geeta Group of Institutions</strong> has
                  emerged as a prominent educational powerhouse spanning from modern K-12 schooling to
                  advanced doctoral research programs. Our students directly benefit from this integrated
                  360° ecosystem:
                </>
              )}
            </p>

            {/* Ecosystem Cards List */}
            <div className="space-y-4 pt-2">
              {ecosystem.map((item, idx) => (
                <div key={idx} className="flex items-stretch gap-3 group">
                  <div
                    className={`flex-1 rounded-[14px] ${item.bgClass} p-5 text-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      {item.icon}
                      <h3 className="font-serif text-[19px] sm:text-[20px] font-bold text-white">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-[14px] text-white/90 font-medium pl-8">
                      {item.subtitle}
                    </p>
                  </div>
                  <div className={`w-2 rounded-full ${item.barColor} opacity-70 group-hover:opacity-100 transition-opacity`} />
                </div>
              ))}
            </div>

            <p className="text-[16px] sm:text-[17px] font-semibold text-[#0A1F44] pt-4 leading-relaxed">
              Together, they form a holistic, future-ready talent development ecosystem.
            </p>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-5">
            <div className="relative aspect-square w-full rounded-[24px] overflow-hidden border border-[#E2E8F0] shadow-lg">
              <Image
                src="/edge/nep/campus.webp"
                alt="Geeta University Campus Ecosystem"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
