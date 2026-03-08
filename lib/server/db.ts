import Database from "better-sqlite3";
import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { hashPassword } from "./password";

let dbInstance: Database.Database | null = null;
let initialized = false;

function getDatabasePath() {
  const dataDir = path.join(process.cwd(), "data");
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, "smsedu.db");
}

function getMigrationFiles() {
  const migrationsDir = path.join(process.cwd(), "db", "migrations");
  if (!existsSync(migrationsDir)) {
    return [];
  }

  return readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .map((file) => ({ file, sql: readFileSync(path.join(migrationsDir, file), "utf8") }));
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const applied = new Set(
    db.prepare("SELECT file_name FROM schema_migrations").all().map((row) => (row as { file_name: string }).file_name),
  );

  for (const migration of getMigrationFiles()) {
    if (applied.has(migration.file)) {
      continue;
    }

    const tx = db.transaction(() => {
      db.exec(migration.sql);
      db.prepare("INSERT INTO schema_migrations (file_name) VALUES (?)").run(migration.file);
    });
    tx();
  }
}

function upsertRole(db: Database.Database, role: string) {
  db.prepare("INSERT OR IGNORE INTO roles (name) VALUES (?)").run(role);
}

function getRoleId(db: Database.Database, role: string) {
  const row = db.prepare("SELECT id FROM roles WHERE name = ?").get(role) as { id: number } | undefined;
  if (!row) {
    throw new Error(`Missing role '${role}'`);
  }
  return row.id;
}

