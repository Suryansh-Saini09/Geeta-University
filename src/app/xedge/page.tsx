import type { Metadata } from "next";
import XEdgePage from "@/components/xedge/XEdgePage";
import { getEdgePageDataAsync } from "@/lib/edge/edgeRepository";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getEdgePageDataAsync("xedge");
  if (!pageData) return {};

  return {
    title: pageData.seo.title,
    description: pageData.seo.description,
    keywords: pageData.seo.keywords,
  };
}

export default async function XEdgeRoute() {
  const pageData = await getEdgePageDataAsync("xedge");
  return <XEdgePage pageData={pageData} />;
}
