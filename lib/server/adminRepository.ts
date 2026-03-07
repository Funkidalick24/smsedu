import { hashPassword } from "./password";
import { ensureDbReady, getDb } from "./db";

export interface AdminStat {
  title: string;
  value: string;
  trend: string;
}

export interface ClassroomSnapshot {
  className: string;
  students: number;
  attendancePct: number;
  status: "On track" | "Needs intervention";
}

export interface AdminStudentRow {
  id: number;
  admissionNo: string;
  name: string;
  email: string;
  gradeLevel: string;
  classes: string;
  attendancePct: number;
}

export interface AdminTeacherRow {
  id: number;
  employeeNo: string;
  name: string;
  email: string;
  department: string;
  subjects: string;
  classes: string;
  status: string;
  assignedClasses: number;
}

export interface AdminClassRow {
  className: string;
  teacherName: string;
  students: number;
  attendancePct: number;
}

export interface AdminAttendanceRow {
  className: string;
  date: string;
  attendancePct: number;
}

export interface ClassOption {
  id: number;
  name: string;
}

export interface SubjectOption {
  id: number;
  name: string;
}

export interface CreateStudentInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  dateOfBirth: string;
  gender: string;
  nationality?: string;
  admissionDate: string;
  email: string;
  admissionNo: string;
  gradeLevel: string;
  sectionStream?: string;
  academicYear?: string;
  transferStatus?: string;
  previousSchool?: string;
  boardingStatus?: string;
  transportMethod?: string;
  busRoute?: string;
  religion?: string;
  homeLanguage?: string;
  extracurricularInterests?: string;
  guardian1Name: string;
  guardian1Relationship: string;
  guardian1Phone: string;
  guardian1Email?: string;
  guardian1Occupation?: string;
  guardian1Address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  allergies?: string;
  medicalNotes?: string;
  knownConditions?: string;
  medications?: string;
  bloodType?: string;
  specialNeeds?: string;
  classId: number | null;
}

export interface CreateTeacherInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  nationalIdNumber?: string;
  maritalStatus?: string;
  phoneNumber: string;
  email: string;
  addressLine?: string;
  city?: string;
  postalCode?: string;
  employeeNo: string;
  employmentDate: string;
  employmentType?: string;
  jobTitle?: string;
  department: string;
  status?: string;
  gradeLevelsTaught?: string;
  academicDepartment?: string;
  homeroomTeacher?: boolean;
  highestQualification?: string;
  degrees?: string;
  teachingCertification?: string;
  professionalLicenseNumber?: string;
  specializations?: string;
  yearsExperience?: number | null;
  previousSchools?: string;
  weeklyTeachingHours?: number | null;
  timetableAssignments?: string;
  subjectLoad?: string;
  salary?: number | null;
  paymentMethod?: string;
  bankName?: string;
  bankAccountNumber?: string;
  taxNumber?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  emergencyContactAltPhone?: string;
  classIds: number[];
  subjectIds: number[];
}

export function getAdminStats() {
  ensureDbReady();
  const db = getDb();

  const totalStudents = (db.prepare("SELECT COUNT(*) as count FROM students").get() as { count: number }).count;
  const totalTeachers = (db.prepare("SELECT COUNT(*) as count FROM teachers").get() as { count: number }).count;
  const totalClasses = (db.prepare("SELECT COUNT(*) as count FROM classes").get() as { count: number }).count;
  const attendance = (db
    .prepare(
      `
      SELECT
        ROUND(
          100.0 * SUM(CASE WHEN status IN ('present', 'late', 'excused') THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0),
          1
        ) as pct
      FROM attendance
      WHERE date >= date('now', '-30 days')
    `,
    )
    .get() as { pct: number | null }).pct;

  const stats: AdminStat[] = [
    { title: "Total Students", value: totalStudents.toLocaleString(), trend: "Live from DB" },
    { title: "Teachers", value: totalTeachers.toLocaleString(), trend: "Live from DB" },
    { title: "Classes", value: totalClasses.toLocaleString(), trend: "Live from DB" },
    { title: "Attendance", value: `${attendance ?? 0}%`, trend: "Last 30 days" },
  ];

  return stats;
}

