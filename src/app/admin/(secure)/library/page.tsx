import { redirect } from "next/navigation";
import { requireAdminSession } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminLibraryLegacyRedirect() {
  await requireAdminSession();
  redirect("/admin/pages/institutional?page=library");
}
