"use client";

import { FormEvent, useEffect, useState } from "react";
import Table from "./Table";

interface School {
  id: number;
  name: string;
  code: string;
  level: string;
  district: string;
  province: string;
  status: string;
  createdAt: string;
  leaderName: string;
  leaderEmail: string;
  leaderTitle: "principal" | "headmaster" | "-";
}

interface SchoolsPayload {
  ok: boolean;
  message?: string;
  schools: School[];
}

interface CreateSchoolResponse extends SchoolsPayload {
  schoolId?: number;
  leaderUserId?: number;
  leaderEmail?: string;
  temporaryPassword?: string;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-ZW", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function SuperAdminSchoolsClient() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [showRequiredHighlights, setShowRequiredHighlights] = useState(false);
  const [form, setForm] = useState({
    schoolName: "",
    schoolCode: "",
    level: "Primary",
    district: "",
    province: "",
    address: "",
    phone: "",
    schoolEmail: "",
    leaderTitle: "principal",
    leaderFullName: "",
    leaderEmail: "",
    leaderPhone: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/super-admin/schools", { cache: "no-store" });
        const payload = (await response.json()) as SchoolsPayload;
        if (!response.ok || !payload.ok) {
          setError(payload.message ?? "Unable to load schools.");
          return;
        }
        setSchools(payload.schools);
      } catch {
        setError("Unable to load schools.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setCredentials(null);
    setShowRequiredHighlights(true);

    if (!form.schoolName.trim() || !form.schoolCode.trim() || !form.leaderFullName.trim() || !form.leaderEmail.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    const response = await fetch("/api/super-admin/schools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const payload = (await response.json()) as CreateSchoolResponse;
    if (!response.ok || !payload.ok) {
      setError(payload.message ?? "Unable to create school.");
      return;
    }

    setSchools(payload.schools ?? []);
    setSuccess("School and leader account created successfully.");
    setShowRequiredHighlights(false);
    if (payload.leaderEmail && payload.temporaryPassword) {
      setCredentials({ email: payload.leaderEmail, password: payload.temporaryPassword });
    }
    setForm((prev) => ({
      ...prev,
      schoolName: "",
      schoolCode: "",
      district: "",
      province: "",
      address: "",
      phone: "",
      schoolEmail: "",
      leaderFullName: "",
      leaderEmail: "",
      leaderPhone: "",
    }));
  };

  const requiredClass = (missing: boolean) =>
    `w-full rounded border px-3 py-2 text-sm ${
      showRequiredHighlights && missing ? "border-red-500 bg-red-50" : "border-blue-200"
    }`;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-blue-950">Schools</h1>
        <p className="mb-4 text-sm text-slate-600">
          Create a school and immediately provision a principal or headmaster account that can log in.
        </p>
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">School name *</label>
            <input
              className={requiredClass(!form.schoolName.trim())}
              value={form.schoolName}
              onChange={(event) => setForm((prev) => ({ ...prev, schoolName: event.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">School code *</label>
            <input
              className={requiredClass(!form.schoolCode.trim())}
              value={form.schoolCode}
              onChange={(event) => setForm((prev) => ({ ...prev, schoolCode: event.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">School level</label>
            <select
              className="w-full rounded border border-blue-200 px-3 py-2 text-sm"
              value={form.level}
              onChange={(event) => setForm((prev) => ({ ...prev, level: event.target.value }))}
            >
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
              <option value="Combined">Combined</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">District</label>
            <input
              className="w-full rounded border border-blue-200 px-3 py-2 text-sm"
              value={form.district}
              onChange={(event) => setForm((prev) => ({ ...prev, district: event.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Province</label>
            <input
              className="w-full rounded border border-blue-200 px-3 py-2 text-sm"
              value={form.province}
              onChange={(event) => setForm((prev) => ({ ...prev, province: event.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">School email</label>
            <input
              className="w-full rounded border border-blue-200 px-3 py-2 text-sm"
              value={form.schoolEmail}
              onChange={(event) => setForm((prev) => ({ ...prev, schoolEmail: event.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Leader role</label>
            <select
              className="w-full rounded border border-blue-200 px-3 py-2 text-sm"
              value={form.leaderTitle}
              onChange={(event) => setForm((prev) => ({ ...prev, leaderTitle: event.target.value }))}
            >
              <option value="principal">Principal</option>
              <option value="headmaster">Headmaster</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Leader full name *</label>
            <input
              className={requiredClass(!form.leaderFullName.trim())}
              value={form.leaderFullName}
              onChange={(event) => setForm((prev) => ({ ...prev, leaderFullName: event.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Leader email *</label>
            <input
              className={requiredClass(!form.leaderEmail.trim())}
              value={form.leaderEmail}
              onChange={(event) => setForm((prev) => ({ ...prev, leaderEmail: event.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Leader phone (optional)</label>
            <input
              className="w-full rounded border border-blue-200 px-3 py-2 text-sm"
              value={form.leaderPhone}
              onChange={(event) => setForm((prev) => ({ ...prev, leaderPhone: event.target.value }))}
            />
          </div>
          <button
            className="rounded px-4 py-2 text-sm font-medium text-white md:col-span-2"
            style={{ backgroundColor: "var(--color-primary)" }}
            type="submit"
          >
            Create School and Leader Account
          </button>
        </form>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        {success ? <p className="mt-3 text-sm text-green-700">{success}</p> : null}
        {credentials ? (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <p className="font-semibold">New login credentials</p>
            <p>Email: {credentials.email}</p>
            <p>Temporary password: {credentials.password}</p>
          </div>
        ) : null}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Registered schools</h2>
        {loading ? <p className="text-sm text-slate-600">Loading schools...</p> : null}
        {!loading ? (
          <Table
            columns={["School", "Code", "Level", "District/Province", "Leader", "Role", "Created"]}
            rows={schools.map((school) => [
              school.name,
              school.code,
              school.level,
              `${school.district || "-"} / ${school.province || "-"}`,
              `${school.leaderName} (${school.leaderEmail})`,
              school.leaderTitle,
              formatDate(school.createdAt),
            ])}
          />
        ) : null}
      </section>
    </div>
  );
}
