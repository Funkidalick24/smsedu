import DashboardLayout from "@/components/DashboardLayout";
import Table from "@/components/Table";
import { requireDashboardRole } from "@/lib/server/pageAuth";
import { getTeacherGrades } from "@/lib/server/moduleRepository";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-ZW", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function TeacherGradesPage() {
  const user = await requireDashboardRole("teacher");
  const grades = getTeacherGrades(user.id);

  return (
    <DashboardLayout role="teacher">
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-primary-strong)" }}>
            Grades
          </h1>
          <p className="mt-2 text-sm text-slate-600">Assessment results and class averages for assigned classes.</p>
        </div>
        <Table
          columns={["Assessment", "Class", "Subject", "Type", "Date", "Average", "Marked"]}
          rows={grades.map((item) => [
            item.title,
            item.className,
            item.subject,
            item.type,
            formatDate(item.assessmentDate),
            item.averagePct === null ? "-" : `${item.averagePct}%`,
            item.gradedCount,
          ])}
        />
        {grades.length === 0 ? <p className="text-sm text-slate-500">No graded assessments are available yet.</p> : null}
      </section>
    </DashboardLayout>
  );
}
