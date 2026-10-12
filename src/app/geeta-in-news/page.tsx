import React from "react";
import type { Metadata } from "next";

import GeetaInNewsClient from "@/components/geeta-in-news/GeetaInNewsClient";
import { getPublishedGeetaInNewsPage } from "@/server/services/pages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedGeetaInNewsPage();

  return {
    metadataBase: new URL("https://geetauniversity.edu.in"),
    title: seo?.title || "Geeta in News | Media Coverage & Press Clippings | Geeta University",
    description:
      seo?.description ||
      "Explore Geeta University's presence across national and regional news publications including Dainik Bhaskar, Amar Ujala, Punjab Kesari, and more.",
    keywords: [
      "Geeta in News",
      "Geeta University Media Coverage",
      "Press Clippings",
      "Dainik Bhaskar Geeta University",
      "Amar Ujala",
      "Panipat University News",
    ],
    openGraph: {
      title: seo?.ogTitle || seo?.title || "Geeta in News | Media Coverage & Press Clippings | Geeta University",
      description:
        seo?.description ||
        "Explore Geeta University's presence across national and regional news publications.",
      images: seo?.ogImage
        ? [{ url: seo.ogImage }]
        : ["https://geetauniversity.edu.in/uploads/all/252/conversions/new-building-3-(1)-full.webp"],
    },
  };
}

export default async function GeetaInNewsPage() {
  const { hero, items, publications } = await getPublishedGeetaInNewsPage();

  return <GeetaInNewsClient hero={hero} items={items} publications={publications} />;
}
