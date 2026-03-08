import { ensureDbReady, getDb } from "./db";

export interface StudentDashboardStat {
  title: string;
  value: string;
  trend: string;
}

export interface StudentDashboardAssignment {
  id: number;
  subject: string;
  title: string;
  dueDate: string;
  status: string;
  submittedAt: string | null;
}

export interface StudentAnnouncement {
  id: number;
  title: string;
  body: string;
  priority: "low" | "normal" | "high" | "urgent";
  publishedAt: string;
}

export interface StudentNotification {
  label: string;
  value: number;
}

export interface StudentCalendarItem {
  id: number;
  title: string;
  date: string;
  type: "assignment" | "class";
  subject: string;
}

export interface StudentSubjectResource {
  id: number;
  title: string;
  resourceType: string;
  resourceUrl: string;
  description: string;
  postedAt: string;
}

export interface StudentSubjectRow {
  subjectId: number;
  subject: string;
  className: string;
  teacherName: string;
  attendancePct: number;
  pendingAssignments: number;
  resources: StudentSubjectResource[];
  schedule: Array<{
    dayOfWeek: string;
    periodNumber: number;
    room: string;
  }>;
}

export interface StudentHomeworkRow {
  assignmentId: number;
  subjectId: number;
  subject: string;
  className: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  allowResubmission: boolean;
  status: "pending" | "upcoming" | "overdue" | "submitted" | "resubmitted" | "late" | "graded";
  submittedAt: string | null;
  score: number | null;
  feedback: string | null;
}

export interface StudentResultRow {
  term: string;
  subject: string;
  assessment: string;
  assessmentType: string;
  assessmentDate: string;
  score: number;
  maxScore: number;
  percent: number;
  gradeLetter: string;
  remarks: string;
}

function getTodayIso() {
  return new Date().toISOString().split("T")[0];
}

export function getStudentIdForUser(userId: number) {
  ensureDbReady();
  const db = getDb();
  const row = db.prepare("SELECT id FROM students WHERE user_id = ?").get(userId) as { id: number } | undefined;
  return row?.id ?? null;
}