function seedUsers(db: Database.Database) {
  const now = new Date().toISOString();
  const password = process.env.DEFAULT_PASSWORD ?? "Admin123!";
  const defaultUsers = [
    { email: "admin@smsedu.local", fullName: "Ariana Admin", role: "admin" },
    { email: "super@smsedu.local", fullName: "Sam Super Admin", role: "superadmin" },
    { email: "teacher@smsedu.local", fullName: "Theo Teacher", role: "teacher" },
    { email: "student@smsedu.local", fullName: "Sofia Student", role: "student" },
    { email: "parent@smsedu.local", fullName: "Priya Parent", role: "parent" },
    { email: "principal@smsedu.local", fullName: "Paula Principal", role: "principal" },
    { email: "headmaster@smsedu.local", fullName: "Henry Headmaster", role: "headmaster" },
  ] as const;
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (email, full_name, password_hash, role_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction(() => {
    for (const user of defaultUsers) {
      insertUser.run(user.email, user.fullName, hashPassword(password), getRoleId(db, user.role), now, now);
    }
  });

  tx();
}

function seedAcademicData(db: Database.Database) {
  const termsCount = db.prepare("SELECT COUNT(*) as count FROM terms").get() as { count: number };
  if (termsCount.count > 0) {
    return;
  }

  const tx = db.transaction(() => {
    db.prepare(
      "INSERT INTO terms (name, start_date, end_date, is_active) VALUES (?, ?, ?, ?), (?, ?, ?, ?)",
    ).run(
      "Term 1 2026",
      "2026-01-15",
      "2026-04-15",
      0,
      "Term 2 2026",
      "2026-05-01",
      "2026-08-15",
      1,
    );

    const teacherUser = db.prepare("SELECT id FROM users WHERE email = ?").get("teacher@smsedu.local") as
      | { id: number }
      | undefined;
    if (!teacherUser) {
      return;
    }

    db.prepare("INSERT OR IGNORE INTO teachers (user_id, employee_no) VALUES (?, ?)").run(teacherUser.id, "T-1001");

    const studentUsers = db
      .prepare(
        `
        SELECT id, email FROM users
        WHERE email IN (?, ?)
      `,
      )
      .all("student@smsedu.local", "parent@smsedu.local") as Array<{ id: number; email: string }>;

    const insertStudent = db.prepare("INSERT OR IGNORE INTO students (user_id, admission_no, grade_level) VALUES (?, ?, ?)");
    for (const user of studentUsers) {
      const admission = user.email.startsWith("student") ? "S-1001" : "S-1002";
      const grade = user.email.startsWith("student") ? "Grade 8" : "Grade 5";
      insertStudent.run(user.id, admission, grade);
    }

    const teacher = db.prepare("SELECT id FROM teachers WHERE user_id = ?").get(teacherUser.id) as { id: number } | undefined;
    const activeTerm = db.prepare("SELECT id FROM terms WHERE is_active = 1 LIMIT 1").get() as { id: number } | undefined;
    if (!teacher || !activeTerm) {
      return;
    }

    db.prepare("INSERT INTO classes (name, teacher_id, term_id) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)").run(
      "Grade 8-A",
      teacher.id,
      activeTerm.id,
      "Grade 5-B",
      teacher.id,
      activeTerm.id,
      "Grade 9-C",
      teacher.id,
      activeTerm.id,
    );

    const classes = db.prepare("SELECT id FROM classes").all() as Array<{ id: number }>;
    const students = db.prepare("SELECT id FROM students").all() as Array<{ id: number }>;
    const enroll = db.prepare("INSERT OR IGNORE INTO class_enrollments (class_id, student_id) VALUES (?, ?)");

    for (const classRow of classes) {
      for (const student of students) {
        enroll.run(classRow.id, student.id);
      }
    }

    const attendanceInsert = db.prepare(
      "INSERT INTO attendance (class_id, student_id, date, status) VALUES (?, ?, ?, ?)",
    );
    const statuses = ["present", "present", "present", "late", "absent"] as const;
    const today = new Date();
    for (const classRow of classes) {
      for (const student of students) {
        for (let day = 0; day < 10; day += 1) {
          const date = new Date(today);
          date.setDate(today.getDate() - day);
          const isoDate = date.toISOString().split("T")[0];
          attendanceInsert.run(classRow.id, student.id, isoDate, statuses[day % statuses.length]);
        }
      }
    }
  });

  tx();
}

function tableExists(db: Database.Database, tableName: string) {
  const row = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(tableName) as { name: string } | undefined;
  return Boolean(row);
}

function seedStudentLearningData(db: Database.Database) {
  if (!tableExists(db, "assignments")) {
    return;
  }

  const assignmentsCount = db.prepare("SELECT COUNT(*) as count FROM assignments").get() as { count: number };
  if (assignmentsCount.count > 0) {
    return;
  }

  const tx = db.transaction(() => {
    const activeTerm = db.prepare("SELECT id FROM terms WHERE is_active = 1 LIMIT 1").get() as { id: number } | undefined;
    const teacher = db.prepare("SELECT id FROM teachers LIMIT 1").get() as { id: number } | undefined;
    if (!activeTerm || !teacher) {
      return;
    }

    const coreSubjects = db
      .prepare("SELECT id, name FROM subjects ORDER BY name LIMIT 4")
      .all() as Array<{ id: number; name: string }>;
    if (coreSubjects.length === 0) {
      return;
    }

    const students = db
      .prepare(
        `
        SELECT s.id as student_id, u.full_name
        FROM students s
        JOIN users u ON u.id = s.user_id
        ORDER BY s.id
      `,
      )
      .all() as Array<{ student_id: number; full_name: string }>;
    if (students.length === 0) {
      return;
    }

    const allClassIds = db.prepare("SELECT id FROM classes ORDER BY id").all() as Array<{ id: number }>;
    const classSubjects = db.prepare(
      "INSERT OR IGNORE INTO class_subjects (class_id, subject_id, teacher_id, subject_code) VALUES (?, ?, ?, ?)",
    );
    const timetableInsert = db.prepare(
      `
      INSERT OR IGNORE INTO class_timetable_slots (class_id, day_of_week, period_number, subject_id, teacher_id, room_assignment)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    );
    for (const classRow of allClassIds) {
      coreSubjects.forEach((subject, index) => {
        classSubjects.run(classRow.id, subject.id, teacher.id, subject.name.slice(0, 3).toUpperCase());
        const day = ["Monday", "Tuesday", "Wednesday", "Thursday"][index % 4];
        timetableInsert.run(classRow.id, day, index + 1, subject.id, teacher.id, `Block ${index + 1}`);
      });
    }

    const assignmentInsert = db.prepare(
      `
      INSERT INTO assignments (
        class_id,
        subject_id,
        teacher_id,
        title,
        description,
        instructions,
        due_date,
        max_score,
        allow_resubmission,
        status,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    );
    const resourceInsert = db.prepare(
      `
      INSERT INTO subject_resources (class_id, subject_id, title, resource_type, resource_url, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    );
    const assessmentInsert = db.prepare(
      `
      INSERT INTO assessments (class_id, subject_id, title, assessment_type, term_id, max_score, assessment_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    );
    const scoreInsert = db.prepare(
      `
      INSERT INTO assessment_scores (assessment_id, student_id, score, grade_letter, remarks, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    );

    const now = new Date();
    const toIso = (date: Date) => date.toISOString().split("T")[0];

    for (const subject of coreSubjects) {
      for (const classRow of allClassIds) {
        const dueSoon = new Date(now);
        dueSoon.setDate(dueSoon.getDate() + 3);
        const dueLater = new Date(now);
        dueLater.setDate(dueLater.getDate() + 8);

        assignmentInsert.run(
          classRow.id,
          subject.id,
          teacher.id,
          `${subject.name} Practice Set`,
          `Revision exercises for ${subject.name}.`,
          "Answer all questions and include workings where required.",
          toIso(dueSoon),
          100,
          1,
        );
        assignmentInsert.run(
          classRow.id,
          subject.id,
          teacher.id,
          `${subject.name} Reflection`,
          `Short written reflection for ${subject.name}.`,
          "Submit a concise summary of key concepts covered this week.",
          toIso(dueLater),
          50,
          1,
        );

        resourceInsert.run(
          classRow.id,
          subject.id,
          `${subject.name} lesson notes`,
          "notes",
          "https://example.edu/resources/lesson-notes",
          "Read before your next class for preparation.",
        );
        resourceInsert.run(
          classRow.id,
          subject.id,
          `${subject.name} walkthrough video`,
          "video",
          "https://example.edu/resources/video-lesson",
          "Video recap of this week's key lesson points.",
        );

        const assessmentDate = new Date(now);
        assessmentDate.setDate(assessmentDate.getDate() - 4);
        const assessmentResult = assessmentInsert.run(
          classRow.id,
          subject.id,
          `${subject.name} Weekly Quiz`,
          "quiz",
          activeTerm.id,
          20,
          toIso(assessmentDate),
        );
        const assessmentId = Number(assessmentResult.lastInsertRowid);

        for (const student of students) {
          const score = 12 + ((student.student_id + subject.id) % 9);
          const gradeLetter = score >= 16 ? "A" : score >= 14 ? "B" : score >= 12 ? "C" : "D";
          scoreInsert.run(assessmentId, student.student_id, score, gradeLetter, "Keep building consistency.");
        }
      }
    }

    const submissions = db
      .prepare(
        `
        SELECT a.id as assignment_id, ce.student_id, a.due_date
        FROM assignments a
        JOIN class_enrollments ce ON ce.class_id = a.class_id
        ORDER BY a.id, ce.student_id
        LIMIT 10
      `,
      )
      .all() as Array<{ assignment_id: number; student_id: number; due_date: string }>;
    const submissionInsert = db.prepare(
      `
      INSERT OR IGNORE INTO assignment_submissions (
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
    );
    for (const submission of submissions) {
      const isLate = new Date(submission.due_date) < new Date();
      submissionInsert.run(
        submission.assignment_id,
        submission.student_id,
        "Completed and attached.",
        "https://example.edu/submissions/sample.pdf",
        isLate ? "late" : "submitted",
      );
    }

    const firstClass = allClassIds[0]?.id ?? null;
    db.prepare(
      `
      INSERT INTO announcements (target_role, class_id, title, body, priority, published_at)
      VALUES
        ('student', NULL, 'Exam Week Reminder', 'Mid-term assessments begin next Monday. Review your timetable and arrive on time.', 'high', CURRENT_TIMESTAMP),
        ('student', ?, 'Class Project Checkpoint', 'Project checkpoint submissions are due this Friday by 17:00.', 'normal', CURRENT_TIMESTAMP),
        ('all', NULL, 'Sports Day', 'Sports day activities are scheduled for March 20, 2026.', 'low', CURRENT_TIMESTAMP)
    `,
    ).run(firstClass);
  });

  tx();
}

function seed(db: Database.Database) {
  upsertRole(db, "admin");
  upsertRole(db, "teacher");
  upsertRole(db, "student");
  upsertRole(db, "parent");
  upsertRole(db, "superadmin");
  upsertRole(db, "principal");
  upsertRole(db, "headmaster");
  seedUsers(db);
  seedAcademicData(db);
  seedStudentLearningData(db);
}

export function getDb() {
  if (!dbInstance) {
    dbInstance = new Database(getDatabasePath());
    dbInstance.pragma("journal_mode = WAL");
    dbInstance.pragma("foreign_keys = ON");
  }
  return dbInstance;
}

export function ensureDbReady() {
  if (initialized) {
    return;
  }
  const db = getDb();
  migrate(db);
  if (process.env.NODE_ENV !== "production") {
    seed(db);
  }
  initialized = true;
}
