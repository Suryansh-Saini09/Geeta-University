import React from "react";
import type { Metadata } from "next";

import ContactHero from "@/components/contact-us/ContactHero";
import ContactMainCards from "@/components/contact-us/ContactMainCards";
import ContactOfficesGrid from "@/components/contact-us/ContactOfficesGrid";
import ContactMapSection from "@/components/contact-us/ContactMapSection";
import IndustryEcosystemSection from "@/components/industry-integration/IndustryEcosystemSection";
import { getContactSettings } from "@/server/services/siteSettings";
import { getPublishedContactPage } from "@/server/services/pages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedContactPage();

  return {
    metadataBase: new URL("https://geetauniversity.edu.in"),
    title: seo?.title || "Contact Us - Best Private University in Haryana Delhi NCR - Geeta University",
    description:
      seo?.description ||
      "Contact Geeta University main campus in Panipat or visit any of our regional admission offices across Sonipat, Shamli, Karnal, Delhi NCR, Guwahati, and Kurukshetra.",
    keywords: [
      "Contact Us",
      "Geeta University contact",
      "Geeta University admission offices",
      "Geeta University Panipat address",
      "Geeta University phone number",
      "Geeta University Delhi office",
    ],
    openGraph: {
      title: seo?.ogTitle || seo?.title || "Contact Us - Best Private University in Haryana Delhi NCR - Geeta University",
      description:
        seo?.description ||
        "Contact Geeta University main campus in Panipat or visit our regional admission offices.",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : ["/contact-us/hero-bg.webp"],
    },
  };
}

export default async function ContactUsPage() {
  const [{ hero, mainInfo, offices, map }, fallbackContact] = await Promise.all([
    getPublishedContactPage(),
    getContactSettings(),
  ]);

  const activeContact = {
    ...fallbackContact,
    ...(mainInfo || {}),
  };

  return (
    <main className="min-h-screen bg-[#F7F9FC] text-[#0A1F44]">
      {/* Hero Section */}
      <ContactHero hero={hero} />

      {/* Main Info Cards (Location, Phone, Email) */}
      <ContactMainCards contact={activeContact} />

      {/* Regional Admission Offices Grid */}
      <ContactOfficesGrid offices={offices} />

      {/* Google Maps Location */}
      <ContactMapSection map={map} />

      {/* Legacy & Ecosystem Section */}
      <IndustryEcosystemSection />
    </main>
  );
}
