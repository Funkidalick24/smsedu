import DashboardLayout from "@/components/DashboardLayout";
import AdminClassesClient from "@/components/AdminClassesClient";
import { listClasses, listSubjectOptions, listTeacherOptions } from "@/lib/server/adminRepository";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function AdminClassesPage() {
  await requireDashboardRole("admin");
  const classes = listClasses();
  const teachers = listTeacherOptions();
  const subjects = listSubjectOptions();

  return (
    <DashboardLayout role="admin">
      <h1 className="mb-6 text-3xl font-bold text-blue-950">Classes</h1>
      <AdminClassesClient
        initialClasses={classes}
        initialTeachers={teachers}
        initialSubjects={subjects}
      />
    </DashboardLayout>
  );
}
