import React from "react";
import type { Metadata } from "next";
import CuetHeroAndCalculator from "@/components/cuet/CuetHeroAndCalculator";
import CuetAdmissionProcess from "@/components/cuet/CuetAdmissionProcess";
import CuetProgramsOffered from "@/components/cuet/CuetProgramsOffered";
import CuetWhyAndStats from "@/components/cuet/CuetWhyAndStats";
import CuetTestimonials from "@/components/cuet/CuetTestimonials";
import CuetStarPerformers from "@/components/cuet/CuetStarPerformers";
import FAQSection from "@/components/programs/FAQSection";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import { cuetFaqsData } from "@/data/cuetData";
import { getPublishedAdmissionsPage } from "@/server/services/pages";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedAdmissionsPage("cuet");
  return {
    title: seo?.title || "CUET UG 2026: Admission Process, Dates & Apply Now | GU",
    description:
      seo?.description ||
      "Get admission through CUET UG 2026 at Geeta University. Explore UG courses, eligibility, exam schedule & apply now.",
    keywords: (seo?.keywords as string[]) || ["CUET", "CUET UG 2026", "CUET Admissions", "CUET Scholarship", "Geeta University CUET"],
    openGraph: {
      title: seo?.ogTitle || seo?.title || "CUET UG 2026: Admission Process, Dates & Apply Now | GU",
      description:
        seo?.description ||
        "Get admission through CUET UG 2026 at Geeta University. Explore UG courses, eligibility, exam schedule & apply now.",
      url: seo?.canonical || "https://geetauniversity.edu.in/cuet",
      type: "website",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : [{ url: "https://geetauniversity.edu.in/uploads/all/2540/cuet.jpeg" }],
    },
    alternates: {
      canonical: seo?.canonical || "https://geetauniversity.edu.in/cuet",
    },
  };
}

export default async function CuetPage() {
  const { sections } = await getPublishedAdmissionsPage("cuet");
  const faqsData = sections.faqs;

  return (
    <div className="min-w-0 overflow-x-hidden bg-white text-[#0A1F44]">
      {/* 1. Hero Banner, CUET Scholarship Calculator & Lead Form */}
      <CuetHeroAndCalculator data={sections.hero} />

      {/* 2. 6-Step Fast-Track Admission Flow */}
      <CuetAdmissionProcess />

      {/* 3. Programs Offered Under CUET */}
      <CuetProgramsOffered />

      {/* 4. Why CUET at Geeta & Placement Stats */}
      <CuetWhyAndStats />

      {/* 5. From Campus to Corporate Testimonials */}
      <CuetTestimonials />

      {/* 6. Star Performances at GU */}
      <CuetStarPerformers />

      {/* 7. Frequently Asked Questions (Unified Design) */}
      <section id="faqs" className="w-full scroll-mt-20">
        <FAQSection
          title={faqsData?.title || "Frequently Asked Questions (FAQs)"}
          subtitle={
            faqsData?.subtitle ||
            "Get instant clarity regarding CUET UG cutoffs, scholarship calculation, and online seat allocation."
          }
          faqs={faqsData?.items || cuetFaqsData}
        />
      </section>

      {/* 8. Legacy & Ecosystem Section */}
      <LegacyEcosystem
        id="legacy-ecosystem"
        contextText={sections.legacy_ecosystem?.contextText || "CUET admitted students benefit from the vast academic infrastructure and ecosystem of:"}
      />
    </div>
  );
}
