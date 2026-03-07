import DashboardLayout from "@/components/DashboardLayout";
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function TeacherGradesPage() {
  await requireDashboardRole("teacher");
  return (
    <DashboardLayout role="teacher">
      <ModulePlaceholder
        title="Grades"
        description="Gradebook operations and term performance analytics will be available here."
      />
    </DashboardLayout>
  );
}
