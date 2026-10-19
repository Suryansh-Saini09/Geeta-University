import React from "react";
import type { Metadata } from "next";
import IcnfprHero from "@/components/icnfpr/IcnfprHero";
import IcnfprAbout from "@/components/icnfpr/IcnfprAbout";
import IcnfprSpeakers from "@/components/icnfpr/IcnfprSpeakers";
import IcnfprSchedule from "@/components/icnfpr/IcnfprSchedule";
import IcnfprCfp from "@/components/icnfpr/IcnfprCfp";
import IcnfprPricing from "@/components/icnfpr/IcnfprPricing";
import IcnfprCommittee from "@/components/icnfpr/IcnfprCommittee";
import IcnfprAdvisoryBoard from "@/components/icnfpr/IcnfprAdvisoryBoard";
import IcnfprContact from "@/components/icnfpr/IcnfprContact";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";

export const metadata: Metadata = {
  title: "3rd International Conference on New Frontiers of Pharmaceutical Research (ICNFPR-2026) | Geeta University",
  description:
    "Join the 3rd International Conference on New Frontiers of Pharmaceutical Research (ICNFPR-2026) at Geeta Institute of Pharmacy, Geeta University in collaboration with IPA Haryana Branch. Theme: Pharma 5.0 AI, Precision Medicine & Sustainable Therapeutics.",
  keywords: [
    "ICNFPR 2026",
    "Pharmacy Conference Haryana",
    "Geeta Institute of Pharmacy Conference",
    "Pharma 5.0",
    "Indian Pharmacist Association",
    "Geeta University Conference",
    "Pharmaceutical Research Conference 2026",
  ],
  openGraph: {
    title: "3rd International Conference on New Frontiers of Pharmaceutical Research (ICNFPR-2026)",
    description:
      "Pharma 5.0 Artificial Intelligence, Precision Medicine & Sustainable Therapeutics. 1st – 2nd May 2026 at Geeta University.",
    url: "https://geetauniversity.edu.in/icnfpr",
    type: "website",
    images: [
      {
        url: "/uploads/all/2008/conversions/hero-full.webp",
        width: 1200,
        height: 630,
        alt: "ICNFPR 2026 - Geeta University",
      },
    ],
  },
  alternates: {
    canonical: "https://geetauniversity.edu.in/icnfpr",
  },
};

export default function IcnfprPage() {
  return (
    <main className="min-h-screen bg-white text-[#0A1F44] overflow-x-hidden">
      {/* 1. Hero & Conference Banner */}
      <IcnfprHero />

      {/* 2. About University, About Conference, GIP & IPA Collaboration */}
      <IcnfprAbout />

      {/* 3. Keynote & Invited Speakers + Guests of Honour */}
      <IcnfprSpeakers />

      {/* 4. Conference Program Schedule (Day 1 & Day 2) */}
      <IcnfprSchedule />

      {/* 5. Call for Papers (CFP) Guidelines & Important Deadlines */}
      <IcnfprCfp />

      {/* 6. Delegate Registration Pricing & Registration Form Link */}
      <IcnfprPricing />

      {/* 7. Organizing Committee Leadership & Sub-Committees */}
      <IcnfprCommittee />

      {/* 8. National & International Advisory Board + IPA Teams */}
      <IcnfprAdvisoryBoard />

      {/* 9. Contact Us, Conference Helplines & Venue Map */}
      <IcnfprContact />

      {/* 10. Legacy & Ecosystem Section */}
      <LegacyEcosystem
        id="legacy-ecosystem"
        contextText="Conference delegates and scholars benefit from the multidisciplinary academic ecosystem of:"
      />
    </main>
  );
}
