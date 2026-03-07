import { NextResponse } from "next/server";
import { requireRole } from "@/lib/server/authService";
import { getAdminStats } from "@/lib/server/adminRepository";

export async function GET() {
  const user = await requireRole(["admin", "superadmin"]);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, stats: getAdminStats() });
}
