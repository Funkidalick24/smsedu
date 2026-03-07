import SuperAdminDashboardClient from "@/components/SuperAdminDashboardClient";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function SuperAdminDashboard() {
  await requireDashboardRole("superadmin");
  return <SuperAdminDashboardClient />;
}
