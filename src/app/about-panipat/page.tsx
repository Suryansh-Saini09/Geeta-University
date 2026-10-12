import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ChevronRight,
  MapPin,
  Users,
  GraduationCap,
} from "lucide-react";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import { getPublishedAboutPanipatPage } from "@/server/services/pages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedAboutPanipatPage();

  return {
    metadataBase: new URL("https://geetauniversity.edu.in"),
    title: seo?.title || "About Panipat",
    description:
      seo?.description ||
      "Explore the rich history, three major battles, famous landmarks, geography, and textile heritage of Panipat, Haryana — the proud home of Geeta University.",
    keywords: Array.isArray(seo?.keywords)
      ? (seo.keywords as string[])
      : [
          "About Panipat",
          "Panipat history",
          "Battles of Panipat",
          "Landmarks of Panipat",
          "Geeta University location",
          "City of Weavers",
        ],
    alternates: {
      canonical: seo?.canonical || "https://geetauniversity.edu.in/about-panipat/",
    },
    openGraph: {
      title: seo?.ogTitle || seo?.title || "About Panipat",
      description:
        seo?.description ||
        "Explore the rich history, three major battles, famous landmarks, geography, and textile heritage of Panipat, Haryana — the proud home of Geeta University.",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : ["https://geetauniversity.edu.in/uploads/all/253/conversions/f-block-(1)-full.webp"],
    },
  };
}

