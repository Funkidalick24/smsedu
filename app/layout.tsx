import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";
import { getRequestTenantCode } from "@/lib/server/tenantContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenantCode = await getRequestTenantCode();

  return (
    <html lang="en">
      <body data-tenant-code={tenantCode ?? undefined}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
