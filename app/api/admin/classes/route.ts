import { NextResponse } from "next/server";
import { requireRole } from "@/lib/server/authService";
import {
  createClass,
  listClasses,
  listSubjectOptions,
  listTeacherOptions,
} from "@/lib/server/adminRepository";

interface ClassSubjectBody {
  subjectId?: number;
  teacherId?: number | null;
  subjectCode?: string;
}

interface CreateClassBody {
  className?: string;
  sectionStream?: string;
  schoolLevel?: "Primary" | "Secondary";
  formLevel?: string;
  academicYear?: string;
  term?: string;
  gradeLevel?: string;
  streamLetter?: string;
  curriculumType?: string;
  classTeacherId?: number | null;
  assistantTeacherId?: number | null;
  department?: string;
  maxStudents?: number;
  building?: string;
  roomNumber?: string;
  floor?: string;
  attendanceMode?: "daily" | "period";
  attendanceTeacherId?: number | null;
  trackLateArrivals?: boolean;
  gradingSystem?: string;
  assessmentTypes?: string;
  passingScore?: number;
  notes?: string;
  subjects?: ClassSubjectBody[];
}

function toIntegerOrNull(value: unknown) {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }
  return null;
}

export async function GET() {
  const user = await requireRole(["admin", "superadmin"]);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    classes: listClasses(),
    teachers: listTeacherOptions(),
    subjects: listSubjectOptions(),
  });
}

export async function POST(request: Request) {
  const user = await requireRole(["admin", "superadmin"]);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as CreateClassBody;
  const className = body.className?.trim() ?? "";
  const sectionStream = body.sectionStream?.trim() ?? "";
  const schoolLevel = body.schoolLevel === "Secondary" ? "Secondary" : "Primary";
  const formLevel = body.formLevel?.trim() ?? "";
  const academicYear = body.academicYear?.trim() ?? "";
  const term = body.term?.trim() ?? "";
  const gradeLevel = body.gradeLevel?.trim() ?? "";
  const streamLetter = body.streamLetter?.trim() ?? "";
  const curriculumType = body.curriculumType?.trim() ?? "";
  const maxStudents = typeof body.maxStudents === "number" ? body.maxStudents : Number.NaN;
  const classTeacherId = toIntegerOrNull(body.classTeacherId);
  const assistantTeacherId = toIntegerOrNull(body.assistantTeacherId);
  const attendanceTeacherId = toIntegerOrNull(body.attendanceTeacherId);

  if (!className || !sectionStream || !academicYear || !term || !gradeLevel || !Number.isFinite(maxStudents)) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Class name, section/stream, academic year, term, grade level, and maximum students are required.",
      },
      { status: 400 },
    );
  }

  if (maxStudents < 1 || maxStudents > 120) {
    return NextResponse.json(
      { ok: false, message: "Maximum students must be between 1 and 120." },
      { status: 400 },
    );
  }

  if (schoolLevel === "Secondary" && !formLevel) {
    return NextResponse.json(
      { ok: false, message: "Form level is required for secondary classes." },
      { status: 400 },
    );
  }

  const subjects = Array.isArray(body.subjects)
    ? body.subjects
        .map((entry) => ({
          subjectId: toIntegerOrNull(entry.subjectId),
          teacherId: toIntegerOrNull(entry.teacherId),
          subjectCode: entry.subjectCode?.trim() ?? "",
        }))
        .filter((entry) => entry.subjectId !== null)
        .map((entry) => ({
          subjectId: entry.subjectId as number,
          teacherId: entry.teacherId,
          subjectCode: entry.subjectCode,
        }))
    : [];

  try {
    const created = createClass({
      className,
      sectionStream,
      schoolLevel,
      formLevel,
      academicYear,
      term,
      gradeLevel,
      streamLetter,
      curriculumType,
      classTeacherId,
      assistantTeacherId,
      department: body.department?.trim(),
      maxStudents: Math.floor(maxStudents),
      building: body.building?.trim(),
      roomNumber: body.roomNumber?.trim(),
      floor: body.floor?.trim(),
      attendanceMode: body.attendanceMode,
      attendanceTeacherId,
      trackLateArrivals: body.trackLateArrivals ?? true,
      gradingSystem: body.gradingSystem?.trim(),
      assessmentTypes: body.assessmentTypes?.trim(),
      passingScore: typeof body.passingScore === "number" ? body.passingScore : undefined,
      notes: body.notes?.trim(),
      createdByUserId: user.id,
      subjects,
    });
    return NextResponse.json({ ok: true, classRecord: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create class.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
