"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type Role = "admin" | "teacher" | "student" | "parent" | "superadmin";

interface User {
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string) => {
    // mock login
    if (email === "admin@test.com") {
      setUser({ name: "Admin", role: "admin" });
    }

    if (email === "teacher@test.com") {
      setUser({ name: "Teacher", role: "teacher" });
    }

    if (email === "student@test.com") {
      setUser({ name: "Student", role: "student" });
    }

    if (email === "parent@test.com") {
      setUser({ name: "Parent", role: "parent" });
    }

    if (email === "super@test.com") {
      setUser({ name: "Super Admin", role: "superadmin" });
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
