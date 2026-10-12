import { getPublishedPlacementsPage } from "@/server/services/pages";
import PlacementsClientPage from "@/components/placements/PlacementsClientPage";

export const revalidate = 60; // ISR 60 seconds

export async function generateMetadata() {
  const { seo } = await getPublishedPlacementsPage();

  return {
    title: seo?.title || "Placements & Career Development Cell | Geeta University",
    description:
      seo?.description ||
      "Geeta University placement records, 445+ recruiting partners, top packages up to ₹1.4 Cr, CDC training, student success stories, and recruitment drives.",
    openGraph: {
      title: seo?.title || "Placements at Geeta University",
      description: seo?.description || "Geeta University campus placements, highest package ₹1.4 Cr, CDC support, and recruiters.",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : [],
    },
  };
}

export default async function PlacementsPage() {
  const { sections, seo } = await getPublishedPlacementsPage();

  return <PlacementsClientPage sections={sections} seo={seo} />;
}
