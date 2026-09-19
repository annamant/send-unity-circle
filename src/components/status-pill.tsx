import type { WhatsAppGroup } from "@prisma/client";

export function StatusPill({ group }: { group: WhatsAppGroup | null }) {
  if (group?.status === "LIVE") {
    return (
      <span className="inline-flex rounded-full bg-sage px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-dark">
        Ready to join
      </span>
    );
  }
  if (group?.status === "PENDING") {
    return (
      <span className="inline-flex rounded-full bg-mist px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-muted">
        Waiting for admin
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-cream px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-muted">
      No group yet
    </span>
  );
}
