import { createHmac, timingSafeEqual } from "node:crypto";
import { isSchoolSlug } from "@/lib/family-tools";

export const TOOLS_UNLOCK_COOKIE = "suc_tools";
export const TOOLS_UNLOCK_MAX_AGE_SEC = 60 * 60 * 24 * 30;
const MAX_SCHOOLS = 20;

function unlockSecret(): string | null {
  const value = process.env.ADMIN_PASSWORD?.trim();
  if (!value) return null;
  return `suc-tools-unlock:${value}`;
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

export function createToolsUnlockToken(slugs: string[]): string {
  const secret = unlockSecret();
  if (!secret) {
    throw new Error("ADMIN_PASSWORD is not set");
  }
  const unique = [...new Set(slugs.filter(isSchoolSlug))].slice(0, MAX_SCHOOLS);
  const exp = Date.now() + TOOLS_UNLOCK_MAX_AGE_SEC * 1000;
  const payload = `v1.${exp}.${unique.join(",")}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function parseToolsUnlockToken(
  token: string | undefined | null,
): string[] {
  const secret = unlockSecret();
  if (!secret || !token) return [];
  const parts = token.split(".");
  if (parts.length !== 4) return [];
  const [version, expRaw, slugPart, sig] = parts;
  if (version !== "v1" || !expRaw || !sig) return [];
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < Date.now()) return [];
  const payload = `${version}.${expRaw}.${slugPart}`;
  if (!safeEqual(sig, sign(payload, secret))) return [];
  if (!slugPart) return [];
  return [...new Set(slugPart.split(",").filter(isSchoolSlug))].slice(
    0,
    MAX_SCHOOLS,
  );
}

export function mergeUnlockedSlugs(
  current: string[],
  slug: string,
): string[] {
  if (!isSchoolSlug(slug)) return current;
  return [slug, ...current.filter((item) => item !== slug)].slice(0, MAX_SCHOOLS);
}
