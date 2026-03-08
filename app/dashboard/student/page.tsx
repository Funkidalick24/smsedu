import DashboardLayout from "@/components/DashboardLayout";
import StudentDashboardClient from "@/components/StudentDashboardClient";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function StudentDashboard() {
  await requireDashboardRole("student");
  return (
    <DashboardLayout role="student">
      <h1 className="mb-6 text-3xl font-bold text-blue-950">Student Dashboard</h1>
      <StudentDashboardClient />
    </DashboardLayout>
  );
}
