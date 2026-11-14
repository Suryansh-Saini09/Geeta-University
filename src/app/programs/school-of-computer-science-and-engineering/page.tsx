import type { Metadata } from "next";
import ProgramPage from "@/components/programs/ProgramPage";
import { computerScienceSchool } from "@/data/programs/schools/computerScience";
import { getProgramBySlug } from "@/lib/programs/programRepository";
import { getLocale } from "@/lib/i18n/getLocale";

const departmentSlug = "school-of-computer-science-and-engineering";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const program = await getProgramBySlug(departmentSlug, locale);
  const data = program || computerScienceSchool;

  const canonical =
    locale === "en"
      ? `https://geetauniversity.edu.in/programs/${departmentSlug}`
      : `https://geetauniversity.edu.in/${locale}/programs/${departmentSlug}`;

  return {
    title: data.seo?.title || data.name,
    description: data.seo?.description || data.hero?.description,
    keywords: data.seo?.keywords,
    alternates: {
      canonical,
      languages: {
        en: `https://geetauniversity.edu.in/programs/${departmentSlug}`,
        hi: `https://geetauniversity.edu.in/hi/programs/${departmentSlug}`,
        fr: `https://geetauniversity.edu.in/fr/programs/${departmentSlug}`,
        "x-default": `https://geetauniversity.edu.in/programs/${departmentSlug}`,
      },
    },
    openGraph: {
      title: data.seo?.title || data.name,
      description: data.seo?.description || data.hero?.description,
      images: data.hero?.image ? [{ url: data.hero.image }] : undefined,
    },
  };
}

export default async function SchoolOfComputerSciencePage() {
  const locale = await getLocale();
  const program = await getProgramBySlug(departmentSlug, locale);

  return <ProgramPage data={program || computerScienceSchool} />;
}
