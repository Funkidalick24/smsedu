"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import Table from "./Table";
import { superAdminChecks } from "@/lib/dashboardData";
import { useTheme } from "@/context/ThemeContext";

export default function SuperAdminDashboardClient() {
  const { primaryColor, setPrimaryColor, resetPrimaryColor } = useTheme();
  const [color, setColor] = useState(primaryColor);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setColor(primaryColor);
  }, [primaryColor]);

  const updateTheme = () => {
    setPrimaryColor(color);
    setMessage("Theme color updated.");
  };

  return (
    <DashboardLayout role="superadmin">
      <h1 className="mb-6 text-3xl font-bold text-blue-950">Super Admin Dashboard</h1>

      <section className="mb-6 rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-slate-800">Brand Theme Control</h2>
        <p className="mb-4 text-sm text-slate-600">
          Update the primary accent color used across the interface.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-16 rounded border border-blue-200"
            aria-label="Choose primary theme color"
          />
          <button
            onClick={updateTheme}
            className="rounded-lg px-4 py-2 text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Apply Theme
          </button>
          <button
            onClick={resetPrimaryColor}
            className="rounded-lg border px-4 py-2 text-sm"
            style={{ borderColor: "var(--color-border)", color: "var(--color-primary-strong)" }}
          >
            Reset Default
          </button>
        </div>
        {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">System health checks</h2>
        <Table
          columns={["Area", "State", "Details"]}
          rows={superAdminChecks.map((check) => [check.area, check.state, check.details])}
        />
      </section>
    </DashboardLayout>
  );
}
