import DashboardLayout from "@/components/DashboardLayout";
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function HeadmasterDashboardPage() {
  await requireDashboardRole("headmaster");
  return (
    <DashboardLayout role="headmaster">
      <ModulePlaceholder
        title="Headmaster Dashboard"
        description="Welcome. School oversight, governance checks, and operational controls can be managed from this workspace."
      />
    </DashboardLayout>
  );
}
