export type Role = "admin" | "teacher" | "student" | "parent" | "superadmin";

export interface User {
  name: string;
  role: Role;
  email: string;
}

export const demoUsers: Record<string, { password: string; user: User }> = {
  "admin@test.com": {
    password: "admin123",
    user: { name: "Ariana Admin", role: "admin", email: "admin@test.com" },
  },
  "teacher@test.com": {
    password: "teacher123",
    user: {
      name: "Theo Teacher",
      role: "teacher",
      email: "teacher@test.com",
    },
  },
  "student@test.com": {
    password: "student123",
    user: {
      name: "Sofia Student",
      role: "student",
      email: "student@test.com",
    },
  },
  "parent@test.com": {
    password: "parent123",
    user: { name: "Priya Parent", role: "parent", email: "parent@test.com" },
  },
  "super@test.com": {
    password: "super123",
    user: {
      name: "Sam Super Admin",
      role: "superadmin",
      email: "super@test.com",
    },
  },
};

export function authenticate(email: string, password: string): User | null {
  const record = demoUsers[email.toLowerCase().trim()];
  if (!record || record.password !== password) {
    return null;
  }

  return record.user;
}

export function roleToDashboardPath(role: Role) {
  return role === "superadmin" ? "/dashboard/super-admin" : `/dashboard/${role}`;
}
