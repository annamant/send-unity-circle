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
        This website does not replace WhatsApp. It helps you find the right
        parent group for your school — official names, one group per school,
        and a clear path from “no group yet” to “join here”.
      </p>

      <section className="grid gap-3">
        <h2 className="font-display text-2xl">Borough hubs</h2>
        <p className="text-ink-muted leading-relaxed">
          SEND Unity Circle creates WhatsApp Communities for each borough.
          Those Communities are the hubs. School groups sit underneath them
          once they are ready to join. {founder} adds a school group to its
          borough Community in WhatsApp. You do not need to do that step.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="font-display text-2xl">Parents start school groups</h2>
        <p className="text-ink-muted leading-relaxed">
          From a school page, follow the short steps. Use the exact group name
          we show (the official school name). Create a WhatsApp group, copy the
          invite link, and paste it here. You do not have to add {founder} as a
          contact.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="font-display text-2xl">Admin joins, then others can join</h2>
        <p className="text-ink-muted leading-relaxed">
          {founder} opens the invite and joins. Until then, the school is
          waiting for SEND Unity Circle admin to join. After that, other parents
          join from the school page on this website — still via the link, not by
          swapping numbers.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="font-display text-2xl">What we ask of you</h2>
        <ul className="list-disc pl-5 text-ink-muted leading-relaxed grid gap-2">
          <li>A parent at the school creates the WhatsApp group — we do not create it for you.</li>
          <li>You never have to add anyone as a contact.</li>
          <li>You do not need to add the group to a borough Community. We do that in WhatsApp.</li>
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
