import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import Table from "@/components/Table";
import { adminStats } from "@/lib/dashboardData";

const adminRows = [
  ["Grade 10-A", "32", "98%", "On track"],
  ["Grade 9-B", "29", "96%", "On track"],
  ["Grade 8-C", "31", "93%", "Needs intervention"],
];

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <h1 className="mb-6 text-3xl font-bold text-blue-950">Admin Dashboard</h1>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} trend={stat.trend} />
        ))}
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Classroom health snapshot</h2>
        <Table
          columns={["Class", "Students", "Attendance", "Status"]}
          rows={adminRows}
        />
      </section>
    </DashboardLayout>
  );
}
