import React from "react";
import type { Metadata } from "next";
import GutsHero from "@/components/guts/GutsHero";
import GutsScholarshipSlabs from "@/components/guts/GutsScholarshipSlabs";
import GutsSyllabusSection from "@/components/guts/GutsSyllabusSection";
import GutsAdmissionProcess from "@/components/guts/GutsAdmissionProcess";
import GutsProgramsApplicable from "@/components/guts/GutsProgramsApplicable";
import GutsVideoBanner from "@/components/guts/GutsVideoBanner";
import GutsVirtualCampus from "@/components/guts/GutsVirtualCampus";
import FAQSection from "@/components/programs/FAQSection";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import { gutsFaqsData } from "@/data/gutsData";
import { getPublishedAdmissionsPage } from "@/server/services/pages";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedAdmissionsPage("guts");
  return {
    title: seo?.title || "GUTS Scholarship Test 2026 | Get Up to 100% Scholarship | GU",
    description:
      seo?.description ||
      "Want scholarships in Haryana? Apply for GUTS 2026 at Geeta University & get up to 100% scholarship for UG & PG courses with top placement.",
    keywords: (seo?.keywords as string[]) || [
      "GUTS",
      "GUTS - Geeta University Test Series",
      "Geeta University Test of Scholarship",
      "Scholarships in Haryana",
      "100% Scholarship Test",
      "Geeta University Admissions 2026",
    ],
    openGraph: {
      title: seo?.ogTitle || seo?.title || "GUTS Scholarship Test 2026 | Get Up to 100% Scholarship | GU",
      description:
        seo?.description ||
        "Want scholarships in Haryana? Apply for GUTS 2026 at Geeta University & get up to 100% scholarship for UG & PG courses with top placement.",
      url: seo?.canonical || "https://geetauniversity.edu.in/guts",
      type: "website",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : [{ url: "https://geetauniversity.edu.in/uploads/all/1912/Guts_banner.jpg" }],
    },
    alternates: {
      canonical: seo?.canonical || "https://geetauniversity.edu.in/guts",
    },
  };
}

export default async function GutsPage() {
  const { sections } = await getPublishedAdmissionsPage("guts");
  const faqsData = sections.faqs;

  return (
    <div className="min-w-0 overflow-x-hidden bg-white text-[#0A1F44]">
      {/* 1. Hero Banner, Benefits & Lead Enquiry Form */}
      <GutsHero data={sections.hero} />

      {/* 2. Scholarship Slabs & Exam Pattern */}
      <GutsScholarshipSlabs />

      {/* 3. Download Subject-Wise Syllabus (14 Subjects) */}
      <GutsSyllabusSection />

      {/* 4. Step-by-Step Admission Process & Exam Guidelines */}
      <GutsAdmissionProcess />

      {/* 5. Programs Applicable Under GUTS */}
      <GutsProgramsApplicable />

      {/* 6. GUTS Video Walkthrough Banner */}
      <GutsVideoBanner />

      {/* 7. Frequently Asked Questions (Unified Design) */}
      <section id="faqs" className="w-full scroll-mt-20">
        <FAQSection
          title={faqsData?.title || "Frequently Asked Questions (FAQs)"}
          subtitle={
            faqsData?.subtitle ||
            "Find answers to common questions about GUTS eligibility, registration, examination mode, and scholarships."
          }
          faqs={faqsData?.items || gutsFaqsData}
        />
      </section>

      {/* 8. Virtual Campus Tour Video */}
      <GutsVirtualCampus />

      {/* 9. Legacy & Ecosystem Section */}
      <LegacyEcosystem
        id="legacy-ecosystem"
        contextText={sections.legacy_ecosystem?.contextText || "GUTS scholarship scholars benefit from the integrated ecosystem of:"}
      />
    </div>
  );
}

