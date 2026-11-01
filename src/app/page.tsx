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
  const isVisible = (key: string) => homeData.visibility?.[key] !== false;

  return (
    <main className="bg-white">
      {isVisible("hero") && homeData.hero && <HomeHeroSection data={homeData.hero} />}

      {isVisible("smartCampus") && homeData.smartCampus && <SmartCampusSection data={homeData.smartCampus} />}

      {isVisible("stats") && homeData.stats && <HomeStatsSection data={homeData.stats} />}

      {isVisible("recruiters") && homeData.recruiters && homeData.recruiters.length > 0 && (
        <TopRecruitersSection data={homeData.recruiters} />
      )}

      {isVisible("programsOffered") && homeData.programsOffered && (
        <HomeProgramsSection data={homeData.programsOffered} />
      )}

      {isVisible("awards") && homeData.awards && homeData.awards.length > 0 && (
        <AwardsRankingsSection data={homeData.awards} />
      )}

      {isVisible("testimonials") && homeData.testimonials && homeData.testimonials.length > 0 && (
        <HomeFeedbackSection data={homeData.testimonials} />
      )}

      {isVisible("globalEducation") && homeData.globalEducation && (
        <HomeGlobalEducationSection data={homeData.globalEducation} />
      )}

      {isVisible("universe") && homeData.universe && <HomeUniverseSection data={homeData.universe} />}

      {isVisible("updates") && homeData.updates && <HomeUpdatesSection data={homeData.updates} />}

      {isVisible("whyJoinGeeta") && homeData.whyJoinGeeta && <WhyJoinGeetaSection data={homeData.whyJoinGeeta} />}

      {isVisible("scholarships") && homeData.scholarships && <ScholarshipsSection data={homeData.scholarships} />}

      {isVisible("industryPartners") && homeData.industryPartners && homeData.industryPartners.length > 0 && (
        <IndustryIntegrationSection data={homeData.industryPartners} />
      )}

      {isVisible("virtualTour") && homeData.virtualTour && (
        <VirtualCampusTourSection data={homeData.virtualTour} />
      )}

      {isVisible("starPerformances") && (homeData.starPerformances?.length > 0 || homeData.starPerformancesCta) && (
        <StarPerformancesSection
          data={homeData.starPerformances}
          ctaData={homeData.starPerformancesCta}
        />
      )}
    </main>
  );
}