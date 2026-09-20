"use server";

import { redirect } from "next/navigation";
import { getSchoolBySlug } from "@/lib/schools";
import { addUnlockedSchool } from "@/lib/tools-session";

export async function unlockLiveSchoolTools(
  slug: string,
): Promise<{ error?: string; inviteUrl?: string }> {
  const school = await getSchoolBySlug(slug);
  if (!school || school.group?.status !== "LIVE" || !school.group.inviteUrl) {
    return { error: "This school’s group is not ready to join yet." };
  }

  await addUnlockedSchool(school.slug);
  return { inviteUrl: school.group.inviteUrl };
}

export async function joinLiveGroup(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const result = await unlockLiveSchoolTools(slug);
  if (result.inviteUrl) {
    redirect(result.inviteUrl);
  }
  if (slug) {
    redirect(`/schools/${slug}`);
  }
  redirect("/schools");
}
