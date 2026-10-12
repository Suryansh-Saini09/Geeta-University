import { notFound } from "next/navigation";
import type { Metadata } from "next";

import EdgePage from "@/components/edge/EdgePage";
import {
  getEdgePageDataAsync,
  getDynamicEdgeSlugs,
} from "@/lib/edge/edgeRepository";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getDynamicEdgeSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageData = await getEdgePageDataAsync(slug);

  if (!pageData) {
    return {};
  }

  return {
    title: pageData.seo.title,
    description: pageData.seo.description,
    keywords: pageData.seo.keywords,
  };
}

export default async function EdgePageRoute({ params }: PageProps) {
  const { slug } = await params;
  const pageData = await getEdgePageDataAsync(slug);

  if (!pageData) {
    notFound();
  }

  return <EdgePage data={pageData} />;
}
