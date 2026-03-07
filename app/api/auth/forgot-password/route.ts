import { NextResponse } from "next/server";
import { startPasswordReset } from "@/lib/server/authService";

interface ForgotBody {
  email?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as ForgotBody;
  const email = body.email?.trim() ?? "";
  if (!email) {
    return NextResponse.json({ ok: false, message: "Email is required." }, { status: 400 });
  }

  const resetToken = startPasswordReset(email);
  if (process.env.NODE_ENV !== "production" && resetToken) {
    return NextResponse.json({
      ok: true,
      message: "If the account exists, a reset link has been generated.",
      resetToken,
    });
  }

  return NextResponse.json({
    ok: true,
    message: "If the account exists, reset instructions have been sent.",
  });
}
