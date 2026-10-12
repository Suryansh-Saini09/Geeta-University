import React from "react";
import type { Metadata } from "next";
import CareersHero from "@/components/careers/CareersHero";
import CareersWhyUs from "@/components/careers/CareersWhyUs";
import CareersForm from "@/components/careers/CareersForm";
import CareersFAQ from "@/components/careers/CareersFAQ";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import { getPublishedCareersPage } from "@/server/services/pages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedCareersPage();

  return {
    metadataBase: new URL("https://geetauniversity.edu.in"),
    title: seo?.title || "Careers at Geeta University | Join Top Private University in Haryana",
    description:
      seo?.description ||
      "Explore career opportunities at Geeta University. Join our team of educators, researchers, and professionals in a top private university in Haryana, Delhi NCR. Apply online now!",
    keywords: [
      "Careers",
      "Faculty jobs",
      "Geeta University Careers",
      "Jobs in Panipat",
      "Teaching Jobs Haryana",
    ],
    openGraph: {
      title: seo?.ogTitle || seo?.title || "Careers at Geeta University",
      description:
        seo?.description ||
        "Explore career opportunities at Geeta University. Join our team of educators and professionals.",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : ["/careers/hero-bg.webp"],
    },
  };
}

export default async function CareersPage() {
  const { hero, benefits, faqs, formConfig } = await getPublishedCareersPage();

  return (
    <div className="min-w-0 overflow-x-hidden bg-[#F8FAFC] text-[#0A1F44]">
      {/* Hero Banner Section */}
      <CareersHero hero={hero} />

      {/* Why Work With Us / Benefits Section */}
      <CareersWhyUs benefits={benefits} />

      {/* Main Career Registration Form Section */}
      <CareersForm formConfig={formConfig} />

      {/* Frequently Asked Questions */}
      <CareersFAQ faqs={faqs} />

      {/* Legacy & Ecosystem Section */}
      <LegacyEcosystem
        id="legacy-ecosystem"
        contextText="Faculty and staff benefit from the integrated ecosystem of:"
      />
    </div>
  );
}
