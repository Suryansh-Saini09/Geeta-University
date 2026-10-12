import { getPublishedCampusLifePage } from "@/server/services/pages";
import CampusLifeClientPage from "@/components/campus-life/CampusLifeClientPage";

export const revalidate = 60; // ISR 60 seconds

export async function generateMetadata() {
  const { seo } = await getPublishedCampusLifePage();

  return {
    title: seo?.title || "Campus Life at Geeta University | Student Facilities & Events",
    description:
      seo?.description ||
      "Explore vibrant campus life, modern infrastructure, sports complex, hostel facilities, and student events at Geeta University Panipat.",
    openGraph: {
      title: seo?.title || "Campus Life at Geeta University",
      description: seo?.description || "Explore vibrant campus life, modern infrastructure, sports complex, and events at Geeta University.",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : [],
    },
  };
}

export default async function CampusLifePage() {
  const { sections, seo } = await getPublishedCampusLifePage();

  return <CampusLifeClientPage sections={sections} seo={seo} />;
}
