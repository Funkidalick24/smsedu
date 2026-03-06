"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Table from "@/components/Table";
import { superAdminChecks } from "@/lib/dashboardData";

export default function SuperAdminDashboard() {
  const [color, setColor] = useState("#1d4ed8");

  const updateTheme = () => {
    document.documentElement.style.setProperty("--color-primary", color);
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
            className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
          >
            Apply Theme
          </button>
        </div>
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
