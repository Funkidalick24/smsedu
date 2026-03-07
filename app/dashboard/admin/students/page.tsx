import DashboardLayout from "@/components/DashboardLayout";
import AdminStudentsClient from "@/components/AdminStudentsClient";
import { listClassOptions, listStudents } from "@/lib/server/adminRepository";
import { requireDashboardRole } from "@/lib/server/pageAuth";

export default async function AdminStudentsPage() {
  await requireDashboardRole("admin");
  const students = listStudents();
  const classes = listClassOptions();

  return (
    <DashboardLayout role="admin">
      <h1 className="mb-6 text-3xl font-bold text-blue-950">Students</h1>
      <AdminStudentsClient initialStudents={students} initialClasses={classes} />
    </DashboardLayout>
  );
}
