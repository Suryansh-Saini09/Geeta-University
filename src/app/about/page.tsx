import { getPublishedAboutPage } from "@/server/services/pages";
import { getLocale } from "@/lib/i18n/getLocale";
import AboutPageClient from "@/components/about/AboutPageClient";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const aboutData = await getPublishedAboutPage(locale);
  const seo: any = aboutData.seo || {};

  const keywords = typeof seo.keywords === "string"
    ? seo.keywords.split(",").map((k: string) => k.trim())
    : Array.isArray(seo.keywords)
    ? seo.keywords
    : undefined;

  const canonical = locale === "en" ? "https://geetauniversity.edu.in/about" : `https://geetauniversity.edu.in/${locale}/about`;

  return {
    title: seo.title || seo.metaTitle || "About Us | Geeta University",
    description: seo.description || seo.metaDescription || "Discover the journey, vision, leadership and institutional foundation behind Geeta University.",
    keywords,
    alternates: {
      canonical,
      languages: {
        "en": "https://geetauniversity.edu.in/about",
        "hi": "https://geetauniversity.edu.in/hi/about",
        "fr": "https://geetauniversity.edu.in/fr/about",
        "x-default": "https://geetauniversity.edu.in/about",
      },
    },
    openGraph: {
      title: seo.ogTitle || seo.title || "About Us | Geeta University",
      description: seo.ogDescription || seo.description || "Discover the journey, vision, leadership and institutional foundation behind Geeta University.",
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
  };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const aboutData = await getPublishedAboutPage(locale);

  return <AboutPageClient aboutData={aboutData} />;
}
