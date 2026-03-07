import DashboardLayout from "@/components/DashboardLayout";
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function StudentSubjectsPage() {
  await requireDashboardRole("student");
  return (
    <DashboardLayout role="student">
      <ModulePlaceholder
        title="Subjects"
        description="Subject timetables, learning resources, and instructor notes will be shown here."
      />
    </DashboardLayout>
  );
}
