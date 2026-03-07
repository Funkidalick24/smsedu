import DashboardLayout from "@/components/DashboardLayout";
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function SuperAdminAccountsPage() {
  await requireDashboardRole("superadmin");
  return (
    <DashboardLayout role="superadmin">
      <ModulePlaceholder
        title="Admin Accounts"
        description="Admin user provisioning, privilege review, and account lifecycle operations will be available here."
      />
    </DashboardLayout>
  );
}
