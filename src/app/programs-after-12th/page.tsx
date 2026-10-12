import React from "react";
import type { Metadata } from "next";
import ProgramsAfter12Hero from "@/components/programs-after-12th/ProgramsAfter12Hero";
import ProgramsListSection from "@/components/programs-after-12th/ProgramsListSection";
import FAQSection from "@/components/programs/FAQSection";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import { ugFaqsData } from "@/data/programsAfter12";
import { getPublishedAdmissionsPage } from "@/server/services/pages";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedAdmissionsPage("programs-after-12th");
  return {
    title: seo?.title || "UG & Diploma Programs After 12th in Delhi NCR | Apply Now | Geeta University",
    description:
      seo?.description ||
      "Undergraduate & diploma programs at GU, the best university in Haryana. Get 100% scholarships, global internships & high placement packages.",
    openGraph: {
      title: seo?.ogTitle || seo?.title || "UG & Diploma Programs After 12th in Delhi NCR | Apply Now | Geeta University",
      description:
        seo?.description ||
        "Undergraduate & diploma programs at GU, the best university in Haryana. Get 100% scholarships, global internships & high placement packages.",
      url: seo?.canonical || "https://geetauniversity.edu.in/programs-after-12th",
      type: "website",
      images: seo?.ogImage ? [seo.ogImage] : ["/programs/ug-banner.webp"],
    },
  };
}

export default async function ProgramsAfter12Page() {
  const { sections } = await getPublishedAdmissionsPage("programs-after-12th");

  const heroData = sections.hero;
  const ugSchoolsData = sections.ug_schools;
  const statsCardsData = sections.stats_cards;
  const faqsData = sections.faqs;
  const legacyData = sections.legacy_ecosystem;

  return (
    <div className="min-w-0 overflow-x-hidden bg-white text-[#0A1F44]">
      {/* 1. Full-Width Banner & Introduction */}
      <ProgramsAfter12Hero data={heroData} />

      {/* 2. Programs by School & Fee/Scholarship Calculator */}
      <ProgramsListSection schoolsData={ugSchoolsData} statsData={statsCardsData} />

      {/* 3. Frequently Asked Questions */}
      <section id="faqs" className="w-full scroll-mt-20">
        <FAQSection
          title={faqsData?.title || "Frequently Asked Questions (FAQs)"}
          subtitle={
            faqsData?.subtitle ||
            "Everything you need to know about undergraduate admissions, eligibility criteria, scholarships, and academic pathways after 12th."
          }
          faqs={faqsData?.items || ugFaqsData}
        />
      </section>

      {/* 4. Legacy & Ecosystem Section */}
      <LegacyEcosystem
        id="legacy-ecosystem"
        contextText={legacyData?.contextText || "UG students benefit from the integrated ecosystem of:"}
      />
    </div>
  );
}
