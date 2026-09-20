import Link from "next/link";

export const metadata = {
  title: "How it works",
  description:
    "One parent WhatsApp group per school. Find yours, or start one, so no family faces this fight alone.",
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 grid gap-10">
      <header className="grid gap-4">
        <h1 className="font-display text-4xl leading-tight">
          How SEND Unity Circle works
        </h1>
        <p className="text-lg text-ink-muted leading-relaxed">
          We are a parent-led network for families whose children are failed by
          schools and local authorities — SEND, mental health, bullying,
          isolation, or any other reason.
        </p>
      </header>

      <section className="grid gap-3">
        <h2 className="font-display text-2xl">Why families feel so alone</h2>
        <p className="text-ink-muted leading-relaxed">
          We are everywhere, and still we are invisible. We are forced to fight
          alone. Support is promised — then we are left isolated, blamed and
          unheard.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="font-display text-2xl">School by school</h2>
        <p className="text-ink-muted leading-relaxed">
          SEND Unity Circle unites parent to parent, school by school, so no
          family faces this fight alone.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="font-display text-2xl">What a school group gives you</h2>
        <p className="text-ink-muted leading-relaxed">
          One WhatsApp group per school. Instant backup from parents who know
          the fight. A place to swap real tactics. A united voice schools cannot
          ignore.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="font-display text-2xl">Finding your group</h2>
        <p className="text-ink-muted leading-relaxed">
          Search for your child&apos;s school. If a group is ready, tap Join.
          If there isn&apos;t one yet, you can start it.
        </p>
      </section>

      <section className="grid gap-3">
        <p className="font-display text-2xl leading-snug">
          No family alone. No kid left behind.
        </p>
        <p className="text-ink-muted leading-relaxed">
          Started by a parent after her own children were failed.
        </p>
      </section>

      <p>
        <Link
          href="/schools"
          className="inline-flex min-h-12 items-center rounded-full bg-teal px-6 font-bold text-cream"
        >
          Find your school
        </Link>
      </p>
    </div>
  );
}
