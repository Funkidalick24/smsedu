import DashboardLayout from "@/components/DashboardLayout";
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function SuperAdminSchoolsPage() {
  await requireDashboardRole("superadmin");
  return (
    <DashboardLayout role="superadmin">
      <ModulePlaceholder
        title="Schools"
        description="Multi-school setup, school-level configuration, and operational metadata will be managed here."
      />
    </DashboardLayout>
  );
}