export function getStudentDashboard(studentId: number) {
  ensureDbReady();
  const db = getDb();
  const today = getTodayIso();

  const attendancePct =
    (db
      .prepare(
        `
      SELECT
        ROUND(
          100.0 * SUM(CASE WHEN status IN ('present', 'late', 'excused') THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0),
          1
        ) as pct
      FROM attendance
      WHERE student_id = ? AND date >= date('now', '-30 days')
    `,
      )
      .get(studentId) as { pct: number | null }).pct ?? 0;

  const averagePercent =
    (db
      .prepare(
        `
      SELECT ROUND(AVG((sc.score * 100.0) / NULLIF(a.max_score, 0)), 1) as pct
      FROM assessment_scores sc
      JOIN assessments a ON a.id = sc.assessment_id
      WHERE sc.student_id = ?
    `,
      )
      .get(studentId) as { pct: number | null }).pct ?? 0;

  const upcomingDeadlines =
    (db
      .prepare(
        `
      SELECT COUNT(*) as count
      FROM assignments a
      JOIN class_enrollments ce ON ce.class_id = a.class_id
      LEFT JOIN assignment_submissions sub ON sub.assignment_id = a.id AND sub.student_id = ce.student_id
      WHERE ce.student_id = ?
        AND a.status = 'published'
        AND sub.id IS NULL
        AND a.due_date >= ?
        AND a.due_date <= date(?, '+7 days')
    `,
      )
      .get(studentId, today, today) as { count: number }).count;

  const unreadAnnouncements =
    (db
      .prepare(
        `
      SELECT COUNT(*) as count
      FROM announcements an
      WHERE (an.target_role = 'student' OR an.target_role = 'all')
        AND (an.expires_at IS NULL OR an.expires_at >= date('now'))
    `,
      )
      .get() as { count: number }).count;

  const stats: StudentDashboardStat[] = [
    { title: "Term Average", value: `${averagePercent}%`, trend: "From graded assessments" },
    { title: "Attendance", value: `${attendancePct}%`, trend: "Last 30 days" },
    { title: "Upcoming Deadlines", value: `${upcomingDeadlines}`, trend: "Due in next 7 days" },
    { title: "Announcements", value: `${unreadAnnouncements}`, trend: "Active notices" },
  ];

  const upcomingAssignments = db
    .prepare(
      `
      SELECT
        a.id,
        s.name as subject_name,
        a.title,
        a.due_date,
        sub.status as submission_status,
        sub.submitted_at
      FROM assignments a
      JOIN class_enrollments ce ON ce.class_id = a.class_id
      JOIN subjects s ON s.id = a.subject_id
      LEFT JOIN assignment_submissions sub ON sub.assignment_id = a.id AND sub.student_id = ce.student_id
      WHERE ce.student_id = ?
        AND a.status = 'published'
      ORDER BY a.due_date ASC, a.id ASC
      LIMIT 8
    `,
    )
    .all(studentId)
    .map((row) => {
      const typed = row as {
        id: number;
        subject_name: string;
        title: string;
        due_date: string;
        submission_status: string | null;
        submitted_at: string | null;
      };
      let status = typed.submission_status ?? "pending";
      if (!typed.submission_status && typed.due_date < today) {
        status = "overdue";
      } else if (!typed.submission_status && typed.due_date <= new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0]) {
        status = "upcoming";
      }
      return {
        id: typed.id,
        subject: typed.subject_name,
        title: typed.title,
        dueDate: typed.due_date,
        status,
        submittedAt: typed.submitted_at,
      } satisfies StudentDashboardAssignment;
    });

  const announcements = db
    .prepare(
      `
      SELECT id, title, body, priority, published_at
      FROM announcements
      WHERE (target_role = 'student' OR target_role = 'all')
        AND (expires_at IS NULL OR expires_at >= date('now'))
      ORDER BY
        CASE priority
          WHEN 'urgent' THEN 1
          WHEN 'high' THEN 2
          WHEN 'normal' THEN 3
          ELSE 4
        END,
        published_at DESC
      LIMIT 6
    `,
    )
    .all()
    .map(
      (row) =>
        ({
          id: (row as { id: number }).id,
          title: (row as { title: string }).title,
          body: (row as { body: string }).body,
          priority: (row as { priority: "low" | "normal" | "high" | "urgent" }).priority,
          publishedAt: (row as { published_at: string }).published_at,
        }) satisfies StudentAnnouncement,
    );

  const overdueCount =
    (db
      .prepare(
        `
      SELECT COUNT(*) as count
      FROM assignments a
      JOIN class_enrollments ce ON ce.class_id = a.class_id
      LEFT JOIN assignment_submissions sub ON sub.assignment_id = a.id AND sub.student_id = ce.student_id
      WHERE ce.student_id = ?
        AND a.status = 'published'
        AND sub.id IS NULL
        AND a.due_date < ?
    `,
      )
      .get(studentId, today) as { count: number }).count;

  const submittedCount =
    (db
      .prepare(
        `
      SELECT COUNT(*) as count
      FROM assignment_submissions
      WHERE student_id = ? AND date(submitted_at) >= date('now', '-14 days')
    `,
      )
      .get(studentId) as { count: number }).count;

  const notifications: StudentNotification[] = [
    { label: "Overdue tasks", value: overdueCount },
    { label: "Submitted (14d)", value: submittedCount },
    { label: "Active notices", value: announcements.length },
  ];

  const calendar = db
    .prepare(
      `
      SELECT
        a.id,
        a.title,
        a.due_date as event_date,
        s.name as subject_name
      FROM assignments a
      JOIN class_enrollments ce ON ce.class_id = a.class_id
      JOIN subjects s ON s.id = a.subject_id
      WHERE ce.student_id = ?
      ORDER BY a.due_date ASC
      LIMIT 10
    `,
    )
    .all(studentId)
    .map(
      (row) =>
        ({
          id: (row as { id: number }).id,
          title: (row as { title: string }).title,
          date: (row as { event_date: string }).event_date,
          type: "assignment",
          subject: (row as { subject_name: string }).subject_name,
        }) satisfies StudentCalendarItem,
    );

  return {
    stats,
    upcomingAssignments,
    announcements,
    notifications,
    calendar,
  };
}

