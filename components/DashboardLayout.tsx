"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "@/context/AuthContext";
import { Role, roleToDashboardPath } from "@/lib/auth";

interface DashboardLayoutProps {
  children: ReactNode;
  role: Role;
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { user, isHydrating } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrating) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== role) {
      router.replace(roleToDashboardPath(user.role));
    }
  }, [isHydrating, role, router, user]);

  if (isHydrating || !user || user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center text-blue-900">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
