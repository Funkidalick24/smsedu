import DashboardLayout from "@/components/DashboardLayout";
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function TeacherClassesPage() {
  await requireDashboardRole("teacher");
  return (
    <DashboardLayout role="teacher">
      <ModulePlaceholder
        title="My Classes"
        description="Class-specific planning, roster details, and classroom updates will appear here."
      />
    </DashboardLayout>
  );
}
