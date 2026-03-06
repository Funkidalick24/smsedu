const menus = {
  superadmin: ["System Overview", "Schools", "Admin Accounts", "Theme Settings"],
  admin: ["Dashboard", "Students", "Teachers", "Classes", "Attendance"],
  teacher: ["Dashboard", "My Classes", "Assignments", "Grades"],
  student: ["Dashboard", "Subjects", "Homework", "Results"],
  parent: ["Dashboard", "Children", "Attendance", "Messages"],
};

export default function Sidebar({ role }: { role: keyof typeof menus }) {
  const menuItems = menus[role] ?? [];

  return (
    <aside className="w-72 border-r border-blue-100 bg-white">
      <div className="border-b border-blue-100 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">SMSEdu</p>
        <h1 className="text-lg font-bold text-blue-950">School Operations</h1>
      </div>

      <nav className="space-y-1 p-3">
        {menuItems.map((item) => (
          <div
            key={item}
            className="cursor-default rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-900"
          >
            {item}
          </div>
        ))}
      </nav>
    </aside>
  );
}
