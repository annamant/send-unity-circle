import Link from "next/link";
import { Logo } from "@/components/logo";

const links = [
  { href: "/schools", label: "Find a school", short: "Schools" },
  { href: "/how-it-works", label: "How it works", short: "How it works" },
  { href: "/rights", label: "Rights & law", short: "Rights" },
  { href: "/tools", label: "Family tools", short: "Tools" },
];

export function Header() {
  return (
    <header className="border-b border-mist bg-paper/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 min-h-11">
          <Logo className="h-11 w-11 sm:h-12 sm:w-12 shrink-0" priority />
          <span className="font-display text-base leading-tight tracking-tight sm:text-xl">
            SEND Unity Circle
          </span>
        </Link>
        <nav
          aria-label="Primary"
          className="flex items-center justify-end gap-0.5 sm:gap-3 flex-wrap"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-2 sm:px-3 py-2 text-sm font-bold text-teal-dark hover:bg-sage min-h-11 inline-flex items-center whitespace-nowrap"
            >
              {link.short ? (
                <>
                  <span className="sm:hidden">{link.short}</span>
                  <span className="hidden sm:inline">{link.label}</span>
                </>
              ) : (
                link.label
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