export default async function AboutPanipatPage() {
  const { hero, battles, landmarks, geographyDemographics, legacyEcosystem } =
    await getPublishedAboutPanipatPage();

  // Fallbacks for data safety
  const heroTitle = hero?.title || "About Panipat";
  const heroSubtitle =
    hero?.subtitle ||
    "Panipat is a prestigious, historic city in Haryana, situated on NH-44, 95 km north of Delhi and 169 km south of Chandigarh. Globally renowned as the “City of Weavers” and India's textile recycling capital, Panipat seamlessly blends a storied 500-year history with rapid industrial growth and modern educational excellence.";
  const heroImage =
    hero?.heroImage ||
    "https://geetauniversity.edu.in/uploads/all/253/conversions/f-block-(1)-full.webp";
  const heroImageAlt = hero?.heroImageAlt || "Geeta University campus in Panipat";

  const battleList = Array.isArray(battles?.battles) ? battles.battles : [];
  const landmarkList = Array.isArray(landmarks?.landmarks) ? landmarks.landmarks : [];

  const geoTitle = geographyDemographics?.geographyTitle || "Geographical Location";
  const geoText1 =
    geographyDemographics?.geographyText1 ||
    "Panipat is positioned at coordinates 29.3875° N, 76.9700° E on the Indo-Gangetic plain. It has an average elevation of 219 metres (718 feet) above sea level.";
  const geoText2 =
    geographyDemographics?.geographyText2 ||
    "Centrally positioned on the National Highway 44 (NH-44 / Grand Trunk Road), it enjoys seamless direct expressway connectivity to New Delhi, IGI International Airport, Karnal, Kurukshetra, Ambala, and Chandigarh.";

  const demoTitle = geographyDemographics?.demographicsTitle || "Demographics & Population";
  const demoText1 =
    geographyDemographics?.demographicsText1 ||
    "According to the official census, the total population of Panipat District stands at 1,202,811 (646,324 males and 556,487 females), constituting approximately 4.74% of the entire state of Haryana.";
  const demoText2 =
    geographyDemographics?.demographicsText2 ||
    "As one of the most commercially active industrial cities in Northern India, Panipat attracts a diverse and vibrant workforce, entrepreneurs, exporters, and academic scholars from across the country.";

  const ctaHeading =
    geographyDemographics?.ctaHeading || "Study in the Heart of Panipat at Geeta University";
  const ctaSubtitle =
    geographyDemographics?.ctaSubtitle ||
    "Experience world-class academic programs, high-tech labs, and vibrant campus life.";
  const ctaLinkText = geographyDemographics?.ctaLinkText || "Explore Programs";
  const ctaLinkHref = geographyDemographics?.ctaLinkHref || "/programs-after-12th";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Page Hero Header ── */}
      <section className="relative overflow-hidden bg-[#0A1F44] pt-32 pb-20 text-white">
        {/* Campus Background with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt={heroImageAlt}
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0" />
        </div>
        <div className="gu-container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            {/* Breadcrumb */}
            <nav className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Link href="/" className="hover:text-[#E8871A] transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[#E8871A]">About Panipat</span>
            </nav>

            {/* Title */}
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[54px] leading-tight">
              {heroTitle.includes("Panipat") ? (
                <>
                  About <span className="text-[#E8871A]">Panipat</span>
                </>
              ) : (
                heroTitle
              )}
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base text-slate-200 md:text-lg leading-relaxed max-w-3xl mx-auto">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* ── The 3 Historic Battles Section ── */}
      {battleList.length > 0 && (
        <section className="py-10 md:py-14">
          <div className="gu-container">
            {/* Battles List Cards */}
            <div className="space-y-10 max-w-5xl mx-auto">
              {battleList.map((battle: any, index: number) => {
                const isEven = index % 2 === 1;
                return (
                  <div
                    key={battle.title || index}
                    className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg shadow-slate-100 transition-all hover:shadow-xl hover:border-slate-300"
                  >
                    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isEven ? "lg:flex-row-reverse" : ""}`}>
                      {/* Content Column */}
                      <div className={`lg:col-span-7 space-y-4 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1F44]">
                          {battle.title}
                        </h3>

                        {battle.opponents && (
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Opponents: <span className="text-slate-800">{battle.opponents}</span>
                          </p>
                        )}

                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                          {battle.description}
                        </p>

                        {battle.keyOutcome && (
                          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 text-xs sm:text-sm font-medium text-slate-700">
                            <strong className="text-[#0A1F44]">Historic Impact:</strong> {battle.keyOutcome}
                          </div>
                        )}
                      </div>

                      {/* Image Column */}
                      {battle.image && (
                        <div className={`lg:col-span-5 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-md">
                            <Image
                              src={battle.image}
                              alt={battle.title || "Historic Battle of Panipat"}
                              fill
                              className="object-cover transition-transform duration-500 hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 400px"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Landmarks of Panipat Section ── */}
      {landmarkList.length > 0 && (
        <section className="bg-slate-100/70 py-10 md:py-14 border-y border-slate-200">
          <div className="gu-container">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A1F44]">
                Famous <span className="text-[#E8871A]">Landmarks</span> of Panipat
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {landmarkList.map((site: any, idx: number) => (
                <div
                  key={site.title || idx}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-slate-300"
                >
                  {/* Image */}
                  {site.image && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      <Image
                        src={site.image}
                        alt={site.title || "Landmark of Panipat"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif text-xl font-bold text-[#0A1F44] mt-1 mb-3">
                      {site.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">
                      {site.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Geography & Demographics Section ── */}
      <section className="py-10 md:py-14">
        <div className="gu-container">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xl shadow-slate-100">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Geography */}
                <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-6">
                  <div className="flex items-center gap-2 text-[#0A1F44] font-serif text-lg font-bold">
                    <MapPin className="h-5 w-5 text-[#E8871A]" />
                    <h3>{geoTitle}</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{geoText1}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{geoText2}</p>
                </div>

                {/* Demographics */}
                <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-6">
                  <div className="flex items-center gap-2 text-[#0A1F44] font-serif text-lg font-bold">
                    <Users className="h-5 w-5 text-[#E8871A]" />
                    <h3>{demoTitle}</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{demoText1}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{demoText2}</p>
                </div>
              </div>

              {/* Panipat & Geeta University Banner */}
              <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#0A1F44] to-[#1A3A6B] p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                  <h4 className="font-serif text-xl font-bold text-white">
                    {ctaHeading}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {ctaSubtitle}
                  </p>
                </div>
                <Link
                  href={ctaLinkHref}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#E8871A] px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-[#F5A623] active:scale-95"
                >
                  <GraduationCap className="h-4 w-4" />
                  {ctaLinkText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Legacy & Ecosystem Section ── */}
      <LegacyEcosystem
        id="legacy-ecosystem"
        contextText="Geeta University in Panipat is part of an integrated, future-ready talent development ecosystem:"
        data={legacyEcosystem}
      />
    </div>
  );
}
