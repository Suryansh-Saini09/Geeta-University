import React from "react";
import type { Metadata } from "next";
import FeeHero from "@/components/fee-and-scholarship/FeeHero";
import ScholarshipPredictorSection from "@/components/fee-and-scholarship/ScholarshipPredictorSection";
import TransportAndHostelPredictor from "@/components/fee-and-scholarship/TransportAndHostelPredictor";
import LegacyEcosystemSection from "@/components/fee-and-scholarship/LegacyEcosystemSection";
import FeeFaqAndCTA from "@/components/fee-and-scholarship/FeeFaqAndCTA";
import { getPublishedAdmissionsPage } from "@/server/services/pages";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedAdmissionsPage("fee-and-scholarship");
  return {
    title: seo?.title || "Fees & Scholarships | Affordable Quality Education at Geeta University",
    description:
      seo?.description ||
      "Explore Geeta University fee structure and scholarship options offering financial support, merit-based benefits, hostel charges, and affordable quality education.",
    keywords: (seo?.keywords as string[]) || [
      "Fee Scholarship",
      "Geeta University Fees",
      "Scholarship Predictor",
      "Hostel Fee",
      "Transport Fee",
      "Geeta University Admissions Open",
    ],
    alternates: {
      canonical: seo?.canonical || "https://geetauniversity.edu.in/fee-and-scholarship",
    },
  };
}

export default async function FeeAndScholarshipPage() {
  const { sections } = await getPublishedAdmissionsPage("fee-and-scholarship");

  return (
    <div className="min-w-0 overflow-x-hidden bg-white text-[#0A1F44]">
      <FeeHero data={sections.hero} />
      <ScholarshipPredictorSection />
      <TransportAndHostelPredictor />
      <LegacyEcosystemSection />
      <FeeFaqAndCTA />
    </div>
  );
}
