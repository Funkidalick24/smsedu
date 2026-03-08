"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between border-b border-blue-100 bg-white/90 px-6 py-4 backdrop-blur">
      <div>
        <h2 className="text-lg font-semibold" style={{ color: "var(--color-primary-strong)" }}>
          SMSEdu Command Center
        </h2>
        <p className="text-xs text-slate-500">Manage operations and monitor school activity.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-700">{user?.name ?? "Guest"}</p>
          <p className="text-xs uppercase tracking-wide" style={{ color: "var(--color-primary)" }}>
            {user?.role ?? "-"}
          </p>
        </div>
        <button
          className="rounded-lg px-3 py-2 text-sm text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
          onClick={() => void handleLogout()}
        >
          Log out
        </button>
      </div>
    </header>
  );
}
