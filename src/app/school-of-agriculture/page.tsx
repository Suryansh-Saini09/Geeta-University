import type { Metadata } from "next";
import ProgramPage from "@/components/programs/ProgramPage";
import { agricultureSchool } from "@/data/programs/schools/agriculture";
import { getProgramBySlug } from "@/lib/programs/programRepository";
import { getLocale } from "@/lib/i18n/getLocale";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const program = await getProgramBySlug("school-of-agriculture", locale);
  const data = program || agricultureSchool;

  const canonical =
    locale === "en"
      ? "https://geetauniversity.edu.in/school-of-agriculture"
      : `https://geetauniversity.edu.in/${locale}/school-of-agriculture`;

  return {
    title: data.seo?.title || data.name,
    description: data.seo?.description || data.hero?.description,
    keywords: data.seo?.keywords,
    alternates: {
      canonical,
      languages: {
        en: "https://geetauniversity.edu.in/school-of-agriculture",
        hi: "https://geetauniversity.edu.in/hi/school-of-agriculture",
        fr: "https://geetauniversity.edu.in/fr/school-of-agriculture",
        "x-default": "https://geetauniversity.edu.in/school-of-agriculture",
      },
    },
    openGraph: {
      title: data.seo?.title || data.name,
      description: data.seo?.description || data.hero?.description,
      images: data.hero?.image ? [{ url: data.hero.image }] : undefined,
    },
  };
}

export default async function DirectSchoolOfAgriculturePage() {
  const locale = await getLocale();
  const program = await getProgramBySlug("school-of-agriculture", locale);

  return <ProgramPage data={program || agricultureSchool} />;
}
