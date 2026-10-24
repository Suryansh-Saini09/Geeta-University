import { NextRequest, NextResponse } from "next/server";
import { searchWebsite } from "@/lib/search/searchEngine";
import { getAuthoritativeSearchDocuments } from "@/lib/search/searchRepository";
import type { SearchResultsResponse } from "@/lib/search/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/search
 * Authoritative search endpoint with BM25 ranking, stop-word elimination,
 * exact phrase boosting, and field weighting.
 *
 * Query Params:
 * - q: Query string (required)
 * - page: 1-based page index (default: 1)
 * - pageSize: Results per page (default: 10, max: 50)
 * - category: Optional category filter (e.g. "Programs", "Courses", "Admissions")
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10)));
    const categoryFilter = searchParams.get("category");

    if (!query.trim()) {
      const emptyResponse: SearchResultsResponse = {
        results: [],
        totalResults: 0,
        query: "",
        page: 1,
        pageSize,
        totalPages: 0,
      };
      return NextResponse.json(emptyResponse);
    }

    // 1. Fetch authoritative indexed documents from MySQL search_documents table
    let documents = await getAuthoritativeSearchDocuments();

    // 2. Apply category filter if requested
    if (categoryFilter && categoryFilter !== "All") {
      documents = documents.filter(
        (doc) => doc.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // 3. Execute relevance search with BM25, exact phrase boost, and coverage filter
    const searchResponse = searchWebsite(query, page, pageSize, documents);

    // 4. Return results with cache-control headers for fast performance
    return NextResponse.json(searchResponse, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("[/api/search] Error executing search:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error during search execution",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
