import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 grid gap-4">
      <h1 className="font-display text-4xl">Page not found</h1>
      <p className="text-ink-muted leading-relaxed">
        That page is not in the SEND Unity Circle index. Try searching for a
        school instead.
      </p>
      <p>
        <Link
          href="/schools"
          className="font-bold text-teal-dark underline decoration-gold underline-offset-4"
        >
          Find a school
        </Link>
      </p>
    </div>
  );
}
