import { NextResponse } from "next/server";
import { requireRole } from "@/lib/server/authService";
import { provisionSchool, loadSchools } from "@/lib/server/superAdminService";
import { logAudit } from "@/lib/server/audit";

interface CreateSchoolBody {
  schoolName?: string;
  schoolCode?: string;
  level?: "Primary" | "Secondary" | "Combined";
  district?: string;
  province?: string;
  address?: string;
  phone?: string;
  schoolEmail?: string;
  leaderTitle?: "principal" | "headmaster";
  leaderFullName?: string;
  leaderEmail?: string;
  leaderPhone?: string;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  const user = await requireRole(["superadmin"]);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, schools: loadSchools() });
}

export async function POST(request: Request) {
  const user = await requireRole(["superadmin"]);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as CreateSchoolBody;
  const schoolName = body.schoolName?.trim() ?? "";
  const schoolCode = body.schoolCode?.trim() ?? "";
  const level = body.level === "Secondary" || body.level === "Combined" ? body.level : "Primary";
  const leaderTitle = body.leaderTitle === "headmaster" ? "headmaster" : "principal";
  const leaderFullName = body.leaderFullName?.trim() ?? "";
  const leaderEmail = body.leaderEmail?.trim().toLowerCase() ?? "";

  if (!schoolName || !schoolCode || !leaderFullName || !leaderEmail) {
    return NextResponse.json(
      { ok: false, message: "School name, school code, leader name, and leader email are required." },
      { status: 400 },
    );
  }
  if (!isValidEmail(leaderEmail)) {
    return NextResponse.json({ ok: false, message: "Enter a valid leader email address." }, { status: 400 });
  }

  try {
    const created = provisionSchool({
      schoolName,
      schoolCode,
      level,
      district: body.district?.trim(),
      province: body.province?.trim(),
      address: body.address?.trim(),
      phone: body.phone?.trim(),
      schoolEmail: body.schoolEmail?.trim(),
      leaderTitle,
      leaderFullName,
      leaderEmail,
      leaderPhone: body.leaderPhone?.trim(),
    });

    logAudit(user.id, "superadmin.school.created", "school", `${created.schoolId}`, {
      leaderUserId: created.leaderUserId,
      leaderTitle,
      leaderEmail,
    });

    return NextResponse.json({
      ok: true,
      schoolId: created.schoolId,
      leaderUserId: created.leaderUserId,
      leaderEmail: created.leaderEmail,
      temporaryPassword: created.temporaryPassword,
      schools: loadSchools(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create school.";
    if (message.includes("UNIQUE")) {
      return NextResponse.json(
        { ok: false, message: "School code/name or leader email already exists." },
        { status: 409 },
      );
    }
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
