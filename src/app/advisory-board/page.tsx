import React from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import { getPublishedAdvisoryBoardPage } from "@/server/services/pages";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedAdvisoryBoardPage();

  return {
    metadataBase: new URL("https://geetauniversity.edu.in"),
    title: seo?.title || "Advisory Board | Global Academic & Industry Mentors | Geeta University",
    description:
      seo?.description ||
      "Meet Geeta University's eminent Advisory Board comprising global deans, industry chief officers, and international research professors guiding our vision and curricula.",
    openGraph: {
      title: seo?.ogTitle || seo?.title || "Advisory Board | Geeta University",
      description:
        seo?.description ||
        "Meet Geeta University's eminent Advisory Board comprising global deans, industry chief officers, and international research professors guiding our vision and curricula.",
      images: seo?.ogImage
        ? [{ url: seo.ogImage }]
        : ["https://geetauniversity.edu.in/uploads/all/252/conversions/new-building-3-(1)-full.webp"],
    },
  };
}

export default async function AdvisoryBoardPage() {
  const { hero, members } = await getPublishedAdvisoryBoardPage();
  const heroTitle = hero?.title || "Advisory";
  const heroHighlight = hero?.highlight || "Board";
  const heroBg = hero?.bgImage || "https://geetauniversity.edu.in/uploads/all/252/conversions/new-building-3-(1)-full.webp";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Page Hero Header ── */}
      <section className="relative overflow-hidden bg-[#0A1F44] pt-32 pb-20 text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBg}
            alt="Geeta University Advisory Board"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0" />
        </div>

        <div className="gu-container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            {/* Title */}
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[54px] leading-tight">
              {heroTitle} <span className="text-[#E8871A]">{heroHighlight}</span>
            </h1>
          </div>
        </div>
      </section>

      {/* ── Advisory Board Members Grid ── */}
      <section className="py-16 md:py-24">
        <div className="gu-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {members.map((member: any) => (
              <div
                key={member.id || member.name}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-300"
              >
                {/* Member Portrait */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-bold">
                      {member.name}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>

                {/* Member Details */}
                <div className="flex flex-1 flex-col p-6 text-left">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0A1F44] group-hover:text-[#E8871A] transition-colors leading-snug">
                    {member.name}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                    {member.role}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600 flex-1">
                    <Building2 className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                    <span className="leading-relaxed">{member.institution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Legacy & Ecosystem Section ── */}
      <LegacyEcosystem
        id="legacy-ecosystem"
        contextText="Our Advisory Board actively guides the expansive vision and multi-tier talent development framework of:"
      />
    </div>
  );
}
