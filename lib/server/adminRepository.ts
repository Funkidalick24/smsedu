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
  id: number;
  className: string;
  sectionStream: string;
  academicYear: string;
  term: string;
  gradeLevel: string;
  teacherName: string;
  maxStudents: number;
  students: number;
  subjects: string;
  attendancePct: number;
  status: string;
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
  code: string;
}

export interface TeacherOption {
  id: number;
  name: string;
}

export interface CreateClassSubjectInput {
  subjectId: number;
  teacherId: number | null;
  subjectCode?: string;
}

export interface CreateClassInput {
  className: string;
  sectionStream: string;
  schoolLevel?: "Primary" | "Secondary";
  formLevel?: string;
  academicYear: string;
  term: string;
  gradeLevel: string;
  streamLetter?: string;
  curriculumType?: string;
  classTeacherId: number | null;
  assistantTeacherId: number | null;
  department?: string;
  maxStudents: number;
  building?: string;
  roomNumber?: string;
  floor?: string;
  attendanceMode?: "daily" | "period";
  attendanceTeacherId: number | null;
  trackLateArrivals?: boolean;
  gradingSystem?: string;
  assessmentTypes?: string;
  passingScore?: number;
  notes?: string;
  createdByUserId: number;
  subjects: CreateClassSubjectInput[];
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
  birthCertificateNumber?: string;
  gradeLevel: string;
  schoolLevel?: "Primary" | "Secondary";
  formLevel?: string;
  classStream?: string;
  sectionStream?: string;
  academicYear?: string;
  transferStatus?: string;
  previousSchool?: string;
  previousSchoolAddress?: string;
  grade7ExamCentreNumber?: string;
  grade7CandidateNumber?: string;
  grade7Results?: string;
  zimsecIndexNumber?: string;
  curriculumType?: string;
  houseName?: string;
  boardingStatus?: string;
  transportMethod?: string;
  busRoute?: string;
  religion?: string;
  homeLanguage?: string;
  extracurricularInterests?: string;
  guardian1Name: string;
  guardian1Relationship: string;
  guardian1Phone: string;
  guardian1NationalIdNumber?: string;
  guardian1Email?: string;
  guardian1Occupation?: string;
  guardian1Address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  allergies?: string;
  medicalNotes?: string;
  knownConditions?: string;
  immunisationRecord?: string;
  medicalAidProvider?: string;
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
  teacherRegistrationNumber?: string;
  teachingCouncilRegistration?: string;
  teachingCertificateNumber?: string;
  teacherTrainingCollege?: string;
  universityQualification?: string;
  primarySubject?: string;
  secondarySubject?: string;
  employmentCategory?: string;
  contractType?: string;
  yearsOfService?: number | null;
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

export interface TeacherDetail {
  id: number;
  employeeNo: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  nationalIdNumber: string;
  maritalStatus: string;
  phoneNumber: string;
  email: string;
  addressLine: string;
  city: string;
  postalCode: string;
  employmentDate: string;
  employmentType: string;
  jobTitle: string;
  department: string;
  status: string;
  gradeLevelsTaught: string;
  academicDepartment: string;
  homeroomTeacher: boolean;
  highestQualification: string;
  degrees: string;
  teachingCertification: string;
  teacherRegistrationNumber: string;
  teachingCouncilRegistration: string;
  teachingCertificateNumber: string;
  teacherTrainingCollege: string;
  universityQualification: string;
  primarySubject: string;
  secondarySubject: string;
  employmentCategory: string;
  contractType: string;
  yearsOfService: number | null;
  professionalLicenseNumber: string;
  specializations: string;
  yearsExperience: number | null;
  previousSchools: string;
  weeklyTeachingHours: number | null;
  timetableAssignments: string;
  subjectLoad: string;
  salary: number | null;
  paymentMethod: string;
  bankName: string;
  bankAccountNumber: string;
  taxNumber: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  emergencyContactAltPhone: string;
  classIds: number[];
  subjectIds: number[];
}

export interface TeacherDocumentRow {
  id: number;
  documentType: string;
  fileName: string;
  filePath: string;
  uploadedAt: string;
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
      SELECT id, name, COALESCE(code, '') as code
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
          code: (row as { code: string }).code,
        }) satisfies SubjectOption,
    );
}

