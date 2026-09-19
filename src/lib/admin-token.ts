import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "suc_admin";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

function adminSecret(): string | null {
  const value = process.env.ADMIN_PASSWORD?.trim();
  return value || null;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export function createAdminToken(): string {
  const secret = adminSecret();
  if (!secret) {
    throw new Error("ADMIN_PASSWORD is not set");
  }
  const payload = String(Date.now() + SESSION_MS);
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  const secret = adminSecret();
  if (!secret || !token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const exp = Number(payload);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  return safeEqual(sig, sign(payload, secret));
}

export function passwordsMatch(candidate: string): boolean {
  const secret = adminSecret();
  if (!secret) return false;
  return safeEqual(candidate, secret);
}
