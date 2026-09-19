"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSchoolBySlug } from "@/lib/schools";
import { normaliseInviteUrl } from "@/lib/whatsapp";

export async function submitSchoolGroup(
  _prev: { error: string },
  formData: FormData,
): Promise<{ error: string }> {
  const slug = String(formData.get("slug") ?? "");
  const note = String(formData.get("note") ?? "").trim().slice(0, 200);
  const inviteUrl = normaliseInviteUrl(String(formData.get("inviteUrl") ?? ""));

  if (!inviteUrl) {
    return {
      error: "Please paste a chat.whatsapp.com invite link.",
    };
  }

  const school = await getSchoolBySlug(slug);
  if (!school) {
    return { error: "We could not find that school." };
  }

  if (school.group?.status === "LIVE") {
    return { error: "This school already has a live group." };
  }

  if (school.group?.status === "PENDING") {
    return {
      error: "A group is already waiting for SEND Unity Circle admin to join.",
    };
  }

  if (school.group) {
    await prisma.whatsAppGroup.update({
      where: { id: school.group.id },
      data: {
        inviteUrl,
        status: "PENDING",
        submitterNote: note || null,
        adminNote: null,
        submittedAt: new Date(),
        liveAt: null,
        rejectedAt: null,
      },
    });
  } else {
    await prisma.whatsAppGroup.create({
      data: {
        schoolId: school.id,
        inviteUrl,
        status: "PENDING",
        submitterNote: note || null,
      },
    });
  }

  revalidatePath(`/schools/${slug}`);
  revalidatePath("/schools");
  revalidatePath("/admin");
  redirect(`/schools/${slug}?submitted=1`);
}
