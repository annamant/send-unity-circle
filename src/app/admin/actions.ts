"use server";

import { revalidatePath } from "next/cache";
import { isAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normaliseInviteUrl } from "@/lib/whatsapp";

async function requireAdmin() {
  if (!(await isAdminSession())) {
    throw new Error("Unauthorised");
  }
}

export async function markGroupLive(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("groupId") ?? "");
  const confirmed = formData.get("joined") === "on";
  if (!confirmed) {
    throw new Error("Confirm that SEND Unity Circle admin has joined the group.");
  }

  const group = await prisma.whatsAppGroup.update({
    where: { id },
    data: {
      status: "LIVE",
      liveAt: new Date(),
      rejectedAt: null,
    },
    include: { school: true },
  });

  revalidatePath("/admin");
  revalidatePath(`/schools/${group.school.slug}`);
}

export async function rejectGroup(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("groupId") ?? "");
  const adminNote = String(formData.get("adminNote") ?? "").trim().slice(0, 500);

  const group = await prisma.whatsAppGroup.update({
    where: { id },
    data: {
      status: "REJECTED",
      rejectedAt: new Date(),
      liveAt: null,
      adminNote: adminNote || "Invite link could not be used.",
    },
    include: { school: true },
  });

  revalidatePath("/admin");
  revalidatePath(`/schools/${group.school.slug}`);
}

export async function updateInviteLink(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("groupId") ?? "");
  const inviteUrl = normaliseInviteUrl(String(formData.get("inviteUrl") ?? ""));
  if (!inviteUrl) {
    throw new Error("Please paste a valid chat.whatsapp.com link.");
  }

  const group = await prisma.whatsAppGroup.update({
    where: { id },
    data: { inviteUrl },
    include: { school: true },
  });

  revalidatePath("/admin");
  revalidatePath(`/schools/${group.school.slug}`);
}