export function listStudentSubjects(studentId: number) {
  ensureDbReady();
  const db = getDb();

  const rows = db
    .prepare(
      `
      SELECT
        s.id as subject_id,
        s.name as subject_name,
        c.id as class_id,
        c.name as class_name,
        COALESCE(u.full_name, 'TBA') as teacher_name
      FROM class_enrollments ce
      JOIN classes c ON c.id = ce.class_id
      JOIN class_subjects cs ON cs.class_id = c.id
      JOIN subjects s ON s.id = cs.subject_id
      LEFT JOIN teachers t ON t.id = cs.teacher_id
      LEFT JOIN users u ON u.id = t.user_id
      WHERE ce.student_id = ?
      GROUP BY s.id, s.name, c.id, c.name, u.full_name
      ORDER BY s.name, c.name
    `,
    )
    .all(studentId) as Array<{
    subject_id: number;
    subject_name: string;
    class_id: number;
    class_name: string;
    teacher_name: string;
  }>;

  const resourceQuery = db.prepare(
    `
    SELECT id, title, resource_type, COALESCE(resource_url, '') as resource_url, COALESCE(description, '') as description, posted_at
    FROM subject_resources
    WHERE class_id = ? AND subject_id = ?
    ORDER BY posted_at DESC, id DESC
    LIMIT 6
  `,
  );

  const scheduleQuery = db.prepare(
    `
    SELECT day_of_week, period_number, COALESCE(room_assignment, '-') as room_assignment
    FROM class_timetable_slots
    WHERE class_id = ? AND subject_id = ?
    ORDER BY
      CASE day_of_week
        WHEN 'Monday' THEN 1
        WHEN 'Tuesday' THEN 2
        WHEN 'Wednesday' THEN 3
        WHEN 'Thursday' THEN 4
        WHEN 'Friday' THEN 5
        WHEN 'Saturday' THEN 6
        WHEN 'Sunday' THEN 7
        ELSE 8
      END,
      period_number
  `,
  );

  const attendanceQuery = db.prepare(
    `
    SELECT
      ROUND(
        100.0 * SUM(CASE WHEN status IN ('present', 'late', 'excused') THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0),
        1
      ) as pct
    FROM attendance
    WHERE student_id = ? AND class_id = ? AND date >= date('now', '-30 days')
  `,
  );

  const pendingAssignmentsQuery = db.prepare(
    `
    SELECT COUNT(*) as count
    FROM assignments a
    LEFT JOIN assignment_submissions sub ON sub.assignment_id = a.id AND sub.student_id = ?
    WHERE a.class_id = ? AND a.subject_id = ? AND a.status = 'published' AND sub.id IS NULL
  `,
  );

  return rows.map((row) => {
    const resources = resourceQuery.all(row.class_id, row.subject_id).map(
      (resource) =>
        ({
          id: (resource as { id: number }).id,
          title: (resource as { title: string }).title,
          resourceType: (resource as { resource_type: string }).resource_type,
          resourceUrl: (resource as { resource_url: string }).resource_url,
          description: (resource as { description: string }).description,
          postedAt: (resource as { posted_at: string }).posted_at,
        }) satisfies StudentSubjectResource,
    );

    const schedule = scheduleQuery.all(row.class_id, row.subject_id).map((slot) => ({
      dayOfWeek: (slot as { day_of_week: string }).day_of_week,
      periodNumber: (slot as { period_number: number }).period_number,
      room: (slot as { room_assignment: string }).room_assignment,
    }));

    const attendancePct =
      (attendanceQuery.get(studentId, row.class_id) as { pct: number | null }).pct ?? 0;
    const pendingAssignments =
      (pendingAssignmentsQuery.get(studentId, row.class_id, row.subject_id) as { count: number }).count;

    return {
      subjectId: row.subject_id,
      subject: row.subject_name,
      className: row.class_name,
      teacherName: row.teacher_name,
      attendancePct,
      pendingAssignments,
      resources,
      schedule,
    } satisfies StudentSubjectRow;
  });
}

