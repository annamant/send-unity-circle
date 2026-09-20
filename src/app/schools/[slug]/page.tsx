import Link from "next/link";
import { notFound } from "next/navigation";
import { ContinueToTools } from "@/components/continue-to-tools";
import { CopyButton } from "@/components/copy-button";
import { JoinGroupButton } from "@/components/join-group-button";
import { StatusPill } from "@/components/status-pill";
import { WhatsAppInviteLink } from "@/components/whatsapp-invite-link";
import { getFounderDisplayName } from "@/lib/config";
import { suggestedGroupName } from "@/lib/group-name";
import { formatAddress, getSchoolBySlug } from "@/lib/schools";
import { isSchoolUnlocked } from "@/lib/tools-session";

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
  const toolsUnlocked =
    (await isSchoolUnlocked(school.slug)) || query.joined === "1";

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
      </p>

      {submitted ? (
        <div className="rounded-2xl bg-sage px-4 py-4 grid gap-3" role="status">
          <p className="font-bold">
            Thank you. This group is waiting for {founder} to join via your
            invite link.
          </p>
          <p className="text-sm leading-relaxed">
            You can use Family tools for this school while that happens. Keep
            this invite for {founder} if they need it.
          </p>
          {school.group?.inviteUrl ? (
            <WhatsAppInviteLink url={school.group.inviteUrl} />
          ) : null}
          <ContinueToTools slug={school.slug} schoolName={school.name} />
        </div>
      ) : null}

      {query.joined === "1" && live && school.group && toolsUnlocked ? (
        <div className="rounded-2xl bg-sage px-4 py-4 grid gap-3" role="status">
          <p className="font-bold">The parent group is ready to join.</p>
          <p className="text-sm leading-relaxed">
            Open WhatsApp to become a member. Family tools for this school is
            unlocked on this website — we cannot see who is in the chat.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <a
              href={school.group.inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-teal px-6 font-bold text-cream hover:bg-teal-dark"
            >
              Open WhatsApp
            </a>
            <ContinueToTools slug={school.slug} schoolName={school.name} />
          </div>
        </div>
      ) : null}

      {live && school.group ? (
        <section className="rounded-3xl bg-paper border border-mist p-5 grid gap-4">
          <h2 className="font-display text-2xl">Join the parent group</h2>
          <p className="text-ink-muted leading-relaxed">
            This school&apos;s WhatsApp group is ready. Tap the invite to
            become a member, or copy the link.
          </p>
          <WhatsAppInviteLink url={school.group.inviteUrl} />
          <div className="flex flex-wrap gap-3 items-center">
            <JoinGroupButton slug={school.slug} />
            {toolsUnlocked ? (
              <ContinueToTools slug={school.slug} schoolName={school.name} />
            ) : null}
          </div>
          {toolsUnlocked ? (
            <p className="text-sm text-ink-muted leading-relaxed">
              After you open WhatsApp, come back here if you need Family tools
              for {school.name}.
            </p>
          ) : (
            <p className="text-sm text-ink-muted leading-relaxed">
              You can open WhatsApp from the invite above. Family tools for
              this school opens after you tap Join on this page — we cannot see
              who is in the chat.
            </p>
          )}
          <p className="text-sm text-ink-muted leading-relaxed">
            SEND Unity Circle will add ready school groups to the{" "}
            {school.localAuthority} WhatsApp Community in WhatsApp. You do not
            need to do this yourself.
          </p>
        </section>
      ) : null}

      {pending ? (
        <section className="rounded-3xl bg-paper border border-mist p-5 grid gap-3">
          <h2 className="font-display text-2xl">Waiting for SEND Unity Circle admin to join</h2>
          <p className="text-ink-muted leading-relaxed">
            A parent has created the WhatsApp group and sent the invite link.
            {` ${founder} `}
            will join via that link. When they have joined, a Join button will
            appear here for everyone else.
          </p>
          <p className="text-sm text-ink-muted">
            Exact group name:{" "}
            <span className="font-bold text-ink">{suggestedGroupName(school.name)}</span>
          </p>
          {toolsUnlocked && !submitted ? (
            <div className="grid gap-3 pt-1">
              {school.group?.inviteUrl ? (
                <WhatsAppInviteLink url={school.group.inviteUrl} />
              ) : null}
              <ContinueToTools slug={school.slug} schoolName={school.name} />
            </div>
          ) : null}
        </section>
      ) : null}

      {rejected ? (
        <section className="rounded-3xl bg-paper border border-mist p-5 grid gap-3">
          <h2 className="font-display text-2xl">Please start again with a new link</h2>
          <p className="text-ink-muted leading-relaxed">
            The last invite link could not be used. Create a fresh WhatsApp
            invite and submit it.
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
            name, then paste the invite link.
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

      <section className="rounded-3xl bg-paper border border-mist p-5 grid gap-3">
        <h2 className="font-display text-2xl">Family tools</h2>
        {toolsUnlocked ? (
          <>
            <p className="text-ink-muted leading-relaxed">
              Need help writing to the school, or a question about what your
              child may be entitled to? Family tools can draft with you in
              plain English. It is parent support, not legal advice.
            </p>
            <p>
              <ContinueToTools slug={school.slug} schoolName={school.name} />
            </p>
          </>
        ) : (
          <p className="text-ink-muted leading-relaxed">
            Family tools for {school.name} opens after you{" "}
            {live ? "join the parent group" : "start a group and send the invite"}
            . We cannot see who is in WhatsApp — this is just the next step on
            this website.
          </p>
        )}
      </section>
    </div>
  );
}
