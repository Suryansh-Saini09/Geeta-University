import type { Metadata } from "next";
import ProgramPage from "@/components/programs/ProgramPage";
import { humanitiesSchool } from "@/data/programs/schools/humanities";
import { getProgramBySlug } from "@/lib/programs/programRepository";
import { getLocale } from "@/lib/i18n/getLocale";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const program = await getProgramBySlug("school-of-humanities", locale);
  const data = program || humanitiesSchool;

  const canonical =
    locale === "en"
      ? "https://geetauniversity.edu.in/programs/school-of-humanities"
      : `https://geetauniversity.edu.in/${locale}/programs/school-of-humanities`;

  return {
    title: data.seo?.title || data.name,
    description: data.seo?.description || data.hero?.description,
    keywords: data.seo?.keywords,
    alternates: {
      canonical,
      languages: {
        en: "https://geetauniversity.edu.in/programs/school-of-humanities",
        hi: "https://geetauniversity.edu.in/hi/programs/school-of-humanities",
        fr: "https://geetauniversity.edu.in/fr/programs/school-of-humanities",
        "x-default": "https://geetauniversity.edu.in/programs/school-of-humanities",
      },
    },
    openGraph: {
      title: data.seo?.title || data.name,
      description: data.seo?.description || data.hero?.description,
      images: data.hero?.image ? [{ url: data.hero.image }] : undefined,
    },
  };
}

export default async function SchoolOfHumanitiesAliasPage() {
  const locale = await getLocale();
  const program = await getProgramBySlug("school-of-humanities", locale);
  return <ProgramPage data={program || humanitiesSchool} />;
}
