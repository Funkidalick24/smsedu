"use client";

import { useEffect, useState } from "react";

interface StudentSubjectPayload {
  ok: boolean;
  message?: string;
  subjects: Array<{
    subjectId: number;
    subject: string;
    className: string;
    teacherName: string;
    attendancePct: number;
    pendingAssignments: number;
    resources: Array<{
      id: number;
      title: string;
      resourceType: string;
      resourceUrl: string;
      description: string;
      postedAt: string;
    }>;
    schedule: Array<{
      dayOfWeek: string;
      periodNumber: number;
      room: string;
    }>;
  }>;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-ZW", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function StudentSubjectsClient() {
  const [data, setData] = useState<StudentSubjectPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/student/subjects", { cache: "no-store" });
        const payload = (await response.json()) as StudentSubjectPayload;
        if (!response.ok || !payload.ok) {
          setError(payload.message ?? "Unable to load subjects.");
          return;
        }
        setData(payload);
      } catch {
        setError("Unable to load subjects.");
      }
    };
    void load();
  }, []);

  if (error) {
    return <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  }
  if (!data) {
    return <p className="text-sm text-slate-600">Loading subjects...</p>;
  }
  if (data.subjects.length === 0) {
    return <p className="rounded border border-blue-100 bg-blue-50 p-4 text-sm text-slate-600">No enrolled subjects found.</p>;
  }

  return (
    <div className="space-y-4">
      {data.subjects.map((subject) => (
        <section key={`${subject.subjectId}-${subject.className}`} className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">{subject.subject}</h2>
              <p className="text-sm text-slate-500">
                {subject.className} • {subject.teacherName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                Attendance {subject.attendancePct}%
              </span>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                Pending {subject.pendingAssignments}
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">Learning resources</h3>
              <div className="space-y-2">
                {subject.resources.length === 0 ? (
                  <p className="text-sm text-slate-500">No resources posted yet.</p>
                ) : (
                  subject.resources.map((resource) => (
                    <article key={resource.id} className="rounded-lg border border-slate-200 p-3">
                      <p className="text-sm font-medium text-slate-700">{resource.title}</p>
                      <p className="text-xs text-slate-500">
                        {resource.resourceType} • {formatDate(resource.postedAt)}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{resource.description}</p>
                      {resource.resourceUrl ? (
                        <a
                          href={resource.resourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block text-xs font-medium text-blue-700 hover:underline"
                        >
                          Open resource
                        </a>
                      ) : null}
                    </article>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">Timetable</h3>
              <div className="space-y-2">
                {subject.schedule.length === 0 ? (
                  <p className="text-sm text-slate-500">No timetable slots configured.</p>
                ) : (
                  subject.schedule.map((slot) => (
                    <div key={`${slot.dayOfWeek}-${slot.periodNumber}`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
                      {slot.dayOfWeek} • Period {slot.periodNumber} • Room {slot.room}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
