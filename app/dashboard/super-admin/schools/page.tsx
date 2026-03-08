import DashboardLayout from "@/components/DashboardLayout";
import SuperAdminSchoolsClient from "@/components/SuperAdminSchoolsClient";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function SuperAdminSchoolsPage() {
  await requireDashboardRole("superadmin");
  return (
    <DashboardLayout role="superadmin">
      <SuperAdminSchoolsClient />
    </DashboardLayout>
  );
}
