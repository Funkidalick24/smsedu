import DashboardLayout from "@/components/DashboardLayout";
import StudentSubjectsClient from "@/components/StudentSubjectsClient";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function StudentSubjectsPage() {
  await requireDashboardRole("student");
  return (
    <DashboardLayout role="student">
      <h1 className="mb-6 text-3xl font-bold text-blue-950">Subjects</h1>
      <StudentSubjectsClient />
    </DashboardLayout>
  );
}