export function listTeacherOptions() {
  ensureDbReady();
  const db = getDb();
  return db
    .prepare(
      `
      SELECT
        t.id,
        COALESCE(TRIM(t.first_name || ' ' || t.last_name), u.full_name) as display_name
      FROM teachers t
      JOIN users u ON u.id = t.user_id
      ORDER BY display_name
    `,
    )
    .all()
    .map(
      (row) =>
        ({
          id: (row as { id: number }).id,
          name: (row as { display_name: string }).display_name,
        }) satisfies TeacherOption,
    );
}

export function createClass(input: CreateClassInput) {
  ensureDbReady();
  const db = getDb();

  const tx = db.transaction(() => {
    const className = input.className.trim();
    const sectionStream = input.sectionStream.trim();
    const schoolLevel = input.schoolLevel === "Secondary" ? "Secondary" : "Primary";
    const formLevel = input.formLevel?.trim() || null;
    const academicYear = input.academicYear.trim();
    const term = input.term.trim();
    const gradeLevel = input.gradeLevel.trim();
    const streamLetter = input.streamLetter?.trim() || null;
    const curriculumType = input.curriculumType?.trim() || "Heritage-Based Curriculum";
    const fullName = `${className}-${sectionStream}`.trim();
    const normalizedAttendanceMode = input.attendanceMode === "period" ? "period" : "daily";
    const trackLateArrivals = input.trackLateArrivals === false ? 0 : 1;
    const gradingSystem = input.gradingSystem?.trim() || "Percentage";
    const passingScore = Number.isFinite(input.passingScore) ? Number(input.passingScore) : 50;

    const termRow = db.prepare("SELECT id FROM terms WHERE name = ?").get(term) as { id: number } | undefined;
    let termId = termRow?.id ?? null;
    if (!termId) {
      const now = new Date().toISOString().split("T")[0];
      const insertTerm = db
        .prepare(
          `
          INSERT INTO terms (name, start_date, end_date, is_active)
          VALUES (?, ?, ?, 0)
        `,
        )
        .run(term, now, now);
      termId = Number(insertTerm.lastInsertRowid);
    }

    const classInsert = db
      .prepare(
        `
        INSERT INTO classes (
          name,
          teacher_id,
          term_id,
          section_stream,
          school_level,
          form_level,
          academic_year,
          term_label,
          stream_letter,
          curriculum_type,
          assistant_teacher_id,
          grade_level,
          department,
          max_students,
          building,
          room_number,
          floor,
          attendance_mode,
          attendance_teacher_id,
          track_late_arrivals,
          grading_system,
          assessment_types,
          passing_score,
          notes,
          status,
          created_by_user_id,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      )
      .run(
        fullName,
        input.classTeacherId,
        termId,
        sectionStream,
        schoolLevel,
        formLevel,
        academicYear,
        term,
        streamLetter,
        curriculumType,
        input.assistantTeacherId,
        gradeLevel,
        input.department?.trim() || null,
        input.maxStudents,
        input.building?.trim() || null,
        input.roomNumber?.trim() || null,
        input.floor?.trim() || null,
        normalizedAttendanceMode,
        input.attendanceTeacherId,
        trackLateArrivals,
        gradingSystem,
        input.assessmentTypes?.trim() || null,
        passingScore,
        input.notes?.trim() || null,
        input.createdByUserId,
      );

    const classId = Number(classInsert.lastInsertRowid);

    if (input.classTeacherId) {
      db.prepare("INSERT OR IGNORE INTO teacher_classes (teacher_id, class_id) VALUES (?, ?)").run(
        input.classTeacherId,
        classId,
      );
    }
    if (input.assistantTeacherId) {
      db.prepare("INSERT OR IGNORE INTO teacher_classes (teacher_id, class_id) VALUES (?, ?)").run(
        input.assistantTeacherId,
        classId,
      );
    }

    const insertClassSubject = db.prepare(
      `
      INSERT OR IGNORE INTO class_subjects (class_id, subject_id, teacher_id, subject_code)
      VALUES (?, ?, ?, ?)
    `,
    );
    for (const subject of input.subjects) {
      insertClassSubject.run(classId, subject.subjectId, subject.teacherId, subject.subjectCode?.trim() || null);
      if (subject.teacherId) {
        db.prepare("INSERT OR IGNORE INTO teacher_subjects (teacher_id, subject_id) VALUES (?, ?)").run(
          subject.teacherId,
          subject.subjectId,
        );
        db.prepare("INSERT OR IGNORE INTO teacher_classes (teacher_id, class_id) VALUES (?, ?)").run(
          subject.teacherId,
          classId,
        );
      }
    }

    return classId;
  });

  const classId = tx();
  const row = db
    .prepare(
      `
      SELECT
        c.id,
        c.name as class_name,
        COALESCE(c.section_stream, '') as section_stream,
        COALESCE(c.academic_year, '') as academic_year,
        COALESCE(c.term_label, t.name, '') as term,
        COALESCE(c.grade_level, '') as grade_level,
        COALESCE(u.full_name, 'Unassigned') as teacher_name,
        COALESCE(c.max_students, 0) as max_students,
        COALESCE(c.status, 'active') as status
      FROM classes c
      LEFT JOIN teachers ct ON ct.id = c.teacher_id
      LEFT JOIN users u ON u.id = ct.user_id
      LEFT JOIN terms t ON t.id = c.term_id
      WHERE c.id = ?
    `,
    )
    .get(classId) as
    | {
        id: number;
        class_name: string;
        section_stream: string;
        academic_year: string;
        term: string;
        grade_level: string;
        teacher_name: string;
        max_students: number;
        status: string;
      }
    | undefined;

  if (!row) {
    throw new Error("Failed to load created class.");
  }

  return {
    id: row.id,
    className: row.class_name,
    sectionStream: row.section_stream,
    academicYear: row.academic_year,
    term: row.term,
    gradeLevel: row.grade_level,
    teacherName: row.teacher_name,
    maxStudents: row.max_students,
    status: row.status,
  };
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
        school_level,
        form_level,
        class_stream,
        birth_certificate_number,
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
        previous_school_address,
        transfer_status,
        grade7_exam_centre_number,
        grade7_candidate_number,
        grade7_results,
        zimsec_index_number,
        curriculum_type,
        house_name,
        academic_year,
        boarding_status,
        transport_method,
        bus_route,
        religion,
        home_language,
        extracurricular_interests
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        userId,
        admissionNo,
        gradeLevel,
        input.schoolLevel === "Secondary" ? "Secondary" : "Primary",
        input.formLevel?.trim() || null,
        input.classStream?.trim() || null,
        input.birthCertificateNumber?.trim() || null,
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
        input.previousSchoolAddress?.trim() || null,
        input.transferStatus?.trim() || null,
        input.grade7ExamCentreNumber?.trim() || null,
        input.grade7CandidateNumber?.trim() || null,
        input.grade7Results?.trim() || null,
        input.zimsecIndexNumber?.trim() || null,
        input.curriculumType?.trim() || "Heritage-Based Curriculum",
        input.houseName?.trim() || null,
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
      INSERT INTO guardians (full_name, relationship, phone_number, email, occupation, address, national_id_number)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        input.guardian1Name.trim(),
        input.guardian1Relationship.trim(),
        input.guardian1Phone.trim(),
        input.guardian1Email?.trim() || null,
        input.guardian1Occupation?.trim() || null,
        input.guardian1Address?.trim() || null,
        input.guardian1NationalIdNumber?.trim() || null,
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
        medical_notes,
        immunisation_record,
        medical_aid_provider
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      studentId,
      input.knownConditions?.trim() || null,
      input.allergies?.trim() || null,
      input.medications?.trim() || null,
      input.bloodType?.trim() || null,
      input.specialNeeds?.trim() || null,
      input.medicalNotes?.trim() || null,
      input.immunisationRecord?.trim() || null,
      input.medicalAidProvider?.trim() || null,
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
        teacher_registration_number,
        teaching_council_registration,
        teaching_certificate_number,
        teacher_training_college,
        university_qualification,
        primary_subject,
        secondary_subject,
        employment_category,
        contract_type,
        years_of_service,
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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        input.teacherRegistrationNumber?.trim() || null,
        input.teachingCouncilRegistration?.trim() || null,
        input.teachingCertificateNumber?.trim() || null,
        input.teacherTrainingCollege?.trim() || null,
        input.universityQualification?.trim() || null,
        input.primarySubject?.trim() || null,
        input.secondarySubject?.trim() || null,
        input.employmentCategory?.trim() || null,
        input.contractType?.trim() || null,
        input.yearsOfService ?? null,
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
        c.id,
        c.name as class_name,
        COALESCE(c.section_stream, '-') as section_stream,
        COALESCE(c.academic_year, '-') as academic_year,
        COALESCE(c.term_label, tm.name, '-') as term,
        COALESCE(c.grade_level, c.name) as grade_level,
        COALESCE(u.full_name, 'Unassigned') as teacher_name,
        COALESCE(c.max_students, 0) as max_students,
        COALESCE(c.status, 'active') as status,
        COUNT(DISTINCT ce.student_id) as student_count,
        COALESCE(GROUP_CONCAT(DISTINCT s.name), 'Unassigned') as subject_names,
        ROUND(
          100.0 * SUM(CASE WHEN a.status IN ('present', 'late', 'excused') THEN 1 ELSE 0 END) / NULLIF(COUNT(a.id), 0),
          1
        ) as attendance_pct
      FROM classes c
      LEFT JOIN teachers t ON t.id = c.teacher_id
      LEFT JOIN users u ON u.id = t.user_id
      LEFT JOIN terms tm ON tm.id = c.term_id
      LEFT JOIN class_enrollments ce ON ce.class_id = c.id
      LEFT JOIN class_subjects cs ON cs.class_id = c.id
      LEFT JOIN subjects s ON s.id = cs.subject_id
      LEFT JOIN attendance a ON a.class_id = c.id AND a.date >= date('now', '-30 days')
      GROUP BY c.id, c.name, c.section_stream, c.academic_year, c.term_label, tm.name, c.grade_level, u.full_name, c.max_students, c.status
      ORDER BY c.name
    `,
    )
    .all()
    .map(
      (row) =>
        ({
          id: (row as { id: number }).id,
          className: (row as { class_name: string }).class_name,
          sectionStream: (row as { section_stream: string }).section_stream,
          academicYear: (row as { academic_year: string }).academic_year,
          term: (row as { term: string }).term,
          gradeLevel: (row as { grade_level: string }).grade_level,
          teacherName: (row as { teacher_name: string }).teacher_name,
          maxStudents: (row as { max_students: number }).max_students,
          students: (row as { student_count: number }).student_count,
          subjects: (row as { subject_names: string }).subject_names,
          attendancePct: (row as { attendance_pct: number | null }).attendance_pct ?? 0,
          status: (row as { status: string | null }).status ?? "active",
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

export function getTeacherById(teacherId: number) {
  ensureDbReady();
  const db = getDb();

  const row = db
    .prepare(
      `
      SELECT
        t.id,
        t.employee_no,
        t.first_name,
        t.middle_name,
        t.last_name,
        t.date_of_birth,
        t.gender,
        t.nationality,
        t.national_id_number,
        t.marital_status,
        t.phone_number,
        u.email,
        t.address_line,
        t.city,
        t.postal_code,
        t.employment_date,
        t.employment_type,
        t.job_title,
        t.department,
        t.status,
        t.grade_levels_taught,
        t.academic_department,
        t.homeroom_teacher,
        t.highest_qualification,
        t.degrees,
        t.teaching_certification,
        t.teacher_registration_number,
        t.teaching_council_registration,
        t.teaching_certificate_number,
        t.teacher_training_college,
        t.university_qualification,
        t.primary_subject,
        t.secondary_subject,
        t.employment_category,
        t.contract_type,
        t.years_of_service,
        t.professional_license_number,
        t.specializations,
        t.years_experience,
        t.previous_schools,
        t.weekly_teaching_hours,
        t.timetable_assignments,
        t.subject_load,
        t.salary,
        t.payment_method,
        t.bank_name,
        t.bank_account_number,
        t.tax_number,
        t.emergency_contact_name,
        t.emergency_contact_relationship,
        t.emergency_contact_phone,
        t.emergency_contact_alt_phone
      FROM teachers t
      JOIN users u ON u.id = t.user_id
      WHERE t.id = ?
    `,
    )
    .get(teacherId) as
    | {
        id: number;
        employee_no: string;
        first_name: string | null;
        middle_name: string | null;
        last_name: string | null;
        date_of_birth: string | null;
        gender: string | null;
        nationality: string | null;
        national_id_number: string | null;
        marital_status: string | null;
        phone_number: string | null;
        email: string;
        address_line: string | null;
        city: string | null;
        postal_code: string | null;
        employment_date: string | null;
        employment_type: string | null;
        job_title: string | null;
        department: string | null;
        status: string | null;
        grade_levels_taught: string | null;
        academic_department: string | null;
        homeroom_teacher: number | null;
        highest_qualification: string | null;
        degrees: string | null;
        teaching_certification: string | null;
        teacher_registration_number: string | null;
        teaching_council_registration: string | null;
        teaching_certificate_number: string | null;
        teacher_training_college: string | null;
        university_qualification: string | null;
        primary_subject: string | null;
        secondary_subject: string | null;
        employment_category: string | null;
        contract_type: string | null;
        years_of_service: number | null;
        professional_license_number: string | null;
        specializations: string | null;
        years_experience: number | null;
        previous_schools: string | null;
        weekly_teaching_hours: number | null;
        timetable_assignments: string | null;
        subject_load: string | null;
        salary: number | null;
        payment_method: string | null;
        bank_name: string | null;
        bank_account_number: string | null;
        tax_number: string | null;
        emergency_contact_name: string | null;
        emergency_contact_relationship: string | null;
        emergency_contact_phone: string | null;
        emergency_contact_alt_phone: string | null;
      }
    | undefined;

  if (!row) {
    return null;
  }

  const classIds = (db
    .prepare("SELECT class_id FROM teacher_classes WHERE teacher_id = ? ORDER BY class_id")
    .all(teacherId) as Array<{ class_id: number }>).map((item) => item.class_id);
  const subjectIds = (db
    .prepare("SELECT subject_id FROM teacher_subjects WHERE teacher_id = ? ORDER BY subject_id")
    .all(teacherId) as Array<{ subject_id: number }>).map((item) => item.subject_id);

  return {
    id: row.id,
    employeeNo: row.employee_no,
    firstName: row.first_name ?? "",
    middleName: row.middle_name ?? "",
    lastName: row.last_name ?? "",
    dateOfBirth: row.date_of_birth ?? "",
    gender: row.gender ?? "",
    nationality: row.nationality ?? "",
    nationalIdNumber: row.national_id_number ?? "",
    maritalStatus: row.marital_status ?? "",
    phoneNumber: row.phone_number ?? "",
    email: row.email,
    addressLine: row.address_line ?? "",
    city: row.city ?? "",
    postalCode: row.postal_code ?? "",
    employmentDate: row.employment_date ?? "",
    employmentType: row.employment_type ?? "",
    jobTitle: row.job_title ?? "",
    department: row.department ?? "",
    status: row.status ?? "Active",
    gradeLevelsTaught: row.grade_levels_taught ?? "",
    academicDepartment: row.academic_department ?? "",
    homeroomTeacher: Boolean(row.homeroom_teacher),
    highestQualification: row.highest_qualification ?? "",
    degrees: row.degrees ?? "",
    teachingCertification: row.teaching_certification ?? "",
    teacherRegistrationNumber: row.teacher_registration_number ?? "",
    teachingCouncilRegistration: row.teaching_council_registration ?? "",
    teachingCertificateNumber: row.teaching_certificate_number ?? "",
    teacherTrainingCollege: row.teacher_training_college ?? "",
    universityQualification: row.university_qualification ?? "",
    primarySubject: row.primary_subject ?? "",
    secondarySubject: row.secondary_subject ?? "",
    employmentCategory: row.employment_category ?? "",
    contractType: row.contract_type ?? "",
    yearsOfService: row.years_of_service,
    professionalLicenseNumber: row.professional_license_number ?? "",
    specializations: row.specializations ?? "",
    yearsExperience: row.years_experience,
    previousSchools: row.previous_schools ?? "",
    weeklyTeachingHours: row.weekly_teaching_hours,
    timetableAssignments: row.timetable_assignments ?? "",
    subjectLoad: row.subject_load ?? "",
    salary: row.salary,
    paymentMethod: row.payment_method ?? "",
    bankName: row.bank_name ?? "",
    bankAccountNumber: row.bank_account_number ?? "",
    taxNumber: row.tax_number ?? "",
    emergencyContactName: row.emergency_contact_name ?? "",
    emergencyContactRelationship: row.emergency_contact_relationship ?? "",
    emergencyContactPhone: row.emergency_contact_phone ?? "",
    emergencyContactAltPhone: row.emergency_contact_alt_phone ?? "",
    classIds,
    subjectIds,
  } satisfies TeacherDetail;
}

export function updateTeacher(teacherId: number, input: CreateTeacherInput) {
  ensureDbReady();
  const db = getDb();

  const existing = db.prepare("SELECT id, user_id FROM teachers WHERE id = ?").get(teacherId) as
    | { id: number; user_id: number }
    | undefined;
  if (!existing) {
    throw new Error("Teacher not found.");
  }

  const tx = db.transaction(() => {
    const firstName = input.firstName.trim();
    const middleName = input.middleName?.trim() || null;
    const lastName = input.lastName.trim();
    const fullName = `${firstName}${middleName ? ` ${middleName}` : ""} ${lastName}`.trim();
    const email = input.email.trim().toLowerCase();

    db.prepare(
      `
      UPDATE users
      SET email = ?, full_name = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    ).run(email, fullName, existing.user_id);

    db.prepare(
      `
      UPDATE teachers SET
        employee_no = ?,
        first_name = ?,
        middle_name = ?,
        last_name = ?,
        date_of_birth = ?,
        gender = ?,
        nationality = ?,
        national_id_number = ?,
        marital_status = ?,
        phone_number = ?,
        email = ?,
        address_line = ?,
        city = ?,
        postal_code = ?,
        employment_date = ?,
        employment_type = ?,
        job_title = ?,
        department = ?,
        status = ?,
        grade_levels_taught = ?,
        academic_department = ?,
        homeroom_teacher = ?,
        highest_qualification = ?,
        degrees = ?,
        teaching_certification = ?,
        teacher_registration_number = ?,
        teaching_council_registration = ?,
        teaching_certificate_number = ?,
        teacher_training_college = ?,
        university_qualification = ?,
        primary_subject = ?,
        secondary_subject = ?,
        employment_category = ?,
        contract_type = ?,
        years_of_service = ?,
        professional_license_number = ?,
        specializations = ?,
        years_experience = ?,
        previous_schools = ?,
        weekly_teaching_hours = ?,
        timetable_assignments = ?,
        subject_load = ?,
        salary = ?,
        payment_method = ?,
        bank_name = ?,
        bank_account_number = ?,
        tax_number = ?,
        emergency_contact_name = ?,
        emergency_contact_relationship = ?,
        emergency_contact_phone = ?,
        emergency_contact_alt_phone = ?
      WHERE id = ?
    `,
    ).run(
      input.employeeNo.trim().toUpperCase(),
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
      input.teacherRegistrationNumber?.trim() || null,
      input.teachingCouncilRegistration?.trim() || null,
      input.teachingCertificateNumber?.trim() || null,
      input.teacherTrainingCollege?.trim() || null,
      input.universityQualification?.trim() || null,
      input.primarySubject?.trim() || null,
      input.secondarySubject?.trim() || null,
      input.employmentCategory?.trim() || null,
      input.contractType?.trim() || null,
      input.yearsOfService ?? null,
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
      teacherId,
    );

    db.prepare("DELETE FROM teacher_subjects WHERE teacher_id = ?").run(teacherId);
    const insertSubject = db.prepare("INSERT OR IGNORE INTO teacher_subjects (teacher_id, subject_id) VALUES (?, ?)");
    for (const subjectId of input.subjectIds) {
      insertSubject.run(teacherId, subjectId);
    }

    db.prepare("UPDATE classes SET teacher_id = NULL WHERE teacher_id = ?").run(teacherId);
    db.prepare("DELETE FROM teacher_classes WHERE teacher_id = ?").run(teacherId);
    const insertClass = db.prepare("INSERT OR IGNORE INTO teacher_classes (teacher_id, class_id) VALUES (?, ?)");
    const updateClassTeacher = db.prepare("UPDATE classes SET teacher_id = ? WHERE id = ?");
    for (const classId of input.classIds) {
      insertClass.run(teacherId, classId);
      updateClassTeacher.run(teacherId, classId);
    }
  });

  tx();
  return getTeacherById(teacherId);
}

export function listTeacherDocuments(teacherId: number) {
  ensureDbReady();
  const db = getDb();
  return db
    .prepare(
      `
      SELECT id, document_type, file_name, file_path, uploaded_at
      FROM teacher_documents
      WHERE teacher_id = ?
      ORDER BY uploaded_at DESC, id DESC
    `,
    )
    .all(teacherId)
    .map(
      (row) =>
        ({
          id: (row as { id: number }).id,
          documentType: (row as { document_type: string }).document_type,
          fileName: (row as { file_name: string }).file_name,
          filePath: (row as { file_path: string }).file_path,
          uploadedAt: (row as { uploaded_at: string }).uploaded_at,
        }) satisfies TeacherDocumentRow,
    );
}

export function createTeacherDocument(teacherId: number, documentType: string, fileName: string, filePath: string) {
  ensureDbReady();
  const db = getDb();
  const exists = db.prepare("SELECT id FROM teachers WHERE id = ?").get(teacherId) as { id: number } | undefined;
  if (!exists) {
    throw new Error("Teacher not found.");
  }

  const result = db
    .prepare(
      `
      INSERT INTO teacher_documents (teacher_id, document_type, file_name, file_path)
      VALUES (?, ?, ?, ?)
    `,
    )
    .run(teacherId, documentType, fileName, filePath);

  return Number(result.lastInsertRowid);
}
