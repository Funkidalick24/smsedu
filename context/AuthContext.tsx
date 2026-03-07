"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthUser } from "@/lib/auth";

interface LoginResult {
  ok: boolean;
  message?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isHydrating: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const data = (await response.json()) as { user: AuthUser | null };
        setUser(data.user ?? null);
      } finally {
        setIsHydrating(false);
      }
    };
    void hydrate();
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = (await response.json()) as { ok: boolean; message?: string; user?: AuthUser };
    if (!result.ok || !result.user) {
      return { ok: false, message: result.message ?? "Unable to login." };
    }

    setUser(result.user);
    return { ok: true };
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isHydrating, login, logout }),
    [user, isHydrating],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
