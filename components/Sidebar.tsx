"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@/lib/auth";

type MenuItem = {
  label: string;
  href: string;
};

const menus: Record<Role, MenuItem[]> = {
  superadmin: [
    { label: "System Overview", href: "/dashboard/super-admin" },
    { label: "Schools", href: "/dashboard/super-admin/schools" },
    { label: "Admin Accounts", href: "/dashboard/super-admin/admin-accounts" },
    { label: "Theme Settings", href: "/dashboard/super-admin/theme-settings" },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard/admin" },
    { label: "Students", href: "/dashboard/admin/students" },
    { label: "Teachers", href: "/dashboard/admin/teachers" },
    { label: "Classes", href: "/dashboard/admin/classes" },
    { label: "Attendance", href: "/dashboard/admin/attendance" },
  ],
  teacher: [
    { label: "Dashboard", href: "/dashboard/teacher" },
    { label: "My Classes", href: "/dashboard/teacher/classes" },
    { label: "Assignments", href: "/dashboard/teacher/assignments" },
    { label: "Grades", href: "/dashboard/teacher/grades" },
  ],
  student: [
    { label: "Dashboard", href: "/dashboard/student" },
    { label: "Subjects", href: "/dashboard/student/subjects" },
    { label: "Homework", href: "/dashboard/student/homework" },
    { label: "Results", href: "/dashboard/student/results" },
  ],
  parent: [
    { label: "Dashboard", href: "/dashboard/parent" },
    { label: "Children", href: "/dashboard/parent/children" },
    { label: "Attendance", href: "/dashboard/parent/attendance" },
    { label: "Messages", href: "/dashboard/parent/messages" },
  ],
};

export default function Sidebar({ role }: { role: Role }) {
  const menuItems = menus[role] ?? [];
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r border-blue-100 bg-white">
      <div className="border-b border-blue-100 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">SMSEdu</p>
        <h1 className="text-lg font-bold text-blue-950">School Operations</h1>
      </div>

      <nav className="space-y-1 p-3">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
              pathname === item.href
                ? "bg-blue-100 text-blue-900"
                : "text-slate-700 hover:bg-blue-50 hover:text-blue-900"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
