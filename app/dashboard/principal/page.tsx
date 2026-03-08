import DashboardLayout from "@/components/DashboardLayout";
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function PrincipalDashboardPage() {
  await requireDashboardRole("principal");
  return (
    <DashboardLayout role="principal">
      <ModulePlaceholder
        title="Principal Dashboard"
        description="Welcome. School-level operations, staffing, and performance tools can be managed from this workspace."
      />
    </DashboardLayout>
  );
}
