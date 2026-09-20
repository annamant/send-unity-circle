import Link from "next/link";
import { RIGHTS_SECTIONS } from "@/lib/rights-links";

export const metadata = {
  title: "Rights & law",
  description:
    "A calm map to official UK sources on SEND, school and council duties, and complaints. Parent support, not legal advice.",
};

export default function RightsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 grid gap-8">
      <header className="grid gap-4">
        <h1 className="font-display text-4xl leading-tight">Rights & law</h1>
        <p className="text-lg text-ink-muted leading-relaxed">
          A parent support map to official sources. Bookmark this page. It is
          not a solicitor, and it is not legal advice.
        </p>
        <p className="text-ink-muted leading-relaxed">
          Laws and guidance change. Always check the linked page for what is
          current. Most of these links are for{" "}
          <span className="font-bold text-ink">England</span>. Scotland, Wales
          and Northern Ireland have different systems.
        </p>
      </header>

      <nav
        aria-label="On this page"
        className="rounded-3xl border border-mist bg-paper p-5 sm:p-6"
      >
        <p className="font-bold">On this page</p>
        <ul className="mt-3 grid gap-2">
          {RIGHTS_SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="font-bold text-teal-dark underline decoration-gold underline-offset-4"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {RIGHTS_SECTIONS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="rounded-3xl border border-mist bg-paper p-5 sm:p-6 grid gap-4 scroll-mt-24"
        >
          <h2 className="font-display text-2xl leading-snug">{section.title}</h2>
          <p className="rounded-2xl bg-sage px-4 py-3 text-sm leading-relaxed">
            <span className="font-bold">Use this when…</span> {section.useWhen}
          </p>
          <ul className="grid gap-5">
            {section.links.map((link) => (
              <li key={link.href} className="grid gap-1">
                <a
                  href={link.href}
                  className="font-bold text-teal-dark underline decoration-gold underline-offset-4"
                  rel="noreferrer"
                >
                  {link.title}
                </a>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">
                  {link.source}
                </p>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {link.note}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="rounded-3xl border border-mist bg-paper p-5 sm:p-6 grid gap-3">
        <h2 className="font-display text-2xl">A quiet reminder</h2>
        <p className="text-ink-muted leading-relaxed">
          This page is parent support, not legal advice. If you are unsure about
          your situation, speak to an adviser — for example your local SENDIASS,
          IPSEA, or a solicitor.
        </p>
        <p className="text-ink-muted leading-relaxed">
          School WhatsApp groups on SEND Unity Circle are peer support. Other
          parents can walk with you. They are not a substitute for checking the
          official page, or getting advice on your own facts.
        </p>
        <p>
          <Link
            href="/schools"
            className="font-bold text-teal-dark underline decoration-gold underline-offset-4"
          >
            Find your school group
          </Link>
        </p>
      </section>
    </div>
  );
}
