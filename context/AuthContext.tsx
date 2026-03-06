"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authenticate, User } from "@/lib/auth";

interface LoginResult {
  ok: boolean;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  isHydrating: boolean;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
}

const AUTH_STORAGE_KEY = "smsedu-user";
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        setUser(JSON.parse(raw) as User);
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsHydrating(false);
    }
  }, []);

  const login = (email: string, password: string): LoginResult => {
    const authenticatedUser = authenticate(email, password);
    if (!authenticatedUser) {
      return {
        ok: false,
        message:
          "Invalid credentials. Use one of the demo accounts shown on the login screen.",
      };
    }

    setUser(authenticatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
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
