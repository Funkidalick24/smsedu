export default function Sidebar({ role }: { role: string }) {
  const menus: any = {
    superadmin: ["Dashboard", "Schools", "Admins", "Theme Settings"],

    admin: ["Dashboard", "Students", "Teachers", "Classes", "Attendance"],

    teacher: ["Dashboard", "My Classes", "Assignments", "Grades"],

    student: ["Dashboard", "Subjects", "Homework", "Results"],
  };

  return (
    <div className="w-64 border-r bg-white">
      <div className="p-4 text-lg font-bold">School System</div>

      {menus[role].map((item: string) => (
        <div key={item} className="cursor-pointer p-3 hover:bg-gray-100">
          {item}
        </div>
      ))}
    </div>
  );
}
