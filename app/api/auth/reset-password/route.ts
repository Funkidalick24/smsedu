import { NextResponse } from "next/server";
import { completePasswordReset } from "@/lib/server/authService";

interface ResetBody {
  token?: string;
  newPassword?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as ResetBody;
  const token = body.token?.trim() ?? "";
  const newPassword = body.newPassword ?? "";

  if (!token || !newPassword) {
    return NextResponse.json(
      { ok: false, message: "Reset token and new password are required." },
      { status: 400 },
    );
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { ok: false, message: "New password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const result = completePasswordReset(token, newPassword);
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: "Password reset completed." });
}
