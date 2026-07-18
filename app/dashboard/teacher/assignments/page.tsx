import DashboardLayout from "@/components/DashboardLayout";
import Table from "@/components/Table";
import { requireDashboardRole } from "@/lib/server/pageAuth";
import { getTeacherAssignments } from "@/lib/server/moduleRepository";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-ZW", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function TeacherAssignmentsPage() {
  const user = await requireDashboardRole("teacher");
  const assignments = getTeacherAssignments(user.id);

  return (
    <DashboardLayout role="teacher">
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-primary-strong)" }}>
            Assignments
          </h1>
          <p className="mt-2 text-sm text-slate-600">Published assignment workload, due dates, and grading progress.</p>
        </div>
        <Table
          columns={["Assignment", "Class", "Subject", "Due", "Status", "Submissions", "Graded"]}
          rows={assignments.map((item) => [
            item.title,
            item.className,
            item.subject,
            formatDate(item.dueDate),
            item.status,
            item.submissions,
            item.graded,
          ])}
        />
        {assignments.length === 0 ? <p className="text-sm text-slate-500">No assignments are available for your account.</p> : null}
      </section>
    </DashboardLayout>
  );
}
