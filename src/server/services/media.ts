import {
  queryUnifiedMediaCatalog,
  getUnifiedMediaAssetByIdOrUrl,
  type CatalogQueryFilters,
  type CatalogQueryResult,
  type UnifiedMediaAsset,
  type MediaCategory,
  type MediaSortOption,
} from "./unifiedMediaCatalog";

export type {
  CatalogQueryFilters,
  CatalogQueryResult,
  UnifiedMediaAsset,
  MediaCategory,
  MediaSortOption,
};

/**
 * Returns unified media assets across database records and static public repository files.
 * Used by /admin/media and administrative views.
 */
export async function getAdminMedia(
  filters: {
    query?: string;
    kind?: MediaCategory;
    directory?: string;
    usage?: "ALL" | "USED" | "UNUSED";
    sort?: MediaSortOption;
    page?: number;
    pageSize?: number;
  } = {}
): Promise<CatalogQueryResult> {
  return queryUnifiedMediaCatalog({
    query: filters.query,
    category: filters.kind || "ALL",
    directory: filters.directory,
    usage: filters.usage,
    sort: filters.sort,
    page: filters.page,
    pageSize: filters.pageSize ?? 24,
  });
}

/**
 * Finds a media asset by database ID or canonical relative URL.
 */
export async function getAdminMediaById(idOrUrl: string): Promise<UnifiedMediaAsset | null> {
  return getUnifiedMediaAssetByIdOrUrl(idOrUrl);
}