export function getClassroomSnapshot() {
  ensureDbReady();
  const db = getDb();

  const rows = db
    .prepare(
      `
      SELECT
        c.name as class_name,
        COUNT(DISTINCT ce.student_id) as student_count,
        ROUND(
          100.0 * SUM(CASE WHEN a.status IN ('present', 'late', 'excused') THEN 1 ELSE 0 END) / NULLIF(COUNT(a.id), 0),
          1
        ) as attendance_pct
      FROM classes c
      LEFT JOIN class_enrollments ce ON ce.class_id = c.id
      LEFT JOIN attendance a ON a.class_id = c.id AND a.date >= date('now', '-30 days')
      GROUP BY c.id, c.name
      ORDER BY c.name
    `,
    )
    .all() as Array<{ class_name: string; student_count: number; attendance_pct: number | null }>;

  return rows.map(
    (row) =>
      ({
        className: row.class_name,
        students: row.student_count,
        attendancePct: row.attendance_pct ?? 0,
        status: (row.attendance_pct ?? 0) >= 95 ? "On track" : "Needs intervention",
      }) satisfies ClassroomSnapshot,
  );
}

export function listStudents() {
  ensureDbReady();
  const db = getDb();
  return db
    .prepare(
      `
      SELECT
        s.id as student_id,
        s.admission_no,
        COALESCE(TRIM(s.first_name || ' ' || s.last_name), u.full_name) as display_name,
        u.email,
        s.grade_level,
        COALESCE(GROUP_CONCAT(DISTINCT c.name), 'Unassigned') as class_names,
        ROUND(
          100.0 * SUM(CASE WHEN a.status IN ('present', 'late', 'excused') THEN 1 ELSE 0 END) / NULLIF(COUNT(a.id), 0),
          1
        ) as attendance_pct
      FROM students s
      JOIN users u ON u.id = s.user_id
      LEFT JOIN class_enrollments ce ON ce.student_id = s.id
      LEFT JOIN classes c ON c.id = ce.class_id
      LEFT JOIN attendance a ON a.student_id = s.id AND a.date >= date('now', '-30 days')
      GROUP BY s.id, s.admission_no, s.first_name, s.last_name, u.full_name, u.email, s.grade_level
      ORDER BY s.grade_level, display_name
    `,
    )
    .all()
    .map(
      (row) =>
        ({
          id: (row as { student_id: number }).student_id,
          admissionNo: (row as { admission_no: string }).admission_no,
          name: (row as { display_name: string }).display_name,
          email: (row as { email: string }).email,
          gradeLevel: (row as { grade_level: string }).grade_level,
          classes: (row as { class_names: string }).class_names,
          attendancePct: (row as { attendance_pct: number | null }).attendance_pct ?? 0,
        }) satisfies AdminStudentRow,
    );
}

export function listClassOptions() {
  ensureDbReady();
  const db = getDb();
  return db
    .prepare(
      `
      SELECT id, name
      FROM classes
      ORDER BY name
    `,
    )
    .all()
    .map(
      (row) =>
        ({
          id: (row as { id: number }).id,
          name: (row as { name: string }).name,
        }) satisfies ClassOption,
    );
}

export function listSubjectOptions() {
  ensureDbReady();
  const db = getDb();
  return db
    .prepare(
      `
      SELECT id, name
      FROM subjects
      ORDER BY name
    `,
    )
    .all()
    .map(
      (row) =>
        ({
          id: (row as { id: number }).id,
          name: (row as { name: string }).name,
        }) satisfies SubjectOption,
    );
}

