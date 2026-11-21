import { NextResponse } from "next/server";
import { requireAdminSession } from "@/server/auth/session";
import { runStorageDiagnostic } from "@/server/media/storageDiagnostic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Restrict access strictly to authenticated administrators
    await requireAdminSession();
    const result = await runStorageDiagnostic();
    return NextResponse.json(result, { status: result.healthy ? 200 : 500 });
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: error?.message || "Unauthorized" },
      { status: 401 }
    );
  }
}

