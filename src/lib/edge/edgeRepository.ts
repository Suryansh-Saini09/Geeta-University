import type { EdgePageData } from "@/data/edge/types";
import { dyodPage } from "@/data/edge/dyod";
import { gfsPage } from "@/data/edge/gfs";
import { gthPage } from "@/data/edge/gth";
import { nepPage } from "@/data/edge/nep";
import { vocationalSkillsPage } from "@/data/edge/vocationalSkills";
import { globalEdgePage } from "@/data/edge/globalEdge";
import { xedgePage } from "@/data/edge/xedge";
import { getPublishedAdmissionsPage } from "@/server/services/pages";

const edgePages: EdgePageData[] = [
  dyodPage,
  gfsPage,
  gthPage,
  nepPage,
  vocationalSkillsPage,
  globalEdgePage,
  xedgePage,
];

export function getEdgePageBySlug(slug: string): EdgePageData | undefined {
  const normalized = slug.toLowerCase().trim();
  return edgePages.find((p) => p.slug.toLowerCase() === normalized);
}

export function getAllEdgePages(): EdgePageData[] {
  return edgePages;
}

export function getDynamicEdgeSlugs(): string[] {
  return edgePages
    .filter((p) => p.slug !== "gu-global-edge")
    .map((p) => p.slug);
}

export async function getEdgePageDataAsync(slug: string): Promise<EdgePageData | undefined> {
  const fallback = getEdgePageBySlug(slug);
  if (!fallback) return undefined;

  try {
    const dbData = await getPublishedAdmissionsPage(slug);
    if (!dbData || !dbData.sections || Object.keys(dbData.sections).length === 0) {
      return fallback;
    }

    const sections = dbData.sections;
    const merged: EdgePageData = { ...fallback };

    const getCleanSection = (raw: any) => {
      if (!raw) return null;
      if (typeof raw === "object" && raw.body && typeof raw.body === "object" && !Array.isArray(raw.body)) {
        return raw.body;
      }
      return raw;
    };

    if (dbData.seo) {
      merged.seo = {
        title: dbData.seo.title || fallback.seo.title,
        description: dbData.seo.description || fallback.seo.description,
        keywords: dbData.seo.keywords
          ? typeof dbData.seo.keywords === "string"
            ? dbData.seo.keywords.split(",").map((k: string) => k.trim())
            : Array.isArray(dbData.seo.keywords)
            ? (dbData.seo.keywords as string[])
            : fallback.seo.keywords
          : fallback.seo.keywords,
        ogImage: dbData.seo.ogImage || fallback.seo.ogImage,
      };
    }

    const cleanHero = getCleanSection(sections.hero);
    if (cleanHero) merged.hero = { ...fallback.hero, ...cleanHero };

    const cleanStats = getCleanSection(sections.stats);
    if (cleanStats) merged.stats = { ...fallback.stats, ...cleanStats };

    const cleanTimeline = getCleanSection(sections.timeline);
    if (cleanTimeline) merged.timeline = { ...fallback.timeline, ...cleanTimeline };

    const cleanTrainingModel = getCleanSection(sections.trainingModel);
    if (cleanTrainingModel) merged.trainingModel = { ...fallback.trainingModel, ...cleanTrainingModel };

    const cleanMentors = getCleanSection(sections.mentors);
    if (cleanMentors) merged.mentors = { ...fallback.mentors, ...cleanMentors };

    const cleanTestimonials = getCleanSection(sections.testimonials);
    if (cleanTestimonials) merged.testimonials = { ...fallback.testimonials, ...cleanTestimonials };

    const cleanVideos = getCleanSection(sections.videos);
    if (cleanVideos) merged.videos = { ...fallback.videos, ...cleanVideos };

    const cleanGallery = getCleanSection(sections.gallery);
    if (cleanGallery) merged.gallery = { ...fallback.gallery, ...cleanGallery };

    const cleanCta = getCleanSection(sections.cta);
    if (cleanCta) merged.cta = { ...fallback.cta, ...cleanCta };

    const cleanCustomSections = getCleanSection(sections.customSections);
    if (cleanCustomSections) merged.customSections = cleanCustomSections;

    // Handle features grids array or featureGrid_... keys
    const featureGridKeys = Object.keys(sections).filter((k) => k.startsWith("featureGrid_") || k === "features");
    if (featureGridKeys.length > 0) {
      const featureGrids: any[] = [];
      featureGridKeys.forEach((key) => {
        if (sections[key]) {
          if (Array.isArray(sections[key])) {
            featureGrids.push(...sections[key]);
          } else {
            featureGrids.push(sections[key]);
          }
        }
      });
      if (featureGrids.length > 0) {
        merged.features = featureGrids;
      }
    }

    // Handle accordions
    const accordionKeys = Object.keys(sections).filter((k) => k.startsWith("accordions_") || k === "accordions");
    if (accordionKeys.length > 0) {
      const accordionSections: any[] = [];
      accordionKeys.forEach((key) => {
        if (sections[key]) {
          if (Array.isArray(sections[key])) {
            accordionSections.push(...sections[key]);
          } else {
            accordionSections.push(sections[key]);
          }
        }
      });
      if (accordionSections.length > 0) {
        merged.accordions = accordionSections;
      }
    }

    return merged;
  } catch (err) {
    console.error(`[EDGE REPO] Error fetching DB data for "${slug}":`, err);
    return fallback;
  }
}
