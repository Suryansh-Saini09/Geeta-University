import React from "react";
import type { Metadata } from "next";
import PhdHero from "@/components/phd/PhdHero";
import PhdAboutAndEnquiry from "@/components/phd/PhdAboutAndEnquiry";
import PhdImportantDates from "@/components/phd/PhdImportantDates";
import PhdCourseworkFramework from "@/components/phd/PhdCourseworkFramework";
import AwardsRankingsSection from "@/components/about/AwardsRankingsSection";
import PhdVirtualCampusTour from "@/components/phd/PhdVirtualCampusTour";
import PhdEligibilitySection from "@/components/phd/PhdEligibilitySection";
import PhdSyllabusSection from "@/components/phd/PhdSyllabusSection";
import PhdNoticeAndContact from "@/components/phd/PhdNoticeAndContact";
import FAQSection from "@/components/programs/FAQSection";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import { phdFaqsData } from "@/data/phdData";
import { getPublishedAdmissionsPage } from "@/server/services/pages";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedAdmissionsPage("phd");
  return {
    title: seo?.title || "PhD in Private University in India | Best Research Programs at GU",
    description:
      seo?.description ||
      "Enroll in a UGC-compliant PhD at a leading private university with expert faculty, advanced labs, and interdisciplinary research opportunities. Apply Now!",
    keywords: (seo?.keywords as string[]) || ["PhD in Private University in India", "Best Research Programs at GU"],
    openGraph: {
      title: seo?.ogTitle || seo?.title || "PhD in Private University in India | Best Research Programs at GU",
      description:
        seo?.description ||
        "Enroll in a UGC-compliant PhD at a leading private university with expert faculty, advanced labs, and interdisciplinary research opportunities. Apply Now!",
      url: seo?.canonical || "https://geetauniversity.edu.in/phd",
      type: "website",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : [{ url: "https://geetauniversity.edu.in/uploads/all/1871/Ph.d.webp" }],
    },
  };
}

export default async function PhdPage() {
  const { sections } = await getPublishedAdmissionsPage("phd");

  const heroData = sections.hero;
  const faqsData = sections.faqs;
  const legacyData = sections.legacy_ecosystem;

  return (
    <div className="min-w-0 overflow-x-hidden bg-white text-[#0A1F44]">
      {/* 1. Hero Banner */}
      <PhdHero data={heroData} />

      {/* 2. About Program & Disciplines with Lead Enquiry Form */}
      <PhdAboutAndEnquiry />

      {/* 3. Important Dates & Schedule Table */}
      <PhdImportantDates />

      {/* 4. Coursework Framework for Part-Time/International & Fellowship/Stipend */}
      <PhdCourseworkFramework />

      {/* 5. Awards, Rankings & THE Impact Section */}
      <AwardsRankingsSection />

      {/* 6. Virtual Campus Tour with Modal */}
      <PhdVirtualCampusTour />

      {/* 7. Eligibility, Selection, Exemption & How to Apply */}
      <PhdEligibilitySection />

      {/* 8. Ph.D. Entrance Syllabus (13 subjects / PDFs) */}
      <PhdSyllabusSection />

      {/* 9. Important Notice & Ph.D. Cell Contact Box */}
      <PhdNoticeAndContact />

      {/* 10. Frequently Asked Questions */}
      <section id="faqs" className="w-full scroll-mt-20">
        <FAQSection
          title={faqsData?.title || "FAQs – Ph.D. at Geeta University"}
          subtitle={
            faqsData?.subtitle ||
            "Clear your doubts about Ph.D. eligibility, entrance examination structure, fellowships, exemptions, and coursework delivery."
          }
          faqs={faqsData?.items || phdFaqsData}
        />
      </section>

      {/* 11. Legacy & Ecosystem Section */}
      <LegacyEcosystem
        id="legacy-ecosystem"
        contextText={legacyData?.contextText || "Ph.D. scholars benefit from the integrated ecosystem of:"}
      />
    </div>
  );
}