export function createStudent(input: CreateStudentInput) {
  ensureDbReady();
  const db = getDb();

  const roleRow = db.prepare("SELECT id FROM roles WHERE name = 'student'").get() as { id: number } | undefined;
  if (!roleRow) {
    throw new Error("Student role is not configured.");
  }

  const tx = db.transaction(() => {
    const email = input.email.trim().toLowerCase();
    const firstName = input.firstName.trim();
    const middleName = input.middleName?.trim() || null;
    const lastName = input.lastName.trim();
    const fullName = `${firstName}${middleName ? ` ${middleName}` : ""} ${lastName}`.trim();
    const admissionNo = input.admissionNo.trim().toUpperCase();
    const gradeLevel = input.gradeLevel.trim();
    const admissionDate = input.admissionDate.trim();
    const defaultPassword = process.env.DEFAULT_STUDENT_PASSWORD ?? "Student123!";

    const userInsert = db
      .prepare(
        `
      INSERT INTO users (email, full_name, password_hash, role_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
      )
      .run(email, fullName, hashPassword(defaultPassword), roleRow.id);

    const userId = Number(userInsert.lastInsertRowid);
    const studentInsert = db
      .prepare(
        `
      INSERT INTO students (
        user_id,
        admission_no,
        grade_level,
        first_name,
        middle_name,
        last_name,
        preferred_name,
        date_of_birth,
        gender,
        nationality,
        admission_date,
        section_stream,
        previous_school,
        transfer_status,
        academic_year,
        boarding_status,
        transport_method,
        bus_route,
        religion,
        home_language,
        extracurricular_interests
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        userId,
        admissionNo,
        gradeLevel,
        firstName,
        middleName,
        lastName,
        input.preferredName?.trim() || null,
        input.dateOfBirth.trim(),
        input.gender.trim(),
        input.nationality?.trim() || null,
        admissionDate,
        input.sectionStream?.trim() || null,
        input.previousSchool?.trim() || null,
        input.transferStatus?.trim() || null,
        input.academicYear?.trim() || null,
        input.boardingStatus?.trim() || null,
        input.transportMethod?.trim() || null,
        input.busRoute?.trim() || null,
        input.religion?.trim() || null,
        input.homeLanguage?.trim() || null,
        input.extracurricularInterests?.trim() || null,
      );

    const studentId = Number(studentInsert.lastInsertRowid);
    if (input.classId) {
      db.prepare("INSERT INTO class_enrollments (class_id, student_id) VALUES (?, ?)").run(input.classId, studentId);
    }

    const guardianInsert = db
      .prepare(
        `
      INSERT INTO guardians (full_name, relationship, phone_number, email, occupation, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        input.guardian1Name.trim(),
        input.guardian1Relationship.trim(),
        input.guardian1Phone.trim(),
        input.guardian1Email?.trim() || null,
        input.guardian1Occupation?.trim() || null,
        input.guardian1Address?.trim() || null,
      );

    const guardianId = Number(guardianInsert.lastInsertRowid);
    db.prepare(
      `
      INSERT INTO student_guardians (student_id, guardian_id, is_primary, is_emergency_contact)
      VALUES (?, ?, 1, ?)
    `,
    ).run(studentId, guardianId, input.emergencyContactName ? 0 : 1);

    if (input.emergencyContactName && input.emergencyContactPhone) {
      const emergencyInsert = db
        .prepare(
          `
        INSERT INTO guardians (full_name, relationship, phone_number, email, occupation, address)
        VALUES (?, ?, ?, NULL, NULL, NULL)
      `,
        )
        .run(
          input.emergencyContactName.trim(),
          input.emergencyContactRelationship?.trim() || "Emergency Contact",
          input.emergencyContactPhone.trim(),
        );

      db.prepare(
        `
        INSERT INTO student_guardians (student_id, guardian_id, is_primary, is_emergency_contact)
        VALUES (?, ?, 0, 1)
      `,
      ).run(studentId, Number(emergencyInsert.lastInsertRowid));
    }

    db.prepare(
      `
      INSERT INTO medical_records (
        student_id,
        known_conditions,
        allergies,
        medications,
        blood_type,
        special_needs,
        medical_notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      studentId,
      input.knownConditions?.trim() || null,
      input.allergies?.trim() || null,
      input.medications?.trim() || null,
      input.bloodType?.trim() || null,
      input.specialNeeds?.trim() || null,
      input.medicalNotes?.trim() || null,
    );

    return studentId;
  });

  const studentId = tx();
  const row = db
    .prepare(
      `
      SELECT
        s.id as student_id,
        s.admission_no,
        COALESCE(TRIM(s.first_name || ' ' || s.last_name), u.full_name) as display_name,
        u.email,
        s.grade_level
      FROM students s
      JOIN users u ON u.id = s.user_id
      WHERE s.id = ?
    `,
    )
    .get(studentId) as
    | {
        student_id: number;
        admission_no: string;
        display_name: string;
        email: string;
        grade_level: string;
      }
    | undefined;

  if (!row) {
    throw new Error("Failed to load created student.");
  }

  return {
    id: row.student_id,
    admissionNo: row.admission_no,
    name: row.display_name,
    email: row.email,
    gradeLevel: row.grade_level,
  };
}

export function createTeacher(input: CreateTeacherInput) {
  ensureDbReady();
  const db = getDb();

  const roleRow = db.prepare("SELECT id FROM roles WHERE name = 'teacher'").get() as { id: number } | undefined;
  if (!roleRow) {
    throw new Error("Teacher role is not configured.");
  }

  const tx = db.transaction(() => {
    const firstName = input.firstName.trim();
    const middleName = input.middleName?.trim() || null;
    const lastName = input.lastName.trim();
    const fullName = `${firstName}${middleName ? ` ${middleName}` : ""} ${lastName}`.trim();
    const email = input.email.trim().toLowerCase();
    const employeeNo = input.employeeNo.trim().toUpperCase();
    const defaultPassword = process.env.DEFAULT_TEACHER_PASSWORD ?? "Teacher123!";

    const userInsert = db
      .prepare(
        `
      INSERT INTO users (email, full_name, password_hash, role_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
      )
      .run(email, fullName, hashPassword(defaultPassword), roleRow.id);

    const userId = Number(userInsert.lastInsertRowid);
    const teacherInsert = db
      .prepare(
        `
      INSERT INTO teachers (
        user_id,
        employee_no,
        first_name,
        middle_name,
        last_name,
        date_of_birth,
        gender,
        nationality,
        national_id_number,
        marital_status,
        phone_number,
        email,
        address_line,
        city,
        postal_code,
        employment_date,
        employment_type,
        job_title,
        department,
        status,
        grade_levels_taught,
        academic_department,
        homeroom_teacher,
        highest_qualification,
        degrees,
        teaching_certification,
        professional_license_number,
        specializations,
        years_experience,
        previous_schools,
        weekly_teaching_hours,
        timetable_assignments,
        subject_load,
        salary,
        payment_method,
        bank_name,
        bank_account_number,
        tax_number,
        emergency_contact_name,
        emergency_contact_relationship,
        emergency_contact_phone,
        emergency_contact_alt_phone
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        userId,
        employeeNo,
        firstName,
        middleName,
        lastName,
        input.dateOfBirth?.trim() || null,
        input.gender?.trim() || null,
        input.nationality?.trim() || null,
        input.nationalIdNumber?.trim() || null,
        input.maritalStatus?.trim() || null,
        input.phoneNumber.trim(),
        email,
        input.addressLine?.trim() || null,
        input.city?.trim() || null,
        input.postalCode?.trim() || null,
        input.employmentDate.trim(),
        input.employmentType?.trim() || null,
        input.jobTitle?.trim() || null,
        input.department.trim(),
        input.status?.trim() || "Active",
        input.gradeLevelsTaught?.trim() || null,
        input.academicDepartment?.trim() || null,
        input.homeroomTeacher ? 1 : 0,
        input.highestQualification?.trim() || null,
        input.degrees?.trim() || null,
        input.teachingCertification?.trim() || null,
        input.professionalLicenseNumber?.trim() || null,
        input.specializations?.trim() || null,
        input.yearsExperience ?? null,
        input.previousSchools?.trim() || null,
        input.weeklyTeachingHours ?? null,
        input.timetableAssignments?.trim() || null,
        input.subjectLoad?.trim() || null,
        input.salary ?? null,
        input.paymentMethod?.trim() || null,
        input.bankName?.trim() || null,
        input.bankAccountNumber?.trim() || null,
        input.taxNumber?.trim() || null,
        input.emergencyContactName?.trim() || null,
        input.emergencyContactRelationship?.trim() || null,
        input.emergencyContactPhone?.trim() || null,
        input.emergencyContactAltPhone?.trim() || null,
      );

    const teacherId = Number(teacherInsert.lastInsertRowid);

    const insertTeacherSubject = db.prepare(
      "INSERT OR IGNORE INTO teacher_subjects (teacher_id, subject_id) VALUES (?, ?)",
    );
    for (const subjectId of input.subjectIds) {
      insertTeacherSubject.run(teacherId, subjectId);
    }

    const insertTeacherClass = db.prepare(
      "INSERT OR IGNORE INTO teacher_classes (teacher_id, class_id) VALUES (?, ?)",
    );
    const updateClassTeacher = db.prepare("UPDATE classes SET teacher_id = ? WHERE id = ?");
    for (const classId of input.classIds) {
      insertTeacherClass.run(teacherId, classId);
      updateClassTeacher.run(teacherId, classId);
    }

    if (input.highestQualification?.trim()) {
      db.prepare(
        `
        INSERT INTO teacher_qualifications (
          teacher_id,
          qualification_type,
          qualification_name,
          institution,
          year_awarded,
          license_number,
          notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      ).run(
        teacherId,
        "Highest Qualification",
        input.highestQualification.trim(),
        null,
        null,
        input.professionalLicenseNumber?.trim() || null,
        input.specializations?.trim() || null,
      );
    }

    return teacherId;
  });

  const teacherId = tx();
  const row = db
    .prepare(
      `
      SELECT
        t.id,
        t.employee_no,
        COALESCE(TRIM(t.first_name || ' ' || t.last_name), u.full_name) as display_name,
        u.email,
        COALESCE(t.department, '-') as department,
        COALESCE(t.status, 'Active') as status
      FROM teachers t
      JOIN users u ON u.id = t.user_id
      WHERE t.id = ?
    `,
    )
    .get(teacherId) as
    | {
        id: number;
        employee_no: string;
        display_name: string;
        email: string;
        department: string;
        status: string;
      }
    | undefined;

  if (!row) {
    throw new Error("Failed to load created teacher.");
  }

  return {
    id: row.id,
    employeeNo: row.employee_no,
    name: row.display_name,
    email: row.email,
    department: row.department,
    status: row.status,
  };
}

export function listTeachers() {
  ensureDbReady();
  const db = getDb();
  return db
    .prepare(
      `
      SELECT
        t.id,
        t.employee_no,
        COALESCE(TRIM(t.first_name || ' ' || t.last_name), u.full_name) as display_name,
        u.email,
        COALESCE(t.department, '-') as department,
        COALESCE(t.status, 'Active') as status,
        COALESCE(GROUP_CONCAT(DISTINCT s.name), 'Unassigned') as subject_names,
        COALESCE(GROUP_CONCAT(DISTINCT c.name), 'Unassigned') as class_names,
        COUNT(DISTINCT tc.class_id) as assigned_classes
      FROM teachers t
      JOIN users u ON u.id = t.user_id
      LEFT JOIN teacher_subjects ts ON ts.teacher_id = t.id
      LEFT JOIN subjects s ON s.id = ts.subject_id
      LEFT JOIN teacher_classes tc ON tc.teacher_id = t.id
      LEFT JOIN classes c ON c.id = tc.class_id
      GROUP BY t.id, t.employee_no, t.first_name, t.last_name, u.full_name, u.email, t.department, t.status
      ORDER BY display_name
    `,
    )
    .all()
    .map(
      (row) =>
        ({
          id: (row as { id: number }).id,
          employeeNo: (row as { employee_no: string }).employee_no,
          name: (row as { display_name: string }).display_name,
          email: (row as { email: string }).email,
          department: (row as { department: string }).department,
          subjects: (row as { subject_names: string }).subject_names,
          classes: (row as { class_names: string }).class_names,
          status: (row as { status: string }).status,
          assignedClasses: (row as { assigned_classes: number }).assigned_classes,
        }) satisfies AdminTeacherRow,
    );
}

export function listClasses() {
  ensureDbReady();
  const db = getDb();
  return db
    .prepare(
      `
      SELECT
        c.name as class_name,
        COALESCE(u.full_name, 'Unassigned') as teacher_name,
        COUNT(DISTINCT ce.student_id) as student_count,
        ROUND(
          100.0 * SUM(CASE WHEN a.status IN ('present', 'late', 'excused') THEN 1 ELSE 0 END) / NULLIF(COUNT(a.id), 0),
          1
        ) as attendance_pct
      FROM classes c
      LEFT JOIN teachers t ON t.id = c.teacher_id
      LEFT JOIN users u ON u.id = t.user_id
      LEFT JOIN class_enrollments ce ON ce.class_id = c.id
      LEFT JOIN attendance a ON a.class_id = c.id AND a.date >= date('now', '-30 days')
      GROUP BY c.id, c.name, u.full_name
      ORDER BY c.name
    `,
    )
    .all()
    .map(
      (row) =>
        ({
          className: (row as { class_name: string }).class_name,
          teacherName: (row as { teacher_name: string }).teacher_name,
          students: (row as { student_count: number }).student_count,
          attendancePct: (row as { attendance_pct: number | null }).attendance_pct ?? 0,
        }) satisfies AdminClassRow,
    );
}

export function listAttendanceSummary(limit = 12) {
  ensureDbReady();
  const db = getDb();
  return db
    .prepare(
      `
      SELECT
        c.name as class_name,
        a.date,
        ROUND(
          100.0 * SUM(CASE WHEN a.status IN ('present', 'late', 'excused') THEN 1 ELSE 0 END) / NULLIF(COUNT(a.id), 0),
          1
        ) as attendance_pct
      FROM attendance a
      JOIN classes c ON c.id = a.class_id
      GROUP BY c.id, c.name, a.date
      ORDER BY a.date DESC, c.name ASC
      LIMIT ?
    `,
    )
    .all(limit)
    .map(
      (row) =>
        ({
          className: (row as { class_name: string }).class_name,
          date: (row as { date: string }).date,
          attendancePct: (row as { attendance_pct: number | null }).attendance_pct ?? 0,
        }) satisfies AdminAttendanceRow,
    );
}
