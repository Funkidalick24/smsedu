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
  const usersCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  if (usersCount.count > 0) {
    return;
  }

  const now = new Date().toISOString();
  const password = process.env.DEFAULT_PASSWORD ?? "Admin123!";
  const tx = db.transaction(() => {
    const insertUser = db.prepare(`
      INSERT INTO users (email, full_name, password_hash, role_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertUser.run("admin@smsedu.local", "Ariana Admin", hashPassword(password), getRoleId(db, "admin"), now, now);
    insertUser.run("super@smsedu.local", "Sam Super Admin", hashPassword(password), getRoleId(db, "superadmin"), now, now);
    insertUser.run("teacher@smsedu.local", "Theo Teacher", hashPassword(password), getRoleId(db, "teacher"), now, now);
    insertUser.run("student@smsedu.local", "Sofia Student", hashPassword(password), getRoleId(db, "student"), now, now);
    insertUser.run("parent@smsedu.local", "Priya Parent", hashPassword(password), getRoleId(db, "parent"), now, now);
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

function seed(db: Database.Database) {
  upsertRole(db, "admin");
  upsertRole(db, "teacher");
  upsertRole(db, "student");
  upsertRole(db, "parent");
  upsertRole(db, "superadmin");
  seedUsers(db);
  seedAcademicData(db);
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
