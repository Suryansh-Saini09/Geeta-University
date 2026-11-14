import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { HARDCODED_SOCIAL_LINKS, HARDCODED_SOCIAL_PROFILE } from "@/lib/socialLinks";
import { serverLogger } from "@/lib/security/logger";

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "social_links" },
      select: { value: true },
    });

    if (setting?.value) {
      const val = setting.value as any;
      return NextResponse.json({
        success: true,
        data: {
          profile: val.profile || HARDCODED_SOCIAL_PROFILE,
          links: val.links || HARDCODED_SOCIAL_LINKS,
        },
      });
    }
  } catch (error) {
    serverLogger.error("Error fetching social data from DB", error, { module: "API", action: "social-links" });
  }

  return NextResponse.json({
    success: true,
    data: {
      profile: HARDCODED_SOCIAL_PROFILE,
      links: HARDCODED_SOCIAL_LINKS,
    },
  });
}
