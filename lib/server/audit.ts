import { ensureDbReady, getDb } from "./db";

export function logAudit(
  actorUserId: number | null,
  action: string,
  targetType: string,
  targetId: string | null,
  metadata: Record<string, unknown> | null = null,
) {
  ensureDbReady();
  const db = getDb();
  db.prepare(
    `
    INSERT INTO audit_logs (actor_user_id, action, target_type, target_id, metadata)
    VALUES (?, ?, ?, ?, ?)
  `,
  ).run(actorUserId, action, targetType, targetId, metadata ? JSON.stringify(metadata) : null);
}
