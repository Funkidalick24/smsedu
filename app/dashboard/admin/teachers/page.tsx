import DashboardLayout from "@/components/DashboardLayout";
import AdminTeachersClient from "@/components/AdminTeachersClient";
import { listClassOptions, listSubjectOptions, listTeachers } from "@/lib/server/adminRepository";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function AdminTeachersPage() {
  await requireDashboardRole("admin");
  const teachers = listTeachers();
  const classes = listClassOptions();
  const subjects = listSubjectOptions();

  return (
    <DashboardLayout role="admin">
      <h1 className="mb-6 text-3xl font-bold text-blue-950">Teachers</h1>
      <AdminTeachersClient
        initialTeachers={teachers}
        initialClasses={classes}
        initialSubjects={subjects}
      />
    </DashboardLayout>
  );
}
