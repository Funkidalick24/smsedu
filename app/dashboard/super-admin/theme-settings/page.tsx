import DashboardLayout from "@/components/DashboardLayout";
import SuperAdminThemeSettingsClient from "@/components/SuperAdminThemeSettingsClient";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function SuperAdminThemeSettingsPage() {
  await requireDashboardRole("superadmin");
  return (
    <DashboardLayout role="superadmin">
      <SuperAdminThemeSettingsClient />
    </DashboardLayout>
  );
}
