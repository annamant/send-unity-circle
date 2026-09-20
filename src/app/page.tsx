import Link from "next/link";
import { SearchForm } from "@/components/search-form";
import { LAUNCH_BOROUGHS } from "@/lib/london-authorities";
import { getHomeStats } from "@/lib/schools";

export const dynamic = "force-dynamic";

export const metadata = {
  description:
    "Parent-led support, school by school, for families whose children are failed by schools and local authorities. Find your school’s parent group — or start one.",
};

export default async function HomePage() {
  const stats = await getHomeStats();

  return (
    <div>
      <section className="bg-paper border-b border-mist">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16 grid gap-8">
          <div className="max-w-2xl grid gap-4">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal">
              Parent-led · School by school
            </p>
            <h1 className="font-display text-4xl sm:text-5xl leading-[1.15] text-balance">
              Parent-led support for families the system has failed.
            </h1>
            <p className="text-lg leading-relaxed text-ink-muted">
              SEND Unity Circle is for families whose children are failed by
              schools and local authorities — SEND, mental health, bullying,
              isolation, or any other reason. We unite parent to parent, school
              by school, so no family faces this fight alone.
            </p>
          </div>
          <div className="rounded-3xl border border-mist bg-cream p-4 sm:p-6 grid gap-3">
            <p className="font-bold">Find your school</p>
            <SearchForm />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 grid gap-4">
        <h2 className="font-display text-3xl">Why so many of us feel alone</h2>
        <p className="text-ink-muted leading-relaxed text-lg">
          Families like ours are everywhere, and still we are invisible. We are
          forced to fight alone. Support is promised — then we are left
          isolated, blamed and unheard.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-12 grid gap-4">
        <h2 className="font-display text-3xl">School by school</h2>
        <p className="text-ink-muted leading-relaxed text-lg">
          We are uniting parent to parent, school by school. One WhatsApp group
          for each school. Instant backup from parents who know the fight. Real
          tactics, swapped between people who have been there. A united voice
          schools cannot ignore.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-12 grid gap-6">
        <div className="max-w-3xl grid gap-2">
          <h2 className="font-display text-3xl">Find your school</h2>
          <p className="text-ink-muted leading-relaxed">
            We are beginning in Lambeth and Southwark. You can already search
            schools across London.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {LAUNCH_BOROUGHS.map((name) => {
            const count = name === "Lambeth" ? stats.lambeth : stats.southwark;
            return (
              <li key={name}>
                <Link
                  href={`/schools?la=${encodeURIComponent(name)}`}
                  className="block rounded-3xl bg-paper border border-mist p-5 hover:border-teal/30 shadow-sm"
                >
                  <p className="font-display text-2xl">{name}</p>
                  <p className="mt-1 text-ink-muted">
                    {count} schools · open the list
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-12 grid gap-3">
        <h2 className="font-display text-3xl">Family tools</h2>
        <p className="text-ink-muted leading-relaxed text-lg">
          Need help with a letter, or a question about what your child may be
          entitled to? Find your school, then join its parent group — or start
          one. Family tools can draft with you after that. It is parent
          support, not legal advice.
        </p>
        <p>
          <Link
            href="/schools"
            className="font-bold text-teal-dark underline decoration-gold underline-offset-4"
          >
            Find your school
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 grid gap-4">
        <p className="font-display text-3xl leading-snug text-balance">
          No family alone. No kid left behind.
        </p>
        <p className="text-ink-muted leading-relaxed">
          Started by a parent after her own children were failed.
        </p>
        <p>
          <Link
            href="/how-it-works"
            className="font-bold text-teal-dark underline decoration-gold underline-offset-4"
          >
            How it works
          </Link>
        </p>
      </section>
    </div>
  );
}
