import DashboardLayout from "@/components/DashboardLayout";
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function StudentResultsPage() {
  await requireDashboardRole("student");
  return (
    <DashboardLayout role="student">
      <ModulePlaceholder
        title="Results"
        description="Assessment results, report cards, and academic trend details will appear here."
      />
    </DashboardLayout>
  );
}
