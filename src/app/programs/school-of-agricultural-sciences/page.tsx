import type { Metadata } from "next";
import ProgramPage from "@/components/programs/ProgramPage";
import { agricultureSchool } from "@/data/programs/schools/agriculture";
import { getProgramBySlug } from "@/lib/programs/programRepository";
import { getLocale } from "@/lib/i18n/getLocale";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const program = await getProgramBySlug("school-of-agricultural-sciences", locale);
  const data = program || agricultureSchool;

  const canonical =
    locale === "en"
      ? "https://geetauniversity.edu.in/programs/school-of-agricultural-sciences"
      : `https://geetauniversity.edu.in/${locale}/programs/school-of-agricultural-sciences`;

  return {
    title: data.seo?.title || data.name,
    description: data.seo?.description || data.hero?.description,
    keywords: data.seo?.keywords,
    alternates: {
      canonical,
      languages: {
        en: "https://geetauniversity.edu.in/programs/school-of-agricultural-sciences",
        hi: "https://geetauniversity.edu.in/hi/programs/school-of-agricultural-sciences",
        fr: "https://geetauniversity.edu.in/fr/programs/school-of-agricultural-sciences",
        "x-default": "https://geetauniversity.edu.in/programs/school-of-agricultural-sciences",
      },
    },
    openGraph: {
      title: data.seo?.title || data.name,
      description: data.seo?.description || data.hero?.description,
      images: data.hero?.image ? [{ url: data.hero.image }] : undefined,
    },
  };
}

export default async function SchoolOfAgriculturalSciencesPage() {
  const locale = await getLocale();
  const program = await getProgramBySlug("school-of-agricultural-sciences", locale);

  return <ProgramPage data={program || agricultureSchool} />;
}
