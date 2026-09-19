import Link from "next/link";
import { getFounderDisplayName } from "@/lib/config";

export const metadata = {
  title: "How it works",
};

export default function HowItWorksPage() {
  const founder = getFounderDisplayName();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 grid gap-8">
      <h1 className="font-display text-4xl">How SEND Unity Circle works</h1>
      <p className="text-lg text-ink-muted leading-relaxed">
        The website does not replace WhatsApp. It is the school index and
        control centre: official names, one group per school, and a clear path
        from “no group yet” to “join here”.
      </p>

      <section className="grid gap-3">
        <h2 className="font-display text-2xl">Borough hubs</h2>
        <p className="text-ink-muted leading-relaxed">
          SEND Unity Circle creates WhatsApp Communities for each borough.
          Those Communities are the hubs. School groups sit underneath them
          once they are live. Attaching a school group to a Community is done
          in WhatsApp by {founder} — this site never automates that.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="font-display text-2xl">Parents start school groups</h2>
        <p className="text-ink-muted leading-relaxed">
          From a school page, follow the guided list. Use the exact group name
          we show (the official DfE name). Create a WhatsApp group, copy the
          invite link, and paste it here. You do not have to add {founder} as a
          contact.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="font-display text-2xl">Admin joins, then it goes live</h2>
        <p className="text-ink-muted leading-relaxed">
          {founder} opens the invite and joins. Only then is the school marked
          live. After that, other parents join from the school page on this
          website — still via the link, not by swapping numbers.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="font-display text-2xl">What we do not do</h2>
        <ul className="list-disc pl-5 text-ink-muted leading-relaxed grid gap-2">
          <li>We do not create WhatsApp groups through the Cloud API.</li>
          <li>We do not run unofficial WhatsApp bots.</li>
          <li>Family Tool AI and native apps are out of scope for this version.</li>
        </ul>
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
