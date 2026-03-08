import DashboardLayout from "@/components/DashboardLayout";
import StudentResultsClient from "@/components/StudentResultsClient";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function StudentResultsPage() {
  await requireDashboardRole("student");
  return (
    <DashboardLayout role="student">
      <h1 className="mb-6 text-3xl font-bold text-blue-950">Results</h1>
      <StudentResultsClient />
    </DashboardLayout>
  );
}
