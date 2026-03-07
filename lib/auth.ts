export type Role = "admin" | "teacher" | "student" | "parent" | "superadmin";

export interface AuthUser {
  id: number;
  name: string;
  role: Role;
  email: string;
}

export function roleToDashboardPath(role: Role) {
  return role === "superadmin" ? "/dashboard/super-admin" : `/dashboard/${role}`;
}
