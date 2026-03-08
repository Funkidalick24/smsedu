"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type HomeworkStatus = "pending" | "upcoming" | "overdue" | "submitted" | "resubmitted" | "late" | "graded";

interface HomeworkRow {
  assignmentId: number;
  subjectId: number;
  subject: string;
  className: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  allowResubmission: boolean;
  status: HomeworkStatus;
  submittedAt: string | null;
  score: number | null;
  feedback: string | null;
}

interface HomeworkPayload {
  ok: boolean;
  message?: string;
  homework: HomeworkRow[];
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-ZW", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusClass(status: HomeworkStatus) {
  if (status === "graded") return "bg-green-50 text-green-700 border-green-200";
  if (status === "submitted" || status === "resubmitted") return "bg-blue-50 text-blue-700 border-blue-200";
  if (status === "late" || status === "overdue") return "bg-red-50 text-red-700 border-red-200";
  if (status === "upcoming") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export default function StudentHomeworkClient() {
  const [rows, setRows] = useState<HomeworkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [activeAssignmentId, setActiveAssignmentId] = useState<number | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const loadHomework = async (status: string, subject: string) => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    params.set("status", status);
    if (subject !== "all") {
      params.set("subjectId", subject);
    }

    try {
      const response = await fetch(`/api/student/homework?${params.toString()}`, { cache: "no-store" });
      const payload = (await response.json()) as HomeworkPayload;
      if (!response.ok || !payload.ok) {
        setError(payload.message ?? "Unable to load homework.");
        setLoading(false);
        return;
      }
      setRows(payload.homework);
    } catch {
      setError("Unable to load homework.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadHomework(statusFilter, subjectFilter);
  }, [statusFilter, subjectFilter]);

  const subjectOptions = useMemo(() => {
    const map = new Map<number, string>();
    for (const row of rows) {
      map.set(row.subjectId, row.subject);
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [rows]);

  const activeRow = rows.find((row) => row.assignmentId === activeAssignmentId) ?? null;

  const canSubmit = (row: HomeworkRow) => {
    if (row.status === "pending" || row.status === "upcoming" || row.status === "overdue") {
      return true;
    }
    if ((row.status === "submitted" || row.status === "late" || row.status === "resubmitted") && row.allowResubmission) {
      return true;
    }
    return false;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeRow) {
      return;
    }
    setSubmitError("");
    setSubmitSuccess("");

    const response = await fetch(`/api/student/homework/${activeRow.assignmentId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionText,
        attachmentUrl,
      }),
    });
    const payload = (await response.json()) as { ok: boolean; message?: string };
    if (!response.ok || !payload.ok) {
      setSubmitError(payload.message ?? "Unable to submit assignment.");
      return;
    }

    setSubmitSuccess("Submission saved successfully.");
    setSubmissionText("");
    setAttachmentUrl("");
    await loadHomework(statusFilter, subjectFilter);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Filter by status</label>
            <select
              className="w-full rounded-lg border border-blue-200 px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="upcoming">Upcoming</option>
              <option value="overdue">Overdue</option>
              <option value="submitted">Submitted</option>
              <option value="resubmitted">Resubmitted</option>
              <option value="late">Late</option>
              <option value="graded">Graded</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Filter by subject</label>
            <select
              className="w-full rounded-lg border border-blue-200 px-3 py-2 text-sm"
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
            >
              <option value="all">All subjects</option>
              {subjectOptions.map((subject) => (
                <option key={subject.id} value={String(subject.id)}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error ? <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-600">Loading homework...</p> : null}

      {!loading && rows.length === 0 ? (
        <p className="rounded border border-blue-100 bg-blue-50 p-4 text-sm text-slate-600">No homework found for this filter.</p>
      ) : null}

      {!loading ? (
        <div className="space-y-3">
          {rows.map((row) => (
            <article key={row.assignmentId} className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-800">{row.title}</h2>
                  <p className="text-sm text-slate-500">
                    {row.subject} • {row.className}
                  </p>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(row.status)}`}>{row.status}</span>
              </div>

              <p className="text-sm text-slate-600">{row.description}</p>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                <span>Due: {formatDate(row.dueDate)}</span>
                <span>Max score: {row.maxScore}</span>
                <span>Submitted: {row.submittedAt ? formatDate(row.submittedAt) : "-"}</span>
                <span>Score: {row.score ?? "-"}</span>
              </div>
              {row.feedback ? <p className="mt-2 text-sm text-slate-600">Feedback: {row.feedback}</p> : null}

              {canSubmit(row) ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveAssignmentId(row.assignmentId);
                    setSubmitError("");
                    setSubmitSuccess("");
                  }}
                  className="mt-3 rounded-lg border border-blue-200 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-50"
                >
                  {row.submittedAt ? "Resubmit" : "Submit assignment"}
                </button>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}

      {activeRow ? (
        <section className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800">Submit: {activeRow.title}</h2>
          <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Submission text</label>
              <textarea
                className="h-28 w-full rounded-lg border border-blue-200 px-3 py-2 text-sm"
                value={submissionText}
                onChange={(event) => setSubmissionText(event.target.value)}
                placeholder="Add your answer, notes, or reflection..."
                required
                maxLength={2000}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Attachment URL (optional)</label>
              <input
                className="w-full rounded-lg border border-blue-200 px-3 py-2 text-sm"
                value={attachmentUrl}
                onChange={(event) => setAttachmentUrl(event.target.value)}
                placeholder="https://..."
              />
            </div>
            {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}
            {submitSuccess ? <p className="text-sm text-green-700">{submitSuccess}</p> : null}
            <div className="flex gap-2">
              <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800" type="submit">
                Submit
              </button>
              <button
                type="button"
                onClick={() => setActiveAssignmentId(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  );
}
