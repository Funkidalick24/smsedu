"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const PRESETS = ["#1d4ed8", "#0f766e", "#be123c", "#7c3aed", "#b45309"];

export default function SuperAdminThemeSettingsClient() {
  const { primaryColor, setPrimaryColor, resetPrimaryColor } = useTheme();
  const [draftColor, setDraftColor] = useState(primaryColor);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    setDraftColor(primaryColor);
  }, [primaryColor]);

  return (
    <section className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
      <h1 className="mb-2 text-2xl font-bold text-blue-950">Theme Settings</h1>
      <p className="mb-4 text-sm text-slate-600">
        Set a global accent color. The color persists in browser storage and is applied across dashboard shell elements.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setDraftColor(preset)}
            className="h-8 w-8 rounded-full border-2"
            style={{
              backgroundColor: preset,
              borderColor: draftColor.toLowerCase() === preset.toLowerCase() ? "#0f172a" : "transparent",
            }}
            title={`Use ${preset}`}
            aria-label={`Use color ${preset}`}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="color"
          value={draftColor}
          onChange={(event) => setDraftColor(event.target.value)}
          className="h-10 w-16 rounded border border-blue-200"
          aria-label="Choose primary theme color"
        />
        <input
          type="text"
          value={draftColor}
          onChange={(event) => setDraftColor(event.target.value)}
          className="w-40 rounded border border-blue-200 px-2 py-1 text-sm"
          aria-label="Theme color hex"
        />
        <button
          type="button"
          onClick={() => {
            setPrimaryColor(draftColor);
            setSaved("Theme updated.");
          }}
          className="rounded-lg px-4 py-2 text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Save Theme
        </button>
        <button
          type="button"
          onClick={() => {
            resetPrimaryColor();
            setSaved("Theme reset to default.");
          }}
          className="rounded-lg border px-4 py-2 text-sm"
          style={{ borderColor: "var(--color-border)", color: "var(--color-primary-strong)" }}
        >
          Reset
        </button>
      </div>

      {saved ? <p className="mt-3 text-sm text-slate-600">{saved}</p> : null}

      <div className="mt-5 rounded-lg border border-blue-100 p-4">
        <p className="text-sm font-medium text-slate-700">Preview</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="rounded px-3 py-1 text-sm text-white" style={{ backgroundColor: "var(--color-primary)" }}>
            Primary
          </span>
          <span className="rounded px-3 py-1 text-sm" style={{ backgroundColor: "var(--color-primary-soft)", color: "var(--color-primary-strong)" }}>
            Soft Accent
          </span>
          <span className="rounded border px-3 py-1 text-sm" style={{ borderColor: "var(--color-border)", color: "var(--color-primary-strong)" }}>
            Border Token
          </span>
        </div>
      </div>
    </section>
  );
}
