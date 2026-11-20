import { getScholarshipAdminData } from "@/server/services/scholarshipPredictor";
import { ScholarshipCmsDashboard } from "@/features/admin/scholarship/components/ScholarshipCmsDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Scholarship Predictor & Fee Management | Admin Dashboard",
  description:
    "Manage academic fee schedules, tuition vs development fee breakdown, scholarship rules, subcategories, percentage slabs, and predictor settings.",
};

interface AdminScholarshipPredictorPageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function AdminScholarshipPredictorPage({
  searchParams,
}: AdminScholarshipPredictorPageProps) {
  const { tab } = await searchParams;

  const data = await getScholarshipAdminData();

  return (
    <ScholarshipCmsDashboard
      initialTab={tab || "overview"}
      schedules={data.schedules}
      programFees={data.programFees}
      rules={data.rules}
      charges={data.charges}
      faqs={data.faqs}
      settings={data.settings}
      predictorData={data.predictorData}
    />
  );
}
