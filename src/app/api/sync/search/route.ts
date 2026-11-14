import { NextRequest, NextResponse } from "next/server";
import {
  upsertSearchDocument,
  deleteSearchDocument,
  invalidateSearchCache,
} from "@/lib/search/searchRepository";

export const dynamic = "force-dynamic";

// Secret bearer token for securing CMS webhooks
const SYNC_SECRET_TOKEN =
  process.env.SYNC_SECRET_TOKEN ||
  process.env.CMS_WEBHOOK_SECRET ||
  "gu_cms_sync_secret_2026";

/**
 * Validates bearer token from Authorization header or x-sync-token header
 */
function authenticateWebhook(request: NextRequest): boolean {
  const authHeader = request.headers.get("Authorization") || "";
  let token = "";

  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else {
    token = request.headers.get("x-sync-token")?.trim() || "";
  }

  // Fallback for development if secret not set in .env
  if (!token) return false;
  return token === SYNC_SECRET_TOKEN;
}

/**
 * POST /api/sync/search
 * Webhook handler for CMS lifecycle events (create, update, delete, publish, unpublish).
 * Supports direct payloads and standard CMS webhooks (Strapi, Sanity, WordPress).
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Verify authentication
  if (!authenticateWebhook(request)) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Invalid or missing Bearer token in Authorization header.",
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // Determine event action
    const rawAction = (body.action || body.event || "").toLowerCase();
    const isUpsert = [
      "create",
      "update",
      "publish",
      "entry.create",
      "entry.update",
      "entry.publish",
    ].includes(rawAction);

    const isDelete = [
      "delete",
      "unpublish",
      "entry.delete",
      "entry.unpublish",
    ].includes(rawAction);

    const isReindex = rawAction === "reindex";

    // ── CASE A: Full Re-index Trigger ──
    if (isReindex) {
      invalidateSearchCache();
      return NextResponse.json({
        success: true,
        action: "reindex_triggered",
        message: "Search cache invalidated. Run 'npm run search:reindex' for full DB recrawl.",
      });
    }

    // ── CASE B: Upsert / Publish Lifecycle Event ──
    if (isUpsert) {
      const data = body.document || body.entry || body.data;
      if (!data) {
        return NextResponse.json(
          { error: "Bad Request", message: "Missing document or entry in payload." },
          { status: 400 }
        );
      }

      const title = data.title || data.name || data.heroTitle;
      const slug = data.slug || "";
      const href =
        data.href ||
        (slug ? (slug.startsWith("/") ? slug : `/${slug}`) : undefined);

      if (!title || !href) {
        return NextResponse.json(
          {
            error: "Bad Request",
            message: "Document must contain at least 'title' and 'href' or 'slug'.",
          },
          { status: 400 }
        );
      }

      const category = data.category || body.model || "General";
      const subcategory = data.subcategory || data.type || undefined;
      const description =
        data.description || data.excerpt || data.summary || data.seoDescription || "";
      const content =
        typeof data.content === "string"
          ? data.content
          : JSON.stringify(data.content || data.body || data.sections || "");

      let tags: string[] = [];
      if (Array.isArray(data.tags)) tags = data.tags;
      else if (Array.isArray(data.keywords)) tags = data.keywords;
      else if (typeof data.tags === "string") tags = data.tags.split(",").map((t: string) => t.trim());

      const upserted = await upsertSearchDocument({
        id: data.id,
        title,
        slug,
        href,
        category,
        subcategory,
        description,
        content,
        tags,
      });

      return NextResponse.json({
        success: true,
        action: "upserted",
        documentId: upserted.id,
        href: upserted.href,
        title: upserted.title,
      });
    }

    // ── CASE C: Delete / Unpublish Lifecycle Event ──
    if (isDelete) {
      const data = body.document || body.entry || body.data || body;
      const identifier = data.id || data.href || data.slug;

      if (!identifier) {
        return NextResponse.json(
          {
            error: "Bad Request",
            message: "Missing 'id', 'href', or 'slug' identifier for deletion.",
          },
          { status: 400 }
        );
      }

      const deleted = await deleteSearchDocument(identifier);
      return NextResponse.json({
        success: deleted,
        action: "deleted",
        identifier,
      });
    }

    return NextResponse.json(
      {
        error: "Bad Request",
        message: `Unsupported action or event '${rawAction}'. Supported: create, update, publish, unpublish, delete, reindex.`,
      },
      { status: 400 }
    );
  } catch (err) {
    console.error("[/api/sync/search] Sync webhook error:", err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
