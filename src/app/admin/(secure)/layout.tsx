import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdminSession } from "@/server/auth/session";

export const metadata: Metadata = {
  title: {
    default: "Admin CMS Geeta University",
    template: "%s | Admin CMS Geeta University",
  },
  description: "Admin CMS Geeta University",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SecureAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return <AdminShell user={session.user}>{children}</AdminShell>;
}
