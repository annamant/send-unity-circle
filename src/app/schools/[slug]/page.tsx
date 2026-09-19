import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { StatusPill } from "@/components/status-pill";
import { getFounderDisplayName } from "@/lib/config";
import { suggestedGroupName } from "@/lib/group-name";
import { formatAddress, getSchoolBySlug } from "@/lib/schools";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const school = await getSchoolBySlug(slug);
  if (!school) return { title: "School" };
  return { title: school.name };
}

export default async function SchoolPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const school = await getSchoolBySlug(slug);
  if (!school) notFound();

  const founder = getFounderDisplayName();
  const submitted = query.submitted === "1";
  const live = school.group?.status === "LIVE";
  const pending = school.group?.status === "PENDING";
  const rejected = school.group?.status === "REJECTED";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 grid gap-6">
      <p>
        <Link href="/schools" className="text-sm font-bold text-teal-dark underline decoration-gold underline-offset-4">
          Back to search
        </Link>
      </p>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="font-display text-4xl leading-tight">{school.name}</h1>
        <StatusPill group={school.group} />
      </div>
      <p className="text-ink-muted leading-relaxed">{formatAddress(school)}</p>
      <p className="text-sm text-ink-muted">
        {school.localAuthority}
        {school.phase ? ` · ${school.phase}` : ""}
        {school.establishmentType ? ` · ${school.establishmentType}` : ""}
        {" · URN "}
        {school.urn}
      </p>

      {submitted ? (
        <p className="rounded-2xl bg-sage px-4 py-3 font-bold" role="status">
          Thank you. This group is pending until {founder} has joined via your
          invite link.
        </p>
      ) : null}

      {live && school.group ? (
        <section className="rounded-3xl bg-paper border border-mist p-5 grid gap-4">
          <h2 className="font-display text-2xl">Join the parent group</h2>
          <p className="text-ink-muted leading-relaxed">
            This school&apos;s WhatsApp group is live. {founder} has already
            joined. Open the invite to become a member — you do not need to add
            a contact.
          </p>
          <a
            href={school.group.inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-teal px-6 font-bold text-cream hover:bg-teal-dark"
          >
            Join on WhatsApp
          </a>
          <p className="text-sm text-ink-muted leading-relaxed">
            SEND Unity Circle will attach live school groups to the{" "}
            {school.localAuthority} WhatsApp Community in WhatsApp. That happens
            after the group is live; it is not automated by this website.
          </p>
        </section>
      ) : null}

      {pending ? (
        <section className="rounded-3xl bg-paper border border-mist p-5 grid gap-3">
          <h2 className="font-display text-2xl">A group is being set up</h2>
          <p className="text-ink-muted leading-relaxed">
            A parent has created the WhatsApp group and sent the invite link.
            {` ${founder} `}
            will join via that link. When we have joined, a Join button will
            appear here for everyone else.
          </p>
          <p className="text-sm text-ink-muted">
            Exact group name:{" "}
            <span className="font-bold text-ink">{suggestedGroupName(school.name)}</span>
          </p>
        </section>
      ) : null}

      {rejected ? (
        <section className="rounded-3xl bg-paper border border-mist p-5 grid gap-3">
          <h2 className="font-display text-2xl">Please start again with a new link</h2>
          <p className="text-ink-muted leading-relaxed">
            The last invite link could not be used. Create a fresh WhatsApp
            invite and submit it — still without adding a contact.
          </p>
          {school.group?.adminNote ? (
            <p className="text-sm">Note from admin: {school.group.adminNote}</p>
          ) : null}
        </section>
      ) : null}

      {!live && !pending ? (
        <section className="rounded-3xl bg-paper border border-mist p-5 grid gap-4">
          <h2 className="font-display text-2xl">Start this school&apos;s group</h2>
          <p className="text-ink-muted leading-relaxed">
            Use the guided steps to create a WhatsApp group with the official
            name, then paste the invite link. {founder} joins via the link. You
            do not have to add anyone as a contact.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <Link
              href={`/schools/${school.slug}/start`}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-coral px-6 font-bold text-cream"
            >
              Start a group
            </Link>
            <CopyButton
              value={suggestedGroupName(school.name)}
              label="Copy suggested name"
              className="min-h-12 rounded-full border border-ink/15 px-5 font-bold"
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
