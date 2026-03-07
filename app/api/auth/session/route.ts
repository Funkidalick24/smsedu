import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/authService";

export async function GET() {
  const user = await getAuthenticatedUser();
  return NextResponse.json({ user });
}
