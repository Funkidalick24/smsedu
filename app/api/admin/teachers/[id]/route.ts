import { NextResponse } from "next/server";
import { requireRole } from "@/lib/server/authService";
import { CreateTeacherInput, getTeacherById, updateTeacher } from "@/lib/server/adminRepository";

interface RouteContext {
  params: Promise<{ id: string }>;
}

interface UpdateTeacherBody extends Omit<CreateTeacherInput, "classIds" | "subjectIds"> {
  classIds?: number[];
  subjectIds?: number[];
}

function parseTeacherId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_request: Request, context: RouteContext) {
  const user = await requireRole(["admin", "superadmin"]);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const teacherId = parseTeacherId(id);
  if (!teacherId) {
    return NextResponse.json({ ok: false, message: "Invalid teacher id." }, { status: 400 });
  }

  const teacher = getTeacherById(teacherId);
  if (!teacher) {
    return NextResponse.json({ ok: false, message: "Teacher not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, teacher });
}

export async function PATCH(request: Request, context: RouteContext) {
  const user = await requireRole(["admin", "superadmin"]);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const teacherId = parseTeacherId(id);
  if (!teacherId) {
    return NextResponse.json({ ok: false, message: "Invalid teacher id." }, { status: 400 });
  }

  const body = (await request.json()) as UpdateTeacherBody;
  const classIds = Array.isArray(body.classIds) ? body.classIds.filter((value) => Number.isInteger(value)) : [];
  const subjectIds = Array.isArray(body.subjectIds)
    ? body.subjectIds.filter((value) => Number.isInteger(value))
    : [];

  if (
    !body.firstName?.trim() ||
    !body.lastName?.trim() ||
    !body.email?.trim() ||
    !body.phoneNumber?.trim() ||
    !body.employeeNo?.trim() ||
    !body.employmentDate?.trim() ||
    !body.department?.trim()
  ) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "First name, last name, email, phone number, employee ID, employment date, and department are required.",
      },
      { status: 400 },
    );
  }

  try {
    const teacher = updateTeacher(teacherId, {
      ...body,
      classIds,
      subjectIds,
      firstName: body.firstName.trim(),
      middleName: body.middleName?.trim(),
      lastName: body.lastName.trim(),
      phoneNumber: body.phoneNumber.trim(),
      email: body.email.trim().toLowerCase(),
      employeeNo: body.employeeNo.trim(),
      employmentDate: body.employmentDate.trim(),
      department: body.department.trim(),
    } as CreateTeacherInput);

    return NextResponse.json({ ok: true, teacher });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update teacher.";
    if (message.includes("UNIQUE")) {
      return NextResponse.json(
        { ok: false, message: "Email or employee ID already exists." },
        { status: 409 },
      );
    }
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
