import { NextRequest, NextResponse } from "next/server";
import { detectTenantCode } from "./lib/server/tenantContext";

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const tenantCode = detectTenantCode(request.headers.get("host"), request.nextUrl.pathname);
  if (tenantCode) {
    requestHeaders.set("x-tenant-code", tenantCode);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
