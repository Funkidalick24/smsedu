import DashboardLayout from "@/components/DashboardLayout";
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function ParentMessagesPage() {
  await requireDashboardRole("parent");
  return (
    <DashboardLayout role="parent">
      <ModulePlaceholder
        title="Messages"
        description="Teacher announcements, school notices, and parent communication threads will appear here."
      />
    </DashboardLayout>
  );
}
