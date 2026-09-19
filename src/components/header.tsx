import Link from "next/link";
import { Logo } from "@/components/logo";

const links = [
  { href: "/schools", label: "Find a school" },
  { href: "/how-it-works", label: "How it works" },
];

export function Header() {
  return (
    <header className="border-b border-mist bg-paper/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 min-h-11">
          <Logo className="h-9 w-9 shrink-0" />
          <span className="font-display text-lg leading-tight tracking-tight sm:text-xl">
            SEND Unity Circle
          </span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-bold text-teal-dark hover:bg-sage min-h-11 inline-flex items-center"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
