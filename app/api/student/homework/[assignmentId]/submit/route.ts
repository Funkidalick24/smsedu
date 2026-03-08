import { NextResponse } from "next/server";
import { requireRole } from "@/lib/server/authService";
import { createStudentSubmission, resolveStudentId } from "@/lib/server/studentService";
import { logAudit } from "@/lib/server/audit";

interface SubmissionBody {
  submissionText?: string;
  attachmentUrl?: string;
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ assignmentId: string }> },
) {
  const user = await requireRole(["student"]);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const studentId = resolveStudentId(user.id);
  if (!studentId) {
    return NextResponse.json({ ok: false, message: "Student profile not found." }, { status: 404 });
  }

  const { assignmentId: assignmentIdParam } = await context.params;
  if (!/^\d+$/.test(assignmentIdParam)) {
    return NextResponse.json({ ok: false, message: "Invalid assignment id." }, { status: 400 });
  }

  const body = (await request.json()) as SubmissionBody;
  const submissionText = (body.submissionText ?? "").trim();
  const attachmentUrl = (body.attachmentUrl ?? "").trim();

  if (!submissionText) {
    return NextResponse.json({ ok: false, message: "Submission text is required." }, { status: 400 });
  }
  if (submissionText.length > 2000) {
    return NextResponse.json(
      { ok: false, message: "Submission text cannot exceed 2000 characters." },
      { status: 400 },
    );
  }
  if (attachmentUrl && !isValidHttpUrl(attachmentUrl)) {
    return NextResponse.json({ ok: false, message: "Attachment URL must be a valid HTTP(S) URL." }, { status: 400 });
  }
  if (attachmentUrl.length > 500) {
    return NextResponse.json(
      { ok: false, message: "Attachment URL cannot exceed 500 characters." },
      { status: 400 },
    );
  }

  try {
    createStudentSubmission(studentId, Number(assignmentIdParam), { submissionText, attachmentUrl });
    logAudit(user.id, "student.assignment.submitted", "assignment", assignmentIdParam, {
      studentId,
      hasAttachment: Boolean(attachmentUrl),
      textLength: submissionText.length,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit assignment.";
    logAudit(user.id, "student.assignment.submit_failed", "assignment", assignmentIdParam, {
      studentId,
      reason: message,
    });
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
