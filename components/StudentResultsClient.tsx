"use client";

import { useEffect, useState } from "react";
import Table from "./Table";

interface ResultsPayload {
  ok: boolean;
  message?: string;
  results: Array<{
    term: string;
    subject: string;
    assessment: string;
    assessmentType: string;
    assessmentDate: string;
    score: number;
    maxScore: number;
    percent: number;
    gradeLetter: string;
    remarks: string;
  }>;
  subjectSummary: Array<{
    subject: string;
    averagePercent: number;
    totalAssessments: number;
  }>;
  termSummary: Array<{
    term: string;
    averagePercent: number;
    totalAssessments: number;
  }>;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-ZW", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function StudentResultsClient() {
  const [data, setData] = useState<ResultsPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/student/results", { cache: "no-store" });
        const payload = (await response.json()) as ResultsPayload;
        if (!response.ok || !payload.ok) {
          setError(payload.message ?? "Unable to load results.");
          return;
        }
        setData(payload);
      } catch {
        setError("Unable to load results.");
      }
    };
    void load();
  }, []);

  if (error) {
    return <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  }
  if (!data) {
    return <p className="text-sm text-slate-600">Loading results...</p>;
  }
  if (data.results.length === 0) {
    return <p className="rounded border border-blue-100 bg-blue-50 p-4 text-sm text-slate-600">No assessment results available yet.</p>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Term progress</h2>
          <div className="space-y-2">
            {data.termSummary.map((term) => (
              <div key={term.term} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <span className="font-medium text-slate-700">{term.term}</span>
                <span className="text-slate-600">
                  {term.averagePercent}% ({term.totalAssessments} assessments)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Subject averages</h2>
          <div className="space-y-2">
            {data.subjectSummary.map((subject) => (
              <div key={subject.subject} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <span className="font-medium text-slate-700">{subject.subject}</span>
                <span className="text-slate-600">
                  {subject.averagePercent}% ({subject.totalAssessments})
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Assessment history</h2>
        <Table
          columns={["Term", "Subject", "Assessment", "Type", "Date", "Score", "Grade"]}
          rows={data.results.map((result) => [
            result.term,
            result.subject,
            result.assessment,
            result.assessmentType,
            formatDate(result.assessmentDate),
            `${result.score}/${result.maxScore} (${result.percent}%)`,
            result.gradeLetter,
          ])}
        />
      </section>
    </div>
  );
}
