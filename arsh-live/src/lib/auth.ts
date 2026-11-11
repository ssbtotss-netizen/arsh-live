import { cookies } from "next/headers";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { prisma } from "./db";

export const token = (n = 18) => randomBytes(n).toString("base64url");

export function hashPassword(pw: string) {
  const salt = randomBytes(16).toString("hex");
  return salt + ":" + scryptSync(pw, salt, 64).toString("hex");
}
export function checkPassword(pw: string, stored: string) {
  const [salt, hash] = stored.split(":");
  const a = Buffer.from(hash, "hex"), b = scryptSync(pw, salt, 64);
  return a.length === b.length && timingSafeEqual(a, b);
}
export async function createSession(userId: string) {
  const id = token(32);
  const expiresAt = new Date(Date.now() + 30 * 864e5);
  await prisma.session.create({ data: { id, userId, expiresAt } });
  (await cookies()).set("sid", id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", expires: expiresAt, path: "/" });
}
export async function currentUser() {
  const sid = (await cookies()).get("sid")?.value;
  if (!sid) return null;
  const s = await prisma.session.findUnique({ where: { id: sid }, include: { user: true } });
  if (!s || s.expiresAt < new Date()) return null;
  if (s.user.disabled) return null; // حساب موقوف من الإدارة
  if (!s.user.lastSeenAt || Date.now() - s.user.lastSeenAt.getTime() > 3600e3) prisma.user.update({ where: { id: s.user.id }, data: { lastSeenAt: new Date() } }).catch(() => {});
  return s.user;
}
export async function destroySession() {
  const c = await cookies(); const sid = c.get("sid")?.value;
  if (sid) await prisma.session.deleteMany({ where: { id: sid } });
  c.delete("sid");
}

/** المشرفون: يُحدَّدون من متغير البيئة ADMIN_EMAILS على الخادم فقط (لا يمكن منح الصلاحية من المتصفح) */
export function isAdmin(u: { email: string } | null) {
  const list = (process.env.ADMIN_EMAILS || "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
  return !!u && list.includes(u.email.toLowerCase());
}
