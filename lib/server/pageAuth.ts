import { redirect } from "next/navigation";
import { Role, roleToDashboardPath } from "../auth";
import { getAuthenticatedUser, requireRole } from "./authService";

export async function requireDashboardRole(role: Role) {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== role) {
    redirect(roleToDashboardPath(user.role));
  }
  return user;
}

export async function requireAnyRole(roles: Role[]) {
  const user = await requireRole(roles);
  if (!user) {
    redirect("/login");
  }
  return user;
}
