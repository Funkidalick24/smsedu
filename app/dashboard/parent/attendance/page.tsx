import DashboardLayout from "@/components/DashboardLayout";
import Table from "@/components/Table";
import { requireDashboardRole } from "@/lib/server/pageAuth";
import { getParentChildren } from "@/lib/server/moduleRepository";

export default async function ParentAttendancePage() {
  await requireDashboardRole("parent");
  const children = getParentChildren();

  return (
    <DashboardLayout role="parent">
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-primary-strong)" }}>
            Attendance
          </h1>
          <p className="mt-2 text-sm text-slate-600">Attendance summaries for linked learners based on recorded class attendance.</p>
        </div>
        <Table
          columns={["Learner", "Grade", "Attendance", "Status"]}
          rows={children.map((child) => {
            const pct = child.attendancePct ?? 0;
            return [child.name, child.gradeLevel, child.attendancePct === null ? "-" : `${pct}%`, pct >= 90 ? "On track" : "Needs follow-up"];
          })}
        />
      </section>
    </DashboardLayout>
  );
}
