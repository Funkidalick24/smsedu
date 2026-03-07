import DashboardLayout from "@/components/DashboardLayout";
import Table from "@/components/Table";
import { listClasses } from "@/lib/server/adminRepository";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function AdminClassesPage() {
  await requireDashboardRole("admin");
  const classes = listClasses();

  return (
    <DashboardLayout role="admin">
      <h1 className="mb-6 text-3xl font-bold text-blue-950">Classes</h1>
      <Table
        columns={["Class", "Teacher", "Students", "Attendance (30 days)"]}
        rows={classes.map((classItem) => [
          classItem.className,
          classItem.teacherName,
          String(classItem.students),
          `${classItem.attendancePct}%`,
        ])}
      />
    </DashboardLayout>
  );
}
