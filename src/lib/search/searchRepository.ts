import { prisma } from "@/server/db/client";
import type { SearchDocument, SearchCategory } from "./types";
import { buildSearchIndex } from "./buildSearchIndex";

// SearchDocument record structure in the database
export interface SearchDocumentRecord {
  id: string;
  title: string;
  slug: string;
  href: string;
  category: string;
  subcategory: string | null;
  description: string | null;
  content: string | null;
  tags: unknown;
  createdAt: Date;
  updatedAt: Date;
}

// Delegate accessor using strongly-typed Prisma model
const searchDocModel = prisma.searchDocument;

// In-memory cache for search documents with 60-second TTL
let cachedDocs: SearchDocument[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000;

export function invalidateSearchCache(): void {
  cachedDocs = null;
  lastCacheTime = 0;
}

/**
 * Strips HTML tags, markdown markers, and extraneous whitespace
 */
export function cleanSearchText(text?: string | null): string {
  if (!text) return "";
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`~\[\]()]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Retrieves authoritative search documents:
 * 1. Checks in-memory cache
 * 2. Fetches from MySQL `search_documents` table via Prisma
 * 3. Falls back to static `buildSearchIndex()` if table is empty or DB is offline
 */
export async function getAuthoritativeSearchDocuments(): Promise<SearchDocument[]> {
  const now = Date.now();
  if (cachedDocs && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedDocs;
  }

  try {
    const dbDocs: SearchDocumentRecord[] = await searchDocModel.findMany({
      orderBy: { updatedAt: "desc" },
    });

    if (dbDocs.length > 0) {
      const mapped: SearchDocument[] = dbDocs.map((d: SearchDocumentRecord) => ({
        id: d.id,
        title: d.title,
        slug: d.slug,
        href: d.href,
        category: d.category as SearchCategory,
        subcategory: d.subcategory || undefined,
        description: d.description || "",
        content: d.content || "",
        tags: Array.isArray(d.tags) ? (d.tags as string[]) : [],
        keywords: Array.isArray(d.tags) ? (d.tags as string[]) : [],
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      }));

      cachedDocs = mapped;
      lastCacheTime = now;
      return mapped;
    }
  } catch (err) {
    console.warn("[SearchRepository] DB query failed, falling back to static index:", err);
  }

  // Fallback to static index builder
  const fallback = buildSearchIndex();
  cachedDocs = fallback;
  lastCacheTime = now;
  return fallback;
}

/**
 * Upserts a single document into the search index
 */
export async function upsertSearchDocument(data: {
  id?: string;
  title: string;
  slug?: string;
  href: string;
  category: string;
  subcategory?: string;
  description?: string;
  content?: string;
  tags?: string[];
}): Promise<SearchDocument> {
  const cleanTitle = cleanSearchText(data.title);
  const cleanDesc = cleanSearchText(data.description);
  const cleanContent = cleanSearchText(data.content);
  const cleanSlug = data.slug || data.href.replace(/^\//, "").replace(/\//g, "-");

  const record: SearchDocumentRecord = await searchDocModel.upsert({
    where: { href: data.href },
    update: {
      title: cleanTitle,
      slug: cleanSlug,
      category: data.category,
      subcategory: data.subcategory || null,
      description: cleanDesc,
      content: cleanContent,
      tags: data.tags || [],
    },
    create: {
      ...(data.id ? { id: data.id } : {}),
      title: cleanTitle,
      slug: cleanSlug,
      href: data.href,
      category: data.category,
      subcategory: data.subcategory || null,
      description: cleanDesc,
      content: cleanContent,
      tags: data.tags || [],
    },
  });

  invalidateSearchCache();

  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    href: record.href,
    category: record.category as SearchCategory,
    subcategory: record.subcategory || undefined,
    description: record.description || "",
    content: record.content || "",
    tags: Array.isArray(record.tags) ? (record.tags as string[]) : [],
    keywords: Array.isArray(record.tags) ? (record.tags as string[]) : [],
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

/**
 * Removes a document from the search index by id or href
 */
export async function deleteSearchDocument(identifier: string): Promise<boolean> {
  try {
    if (identifier.startsWith("/")) {
      await searchDocModel.deleteMany({
        where: { href: identifier },
      });
    } else {
      await searchDocModel.deleteMany({
        where: {
          OR: [{ id: identifier }, { href: identifier }, { slug: identifier }],
        },
      });
    }
    invalidateSearchCache();
    return true;
  } catch (err) {
    console.error("[SearchRepository] Delete document failed:", err);
    return false;
  }
}
