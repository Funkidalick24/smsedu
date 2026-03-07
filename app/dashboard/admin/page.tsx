import DashboardLayout from "@/components/DashboardLayout";
import AdminDashboardClient from "@/components/AdminDashboardClient";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function AdminDashboard() {
  await requireDashboardRole("admin");
  return (
    <DashboardLayout role="admin">
      <h1 className="mb-6 text-3xl font-bold text-blue-950">Admin Dashboard</h1>
      <AdminDashboardClient />
    </DashboardLayout>
  );
}
