import { redirect } from "next/navigation";
import { requireAdminSession } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminMedalPolicyLegacyRedirect() {
  await requireAdminSession();
  redirect("/admin/pages/institutional?page=medal-policy");
}
