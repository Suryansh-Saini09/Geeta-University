import { getPublishedHomePage } from "@/server/services/pages";
import { getLocale } from "@/lib/i18n/getLocale";
import HomeHeroSection from "@/components/home/HomeHeroSection";
import SmartCampusSection from "@/components/home/SmartCampusSection";
import HomeStatsSection from "@/components/home/HomeStatsSection";
import HomeProgramsSection from "@/components/home/HomeProgramsSection";
import TopRecruitersSection from "@/components/home/TopRecruitersSection";
import VirtualCampusTourSection from "@/components/home/VirtualCampusTourSection";
import AwardsRankingsSection from "@/components/about/AwardsRankingsSection";
import HomeFeedbackSection from "@/components/home/HomeFeedbackSection";
import HomeGlobalEducationSection from "@/components/home/HomeGlobalEducationSection";
import HomeUniverseSection from "@/components/home/HomeUniverseSection";
import HomeUpdatesSection from "@/components/home/HomeUpdatesSection";
import WhyJoinGeetaSection from "@/components/home/WhyJoinGeetaSection";
import ScholarshipsSection from "@/components/home/ScholarshipsSection";
import IndustryIntegrationSection from "@/components/home/IndustryIntegrationSection";
import StarPerformancesSection from "@/components/home/StarPerformancesSection";

import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const homeData = await getPublishedHomePage(locale);
  const seo: any = homeData.seo || {};

  const keywords = typeof seo.keywords === "string"
    ? seo.keywords.split(",").map((k: string) => k.trim())
    : Array.isArray(seo.keywords)
    ? seo.keywords
    : undefined;

  const canonical = locale === "en" ? "https://geetauniversity.edu.in" : `https://geetauniversity.edu.in/${locale}`;

  return {
    title: seo.title || seo.metaTitle || "Geeta University | Top Private University in Haryana",
    description: seo.description || seo.metaDescription || "Geeta University offers industry-ready degree programs with modern labs, top faculty and placement support.",
    keywords,
    alternates: {
      canonical,
      languages: {
        "en": "https://geetauniversity.edu.in",
        "hi": "https://geetauniversity.edu.in/hi",
        "fr": "https://geetauniversity.edu.in/fr",
        "x-default": "https://geetauniversity.edu.in",
      },
    },
    openGraph: {
      title: seo.ogTitle || seo.title || "Geeta University | Top Private University in Haryana",
      description: seo.ogDescription || seo.description || "Geeta University offers industry-ready degree programs with modern labs and placement support.",
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
  };
}

export default async function Home() {
  const locale = await getLocale();
  const homeData = await getPublishedHomePage(locale);

  return (
    <main className="bg-white">
      <HomeHeroSection data={homeData.hero} />

      <SmartCampusSection data={homeData.smartCampus} />

      <HomeStatsSection data={homeData.stats} />

      <TopRecruitersSection data={homeData.recruiters} />

      <HomeProgramsSection data={homeData.programsOffered} />

      <AwardsRankingsSection data={homeData.awards} />

      <HomeFeedbackSection data={homeData.testimonials} />

      <HomeGlobalEducationSection data={homeData.globalEducation} />

      <HomeUniverseSection data={homeData.universe} />

      <HomeUpdatesSection data={homeData.updates} />

      <WhyJoinGeetaSection data={homeData.whyJoinGeeta} />

      <ScholarshipsSection data={homeData.scholarships} />

      <IndustryIntegrationSection data={homeData.industryPartners} />

      <VirtualCampusTourSection data={homeData.virtualTour} />

      <StarPerformancesSection
        data={homeData.starPerformances}
        ctaData={homeData.starPerformancesCta}
      />
    </main>
  );
}