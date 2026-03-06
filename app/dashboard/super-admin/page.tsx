"use client";

import { useState } from "react";

export default function SuperAdminDashboard() {
  const [color, setColor] = useState("#2563eb");

  const updateTheme = () => {
    document.documentElement.style.setProperty("--primary-color", color);
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Theme Settings</h1>

      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      <button
        onClick={updateTheme}
        className="ml-4 rounded bg-blue-600 px-4 py-2 text-white"
      >
        Apply Theme
      </button>
    </div>
  );
}
