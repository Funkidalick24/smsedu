import { NextResponse } from "next/server";
import { loginUser } from "@/lib/server/authService";

interface LoginBody {
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;
  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ ok: false, message: "Email and password are required." }, { status: 400 });
  }

  const result = await loginUser(
    email,
    password,
    request.headers.get("x-forwarded-for"),
    request.headers.get("user-agent"),
  );

  if (!result.ok) {
    return NextResponse.json(result, { status: 401 });
  }
  return NextResponse.json({ ok: true, user: result.user });
}
