import DashboardLayout from "@/components/DashboardLayout";
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function SuperAdminThemeSettingsPage() {
  await requireDashboardRole("superadmin");
  return (
    <DashboardLayout role="superadmin">
      <ModulePlaceholder
        title="Theme Settings"
        description="Brand colors, typography tokens, and global appearance controls will be configured here."
      />
    </DashboardLayout>
  );
}
