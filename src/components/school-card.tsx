import Link from "next/link";
import { StatusPill } from "@/components/status-pill";
import { formatAddress } from "@/lib/schools";
import type { School, WhatsAppGroup } from "@prisma/client";

export function SchoolCard({
  school,
}: {
  school: School & { group: WhatsAppGroup | null };
}) {
  return (
    <li>
      <Link
        href={`/schools/${school.slug}`}
        className="block rounded-3xl border border-mist bg-paper p-4 shadow-sm transition hover:border-teal/30 hover:shadow-md"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="font-display text-xl leading-snug text-ink">{school.name}</h2>
          <StatusPill group={school.group} />
        </div>
        <p className="mt-2 text-sm text-ink-muted">{formatAddress(school)}</p>
        <p className="mt-1 text-sm text-ink-muted">
          {school.localAuthority}
          {school.phase ? ` · ${school.phase}` : ""}
        </p>
      </Link>
    </li>
  );
}
