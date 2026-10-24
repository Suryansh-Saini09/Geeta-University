import type { EdgePageData } from "@/data/edge/types";
import { dyodPage } from "@/data/edge/dyod";
import { gfsPage } from "@/data/edge/gfs";
import { gthPage } from "@/data/edge/gth";
import { nepPage } from "@/data/edge/nep";
import { vocationalSkillsPage } from "@/data/edge/vocationalSkills";
import { globalEdgePage } from "@/data/edge/globalEdge";
import { xedgePage } from "@/data/edge/xedge";

export const edgePages: EdgePageData[] = [
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