export function listStudentHomework(studentId: number, subjectId?: number | null, statusFilter?: string | null) {
  ensureDbReady();
  const db = getDb();
  const today = getTodayIso();

  const rows = db
    .prepare(
      `
      SELECT
        a.id as assignment_id,
        a.subject_id,
        s.name as subject_name,
        c.name as class_name,
        a.title,
        COALESCE(a.description, '') as description,
        a.due_date,
        a.max_score,
        a.allow_resubmission,
        sub.status as submission_status,
        sub.submitted_at,
        sub.score,
        sub.feedback
      FROM assignments a
      JOIN class_enrollments ce ON ce.class_id = a.class_id
      JOIN classes c ON c.id = a.class_id
      JOIN subjects s ON s.id = a.subject_id
      LEFT JOIN assignment_submissions sub ON sub.assignment_id = a.id AND sub.student_id = ce.student_id
      WHERE ce.student_id = ?
        AND a.status = 'published'
        AND (? IS NULL OR a.subject_id = ?)
      ORDER BY a.due_date ASC, a.id ASC
    `,
    )
    .all(studentId, subjectId ?? null, subjectId ?? null)
    .map((row) => {
      const typed = row as {
        assignment_id: number;
        subject_id: number;
        subject_name: string;
        class_name: string;
        title: string;
        description: string;
        due_date: string;
        max_score: number;
        allow_resubmission: number;
        submission_status: string | null;
        submitted_at: string | null;
        score: number | null;
        feedback: string | null;
      };

      let status: StudentHomeworkRow["status"] = "pending";
      if (typed.submission_status) {
        if (typed.submission_status === "submitted") {
          status = "submitted";
        } else if (typed.submission_status === "resubmitted") {
          status = "resubmitted";
        } else if (typed.submission_status === "graded") {
          status = "graded";
        } else if (typed.submission_status === "late") {
          status = "late";
        }
      } else if (typed.due_date < today) {
        status = "overdue";
      } else if (typed.due_date <= new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0]) {
        status = "upcoming";
      }

      return {
        assignmentId: typed.assignment_id,
        subjectId: typed.subject_id,
        subject: typed.subject_name,
        className: typed.class_name,
        title: typed.title,
        description: typed.description,
        dueDate: typed.due_date,
        maxScore: typed.max_score,
        allowResubmission: Boolean(typed.allow_resubmission),
        status,
        submittedAt: typed.submitted_at,
        score: typed.score,
        feedback: typed.feedback,
      } satisfies StudentHomeworkRow;
    });

  if (!statusFilter || statusFilter === "all") {
    return rows;
  }
  return rows.filter((row) => row.status === statusFilter);
}

