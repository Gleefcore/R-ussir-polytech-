import crypto from "crypto";
import { cookies } from "next/headers";
import { getDB, save } from "./db";
import type { PublicUser, User } from "./types";

export const SESSION_COOKIE = "rp_session";
const SESSION_DAYS = 7;

export function hashPassword(password: string, salt?: string) {
  const s = salt ?? crypto.randomBytes(8).toString("hex");
  const hash = crypto.scryptSync(password, s, 32).toString("hex");
  return { salt: s, hash };
}

export function verifyPassword(password: string, user: User): boolean {
  const { hash } = hashPassword(password, user.passSalt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(user.passHash, "hex"));
}

export function toPublic(u: User): PublicUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    level: u.level,
    role: u.role,
    createdAt: u.createdAt,
    unlocked: u.unlocked,
    study: u.study,
  };
}

export function getSessionUser(): User | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = getDB();
  const session = db.sessions.find((s) => s.token === token);
  if (!session || session.expiresAt < Date.now()) return null;
  return db.users.find((u) => u.id === session.userId) ?? null;
}

export function requireAdmin(): User | null {
  const u = getSessionUser();
  return u && u.role === "admin" ? u : null;
}

export function startSession(userId: string): void {
  const token = crypto.randomBytes(24).toString("hex");
  const db = getDB();
  db.sessions.push({ token, userId, expiresAt: Date.now() + SESSION_DAYS * 86400000 });
  save();
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export function endSession(): void {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    const db = getDB();
    db.sessions = db.sessions.filter((s) => s.token !== token);
    save();
  }
  cookies().set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}
