"use client";

import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import Table from "./Table";

interface DashboardResponse {
  ok: boolean;
  stats: Array<{ title: string; value: string; trend: string }>;
  classroomSnapshot: Array<{
    className: string;
    students: number;
    attendancePct: number;
    status: string;
  }>;
  message?: string;
}

export default function AdminDashboardClient() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
      const payload = (await response.json()) as DashboardResponse;
      if (!response.ok || !payload.ok) {
        setError(payload.message ?? "Unable to load dashboard data.");
        return;
      }
      setData(payload);
    };
    void load();
  }, []);

  if (error) {
    return <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  }

  if (!data) {
    return <p className="text-sm text-slate-600">Loading admin metrics...</p>;
  }

  return (
    <>
      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} trend={stat.trend} />
        ))}
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Classroom health snapshot</h2>
        <Table
          columns={["Class", "Students", "Attendance", "Status"]}
          rows={data.classroomSnapshot.map((row) => [
            row.className,
            String(row.students),
            `${row.attendancePct}%`,
            row.status,
          ])}
        />
      </section>
    </>
  );
}
