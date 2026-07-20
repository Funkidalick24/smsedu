import { headers } from "next/headers";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

export function detectTenantCodeFromHost(hostHeader: string | null) {
  if (!hostHeader) {
    return null;
  }
  const hostname = hostHeader.split(":")[0]?.toLowerCase() ?? "";
  if (!hostname || LOCAL_HOSTS.has(hostname)) {
    return null;
  }
  const parts = hostname.split(".");
  if (parts.length < 3 || parts[0] === "www") {
    return null;
  }
  return parts[0];
}

export function detectTenantCodeFromPath(pathname: string | null) {
  if (!pathname) {
    return null;
  }
  const match = pathname.match(/^\/schools\/([^/]+)/i);
  return match?.[1]?.toLowerCase() ?? null;
}

export function detectTenantCode(hostHeader: string | null, pathname: string | null) {
  return detectTenantCodeFromPath(pathname) ?? detectTenantCodeFromHost(hostHeader);
}

export async function getRequestTenantCode() {
  const requestHeaders = await headers();
  return requestHeaders.get("x-tenant-code") ?? detectTenantCode(requestHeaders.get("host"), requestHeaders.get("x-pathname"));
}
