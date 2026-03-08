import { randomBytes } from "node:crypto";
import { ensureDbReady, getDb } from "./db";
import { hashPassword } from "./password";

export interface SchoolRecord {
  id: number;
  name: string;
  code: string;
  level: string;
  district: string;
  province: string;
  status: string;
  createdAt: string;
  leaderName: string;
  leaderEmail: string;
  leaderTitle: "principal" | "headmaster" | "-";
}

export interface CreateSchoolInput {
  schoolName: string;
  schoolCode: string;
  level: "Primary" | "Secondary" | "Combined";
  district?: string;
  province?: string;
  address?: string;
  phone?: string;
  schoolEmail?: string;
  leaderTitle: "principal" | "headmaster";
  leaderFullName: string;
  leaderEmail: string;
  leaderPhone?: string;
}

function slug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generatePassword() {
  const random = randomBytes(4).toString("hex");
  return `SmsEdu!${random}`;
}

export function listSchools() {
  ensureDbReady();
  const db = getDb();
  return db
    .prepare(
      `
      SELECT
        s.id,
        s.name,
        s.code,
        s.level,
        COALESCE(s.district, '') as district,
        COALESCE(s.province, '') as province,
        s.status,
        s.created_at,
        COALESCE(u.full_name, '-') as leader_name,
        COALESCE(u.email, '-') as leader_email,
        COALESCE(sl.title, '-') as leader_title
      FROM schools s
      LEFT JOIN school_leadership sl ON sl.school_id = s.id
      LEFT JOIN users u ON u.id = sl.user_id
      ORDER BY s.created_at DESC, s.id DESC
    `,
    )
    .all()
    .map(
      (row) =>
        ({
          id: (row as { id: number }).id,
          name: (row as { name: string }).name,
          code: (row as { code: string }).code,
          level: (row as { level: string }).level,
          district: (row as { district: string }).district,
          province: (row as { province: string }).province,
          status: (row as { status: string }).status,
          createdAt: (row as { created_at: string }).created_at,
          leaderName: (row as { leader_name: string }).leader_name,
          leaderEmail: (row as { leader_email: string }).leader_email,
          leaderTitle: (row as { leader_title: "principal" | "headmaster" | "-" }).leader_title,
        }) satisfies SchoolRecord,
    );
}

export function createSchoolWithLeader(input: CreateSchoolInput) {
  ensureDbReady();
  const db = getDb();

  const password = generatePassword();
  const schoolCode = input.schoolCode.trim().toUpperCase();
  const leaderEmail = input.leaderEmail.trim().toLowerCase();
  const leaderFullName = input.leaderFullName.trim();
  const roleName = input.leaderTitle;

  const roleRow = db.prepare("SELECT id FROM roles WHERE name = ?").get(roleName) as { id: number } | undefined;
  if (!roleRow) {
    throw new Error(`Role '${roleName}' is not configured.`);
  }

  const tx = db.transaction(() => {
    const schoolInsert = db
      .prepare(
        `
      INSERT INTO schools (name, code, level, district, province, address, phone, email, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
      )
      .run(
        input.schoolName.trim(),
        schoolCode,
        input.level,
        input.district?.trim() || null,
        input.province?.trim() || null,
        input.address?.trim() || null,
        input.phone?.trim() || null,
        input.schoolEmail?.trim().toLowerCase() || null,
      );
    const schoolId = Number(schoolInsert.lastInsertRowid);

    const userInsert = db
      .prepare(
        `
      INSERT INTO users (email, full_name, password_hash, role_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
      )
      .run(leaderEmail, leaderFullName, hashPassword(password), roleRow.id);
    const userId = Number(userInsert.lastInsertRowid);

    db.prepare("INSERT INTO school_leadership (school_id, user_id, title, assigned_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)").run(
      schoolId,
      userId,
      roleName,
    );

    const teacherRow = db.prepare("SELECT id FROM teachers WHERE user_id = ?").get(userId) as { id: number } | undefined;
    if (!teacherRow) {
      const employeeNo = `${roleName.slice(0, 1).toUpperCase()}-${schoolCode}-${String(schoolId).padStart(3, "0")}`;
      db.prepare("INSERT OR IGNORE INTO teachers (user_id, employee_no, status) VALUES (?, ?, 'Active')").run(userId, employeeNo);
    }

    const schoolAlias = slug(input.schoolName);
    const suggestedEmail = `${roleName}@${schoolAlias || "school"}.smsedu.local`;

    return {
      schoolId,
      leaderUserId: userId,
      leaderEmail,
      temporaryPassword: password,
      suggestedEmail,
    };
  });

  return tx();
}
