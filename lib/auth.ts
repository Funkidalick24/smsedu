export type Role = "admin" | "teacher" | "student" | "parent" | "superadmin" | "principal" | "headmaster";

export interface AuthUser {
  id: number;
  name: string;
  role: Role;
  email: string;
}

export function roleToDashboardPath(role: Role) {
  if (role === "superadmin") {
    return "/dashboard/super-admin";
  }
  return `/dashboard/${role}`;
}
