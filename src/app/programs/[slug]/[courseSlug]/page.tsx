import { notFound } from "next/navigation";
import type { Metadata } from "next";

import CoursePage from "@/components/programs/course/CoursePage";
import {
  getCourseBySlug,
  getAllCourseParams,
} from "@/lib/programs/courseRepository";
import { getProgramBySlug } from "@/lib/programs/programRepository";
import { getLocale } from "@/lib/i18n/getLocale";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
    courseSlug: string;
  }>;
}

export async function generateStaticParams() {
  const paramsList = getAllCourseParams();
  return paramsList.map(({ schoolSlug, courseSlug }) => ({
    slug: schoolSlug,
    courseSlug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, courseSlug } = await params;
  const locale = await getLocale();

  const course = await getCourseBySlug(slug, courseSlug);

  if (!course) {
    return {};
  }

  const canonical = locale === "en"
    ? `https://geetauniversity.edu.in/programs/${slug}/${courseSlug}`
    : `https://geetauniversity.edu.in/${locale}/programs/${slug}/${courseSlug}`;

  return {
    title: course.seo.title,
    description: course.seo.description,
    keywords: course.seo.keywords,
    alternates: {
      canonical,
      languages: {
        "en": `https://geetauniversity.edu.in/programs/${slug}/${courseSlug}`,
        "hi": `https://geetauniversity.edu.in/hi/programs/${slug}/${courseSlug}`,
        "fr": `https://geetauniversity.edu.in/fr/programs/${slug}/${courseSlug}`,
        "x-default": `https://geetauniversity.edu.in/programs/${slug}/${courseSlug}`,
      },
    },
    openGraph: {
      title: course.seo.title,
      description: course.seo.description,
      images: course.seo.ogImage ? [{ url: course.seo.ogImage }] : undefined,
    },
  };
}

export default async function CourseRoute({ params }: PageProps) {
  const { slug, courseSlug } = await params;
  const locale = await getLocale();

  const course = await getCourseBySlug(slug, courseSlug);

  if (!course) {
    notFound();
  }

  const school = await getProgramBySlug(slug, locale);

  return <CoursePage course={course} school={school} />;
}
