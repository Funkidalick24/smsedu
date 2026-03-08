import DashboardLayout from "@/components/DashboardLayout";
import StudentHomeworkClient from "@/components/StudentHomeworkClient";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function StudentHomeworkPage() {
  await requireDashboardRole("student");
  return (
    <DashboardLayout role="student">
      <h1 className="mb-6 text-3xl font-bold text-blue-950">Homework</h1>
      <StudentHomeworkClient />
    </DashboardLayout>
  );
}
