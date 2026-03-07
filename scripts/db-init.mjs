import Database from "better-sqlite3";
import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { randomBytes, scryptSync } from "node:crypto";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "smsedu.db");
const migrationsDir = path.join(process.cwd(), "db", "migrations");

if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_name TEXT NOT NULL UNIQUE,
    applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const applied = new Set(db.prepare("SELECT file_name FROM schema_migrations").all().map((r) => r.file_name));
const migrations = readdirSync(migrationsDir).filter((file) => file.endsWith(".sql")).sort();

for (const file of migrations) {
  if (applied.has(file)) {
    continue;
  }
  const sql = readFileSync(path.join(migrationsDir, file), "utf8");
  const tx = db.transaction(() => {
    db.exec(sql);
    db.prepare("INSERT INTO schema_migrations (file_name) VALUES (?)").run(file);
  });
  tx();
}

const roles = ["admin", "teacher", "student", "parent", "superadmin"];
for (const role of roles) {
  db.prepare("INSERT OR IGNORE INTO roles (name) VALUES (?)").run(role);
}

const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
if (totalUsers === 0) {
  const password = process.env.DEFAULT_PASSWORD || "Admin123!";
  const getRoleId = db.prepare("SELECT id FROM roles WHERE name = ?");
  const insertUser = db.prepare(`
    INSERT INTO users (email, full_name, password_hash, role_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  insertUser.run("admin@smsedu.local", "Ariana Admin", hashPassword(password), getRoleId.get("admin").id);
  insertUser.run("super@smsedu.local", "Sam Super Admin", hashPassword(password), getRoleId.get("superadmin").id);
  insertUser.run("teacher@smsedu.local", "Theo Teacher", hashPassword(password), getRoleId.get("teacher").id);
  insertUser.run("student@smsedu.local", "Sofia Student", hashPassword(password), getRoleId.get("student").id);
  insertUser.run("parent@smsedu.local", "Priya Parent", hashPassword(password), getRoleId.get("parent").id);
}

console.log(`Database ready at ${dbPath}`);
