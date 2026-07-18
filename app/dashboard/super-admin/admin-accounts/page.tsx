import DashboardLayout from "@/components/DashboardLayout";
import Table from "@/components/Table";
import { requireDashboardRole } from "@/lib/server/pageAuth";
import { getSuperAdminAccounts } from "@/lib/server/moduleRepository";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-ZW", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function SuperAdminAccountsPage() {
  await requireDashboardRole("superadmin");
  const accounts = getSuperAdminAccounts();

  return (
    <DashboardLayout role="superadmin">
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-primary-strong)" }}>
            Admin Accounts
          </h1>
          <p className="mt-2 text-sm text-slate-600">Platform and school leadership accounts with tenant association and status.</p>
        </div>
        <Table
          columns={["Name", "Email", "Role", "School", "Status", "Created"]}
          rows={accounts.map((account) => [
            account.name,
            account.email,
            account.role,
            account.school,
            account.status,
            formatDate(account.createdAt),
          ])}
        />
      </section>
    </DashboardLayout>
  );
}
