import { ensureDbReady, getDb } from "./db";

function tableExists(tableName: string) {
  const db = getDb();
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName) as
    | { name: string }
    | undefined;
  return Boolean(row);
}

export function getTeacherIdForUser(userId: number) {
  ensureDbReady();
  const db = getDb();
  const row = db.prepare("SELECT id FROM teachers WHERE user_id = ?").get(userId) as { id: number } | undefined;
  return row?.id ?? null;
}

export function getTeacherClasses(userId: number) {
  const teacherId = getTeacherIdForUser(userId);
  if (!teacherId) return [];
  const db = getDb();
  return db
    .prepare(
      `
      SELECT
        c.name as className,
        COALESCE(c.grade_level, 'Unassigned') as gradeLevel,
        COALESCE(t.name, 'Current term') as term,
        COUNT(DISTINCT ce.student_id) as students,
        COUNT(DISTINCT cs.subject_id) as subjects
      FROM classes c
      LEFT JOIN terms t ON t.id = c.term_id
      LEFT JOIN class_enrollments ce ON ce.class_id = c.id
      LEFT JOIN class_subjects cs ON cs.class_id = c.id
      WHERE c.teacher_id = ? OR c.assistant_teacher_id = ?
      GROUP BY c.id
      ORDER BY c.name
    `,
    )
    .all(teacherId, teacherId) as Array<{ className: string; gradeLevel: string; term: string; students: number; subjects: number }>;
}

export function getTeacherAssignments(userId: number) {
  const teacherId = getTeacherIdForUser(userId);
  if (!teacherId || !tableExists("assignments")) return [];
  const db = getDb();
  return db
    .prepare(
      `
      SELECT
        a.title,
        c.name as className,
        s.name as subject,
        a.due_date as dueDate,
        a.status,
        COUNT(sub.id) as submissions,
        COUNT(CASE WHEN sub.status = 'graded' THEN 1 END) as graded
      FROM assignments a
      JOIN classes c ON c.id = a.class_id
      JOIN subjects s ON s.id = a.subject_id
      LEFT JOIN assignment_submissions sub ON sub.assignment_id = a.id
      WHERE a.teacher_id = ?
      GROUP BY a.id
      ORDER BY a.due_date ASC, a.id ASC
      LIMIT 25
    `,
    )
    .all(teacherId) as Array<{
      title: string;
      className: string;
      subject: string;
      dueDate: string;
      status: string;
      submissions: number;
      graded: number;
    }>;
}

export function getTeacherGrades(userId: number) {
  const teacherId = getTeacherIdForUser(userId);
  if (!teacherId || !tableExists("assessments")) return [];
  const db = getDb();
  return db
    .prepare(
      `
      SELECT
        a.title,
        c.name as className,
        s.name as subject,
        a.assessment_type as type,
        a.assessment_date as assessmentDate,
        ROUND(AVG((sc.score * 100.0) / NULLIF(a.max_score, 0)), 1) as averagePct,
        COUNT(sc.id) as gradedCount
      FROM assessments a
      JOIN classes c ON c.id = a.class_id
      JOIN subjects s ON s.id = a.subject_id
      LEFT JOIN assessment_scores sc ON sc.assessment_id = a.id
      WHERE c.teacher_id = ?
      GROUP BY a.id
      ORDER BY a.assessment_date DESC, a.id DESC
      LIMIT 25
    `,
    )
    .all(teacherId) as Array<{
      title: string;
      className: string;
      subject: string;
      type: string;
      assessmentDate: string;
      averagePct: number | null;
      gradedCount: number;
    }>;
}

export function getParentChildren() {
  ensureDbReady();
  const db = getDb();
  return db
    .prepare(
      `
      SELECT
        s.id,
        u.full_name as name,
        s.admission_no as admissionNo,
        s.grade_level as gradeLevel,
        COALESCE(GROUP_CONCAT(DISTINCT c.name), 'Not enrolled') as classes,
        ROUND(100.0 * SUM(CASE WHEN a.status IN ('present', 'late', 'excused') THEN 1 ELSE 0 END) / NULLIF(COUNT(a.id), 0), 1) as attendancePct
      FROM students s
      JOIN users u ON u.id = s.user_id
      LEFT JOIN class_enrollments ce ON ce.student_id = s.id
      LEFT JOIN classes c ON c.id = ce.class_id
      LEFT JOIN attendance a ON a.student_id = s.id
      GROUP BY s.id
      ORDER BY u.full_name
      LIMIT 10
    `,
    )
    .all() as Array<{ id: number; name: string; admissionNo: string; gradeLevel: string; classes: string; attendancePct: number | null }>;
}

export function getParentMessages() {
  ensureDbReady();
  if (!tableExists("announcements")) return [];
  const db = getDb();
  return db
    .prepare(
      `
      SELECT title, body, priority, published_at as publishedAt
      FROM announcements
      WHERE target_role IN ('parent', 'all') OR priority IN ('high', 'urgent')
      ORDER BY published_at DESC
      LIMIT 15
    `,
    )
    .all() as Array<{ title: string; body: string; priority: string; publishedAt: string }>;
}

export function getSuperAdminAccounts() {
  ensureDbReady();
  const db = getDb();
  return db
    .prepare(
      `
      SELECT
        u.full_name as name,
        u.email,
        r.name as role,
        COALESCE(s.name, 'Platform') as school,
        CASE WHEN u.is_active = 1 THEN 'Active' ELSE 'Inactive' END as status,
        u.created_at as createdAt
      FROM users u
      JOIN roles r ON r.id = u.role_id
      LEFT JOIN schools s ON s.id = u.school_id
      WHERE r.name IN ('admin', 'principal', 'headmaster', 'superadmin')
      ORDER BY r.name, u.full_name
    `,
    )
    .all() as Array<{ name: string; email: string; role: string; school: string; status: string; createdAt: string }>;
}
