import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import Table from "@/components/Table";
import { teacherTasks } from "@/lib/dashboardData";

export default function TeacherDashboard() {
  return (
    <DashboardLayout role="teacher">
      <h1 className="mb-6 text-3xl font-bold text-blue-950">Teacher Dashboard</h1>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard title="Classes Today" value="5" trend="1 starts in 35m" />
        <StatCard title="Assignments Pending" value="37" trend="-8 from yesterday" />
        <StatCard title="Attendance" value="96.1%" trend="+1.1%" />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Priority tasks</h2>
        <Table
          columns={["Task", "Due", "Priority"]}
          rows={teacherTasks.map((task) => [task.task, task.due, task.priority])}
        />
      </section>
    </DashboardLayout>
  );
}
