import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type Role = "admin" | "teacher" | "student" | "parent" | "superadmin";

interface DashboardLayoutProps {
  children: ReactNode;
  role: Role;
}

export default function DashboardLayout({
  children,
  role,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar role={role} />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="flex-1 bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  );
}
