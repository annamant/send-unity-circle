import type { PrismaClient } from "@prisma/client";
import { normaliseInviteUrl } from "@/lib/whatsapp";

export async function setSchoolGroupLive(
  prisma: PrismaClient,
  options: { urn: string; inviteUrl: string; note?: string },
) {
  const inviteUrl = normaliseInviteUrl(options.inviteUrl);
  if (!inviteUrl) {
    throw new Error("Please provide a chat.whatsapp.com invite link.");
  }

  const school = await prisma.school.findUnique({ where: { urn: options.urn } });
  if (!school) {
    throw new Error(`No school with URN ${options.urn}`);
  }

  const group = await prisma.whatsAppGroup.upsert({
    where: { schoolId: school.id },
    create: {
      schoolId: school.id,
      inviteUrl,
      status: "LIVE",
      liveAt: new Date(),
      submittedAt: new Date(),
      rejectedAt: null,
      adminNote: options.note ?? "Founder-confirmed live invite",
    },
    update: {
      inviteUrl,
      status: "LIVE",
      liveAt: new Date(),
      rejectedAt: null,
      adminNote: options.note ?? "Founder-confirmed live invite",
    },
  });

  return { school, group, inviteUrl };
}
