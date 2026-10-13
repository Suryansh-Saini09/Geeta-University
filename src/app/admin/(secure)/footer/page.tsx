import { notFound } from "next/navigation";
import { hasPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import {
  getFooterMediaDocuments,
  getFooterOverview,
  getFooterSettings,
} from "@/server/services/footer";
import FooterCmsDashboard from "@/features/admin/footer/components/FooterCmsDashboard";

export const metadata = {
  title: "Footer CMS | Admin Portal | Geeta University",
  description: "Manage site-wide footer branding, admissions banner, 4 link columns, institutional documents, and legal bar.",
};

export default async function FooterAdminPage() {
  const session = await requireAdminSession();

  if (!hasPermission(session.user.role, "manageContent")) {
    notFound();
  }

  const [settings, overview, documents] = await Promise.all([
    getFooterSettings(),
    getFooterOverview(),
    getFooterMediaDocuments(50),
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <FooterCmsDashboard
        initialSettings={settings}
        overview={overview}
        initialDocuments={documents}
        userRole={session.user.role}
      />
    </div>
  );
}
