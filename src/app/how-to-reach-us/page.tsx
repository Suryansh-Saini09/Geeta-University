import React from "react";
import type { Metadata } from "next";

import ReachInfographicSection from "@/components/how-to-reach-us/ReachInfographicSection";
import ContactMapSection from "@/components/contact-us/ContactMapSection";
import IndustryEcosystemSection from "@/components/industry-integration/IndustryEcosystemSection";
import { getPublishedHowToReachUsPage } from "@/server/services/pages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedHowToReachUsPage();

  return {
    metadataBase: new URL("https://geetauniversity.edu.in"),
    title: seo?.title || "How to Reach Geeta University | Address & Transport Guide",
    description:
      seo?.description ||
      "Get directions to Geeta University. Find transport options, campus location details, and travel tips for a hassle-free visit.",
    keywords: Array.isArray(seo?.keywords)
      ? (seo.keywords as string[])
      : [
          "How to Reach Us?",
          "How to reach Geeta University",
          "Geeta University address",
          "Geeta University location",
          "Geeta University directions Panipat",
          "Geeta University transport options",
        ],
    alternates: {
      canonical: seo?.canonical || "https://geetauniversity.edu.in/how-to-reach-us/",
    },
    openGraph: {
      title: seo?.ogTitle || seo?.title || "How to Reach Geeta University | Address & Transport Guide",
      description:
        seo?.description ||
        "Get directions to Geeta University. Find transport options, campus location details, and travel tips for a hassle-free visit.",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : ["/how-to-reach-us.png"],
    },
  };
}

export default async function HowToReachUsPage() {
  const { hero, map, legacyEcosystem } = await getPublishedHowToReachUsPage();

  return (
    <main className="min-h-screen bg-[#F7F9FC] text-[#0A1F44]">
      {/* Official Route Diagram & Distance Timeline */}
      <ReachInfographicSection hero={hero} />

      {/* Google Maps Location Embed */}
      <ContactMapSection map={map} />

      {/* Legacy & Ecosystem Section */}
      <IndustryEcosystemSection data={legacyEcosystem} />
    </main>
  );
}
