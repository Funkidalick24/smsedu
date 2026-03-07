import DashboardLayout from "@/components/DashboardLayout";
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function StudentHomeworkPage() {
  await requireDashboardRole("student");
  return (
    <DashboardLayout role="student">
      <ModulePlaceholder
        title="Homework"
        description="Homework tasks, due dates, and submission progress will be tracked in this section."
      />
    </DashboardLayout>
  );
}
