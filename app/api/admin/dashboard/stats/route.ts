import { NextResponse } from "next/server";
import { requireRole } from "@/lib/server/authService";
import { getAdminStats } from "@/lib/server/adminRepository";

export async function GET() {
  const user = await requireRole(["admin", "superadmin"]);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  if (!user.schoolId) {
    return NextResponse.json({ ok: false, message: "Tenant context not found." }, { status: 403 });
  }

  return NextResponse.json({ ok: true, stats: getAdminStats(user.schoolId) });
}
