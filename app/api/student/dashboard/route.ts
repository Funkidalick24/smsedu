import { NextResponse } from "next/server";
import { requireRole } from "@/lib/server/authService";
import { loadStudentDashboard, resolveStudentId } from "@/lib/server/studentService";

export async function GET() {
  const user = await requireRole(["student"]);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const studentId = resolveStudentId(user.id);
  if (!studentId) {
    return NextResponse.json({ ok: false, message: "Student profile not found." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    ...loadStudentDashboard(studentId),
  });
}
