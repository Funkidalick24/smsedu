import DashboardLayout from "@/components/DashboardLayout";
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function ParentAttendancePage() {
  await requireDashboardRole("parent");
  return (
    <DashboardLayout role="parent">
      <ModulePlaceholder
        title="Attendance"
        description="Daily attendance, absentee trends, and attendance alerts will be visible here."
      />
    </DashboardLayout>
  );
}
