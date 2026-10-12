import React from "react";
import type { Metadata } from "next";

import LibraryHero from "@/components/library/LibraryHero";
import LibraryStatCards from "@/components/library/LibraryStatCards";
import LibraryOverview from "@/components/library/LibraryOverview";
import LibraryDigitalResources from "@/components/library/LibraryDigitalResources";
import LibraryInfoAndPolicy from "@/components/library/LibraryInfoAndPolicy";
import LibraryContactLibrarian from "@/components/library/LibraryContactLibrarian";
import { getPublishedLibraryPage } from "@/server/services/pages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedLibraryPage();

  return {
    metadataBase: new URL("https://geetauniversity.edu.in"),
    title: seo?.title || "Central Library & Knowledge Resource Center - Geeta University",
    description:
      seo?.description ||
      "Explore Geeta University Central Library. Access over 25,000 physical books, 1,00,000+ e-books, and 1,000+ subscribed IEEE, ASME, and ELSEVIER e-journals.",
    keywords: [
      "Central Library Geeta University",
      "GU Library Panipat",
      "Knowledge Resource Center",
      "E-Library IEEE ASME",
      "NDLI Geeta University",
      "Library Timings Naultha",
    ],
    openGraph: {
      title: seo?.ogTitle || seo?.title || "Central Library & Knowledge Resource Center - Geeta University",
      description:
        seo?.description ||
        "25,000+ physical books, 1,00,000+ e-books, and 1,000+ global e-journals open 360 days a year.",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : ["/library/hero-bg.webp"],
    },
  };
}

export default async function LibraryPage() {
  const { hero, metrics, overview, portals, hoursPolicy, loanRules, contact } =
    await getPublishedLibraryPage();

  return (
    <main className="min-h-screen bg-[#F7F9FC] text-[#0A1F44]">
      {/* Hero Banner */}
      <LibraryHero hero={hero} />

      {/* Resource Metrics Cards (Physical Books, E-Books, E-Journals) */}
      <LibraryStatCards metrics={metrics} />

      {/* Main Overview & History Section */}
      <LibraryOverview overview={overview} />

      {/* Digital Resources & E-Library Portals */}
      <LibraryDigitalResources portals={portals} />

      {/* Timings, Guidelines, and Circulation Rules Table */}
      <LibraryInfoAndPolicy hoursPolicy={hoursPolicy} loanRules={loanRules} />

      {/* Librarian Contact Details */}
      <LibraryContactLibrarian contact={contact} />
    </main>
  );
}
