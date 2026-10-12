import React from "react";
import type { Metadata } from "next";
import ConfusedHero from "@/components/confused-about-courses/ConfusedHero";
import ConfusedContentSections from "@/components/confused-about-courses/ConfusedContentSections";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import { getPublishedAdmissionsPage } from "@/server/services/pages";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedAdmissionsPage("confused-about-courses");
  return {
    title: seo?.title || "Are You Confused About Courses? | Geeta University Career Guidance",
    description:
      seo?.description ||
      "Confused about courses? Geeta University guides you to the best programs in engineering, management, law, and more. Find your perfect career fit now!",
    openGraph: {
      title: seo?.ogTitle || seo?.title || "Are You Confused About Courses? | Geeta University Career Guidance",
      description:
        seo?.description ||
        "Confused about courses? Geeta University guides you to the best programs in engineering, management, law, and more. Find your perfect career fit now!",
      url: seo?.canonical || "https://geetauniversity.edu.in/confused-about-courses",
      type: "website",
      images: seo?.ogImage ? [seo.ogImage] : ["/courses/confused-banner.png"],
    },
  };
}

export default async function ConfusedAboutCoursesPage() {
  const { sections } = await getPublishedAdmissionsPage("confused-about-courses");

  const heroData = sections.hero;

  return (
    <div className="min-w-0 overflow-x-hidden bg-white text-[#0A1F44]">
      {/* 1. Full-Width Career Guidance Hero Banner */}
      <ConfusedHero data={heroData} />

      {/* 2. Structured Decision Framework & Institutional Guidance */}
      <ConfusedContentSections />

      {/* 3. Shared Legacy & Ecosystem Section */}
      <LegacyEcosystem
        id="legacy-ecosystem"
        contextText="Students at Geeta University benefit from the integrated ecosystem of:"
      />
    </div>
  );
}
