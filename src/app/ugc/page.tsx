import React from "react";
import type { Metadata } from "next";

import UGCHero from "@/components/ugc/UGCHero";
import UGCDocumentsGrid from "@/components/ugc/UGCDocumentsGrid";
import UGCStatutoryApprovals from "@/components/ugc/UGCStatutoryApprovals";
import IndustryEcosystemSection from "@/components/industry-integration/IndustryEcosystemSection";
import UGCCalloutCTA from "@/components/ugc/UGCCalloutCTA";
import { getPublishedUgcPage } from "@/server/services/pages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedUgcPage();

  return {
    metadataBase: new URL("https://geetauniversity.edu.in"),
    title: seo?.title || "UGC-Approved University | Geeta University Accreditation & Recognition",
    description:
      seo?.description ||
      "Explore Geeta University’s UGC-approved status, statutory council recognitions, virtual inspection performas, and academic accreditation documents.",
    keywords: [
      "UGC Approved University",
      "Geeta University UGC",
      "UGC Documents",
      "UGC Inspection Performa",
      "State Private University Haryana",
      "PCI BCI Approval",
    ],
    openGraph: {
      title: seo?.ogTitle || seo?.title || "UGC-Approved University | Geeta University Accreditation & Recognition",
      description:
        seo?.description ||
        "Explore Geeta University’s UGC-approved status, accreditation details, and statutory recognition documents.",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : ["/ugc/campus-ecosystem.webp"],
    },
  };
}

export default async function UGCPage() {
  const { hero, documents, approvals, calloutCta } = await getPublishedUgcPage();

  return (
    <main className="min-h-screen bg-[#F7F9FC] text-[#0A1F44]">
      {/* Hero Section */}
      <UGCHero hero={hero} />

      {/* Official Inspection Documents & Downloads */}
      <UGCDocumentsGrid documents={documents} />

      {/* Statutory Bodies & Council Approvals */}
      <UGCStatutoryApprovals approvals={approvals} />

      {/* Legacy & Ecosystem Section */}
      <IndustryEcosystemSection />

      {/* Contact & Statutory Callout Banner */}
      <UGCCalloutCTA calloutCta={calloutCta} />
    </main>
  );
}
