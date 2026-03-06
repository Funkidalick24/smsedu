export default function Sidebar({ role }: { role: string }) {
  const menus = {
    superadmin: ["Dashboard", "Schools", "Admins", "Theme Settings"],
    admin: ["Dashboard", "Students", "Teachers", "Classes", "Attendance"],
    teacher: ["Dashboard", "My Classes", "Assignments", "Grades"],
    student: ["Dashboard", "Subjects", "Homework", "Results"],
  };

  const menuItems = menus[role as keyof typeof menus] ?? [];

  return (
    <div className="w-64 border-r bg-white">
      <div className="p-4 text-lg font-bold">School System</div>

      {menuItems.map((item) => (
        <div key={item} className="cursor-pointer p-3 hover:bg-gray-100">
            {item}
        </div>
      ))}
    </div>
  );
}
