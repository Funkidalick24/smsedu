"use client";

import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import Table from "./Table";

interface StudentDashboardPayload {
  ok: boolean;
  message?: string;
  stats: Array<{ title: string; value: string; trend: string }>;
  upcomingAssignments: Array<{
    id: number;
    subject: string;
    title: string;
    dueDate: string;
    status: string;
    submittedAt: string | null;
  }>;
  announcements: Array<{
    id: number;
    title: string;
    body: string;
    priority: "low" | "normal" | "high" | "urgent";
    publishedAt: string;
  }>;
  notifications: Array<{ label: string; value: number }>;
  calendar: Array<{
    id: number;
    title: string;
    date: string;
    type: "assignment" | "class";
    subject: string;
  }>;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-ZW", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function priorityClass(priority: StudentDashboardPayload["announcements"][number]["priority"]) {
  if (priority === "urgent") return "border-red-200 bg-red-50 text-red-700";
  if (priority === "high") return "border-amber-200 bg-amber-50 text-amber-700";
  if (priority === "low") return "border-green-200 bg-green-50 text-green-700";
  return "border-blue-200 bg-blue-50 text-blue-700";
}

export default function StudentDashboardClient() {
  const [data, setData] = useState<StudentDashboardPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/student/dashboard", { cache: "no-store" });
        const payload = (await response.json()) as StudentDashboardPayload;
        if (!response.ok || !payload.ok) {
          setError(payload.message ?? "Unable to load dashboard.");
          return;
        }
        setData(payload);
      } catch {
        setError("Unable to load dashboard.");
      }
    };
    void load();
  }, []);

  if (error) {
    return <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  }

  if (!data) {
    return <p className="text-sm text-slate-600">Loading student dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} trend={stat.trend} />
        ))}
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Assignment timeline</h2>
        <Table
          columns={["Subject", "Assignment", "Due", "Status", "Submitted"]}
          rows={data.upcomingAssignments.map((item) => [
            item.subject,
            item.title,
            formatDate(item.dueDate),
            item.status,
            item.submittedAt ? formatDate(item.submittedAt) : "-",
          ])}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Notifications</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {data.notifications.map((item) => (
              <div key={item.label} className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-blue-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Upcoming calendar</h2>
          <div className="space-y-2">
            {data.calendar.length === 0 ? <p className="text-sm text-slate-500">No upcoming events.</p> : null}
            {data.calendar.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 px-3 py-2">
                <p className="text-sm font-medium text-slate-700">{item.title}</p>
                <p className="text-xs text-slate-500">
                  {item.subject} • {formatDate(item.date)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-slate-800">School announcements</h2>
        <div className="space-y-3">
          {data.announcements.length === 0 ? <p className="text-sm text-slate-500">No announcements.</p> : null}
          {data.announcements.map((announcement) => (
            <article key={announcement.id} className="rounded-lg border border-slate-200 p-3">
              <div className="mb-1 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-800">{announcement.title}</h3>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${priorityClass(announcement.priority)}`}>
                  {announcement.priority}
                </span>
              </div>
              <p className="text-sm text-slate-600">{announcement.body}</p>
              <p className="mt-2 text-xs text-slate-400">{formatDate(announcement.publishedAt)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
