import { NextResponse } from "next/server";
import { requireRole } from "@/lib/server/authService";
import { loadStudentDashboard, resolveStudentId } from "@/lib/server/studentService";

export async function GET() {
  const user = await requireRole(["student"]);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!user.schoolId) {
    return NextResponse.json({ ok: false, message: "Tenant context not found." }, { status: 403 });
  }

  const studentId = resolveStudentId(user.id, user.schoolId);
  if (!studentId) {
    return NextResponse.json({ ok: false, message: "Student profile not found." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    ...loadStudentDashboard(studentId, user.schoolId),
  });
}
