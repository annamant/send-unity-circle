import Link from "next/link";

export function ContinueToTools({
  slug,
  schoolName,
}: {
  slug: string;
  schoolName: string;
}) {
  return (
    <Link
      href={`/tools?school=${encodeURIComponent(slug)}`}
      className="inline-flex min-h-12 items-center justify-center rounded-full bg-coral px-6 font-bold text-cream"
    >
      Continue to Family tools
      <span className="sr-only"> for {schoolName}</span>
    </Link>
  );
}
