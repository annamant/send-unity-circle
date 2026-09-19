"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, createAdminToken, passwordsMatch } from "@/lib/auth";

export async function loginAdmin(
  _prev: { error: string },
  formData: FormData,
): Promise<{ error: string }> {
  const password = String(formData.get("password") ?? "");
  try {
    if (!passwordsMatch(password)) {
      return { error: "That password is not right." };
    }
  } catch {
    return { error: "Admin login is not configured yet." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, createAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
