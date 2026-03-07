import { createHash } from "node:crypto";
import { ensureDbReady, getDb } from "./db";
import { AuthUser, Role } from "../auth";

interface DbUserRow {
  id: number;
  email: string;
  full_name: string;
  password_hash: string;
  role: Role;
  is_active: number;
  failed_attempts: number;
  locked_until: string | null;
}

export interface SessionPayload {
  id: number;
  user: AuthUser;
  expiresAt: string;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function findUserByEmail(email: string) {
  ensureDbReady();
  const db = getDb();
  return db
    .prepare(
      `
      SELECT u.id, u.email, u.full_name, u.password_hash, r.name as role, u.is_active, u.failed_attempts, u.locked_until
      FROM users u
      JOIN roles r ON r.id = u.role_id
      WHERE lower(u.email) = lower(?)
    `,
    )
    .get(email) as DbUserRow | undefined;
}

export function clearFailedLogin(userId: number) {
  ensureDbReady();
  const db = getDb();
  db.prepare("UPDATE users SET failed_attempts = 0, locked_until = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(userId);
}

export function markFailedLogin(userId: number, lockUntilIso: string | null) {
  ensureDbReady();
  const db = getDb();
  if (lockUntilIso) {
    db.prepare(
      "UPDATE users SET failed_attempts = failed_attempts + 1, locked_until = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    ).run(lockUntilIso, userId);
    return;
  }
  db.prepare("UPDATE users SET failed_attempts = failed_attempts + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(userId);
}

export function createSession(user: AuthUser, token: string, expiresAt: string, ipAddress: string | null, userAgent: string | null) {
  ensureDbReady();
  const db = getDb();
  db.prepare(
    `
      INSERT INTO sessions (user_id, token_hash, expires_at, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?)
    `,
  ).run(user.id, hashToken(token), expiresAt, ipAddress, userAgent);
}

export function findSession(token: string) {
  ensureDbReady();
  const db = getDb();
  return db
    .prepare(
      `
      SELECT s.id, s.expires_at, u.id as user_id, u.email, u.full_name, r.name as role
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      JOIN roles r ON r.id = u.role_id
      WHERE s.token_hash = ?
    `,
    )
    .get(hashToken(token)) as
    | {
        id: number;
        expires_at: string;
        user_id: number;
        email: string;
        full_name: string;
        role: Role;
      }
    | undefined;
}

export function touchSession(sessionId: number) {
  ensureDbReady();
  const db = getDb();
  db.prepare("UPDATE sessions SET last_seen_at = CURRENT_TIMESTAMP WHERE id = ?").run(sessionId);
}

export function deleteSession(token: string) {
  ensureDbReady();
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashToken(token));
}

export function createPasswordReset(userId: number, token: string, expiresAt: string) {
  ensureDbReady();
  const db = getDb();
  db.prepare("INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)").run(
    userId,
    hashToken(token),
    expiresAt,
  );
}

export function findValidPasswordReset(token: string) {
  ensureDbReady();
  const db = getDb();
  return db
    .prepare(
      `
      SELECT id, user_id, expires_at, used_at
      FROM password_resets
      WHERE token_hash = ?
    `,
    )
    .get(hashToken(token)) as
    | {
        id: number;
        user_id: number;
        expires_at: string;
        used_at: string | null;
      }
    | undefined;
}

export function consumePasswordReset(resetId: number) {
  ensureDbReady();
  const db = getDb();
  db.prepare("UPDATE password_resets SET used_at = CURRENT_TIMESTAMP WHERE id = ?").run(resetId);
}

export function updatePassword(userId: number, passwordHash: string) {
  ensureDbReady();
  const db = getDb();
  db.prepare(
    "UPDATE users SET password_hash = ?, failed_attempts = 0, locked_until = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
  ).run(passwordHash, userId);
}

export function getAuthUserById(userId: number) {
  ensureDbReady();
  const db = getDb();
  const row = db
    .prepare(
      `
      SELECT u.id, u.email, u.full_name, r.name as role
      FROM users u
      JOIN roles r ON r.id = u.role_id
      WHERE u.id = ?
    `,
    )
    .get(userId) as { id: number; email: string; full_name: string; role: Role } | undefined;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    name: row.full_name,
    role: row.role,
  } satisfies AuthUser;
}
