import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import Table from "@/components/Table";
import { parentChildren } from "@/lib/dashboardData";

export default function ParentDashboard() {
  return (
    <DashboardLayout role="parent">
      <h1 className="mb-6 text-3xl font-bold text-blue-950">Parent Dashboard</h1>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard title="Children Enrolled" value="2" />
        <StatCard title="Average Attendance" value="96%" trend="Stable" />
        <StatCard title="Unread Messages" value="4" trend="2 new today" />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Student overview</h2>
        <Table
          columns={["Name", "Grade", "Attendance", "Performance"]}
          rows={parentChildren.map((child) => [
            child.name,
            child.grade,
            child.attendance,
            child.performance,
          ])}
        />
      </section>
    </DashboardLayout>
  );
}
