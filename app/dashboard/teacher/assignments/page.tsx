import DashboardLayout from "@/components/DashboardLayout";
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function TeacherAssignmentsPage() {
  await requireDashboardRole("teacher");
  return (
    <DashboardLayout role="teacher">
      <ModulePlaceholder
        title="Assignments"
        description="Assignment creation, grading queue, and submission status will be managed in this module."
      />
    </DashboardLayout>
  );
}
