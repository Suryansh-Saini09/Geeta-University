import React from "react";
import type { Metadata } from "next";

import FAQClientWrapper from "./FAQClientWrapper";
import IndustryEcosystemSection from "@/components/industry-integration/IndustryEcosystemSection";
import FAQContactBanner from "@/components/faq/FAQContactBanner";
import { getPublishedAdmissionsPage } from "@/server/services/pages";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedAdmissionsPage("faq");
  return {
    metadataBase: new URL("https://geetauniversity.edu.in"),
    title: seo?.title || "Geeta University FAQs | Admission, Courses & Programs",
    description:
      seo?.description ||
      "Find answers to common questions about admissions, courses, scholarships, campus life, hostels, fees, and placements at Geeta University, Haryana & Delhi NCR.",
    keywords: (seo?.keywords as string[]) || [
      "FAQ",
      "Geeta University FAQ",
      "Geeta University Admissions",
      "Geeta University Fees",
      "Geeta University Scholarships",
      "Geeta University Placements",
      "Geeta University Hostel Transport",
    ],
    openGraph: {
      title: seo?.ogTitle || seo?.title || "Geeta University FAQs | Admission, Courses & Programs",
      description:
        seo?.description ||
        "Find answers to common questions about admissions, courses, scholarships, campus life, and academics at Geeta University.",
      images: seo?.ogImage ? [seo.ogImage] : ["/faq/hero-faq.webp"],
    },
  };
}

export default async function FAQPage() {
  const { sections } = await getPublishedAdmissionsPage("faq");

  return (
    <main className="min-h-screen bg-[#F7F9FC] text-[#0A1F44]">
      {/* Interactive FAQ Search & Accordion Section */}
      <FAQClientWrapper heroData={sections.hero} />

      {/* Group Legacy & Ecosystem */}
      <IndustryEcosystemSection />

      {/* Contact & Support Banner */}
      <FAQContactBanner />
    </main>
  );
}
