import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { LONDON_AUTHORITIES } from "@/lib/london-authorities";

const PAGE_SIZE = 25;

export function normalisePostcode(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

function looksLikePostcode(value: string): boolean {
  return /^[A-Z]{1,2}\d/i.test(value.trim());
}

export async function searchSchools(options: {
  q?: string;
  la?: string;
  page?: number;
}) {
  const q = options.q?.trim() ?? "";
  const la = options.la?.trim() ?? "";
  const page = Math.max(1, options.page ?? 1);

  const where: Prisma.SchoolWhereInput = {};
  const and: Prisma.SchoolWhereInput[] = [];

  if (la) {
    and.push({ localAuthority: la });
  }

    if (q) {
    const or: Prisma.SchoolWhereInput[] = [
      { nameSearch: { contains: q.toLowerCase() } },
    ];
    const postcodeNorm = normalisePostcode(q);
    if (looksLikePostcode(q) && postcodeNorm.length >= 2) {
      or.push({ postcodeNorm: { startsWith: postcodeNorm } });
    }
    if (!la) {
      const matchingAuthorities = LONDON_AUTHORITIES.filter((name) =>
        name.toLowerCase().includes(q.toLowerCase()),
      );
      if (matchingAuthorities.length) {
        or.push({ localAuthority: { in: [...matchingAuthorities] } });
      }
    }
    and.push({ OR: or });
  }

  if (and.length) where.AND = and;

  const [total, schools] = await Promise.all([
    prisma.school.count({ where }),
    prisma.school.findMany({
      where,
      include: { group: true },
      orderBy: [{ localAuthority: "asc" }, { name: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return {
    schools,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    q,
    la,
  };
}

export async function getSchoolBySlug(slug: string) {
  return prisma.school.findUnique({
    where: { slug },
    include: { group: true },
  });
}

export async function getHomeStats() {
  const [schoolCount, liveCount, pendingCount, lambeth, southwark] =
    await Promise.all([
      prisma.school.count(),
      prisma.whatsAppGroup.count({ where: { status: "LIVE" } }),
      prisma.whatsAppGroup.count({ where: { status: "PENDING" } }),
      prisma.school.count({ where: { localAuthority: "Lambeth" } }),
      prisma.school.count({ where: { localAuthority: "Southwark" } }),
    ]);

  return { schoolCount, liveCount, pendingCount, lambeth, southwark };
}

export function formatAddress(school: {
  street: string | null;
  locality: string | null;
  town: string | null;
  postcode: string;
}): string {
  return [school.street, school.locality, school.town, school.postcode]
    .filter(Boolean)
    .join(", ");
}
