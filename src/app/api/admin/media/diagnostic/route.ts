import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/server/auth/session";
import { assertPermission } from "@/server/auth/permissions";
import {
  runStorageDiagnostic,
  inspectAssetStorage,
} from "@/server/media/storageDiagnostic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Restrict access strictly to authenticated administrators with manageContent authorization
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageContent");

    const { searchParams } = new URL(request.url);
    const assetQuery = searchParams.get("asset") || searchParams.get("key");

    if (assetQuery) {
      const assetResult = await inspectAssetStorage(assetQuery);
      return NextResponse.json(assetResult, {
        status: assetResult.existsOnDisk ? 200 : 404,
      });
    }

    const result = await runStorageDiagnostic();
    return NextResponse.json(result, { status: result.healthy ? 200 : 500 });
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const isForbidden = error?.message === "Forbidden";
    return NextResponse.json(
      { error: error?.message || "Unauthorized" },
      { status: isForbidden ? 403 : 401 }
    );
  }
}

