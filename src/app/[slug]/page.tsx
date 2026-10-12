import { notFound } from "next/navigation";
import type { Metadata } from "next";

import CoursePage from "@/components/programs/course/CoursePage";
import ProgramPage from "@/components/programs/ProgramPage";
import {
  getCourseByDirectSlug,
  getAllCourses,
} from "@/lib/programs/courseRepository";
import {
  getProgramBySlug,
  getAllProgramSlugs,
} from "@/lib/programs/programRepository";
import { getLocale } from "@/lib/i18n/getLocale";
import { getPublishedPageBySlug } from "@/server/services/pages";
import { parsePageSections } from "@/validations/page";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const allCourses = getAllCourses();
  const allProgramSlugs = getAllProgramSlugs();

  return [
    ...allCourses.map((c) => ({ slug: c.slug })),
    ...allProgramSlugs.map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();

  const course = getCourseByDirectSlug(slug);
  if (course) {
    const canonical =
      locale === "en"
        ? `https://geetauniversity.edu.in/${course.slug}`
        : `https://geetauniversity.edu.in/${locale}/${course.slug}`;

    return {
      title: course.seo.title,
      description: course.seo.description,
      keywords: course.seo.keywords,
      alternates: {
        canonical,
        languages: {
          en: `https://geetauniversity.edu.in/${course.slug}`,
          hi: `https://geetauniversity.edu.in/hi/${course.slug}`,
          fr: `https://geetauniversity.edu.in/fr/${course.slug}`,
          "x-default": `https://geetauniversity.edu.in/${course.slug}`,
        },
      },
      openGraph: {
        title: course.seo.title,
        description: course.seo.description,
        images: course.seo.ogImage ? [{ url: course.seo.ogImage }] : undefined,
      },
    };
  }

  const school = await getProgramBySlug(slug, locale);
  if (school) {
    const canonical =
      locale === "en"
        ? `https://geetauniversity.edu.in/${slug}`
        : `https://geetauniversity.edu.in/${locale}/${slug}`;

    return {
      title: school.seo?.title || school.name,
      description: school.seo?.description || school.hero?.description,
      keywords: school.seo?.keywords,
      alternates: {
        canonical,
        languages: {
          en: `https://geetauniversity.edu.in/${slug}`,
          hi: `https://geetauniversity.edu.in/hi/${slug}`,
          fr: `https://geetauniversity.edu.in/fr/${slug}`,
          "x-default": `https://geetauniversity.edu.in/${slug}`,
        },
      },
      openGraph: {
        title: school.seo?.title || school.name,
        description: school.seo?.description || school.hero?.description,
        images: school.hero?.image ? [{ url: school.hero.image }] : undefined,
      },
    };
  }

  try {
    const page = await getPublishedPageBySlug(slug);
    if (page) {
      return {
        title: page.seo?.title ?? page.title,
        description: page.seo?.description ?? undefined,
        robots: page.seo?.noIndex ? { index: false, follow: false } : undefined,
      };
    }
  } catch {
    // ignore database error
  }

  return {};
}

export default async function DirectSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();

  // 1. Check if slug matches a course directly (e.g., phd-computer-application, phd-cse, mca, etc.)
  const course = getCourseByDirectSlug(slug);
  if (course) {
    const school = await getProgramBySlug(course.schoolSlug, locale);
    return <CoursePage course={course} school={school} />;
  }

  // 2. Check if slug matches a school directly (e.g., school-of-humanities, school-of-humanities-and-social-science, etc.)
  const school = await getProgramBySlug(slug, locale);
  if (school) {
    return <ProgramPage data={school} />;
  }

  // 3. Check if slug matches a published page from CMS
  try {
    const page = await getPublishedPageBySlug(slug);
    if (page) {
      const sections = parsePageSections(page.sections);
      return (
        <article className="min-h-screen bg-white text-[#0A1F44]">
          <header className="border-b border-slate-200 bg-slate-50 px-5 py-12 sm:py-16">
            <div className="mx-auto max-w-5xl">
              <h1 className="font-serif text-4xl font-bold sm:text-5xl">
                {page.title}
              </h1>
            </div>
          </header>
          <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
            {sections.map((section, index) => (
              <section
                key={index}
                className="border-b border-slate-200 py-7 first:pt-0 last:border-b-0"
              >
                <h2 className="font-serif text-2xl font-bold">
                  {section.heading}
                </h2>
                <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-slate-700">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </article>
      );
    }
  } catch {
    // ignore database error
  }

  // 4. Fallback to 404
  notFound();
}
