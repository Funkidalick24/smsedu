"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

interface ThemeContextType {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  resetPrimaryColor: () => void;
}

const DEFAULT_PRIMARY = "#1d4ed8";
const STORAGE_KEY = "smsedu-theme-primary";
const ThemeContext = createContext<ThemeContextType | null>(null);

function clamp(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return null;
  }
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${clamp(r).toString(16).padStart(2, "0")}${clamp(g).toString(16).padStart(2, "0")}${clamp(b)
    .toString(16)
    .padStart(2, "0")}`;
}

function mix(hex: string, mixHex: string, weight: number) {
  const base = hexToRgb(hex);
  const target = hexToRgb(mixHex);
  if (!base || !target) {
    return hex;
  }
  const w = Math.max(0, Math.min(1, weight));
  return rgbToHex(
    base.r * (1 - w) + target.r * w,
    base.g * (1 - w) + target.g * w,
    base.b * (1 - w) + target.b * w,
  );
}

function applyTheme(primaryHex: string) {
  const root = document.documentElement;
  const primary = hexToRgb(primaryHex) ? primaryHex : DEFAULT_PRIMARY;
  root.style.setProperty("--color-primary", primary);
  root.style.setProperty("--color-primary-strong", mix(primary, "#000000", 0.18));
  root.style.setProperty("--color-primary-soft", mix(primary, "#ffffff", 0.82));
  root.style.setProperty("--color-secondary", mix(primary, "#22d3ee", 0.22));
  root.style.setProperty("--color-background", mix(primary, "#ffffff", 0.92));
  root.style.setProperty("--color-border", mix(primary, "#ffffff", 0.7));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [primaryColor, setPrimaryColorState] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_PRIMARY;
    }
    const stored = localStorage.getItem(STORAGE_KEY) ?? DEFAULT_PRIMARY;
    return hexToRgb(stored) ? stored : DEFAULT_PRIMARY;
  });

  useEffect(() => {
    applyTheme(primaryColor);
  }, [primaryColor]);

  const setPrimaryColor = (color: string) => {
    const next = hexToRgb(color) ? color : DEFAULT_PRIMARY;
    setPrimaryColorState(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  const resetPrimaryColor = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPrimaryColorState(DEFAULT_PRIMARY);
    applyTheme(DEFAULT_PRIMARY);
  };

  const value = useMemo(
    () => ({
      primaryColor,
      setPrimaryColor,
      resetPrimaryColor,
    }),
    [primaryColor],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
