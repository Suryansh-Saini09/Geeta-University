import { notFound } from "next/navigation";
import type { Metadata } from "next";

import GlobalEdgeContent from "@/components/edge/GlobalEdgeContent";
import { getEdgePageDataAsync } from "@/lib/edge/edgeRepository";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getEdgePageDataAsync("gu-global-edge");
  if (!pageData) return {};

  return {
    title: pageData.seo.title,
    description: pageData.seo.description,
    keywords: pageData.seo.keywords,
  };
}

export default async function GuGlobalEdgePage() {
  const pageData = await getEdgePageDataAsync("gu-global-edge");

  if (!pageData) {
    notFound();
  }

  return <GlobalEdgeContent data={pageData} />;
}
