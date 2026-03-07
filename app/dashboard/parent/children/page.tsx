import DashboardLayout from "@/components/DashboardLayout";
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function ParentChildrenPage() {
  await requireDashboardRole("parent");
  return (
    <DashboardLayout role="parent">
      <ModulePlaceholder
        title="Children"
        description="Per-child profiles, grade summaries, and progress overviews will be managed here."
      />
    </DashboardLayout>
  );
}
