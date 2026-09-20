/**
 * Mark a school WhatsApp group live from a chat.whatsapp.com invite.
 *
 *   npm run group:live -- --urn 144309 --url 'https://chat.whatsapp.com/Civl3V1tBnBDr6KH714c00'
 *
 * Query-string tracking params are stripped. Only add a school when the founder
 * has confirmed the invite.
 */
import { PrismaClient } from "@prisma/client";
import { setSchoolGroupLive } from "../src/lib/live-group";

const prisma = new PrismaClient();

function arg(flag: string): string {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? (process.argv[index + 1] ?? "") : "";
}

async function main() {
  const urn = arg("--urn").trim();
  const url = arg("--url").trim();
  if (!urn || !url) {
    console.error("Usage: npm run group:live -- --urn <URN> --url <chat.whatsapp.com/…>");
    process.exit(1);
  }

  const result = await setSchoolGroupLive(prisma, { urn, inviteUrl: url });
  console.log(
    `LIVE ${result.school.name} (URN ${result.school.urn}) → ${result.inviteUrl} → /schools/${result.school.slug}`,
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
