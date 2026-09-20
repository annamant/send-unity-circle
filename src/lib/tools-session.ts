import { cookies } from "next/headers";
import {
  TOOLS_UNLOCK_COOKIE,
  TOOLS_UNLOCK_MAX_AGE_SEC,
  createToolsUnlockToken,
  mergeUnlockedSlugs,
  parseToolsUnlockToken,
} from "@/lib/tools-unlock";

export async function readUnlockedSlugs(): Promise<string[]> {
  try {
    const store = await cookies();
    return parseToolsUnlockToken(store.get(TOOLS_UNLOCK_COOKIE)?.value);
  } catch {
    return [];
  }
}

export async function isSchoolUnlocked(slug: string): Promise<boolean> {
  const slugs = await readUnlockedSlugs();
  return slugs.includes(slug);
}

export async function addUnlockedSchool(slug: string): Promise<void> {
  const current = await readUnlockedSlugs();
  const next = mergeUnlockedSlugs(current, slug);
  if (next.length === 0) return;
  const store = await cookies();
  store.set(TOOLS_UNLOCK_COOKIE, createToolsUnlockToken(next), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TOOLS_UNLOCK_MAX_AGE_SEC,
  });
}
