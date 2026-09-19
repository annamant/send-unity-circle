import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type SeedSchool = {
  urn: string;
  name: string;
  slug: string;
  postcode: string;
  localAuthority: string;
  laCode: string;
  street: string | null;
  locality: string | null;
  town: string | null;
  phase: string | null;
  establishmentType: string | null;
  website: string | null;
};

type SeedFile = {
  source: string;
  count: number;
  schools: SeedSchool[];
};

const prisma = new PrismaClient();

function normalisePostcode(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

async function main() {
  const dataPath = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "london-schools.json");
  const payload = JSON.parse(readFileSync(dataPath, "utf8")) as SeedFile;

  if (!payload.schools?.length) {
    throw new Error("Seed file has no schools");
  }

  const required = ["The Elmgreen School", "Kingsdale Foundation School"];
  for (const name of required) {
    if (!payload.schools.some((school) => school.name === name)) {
      throw new Error(`Required school missing from seed: ${name}`);
    }
  }

  const batchSize = 250;
  for (let i = 0; i < payload.schools.length; i += batchSize) {
    const slice = payload.schools.slice(i, i + batchSize);
    await prisma.$transaction(
      slice.map((school) =>
        prisma.school.upsert({
          where: { urn: school.urn },
          create: {
            urn: school.urn,
            slug: school.slug,
            name: school.name,
            postcode: school.postcode,
            postcodeNorm: normalisePostcode(school.postcode),
            localAuthority: school.localAuthority,
            laCode: school.laCode,
            street: school.street,
            locality: school.locality,
            town: school.town,
            phase: school.phase,
            establishmentType: school.establishmentType,
            website: school.website,
            nameSearch: school.name.toLowerCase(),
          },
          update: {
            slug: school.slug,
            name: school.name,
            postcode: school.postcode,
            postcodeNorm: normalisePostcode(school.postcode),
            localAuthority: school.localAuthority,
            laCode: school.laCode,
            street: school.street,
            locality: school.locality,
            town: school.town,
            phase: school.phase,
            establishmentType: school.establishmentType,
            website: school.website,
            nameSearch: school.name.toLowerCase(),
          },
        }),
      ),
    );
  }

  const [total, lambeth, southwark, elmgreen, kingsdale] = await Promise.all([
    prisma.school.count(),
    prisma.school.count({ where: { localAuthority: "Lambeth" } }),
    prisma.school.count({ where: { localAuthority: "Southwark" } }),
    prisma.school.findFirst({ where: { name: "The Elmgreen School" } }),
    prisma.school.findFirst({ where: { name: "Kingsdale Foundation School" } }),
  ]);

  console.log(
    `Seeded ${payload.count} GIAS schools (${payload.source}). Database now has ${total} schools — Lambeth ${lambeth}, Southwark ${southwark}.`,
  );
  console.log(`Elmgreen: ${elmgreen?.urn} ${elmgreen?.postcode}; Kingsdale: ${kingsdale?.urn} ${kingsdale?.postcode}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
