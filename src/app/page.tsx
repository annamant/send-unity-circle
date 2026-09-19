import Link from "next/link";
import { SearchForm } from "@/components/search-form";
import { LAUNCH_BOROUGHS } from "@/lib/london-authorities";
import { getHomeStats } from "@/lib/schools";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const stats = await getHomeStats();

  return (
    <div>
      <section className="bg-paper border-b border-mist">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16 grid gap-8">
          <div className="max-w-2xl grid gap-4">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal">
              Parent-led · UK · WhatsApp
            </p>
            <h1 className="font-display text-4xl sm:text-5xl leading-[1.15] text-balance">
              Find your school&apos;s SEND parent group, or start one.
            </h1>
            <p className="text-lg leading-relaxed text-ink-muted">
              SEND Unity Circle is a parent-led network. Each school has one
              WhatsApp group. Borough WhatsApp Communities bring nearby schools
              together. This website helps you find the right group — without
              adding anyone as a contact.
            </p>
          </div>
          <div className="rounded-3xl border border-mist bg-cream p-4 sm:p-6">
            <SearchForm />
          </div>
          <p className="text-sm text-ink-muted">
            {stats.schoolCount.toLocaleString("en-GB")} schools on the official
            school list (London to start) · {stats.liveCount} ready to join ·{" "}
            {stats.pendingCount} waiting for SEND Unity Circle admin to join
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 grid gap-6">
        <h2 className="font-display text-3xl">Starting boroughs</h2>
        <p className="text-ink-muted max-w-2xl leading-relaxed">
          We are beginning with Lambeth and Southwark. You can already search
          schools across London.
        </p>
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

      <section className="mx-auto max-w-5xl px-4 pb-12 grid gap-6">
        <h2 className="font-display text-3xl">How a school group gets going</h2>
        <ol className="grid gap-4">
          {[
            {
              title: "Find your school",
              body: "Search by name, postcode or local authority. We use official school names from the Department for Education, so everyone uses the same wording.",
            },
            {
              title: "Join — if a group is ready",
              body: "When SEND Unity Circle admin has already joined, you’ll see a Join button. One tap opens the WhatsApp invite.",
            },
            {
              title: "Or start a group",
              body: "We give you the exact group name. You create the WhatsApp group and paste the invite link. You do not have to add a contact.",
            },
            {
              title: "Admin joins via the link",
              body: "SEND Unity Circle admin joins through the invite you pasted. When they have joined, other parents can join from this website.",
            },
            {
              title: "Borough Community comes later",
              body: "SEND Unity Circle looks after borough WhatsApp Communities. After a group is ready, we add it to that Community in WhatsApp. You do not need to do this yourself.",
            },
          ].map((item, index) => (
            <li
              key={item.title}
              className="rounded-3xl bg-paper border border-mist p-5 grid gap-2 sm:grid-cols-[auto_1fr] sm:gap-5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage font-display text-xl text-teal-dark">
                {index + 1}
              </span>
              <div>
                <h3 className="font-display text-xl">{item.title}</h3>
                <p className="mt-1 text-ink-muted leading-relaxed">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p>
          <Link
            href="/how-it-works"
            className="font-bold text-teal-dark underline decoration-gold underline-offset-4"
          >
            Read the full walkthrough
          </Link>
        </p>
      </section>
    </div>
  );
}
