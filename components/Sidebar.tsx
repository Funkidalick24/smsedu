"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactElement } from "react";
import { Role } from "@/lib/auth";

type MenuItem = {
  label: string;
  href: string;
  icon: (props: { className?: string }) => ReactElement;
};

function HomeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M10 21v-6h4v6" />
    </svg>
  );
}

function SchoolIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="m3 9 9-5 9 5-9 5-9-5Z" />
      <path d="M5 10.5V16l7 4 7-4v-5.5" />
      <path d="M12 14v6" />
    </svg>
  );
}

function UsersIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="3" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a3 3 0 0 1 0 5.74" />
    </svg>
  );
}

function PaintIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 3a9 9 0 0 0 0 18h1.2a2.8 2.8 0 0 0 0-5.6H11a2 2 0 0 1 0-4h6a4 4 0 0 0 4-4 8.4 8.4 0 0 0-9-4.4Z" />
      <circle cx="7.5" cy="8.5" r="1" />
      <circle cx="10.5" cy="6.5" r="1" />
      <circle cx="6.5" cy="12.5" r="1" />
    </svg>
  );
}

function StudentIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="m2 9 10-5 10 5-10 5L2 9Z" />
      <path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" />
    </svg>
  );
}

function TeacherIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M8 22h8" />
      <path d="M12 18v4" />
      <path d="M7 9h10" />
    </svg>
  );
}

function ClassIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M7 9h10M7 13h6" />
      <path d="M8 20h8" />
    </svg>
  );
}

function AttendanceIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M8 2v4M16 2v4M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}

function AssignmentsIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  );
}

function GradesIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M4 20h16" />
      <path d="M7 16v-4M12 16V8M17 16v-6" />
    </svg>
  );
}

function SubjectsIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M4 19a2 2 0 0 0 2 2h12" />
      <path d="M6 3h12v18H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M9 8h6M9 12h6" />
    </svg>
  );
}

function HomeworkIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M8 4h11a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H8" />
      <path d="M8 8V4L3 9l5 5V10" />
      <path d="M12 10h5M12 14h5" />
    </svg>
  );
}

function ResultsIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M4 20h16" />
      <rect x="6" y="10" width="3" height="6" />
      <rect x="11" y="7" width="3" height="9" />
      <rect x="16" y="4" width="3" height="12" />
    </svg>
  );
}

function ChildrenIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="8" r="3" />
      <path d="M3 20a5 5 0 0 1 10 0M11 20a5 5 0 0 1 10 0" />
    </svg>
  );
}

function MessageIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />
    </svg>
  );
}

function ChevronIcon({ className = "h-4 w-4", collapsed = false }: { className?: string; collapsed?: boolean }) {
  return collapsed ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

const menus: Record<Role, MenuItem[]> = {
  superadmin: [
    { label: "System Overview", href: "/dashboard/super-admin", icon: HomeIcon },
    { label: "Schools", href: "/dashboard/super-admin/schools", icon: SchoolIcon },
    { label: "Admin Accounts", href: "/dashboard/super-admin/admin-accounts", icon: UsersIcon },
    { label: "Theme Settings", href: "/dashboard/super-admin/theme-settings", icon: PaintIcon },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard/admin", icon: HomeIcon },
    { label: "Students", href: "/dashboard/admin/students", icon: StudentIcon },
    { label: "Teachers", href: "/dashboard/admin/teachers", icon: TeacherIcon },
    { label: "Classes", href: "/dashboard/admin/classes", icon: ClassIcon },
    { label: "Attendance", href: "/dashboard/admin/attendance", icon: AttendanceIcon },
  ],
  teacher: [
    { label: "Dashboard", href: "/dashboard/teacher", icon: HomeIcon },
    { label: "My Classes", href: "/dashboard/teacher/classes", icon: ClassIcon },
    { label: "Assignments", href: "/dashboard/teacher/assignments", icon: AssignmentsIcon },
    { label: "Grades", href: "/dashboard/teacher/grades", icon: GradesIcon },
  ],
  student: [
    { label: "Dashboard", href: "/dashboard/student", icon: HomeIcon },
    { label: "Subjects", href: "/dashboard/student/subjects", icon: SubjectsIcon },
    { label: "Homework", href: "/dashboard/student/homework", icon: HomeworkIcon },
    { label: "Results", href: "/dashboard/student/results", icon: ResultsIcon },
  ],
  parent: [
    { label: "Dashboard", href: "/dashboard/parent", icon: HomeIcon },
    { label: "Children", href: "/dashboard/parent/children", icon: ChildrenIcon },
    { label: "Attendance", href: "/dashboard/parent/attendance", icon: AttendanceIcon },
    { label: "Messages", href: "/dashboard/parent/messages", icon: MessageIcon },
  ],
  principal: [{ label: "Dashboard", href: "/dashboard/principal", icon: HomeIcon }],
  headmaster: [{ label: "Dashboard", href: "/dashboard/headmaster", icon: HomeIcon }],
};

export default function Sidebar({ role }: { role: Role }) {
  const menuItems = menus[role] ?? [];
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-72"} border-r bg-white transition-all duration-200`}
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className={`border-b ${collapsed ? "px-3 py-4" : "px-5 py-5"}`} style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
              {collapsed ? "SMS" : "SMSEdu"}
            </p>
            {!collapsed ? (
              <h1 className="text-lg font-bold" style={{ color: "var(--color-primary-strong)" }}>
                School Operations
              </h1>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="rounded-md border p-1 hover:bg-blue-50"
            style={{ borderColor: "var(--color-border)", color: "var(--color-primary-strong)" }}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronIcon collapsed={collapsed} />
          </button>
        </div>
      </div>

      <nav className={`space-y-1 ${collapsed ? "p-2" : "p-3"}`}>
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined}>
            <span
              className={`flex items-center rounded-md text-sm font-medium transition ${
                collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2"
              } ${
                pathname === item.href
                  ? "text-blue-900"
                  : "text-slate-700 hover:bg-blue-50 hover:text-blue-900"
              }`}
              style={
                pathname === item.href
                  ? { backgroundColor: "var(--color-primary-soft)", color: "var(--color-primary-strong)" }
                  : undefined
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
