import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-token";

export { ADMIN_COOKIE, createAdminToken, passwordsMatch, verifyAdminToken } from "@/lib/admin-token";

export async function isAdminSession(): Promise<boolean> {
  try {
    const store = await cookies();
    return verifyAdminToken(store.get(ADMIN_COOKIE)?.value);
  } catch {
    return false;
  }
}
