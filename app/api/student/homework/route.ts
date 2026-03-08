import { NextResponse } from "next/server";
import { requireRole } from "@/lib/server/authService";
import { loadStudentHomework, resolveStudentId } from "@/lib/server/studentService";

const ALLOWED_STATUS = new Set(["all", "pending", "upcoming", "overdue", "submitted", "resubmitted", "late", "graded"]);

export async function GET(request: Request) {
  const user = await requireRole(["student"]);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const studentId = resolveStudentId(user.id);
  if (!studentId) {
    return NextResponse.json({ ok: false, message: "Student profile not found." }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const subjectParam = searchParams.get("subjectId");
  const statusParam = searchParams.get("status");
  const subjectId = subjectParam && /^\d+$/.test(subjectParam) ? Number(subjectParam) : null;
  const status = statusParam && ALLOWED_STATUS.has(statusParam) ? statusParam : "all";

  return NextResponse.json({
    ok: true,
    homework: loadStudentHomework(studentId, subjectId, status),
  });
}
