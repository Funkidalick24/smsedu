import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import Table from "@/components/Table";
import { studentAssignments } from "@/lib/dashboardData";

export default function StudentDashboard() {
  return (
    <DashboardLayout role="student">
      <h1 className="mb-6 text-3xl font-bold text-blue-950">Student Dashboard</h1>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard title="Current GPA" value="3.79" trend="+0.10" />
        <StatCard title="Attendance" value="97%" trend="Excellent" />
        <StatCard title="Upcoming Deadlines" value="3" trend="Next due in 2 days" />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Assignments</h2>
        <Table
          columns={["Subject", "Title", "Due", "Status"]}
          rows={studentAssignments.map((assignment) => [
            assignment.subject,
            assignment.title,
            assignment.due,
            assignment.status,
          ])}
        />
      </section>
    </DashboardLayout>
  );
}
