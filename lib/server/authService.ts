import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { AuthUser, Role } from "../auth";
import {
  clearFailedLogin,
  consumePasswordReset,
  createPasswordReset,
  createSession,
  deleteSession,
  findSession,
  findUserByEmail,
  findValidPasswordReset,
  getAuthUserById,
  markFailedLogin,
  touchSession,
  updatePassword,
} from "./authRepository";
import { logAudit } from "./audit";
import { hashPassword, verifyPassword } from "./password";

const SESSION_COOKIE = "smsedu_session";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const SESSION_HOURS = 12;
const RESET_MINUTES = 30;

function addMinutes(date: Date, minutes: number) {
  const cloned = new Date(date);
  cloned.setMinutes(cloned.getMinutes() + minutes);
  return cloned;
}

function addHours(date: Date, hours: number) {
  const cloned = new Date(date);
  cloned.setHours(cloned.getHours() + hours);
  return cloned;
}

export async function loginUser(
  email: string,
  password: string,
  ipAddress: string | null,
  userAgent: string | null,
): Promise<{ ok: true; user: AuthUser } | { ok: false; message: string }> {
  const user = findUserByEmail(email.trim().toLowerCase());
  if (!user || !user.is_active) {
    return { ok: false, message: "Invalid credentials." };
  }

  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    return { ok: false, message: "Account temporarily locked due to failed login attempts." };
  }

  if (!verifyPassword(password, user.password_hash)) {
    const attempts = user.failed_attempts + 1;
    const lockUntil = attempts >= MAX_FAILED_ATTEMPTS ? addMinutes(new Date(), LOCKOUT_MINUTES).toISOString() : null;
    markFailedLogin(user.id, lockUntil);
    return { ok: false, message: "Invalid credentials." };
  }

  clearFailedLogin(user.id);

  const authUser: AuthUser = {
    id: user.id,
    name: user.full_name,
    role: user.role,
    email: user.email,
  };
  const token = randomBytes(48).toString("hex");
  const expiresAt = addHours(new Date(), SESSION_HOURS).toISOString();
  createSession(authUser, token, expiresAt, ipAddress, userAgent);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });

  logAudit(authUser.id, "auth.login", "user", `${authUser.id}`);
  return { ok: true, user: authUser };
}

export async function logoutUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    deleteSession(token);
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const session = findSession(token);
  if (!session || new Date(session.expires_at) < new Date()) {
    cookieStore.delete(SESSION_COOKIE);
    if (session) {
      deleteSession(token);
    }
    return null;
  }

  touchSession(session.id);
  return {
    id: session.user_id,
    name: session.full_name,
    email: session.email,
    role: session.role,
  } satisfies AuthUser;
}

export async function requireRole(roles: Role[]) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return null;
  }
  if (!roles.includes(user.role)) {
    return null;
  }
  return user;
}

export function startPasswordReset(email: string) {
  const user = findUserByEmail(email.trim().toLowerCase());
  if (!user || !user.is_active) {
    return null;
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = addMinutes(new Date(), RESET_MINUTES).toISOString();
  createPasswordReset(user.id, token, expiresAt);
  logAudit(user.id, "auth.reset.requested", "user", `${user.id}`);
  return token;
}

export function completePasswordReset(token: string, newPassword: string) {
  const reset = findValidPasswordReset(token.trim());
  if (!reset) {
    return { ok: false as const, message: "Invalid reset token." };
  }
  if (reset.used_at) {
    return { ok: false as const, message: "Reset token already used." };
  }
  if (new Date(reset.expires_at) < new Date()) {
    return { ok: false as const, message: "Reset token expired." };
  }

  updatePassword(reset.user_id, hashPassword(newPassword));
  consumePasswordReset(reset.id);
  logAudit(reset.user_id, "auth.reset.completed", "user", `${reset.user_id}`);
  const user = getAuthUserById(reset.user_id);
  if (!user) {
    return { ok: false as const, message: "User not found." };
  }
  return { ok: true as const, user };
}