export function submitStudentHomework(
  studentId: number,
  assignmentId: number,
  input: { submissionText: string; attachmentUrl: string },
) {
  ensureDbReady();
  const db = getDb();

  const assignment = db
    .prepare(
      `
      SELECT
        a.id,
        a.class_id,
        a.due_date,
        a.allow_resubmission,
        a.status
      FROM assignments a
      JOIN class_enrollments ce ON ce.class_id = a.class_id
      WHERE a.id = ? AND ce.student_id = ?
      LIMIT 1
    `,
    )
    .get(assignmentId, studentId) as
    | {
        id: number;
        class_id: number;
        due_date: string;
        allow_resubmission: number;
        status: string;
      }
    | undefined;

  if (!assignment) {
    throw new Error("Assignment not found for this student.");
  }
  if (assignment.status !== "published") {
    throw new Error("This assignment is not open for submissions.");
  }

  const existing = db
    .prepare("SELECT id, status FROM assignment_submissions WHERE assignment_id = ? AND student_id = ?")
    .get(assignmentId, studentId) as { id: number; status: string } | undefined;
  if (existing && !assignment.allow_resubmission) {
    throw new Error("Resubmissions are not allowed for this assignment.");
  }

  const isLate = assignment.due_date < getTodayIso();
  const status = existing ? "resubmitted" : isLate ? "late" : "submitted";

  if (existing) {
    db.prepare(
      `
      UPDATE assignment_submissions
      SET
        submission_text = ?,
        attachment_url = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP,
        submitted_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    ).run(input.submissionText, input.attachmentUrl || null, status, existing.id);
  } else {
    db.prepare(
      `
      INSERT INTO assignment_submissions (
        assignment_id,
        student_id,
        submission_text,
        attachment_url,
        status,
        submitted_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    ).run(assignmentId, studentId, input.submissionText, input.attachmentUrl || null, status);
  }
}

export function listStudentResults(studentId: number) {
  ensureDbReady();
  const db = getDb();

  const rows = db
    .prepare(
      `
      SELECT
        COALESCE(t.name, 'No term') as term_name,
        s.name as subject_name,
        a.title as assessment_title,
        a.assessment_type,
        a.assessment_date,
        sc.score,
        a.max_score,
        ROUND((sc.score * 100.0) / NULLIF(a.max_score, 0), 1) as percent,
        COALESCE(sc.grade_letter, '-') as grade_letter,
        COALESCE(sc.remarks, '') as remarks
      FROM assessment_scores sc
      JOIN assessments a ON a.id = sc.assessment_id
      JOIN subjects s ON s.id = a.subject_id
      LEFT JOIN terms t ON t.id = a.term_id
      WHERE sc.student_id = ?
      ORDER BY a.assessment_date DESC, s.name ASC
    `,
    )
    .all(studentId)
    .map(
      (row) =>
        ({
          term: (row as { term_name: string }).term_name,
          subject: (row as { subject_name: string }).subject_name,
          assessment: (row as { assessment_title: string }).assessment_title,
          assessmentType: (row as { assessment_type: string }).assessment_type,
          assessmentDate: (row as { assessment_date: string }).assessment_date,
          score: (row as { score: number }).score,
          maxScore: (row as { max_score: number }).max_score,
          percent: (row as { percent: number }).percent,
          gradeLetter: (row as { grade_letter: string }).grade_letter,
          remarks: (row as { remarks: string }).remarks,
        }) satisfies StudentResultRow,
    );

  const subjectSummary = db
    .prepare(
      `
      SELECT
        s.name as subject_name,
        ROUND(AVG((sc.score * 100.0) / NULLIF(a.max_score, 0)), 1) as average_percent,
        COUNT(*) as total_assessments
      FROM assessment_scores sc
      JOIN assessments a ON a.id = sc.assessment_id
      JOIN subjects s ON s.id = a.subject_id
      WHERE sc.student_id = ?
      GROUP BY s.id, s.name
      ORDER BY s.name
    `,
    )
    .all(studentId)
    .map((row) => ({
      subject: (row as { subject_name: string }).subject_name,
      averagePercent: (row as { average_percent: number }).average_percent,
      totalAssessments: (row as { total_assessments: number }).total_assessments,
    }));

  const termSummary = db
    .prepare(
      `
      SELECT
        COALESCE(t.name, 'No term') as term_name,
        ROUND(AVG((sc.score * 100.0) / NULLIF(a.max_score, 0)), 1) as average_percent,
        COUNT(*) as total_assessments
      FROM assessment_scores sc
      JOIN assessments a ON a.id = sc.assessment_id
      LEFT JOIN terms t ON t.id = a.term_id
      WHERE sc.student_id = ?
      GROUP BY t.id, t.name
      ORDER BY t.start_date DESC
    `,
    )
    .all(studentId)
    .map((row) => ({
      term: (row as { term_name: string }).term_name,
      averagePercent: (row as { average_percent: number }).average_percent,
      totalAssessments: (row as { total_assessments: number }).total_assessments,
    }));

  return {
    results: rows,
    subjectSummary,
    termSummary,
  };
}
