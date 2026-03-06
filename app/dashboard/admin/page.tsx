import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Students" value="850" />
        <StatCard title="Teachers" value="45" />
        <StatCard title="Classes" value="22" />
        <StatCard title="Attendance" value="94%" />
      </div>
    </DashboardLayout>
  );
}
