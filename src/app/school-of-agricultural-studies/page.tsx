import type { Metadata } from "next";
import ProgramPage from "@/components/programs/ProgramPage";
import { agricultureSchool } from "@/data/programs/schools/agriculture";
import { getProgramBySlug } from "@/lib/programs/programRepository";
import { getLocale } from "@/lib/i18n/getLocale";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const program = await getProgramBySlug("school-of-agricultural-studies", locale);
  const data = program || agricultureSchool;

  const canonical =
    locale === "en"
      ? "https://geetauniversity.edu.in/school-of-agricultural-studies"
      : `https://geetauniversity.edu.in/${locale}/school-of-agricultural-studies`;

  return {
    title: data.seo?.title || data.name,
    description: data.seo?.description || data.hero?.description,
    keywords: data.seo?.keywords,
    alternates: {
      canonical,
      languages: {
        en: "https://geetauniversity.edu.in/school-of-agricultural-studies",
        hi: "https://geetauniversity.edu.in/hi/school-of-agricultural-studies",
        fr: "https://geetauniversity.edu.in/fr/school-of-agricultural-studies",
        "x-default": "https://geetauniversity.edu.in/school-of-agricultural-studies",
      },
    },
    openGraph: {
      title: data.seo?.title || data.name,
      description: data.seo?.description || data.hero?.description,
      images: data.hero?.image ? [{ url: data.hero.image }] : undefined,
    },
  };
}

export default async function DirectSchoolOfAgriculturalStudiesPage() {
  const locale = await getLocale();
  const program = await getProgramBySlug("school-of-agricultural-studies", locale);

  return <ProgramPage data={program || agricultureSchool} />;
}
