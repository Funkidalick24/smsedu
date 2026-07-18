import DashboardLayout from "@/components/DashboardLayout";
import Table from "@/components/Table";
import { requireDashboardRole } from "@/lib/server/pageAuth";
import { getParentChildren } from "@/lib/server/moduleRepository";

export default async function ParentChildrenPage() {
  await requireDashboardRole("parent");
  const children = getParentChildren();

  return (
    <DashboardLayout role="parent">
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-primary-strong)" }}>
            Children
          </h1>
          <p className="mt-2 text-sm text-slate-600">Linked learner profiles with class enrolment and recent attendance health.</p>
        </div>
        <Table
          columns={["Learner", "Admission #", "Grade", "Classes", "Attendance"]}
          rows={children.map((child) => [
            child.name,
            child.admissionNo,
            child.gradeLevel,
            child.classes,
            child.attendancePct === null ? "-" : `${child.attendancePct}%`,
          ])}
        />
        {children.length === 0 ? <p className="text-sm text-slate-500">No linked children are available for this account.</p> : null}
      </section>
    </DashboardLayout>
  );
}
