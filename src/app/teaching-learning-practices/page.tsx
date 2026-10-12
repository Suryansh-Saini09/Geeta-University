import React from "react";
import type { Metadata } from "next";

import TeachingHero from "@/components/teaching-learning-practices/TeachingHero";
import TeachingOverviewSection from "@/components/teaching-learning-practices/TeachingOverviewSection";
import TeachingPedagogyGrid from "@/components/teaching-learning-practices/TeachingPedagogyGrid";
import IndustryEcosystemSection from "@/components/industry-integration/IndustryEcosystemSection";
import TeachingCTA from "@/components/teaching-learning-practices/TeachingCTA";
import { getPublishedTeachingPage } from "@/server/services/pages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedTeachingPage();

  return {
    metadataBase: new URL("https://geetauniversity.edu.in"),
    title: seo?.title || "Teaching & Learning Practices | Geeta University",
    description:
      seo?.description ||
      "Discover innovative teaching and learning practices at Geeta University including active learning, flipped classrooms, concept mapping, and peer instruction.",
    keywords: [
      "Teaching Learning Practices",
      "Teaching learning practices at Geeta University",
      "Active Learning Haryana",
      "Flipped Classroom Pedagogy",
      "Peer Instruction",
      "XEDGE Geeta University",
      "Geeta University Panipat Delhi NCR",
    ],
    openGraph: {
      title: seo?.ogTitle || seo?.title || "Teaching & Learning Practices | Geeta University",
      description:
        seo?.description ||
        "Transforming higher education with student-oriented learning, IIT/IIM faculty mentorship, and active learning frameworks.",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : ["/teaching-learning-practices/hero-f-block.webp"],
    },
  };
}

export default async function TeachingLearningPracticesPage() {
  const { hero, overview, pedagogy, cta } = await getPublishedTeachingPage();

  return (
    <main className="min-h-screen bg-[#F7F9FC] text-[#0A1F44]">
      {/* Hero Section */}
      <TeachingHero hero={hero} />

      {/* Main Teaching Practice Overview */}
      <TeachingOverviewSection overview={overview} />

      {/* Grid of Pedagogical Methods */}
      <TeachingPedagogyGrid pedagogy={pedagogy} />

      {/* Group Ecosystem */}
      <IndustryEcosystemSection />

      {/* Call to Action */}
      <TeachingCTA cta={cta} />
    </main>
  );
}
