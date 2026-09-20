/**
 * Import open establishments from the DfE GIAS daily extract.
 *
 * London only (default):
 *   npm run import:gias
 *
 * Wider England:
 *   npm run import:gias -- --england
 *
 * From an existing CSV:
 *   npm run import:gias -- --file ./data/gias-raw.csv --england
 */
import { PrismaClient } from "@prisma/client";
import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const prisma = new PrismaClient();

const LONDON_LA_CODES = new Set([
  "201",
  "202",
  "203",
  "204",
  "205",
  "206",
  "207",
  "208",
  "209",
  "210",
  "211",
  "212",
  "213",
  "301",
  "302",
  "303",
  "304",
  "305",
  "306",
  "307",
  "308",
  "309",
  "310",
  "311",
  "312",
  "313",
  "314",
  "315",
  "316",
  "317",
  "318",
  "319",
  "320",
]);

function slugify(name: string, urn: string): string {
  const slug = name
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  return `${slug || "school"}-${urn}`;
}

function parseArgs(argv: string[]) {
  const args = { england: false, file: "", writeJson: false };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--england") args.england = true;
    if (argv[i] === "--write-json") args.writeJson = true;
    if (argv[i] === "--file") args.file = argv[i + 1] ?? "";
  }
  return args;
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      out.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  out.push(current);
  return out;
}

async function downloadGiasCsv(dest: string): Promise<void> {
  const today = new Date();
  const dates: string[] = [];
  for (let offset = 0; offset < 10; offset += 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    dates.push(d.toISOString().slice(0, 10).replaceAll("-", ""));
  }

  let lastError: Error | null = null;
  for (const date of dates) {
    const url = `https://ea-edubase-api-prod.azurewebsites.net/edubase/downloads/public/edubasealldata${date}.csv`;
    try {
      const res = await fetch(url);
      if (!res.ok || !res.body) {
        lastError = new Error(`${url} -> ${res.status}`);
        continue;
      }
      await mkdir(dirname(dest), { recursive: true });
      await pipeline(Readable.fromWeb(res.body as never), createWriteStream(dest));
      console.log(`Downloaded ${url}`);
      return;
    } catch (error) {
      lastError = error as Error;
    }
  }
  throw lastError ?? new Error("Could not download GIAS CSV");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const csvPath = args.file || join(root, "data", "gias-raw.csv");

  if (!args.file) {
    await downloadGiasCsv(csvPath);
  }

  const rl = createInterface({ input: createReadStream(csvPath, { encoding: "latin1" }) });
  let headers: string[] = [];
  const schools: Array<Record<string, string | null>> = [];

  for await (const line of rl) {
    if (!headers.length) {
      headers = parseCsvLine(line).map((h) => h.replace(/^\uFEFF/, ""));
      continue;
    }
    const cols = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, i) => {
      row[header] = cols[i] ?? "";
    });

    const status = (row["EstablishmentStatus (name)"] || "").trim();
    if (!status.startsWith("Open")) continue;

    const laCode = (row["LA (code)"] || "").trim();
    if (!args.england && !LONDON_LA_CODES.has(laCode)) continue;

    const name = (row.EstablishmentName || "").trim();
    const urn = (row.URN || "").trim();
    if (!name || !urn) continue;

    schools.push({
      urn,
      name,
      slug: slugify(name, urn),
      postcode: (row.Postcode || "").trim().toUpperCase(),
      localAuthority: (row["LA (name)"] || "").trim(),
      laCode,
      street: (row.Street || "").trim() || null,
      locality: (row.Locality || "").trim() || null,
      town: (row.Town || "").trim() || null,
      phase: (row["PhaseOfEducation (name)"] || "").trim() || null,
      establishmentType: (row["TypeOfEstablishment (name)"] || "").trim() || null,
      website: (row.SchoolWebsite || "").trim() || null,
    });
  }

  console.log(`Parsed ${schools.length} open establishments (${args.england ? "England" : "London"}).`);

  const batchSize = 250;
  for (let i = 0; i < schools.length; i += batchSize) {
    const slice = schools.slice(i, i + batchSize);
    await prisma.$transaction(
      slice.map((school) =>
        prisma.school.upsert({
          where: { urn: school.urn as string },
          create: {
            urn: school.urn as string,
            slug: school.slug as string,
            name: school.name as string,
            postcode: (school.postcode as string) || "",
            postcodeNorm: ((school.postcode as string) || "").replace(/\s+/g, ""),
            localAuthority: school.localAuthority as string,
            laCode: school.laCode as string,
            street: school.street,
            locality: school.locality,
            town: school.town,
            phase: school.phase,
            establishmentType: school.establishmentType,
            website: school.website,
            nameSearch: (school.name as string).toLowerCase(),
          },
          update: {
            slug: school.slug as string,
            name: school.name as string,
            postcode: (school.postcode as string) || "",
            postcodeNorm: ((school.postcode as string) || "").replace(/\s+/g, ""),
            localAuthority: school.localAuthority as string,
            laCode: school.laCode as string,
            street: school.street,
            locality: school.locality,
            town: school.town,
            phase: school.phase,
            establishmentType: school.establishmentType,
            website: school.website,
            nameSearch: (school.name as string).toLowerCase(),
          },
        }),
      ),
    );
  }

  if (args.writeJson && !args.england) {
    await writeFile(
      join(root, "data", "london-schools.json"),
      JSON.stringify(
        {
          source: "DfE GIAS import",
          count: schools.length,
          schools,
        },
        null,
        0,
      ),
    );
  }

  console.log(`Upserted ${schools.length} schools.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
