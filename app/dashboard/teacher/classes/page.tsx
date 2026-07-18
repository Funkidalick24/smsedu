import DashboardLayout from "@/components/DashboardLayout";
import Table from "@/components/Table";
import { requireDashboardRole } from "@/lib/server/pageAuth";
import { getTeacherClasses } from "@/lib/server/moduleRepository";

export default async function TeacherClassesPage() {
  const user = await requireDashboardRole("teacher");
  const classes = getTeacherClasses(user.id);

  return (
    <DashboardLayout role="teacher">
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-primary-strong)" }}>
            My Classes
          </h1>
          <p className="mt-2 text-sm text-slate-600">Assigned classes, enrolment counts, and subject load from school records.</p>
        </div>
        <Table
          columns={["Class", "Level", "Term", "Students", "Subjects"]}
          rows={classes.map((item) => [item.className, item.gradeLevel, item.term, item.students, item.subjects])}
        />
        {classes.length === 0 ? <p className="text-sm text-slate-500">No classes are assigned to your teacher account yet.</p> : null}
      </section>
    </DashboardLayout>
  );
}
