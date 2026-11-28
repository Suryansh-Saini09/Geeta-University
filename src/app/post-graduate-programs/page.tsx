import React from "react";
import type { Metadata } from "next";
import PostGraduateHero from "@/components/post-graduate-programs/PostGraduateHero";
import PostGraduateListSection from "@/components/post-graduate-programs/PostGraduateListSection";
import FAQSection from "@/components/programs/FAQSection";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import { pgFaqsData } from "@/data/postGraduatePrograms";
import { getPublishedAdmissionsPage } from "@/server/services/pages";
import { getScholarshipPredictorData } from "@/server/services/scholarshipPredictor";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedAdmissionsPage("post-graduate-programs");
  return {
    title: seo?.title || "Post Graduate & Master's Degree Programs in Delhi NCR | Apply Now | Geeta University",
    description:
      seo?.description ||
      "PG & master's degree programs in Delhi NCR at GU, the best university in Haryana. Apply now for admissions with top placements & scholarships.",
    openGraph: {
      title: seo?.ogTitle || seo?.title || "Post Graduate & Master's Degree Programs in Delhi NCR | Apply Now | Geeta University",
      description:
        seo?.description ||
        "PG & master's degree programs in Delhi NCR at GU, the best university in Haryana. Apply now for admissions with top placements & scholarships.",
      url: seo?.canonical || "https://geetauniversity.edu.in/post-graduate-programs",
      type: "website",
      images: seo?.ogImage ? [seo.ogImage] : ["/programs/pg-banner.webp"],
    },
  };
}

export default async function PostGraduateProgramsPage() {
  const [{ sections }, predictorData] = await Promise.all([
    getPublishedAdmissionsPage("post-graduate-programs"),
    getScholarshipPredictorData(),
  ]);

  const heroData = sections.hero;
  const pgSchoolsData = sections.pg_schools;
  const statsCardsData = sections.stats_cards;
  const faqsData = sections.faqs;
  const legacyData = sections.legacy_ecosystem;

  return (
    <div className="min-w-0 overflow-x-hidden bg-white text-[#0A1F44]">
      {/* 1. Full-Width Banner & Introduction */}
      <PostGraduateHero data={heroData} />

      {/* 2. Programs by School & Fee/Scholarship Calculator */}
      <PostGraduateListSection
        schoolsData={pgSchoolsData}
        statsData={statsCardsData}
        calculatorData={predictorData}
      />

      {/* 3. Frequently Asked Questions */}
      <section id="faqs" className="w-full scroll-mt-20">
        <FAQSection
          title={faqsData?.title || "Frequently Asked Questions (FAQs)"}
          subtitle={
            faqsData?.subtitle           }
          faqs={faqsData?.items || pgFaqsData}
        />
      </section>

      {/* 4. Legacy & Ecosystem Section */}
      <LegacyEcosystem
        id="legacy-ecosystem"
        contextText={legacyData?.contextText || "PG students benefit from the integrated ecosystem of:"}
      />

    </div>
  );
}
