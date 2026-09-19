import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-mist bg-paper">
      <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-ink-muted">
        <p className="flex items-center gap-3 font-display text-lg text-ink">
          <Logo className="h-12 w-12" />
          SEND Unity Circle
        </p>
        <p className="mt-2 max-w-2xl leading-relaxed">
          A parent-led UK network. This website is the school index and control
          centre. School WhatsApp groups are created by parents; SEND Unity
          Circle admin joins via the invite link. We do not create groups through
          the WhatsApp Cloud API, and we do not use unofficial WhatsApp bots.
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
          <li>
            <Link className="underline decoration-gold underline-offset-4 hover:text-ink" href="/how-it-works">
              How it works
            </Link>
          </li>
          <li>
            <Link className="underline decoration-gold underline-offset-4 hover:text-ink" href="/schools">
              School list
            </Link>
          </li>
          <li>
            <Link className="underline decoration-gold underline-offset-4 hover:text-ink" href="/privacy">
              Privacy
            </Link>
          </li>
          <li>
            <Link className="underline decoration-gold underline-offset-4 hover:text-ink" href="/admin">
              Admin
            </Link>
          </li>
        </ul>
        <p className="mt-6 text-xs leading-relaxed">
          School names come from the Department for Education’s Get Information
          about Schools (GIAS) data. WhatsApp is a product of Meta. SEND Unity
          Circle is not affiliated with the DfE or Meta.
        </p>
      </div>
    </footer>
  );
}
