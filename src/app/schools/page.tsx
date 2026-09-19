import Link from "next/link";
import { SearchForm } from "@/components/search-form";
import { SchoolCard } from "@/components/school-card";
import { LONDON_AUTHORITIES } from "@/lib/london-authorities";
import { searchSchools } from "@/lib/schools";

export const dynamic = "force-dynamic";

function firstString(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function SchoolsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = firstString(params.q);
  const la = firstString(params.la);
  const page = Number(firstString(params.page) || "1") || 1;
  const hasFilter = Boolean(q || la);
  const result = hasFilter
    ? await searchSchools({ q, la, page })
    : { schools: [], total: 0, page: 1, pageSize: 25, totalPages: 1, q: "", la: "" };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 grid gap-8">
      <div className="grid gap-3">
        <h1 className="font-display text-4xl">Find a school</h1>
        <p className="text-ink-muted max-w-2xl leading-relaxed">
          Search official DfE school names. If a group is live, you can join
          from the school page. If not, you can start one.
        </p>
      </div>
      <SearchForm q={q} la={la} />

      {!hasFilter ? (
        <section className="grid gap-4">
          <h2 className="font-display text-2xl">Browse by local authority</h2>
          <ul className="flex flex-wrap gap-2">
            {LONDON_AUTHORITIES.map((name) => (
              <li key={name}>
                <Link
                  href={`/schools?la=${encodeURIComponent(name)}`}
                  className="inline-flex min-h-11 items-center rounded-full bg-paper border border-mist px-4 text-sm font-bold hover:border-teal/40"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="grid gap-4">
          <p className="text-sm text-ink-muted">
            {result.total.toLocaleString("en-GB")}{" "}
            {result.total === 1 ? "school" : "schools"}
            {la ? ` in ${la}` : ""}
            {q ? ` matching “${q}”` : ""}
          </p>
          {result.schools.length === 0 ? (
            <p className="rounded-3xl bg-paper border border-mist p-6 leading-relaxed">
              No schools matched. Try the official name, a shorter part of it, or
              the postcode (for example SE27).
            </p>
          ) : (
            <ul className="grid gap-3">
              {result.schools.map((school) => (
                <SchoolCard key={school.id} school={school} />
              ))}
            </ul>
          )}
          {result.totalPages > 1 ? (
            <nav className="flex flex-wrap gap-2" aria-label="Pagination">
              {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
                (n) => {
                  const search = new URLSearchParams();
                  if (q) search.set("q", q);
                  if (la) search.set("la", la);
                  search.set("page", String(n));
                  return (
                    <Link
                      key={n}
                      href={`/schools?${search.toString()}`}
                      className={`min-h-11 min-w-11 inline-flex items-center justify-center rounded-full px-3 text-sm font-bold ${
                        n === result.page
                          ? "bg-teal text-cream"
                          : "bg-paper border border-mist"
                      }`}
                    >
                      {n}
                    </Link>
                  );
                },
              )}
            </nav>
          ) : null}
        </section>
      )}
    </div>
  );
}
