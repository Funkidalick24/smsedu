export type Role = "admin" | "teacher" | "student" | "parent" | "superadmin" | "principal" | "headmaster";

export interface AuthUser {
  id: number;
  name: string;
  role: Role;
  email: string;
  schoolId: number | null;
}

export function roleToDashboardPath(role: Role) {
  if (role === "superadmin") {
    return "/dashboard/super-admin";
  }
  return `/dashboard/${role}`;
}
