import DashboardLayout from "@/components/DashboardLayout";
import Table from "@/components/Table";
import { listAttendanceSummary } from "@/lib/server/adminRepository";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function AdminAttendancePage() {
  await requireDashboardRole("admin");
  const summary = listAttendanceSummary(30);

  return (
    <DashboardLayout role="admin">
      <h1 className="mb-6 text-3xl font-bold text-blue-950">Attendance</h1>
      <Table
        columns={["Date", "Class", "Attendance"]}
        rows={summary.map((row) => [row.date, row.className, `${row.attendancePct}%`])}
      />
    </DashboardLayout>
  );
}
