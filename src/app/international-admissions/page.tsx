import React from "react";
import type { Metadata } from "next";

import InternationalHero from "@/components/international-admissions/InternationalHero";
import InternationalLogoMarquee from "@/components/international-admissions/InternationalLogoMarquee";
import UniverseOfGUSection from "@/components/international-admissions/UniverseOfGUSection";
import LeadershipSpotlightSection from "@/components/international-admissions/LeadershipSpotlightSection";
import InternationalTestimonials from "@/components/international-admissions/InternationalTestimonials";
import InternationalVideoSection from "@/components/international-admissions/InternationalVideoSection";
import InternationalProgramsAccordion from "@/components/international-admissions/InternationalProgramsAccordion";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import { getPublishedAdmissionsPage } from "@/server/services/pages";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedAdmissionsPage("international-admissions");
  return {
    metadataBase: new URL("https://geetauniversity.edu.in"),
    title: seo?.title || "International Admissions 2026 | Geeta University",
    description:
      seo?.description ||
      "Geeta University offers international students a quality education, recognised degrees, student support, and multicultural campus life in India",
    keywords: (seo?.keywords as string[]) || [
      "International Admissions",
      "Geeta University International",
      "Study in India",
      "Global University MoUs",
      "Geeta University Delhi NCR Panipat",
    ],
    openGraph: {
      title: seo?.ogTitle || seo?.title || "International Admissions 2026 | Geeta University",
      description:
        seo?.description ||
        "Join a lively global community representing 31+ countries & 22 Indian states at Geeta University.",
      images: seo?.ogImage ? [seo.ogImage] : ["/international-admissions/hero.jpg"],
    },
  };
}

export default async function InternationalAdmissionsPage() {
  const { sections } = await getPublishedAdmissionsPage("international-admissions");

  return (
    <main className="min-h-screen bg-[#F7F9FC] text-[#0A1F44]">
      {/* Hero Banner */}
      <InternationalHero data={sections.hero} />

      {/* Partner Flags / Logos Ticker Marquee */}
      <InternationalLogoMarquee />

      {/* Universe of GU Narrative & Enquiry Form */}
      <UniverseOfGUSection />

      {/* Leadership Spotlight */}
      <LeadershipSpotlightSection />

      {/* International Student Testimonials */}
      <InternationalTestimonials />

      {/* Campus Life & Virtual Campus Tour Videos */}
      <InternationalVideoSection />

      {/* Programs Offered Accordion Catalog */}
      <InternationalProgramsAccordion />

      {/* Legacy & Ecosystem */}
      <LegacyEcosystem contextText={sections.legacy_ecosystem?.contextText || "International students benefit from the integrated ecosystem of:"} />
    </main>
  );
}
