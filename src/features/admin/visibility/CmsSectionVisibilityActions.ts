"use server";

import { z } from "zod";
import { requireAdminSession } from "@/server/auth/session";
import { assertPermission } from "@/server/auth/permissions";
import { recordAuditLog } from "@/server/services/auditLogs";
import { safeActionError } from "@/lib/cms/errorSanitizer";
import { CmsSectionVisibilityService } from "./CmsSectionVisibilityService";
import type { CmsScopeType, UpdateVisibilityPayload, UpdateVisibilityResponse } from "./types";

const visibilityPayloadSchema = z.object({
  scopeType: z.enum(["department", "page", "program"]),
  scopeId: z.string().trim().min(1, "Scope ID is required"),
  sectionKey: z.string().trim().min(1, "Section key is required"),
  isVisible: z.boolean(),
});

export async function updateCmsSectionVisibilityAction(
  payload: UpdateVisibilityPayload
): Promise<UpdateVisibilityResponse> {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageContent");

    const parsed = visibilityPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid visibility update payload.",
      };
    }

    const { scopeType, scopeId, sectionKey, isVisible } = parsed.data;

    // Execute visibility update
    const result = await CmsSectionVisibilityService.setSectionVisibility(
      scopeType as CmsScopeType,
      scopeId,
      sectionKey,
      isVisible
    );

    if (result.success) {
      await recordAuditLog({
        actorId: session.user.id,
        action: "UPDATE",
        entityType: "CmsSectionVisibility",
        entityId: `${scopeType}:${scopeId}:${sectionKey}`,
        before: { isVisible: !isVisible },
        after: { isVisible },
      });
    }

    return result;
  } catch (err: any) {
    return safeActionError(err, "Failed to update section visibility", {
      module: "VISIBILITY",
      action: "updateCmsSectionVisibilityAction",
      payload,
    });
  }
}

export async function getScopeVisibilityAction(
  scopeType: CmsScopeType,
  scopeId: string
): Promise<{ success: boolean; visibility?: Record<string, boolean>; error?: string }> {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageContent");

    const visibility = await CmsSectionVisibilityService.getScopeVisibility(scopeType, scopeId);
    return { success: true, visibility };
  } catch (err: any) {
    return safeActionError(err, "Failed to retrieve section visibility", {
      module: "VISIBILITY",
      action: "getScopeVisibilityAction",
      scopeType,
      scopeId,
    });
  }
}
