import Link from "next/link";
import { FamilyChat } from "@/components/family-chat";
import { isFamilyToolsAvailable } from "@/lib/config";
import { getSchoolBySlug } from "@/lib/schools";
import { readUnlockedSlugs } from "@/lib/tools-session";
import type { SchoolChatContext } from "@/lib/family-tools";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Family tools",
  description:
    "Plain-English help with letters, rights questions, and next steps — from a SEND parent advocate, not a solicitor.",
};

function firstString(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function toContext(school: {
  slug: string;
  name: string;
  localAuthority: string;
}): SchoolChatContext {
  return {
    slug: school.slug,
    name: school.name,
    localAuthority: school.localAuthority,
  };
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const requestedSlug = firstString(params.school);
  const unlockedSlugs = await readUnlockedSlugs();

  const requestedSchool = requestedSlug
    ? await getSchoolBySlug(requestedSlug)
    : null;
  const requestedUnlocked = Boolean(
    requestedSchool && unlockedSlugs.includes(requestedSchool.slug),
  );

  let school: SchoolChatContext | null = null;
  if (requestedUnlocked && requestedSchool) {
    school = toContext(requestedSchool);
  } else if (!requestedSlug) {
    for (const slug of unlockedSlugs) {
      const record = await getSchoolBySlug(slug);
      if (record) {
        school = toContext(record);
        break;
      }
    }
  }

  const canChat = Boolean(school);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 grid gap-6">
      <header className="grid gap-3">
        <h1 className="font-display text-4xl leading-tight">Family tools</h1>
        <p className="text-lg text-ink-muted leading-relaxed">
          Draft a message, check what your child may be entitled to, or ask a
          question in plain English. This is parent support, not legal advice.
        </p>
        <p className="text-ink-muted leading-relaxed">
          For official UK sources on SEND, school and council duties, and
          complaints, see{" "}
          <Link
            href="/rights"
            className="font-bold text-teal-dark underline decoration-gold underline-offset-4"
          >
            Rights & law
          </Link>
          . You can open it any time — it is not locked behind a WhatsApp
          group.
        </p>
      </header>

      {canChat && school ? (
        <>
          <p className="rounded-2xl bg-sage px-4 py-3 text-sm leading-relaxed">
            Drafting with <span className="font-bold">{school.name}</span> in{" "}
            <span className="font-bold">{school.localAuthority}</span>.{" "}
            <Link
              href={`/schools/${school.slug}`}
              className="font-bold text-teal-dark underline decoration-gold underline-offset-4"
            >
              School page
            </Link>
          </p>
          <FamilyChat available={isFamilyToolsAvailable()} school={school} />
        </>
      ) : requestedSchool && !requestedUnlocked ? (
        <section className="rounded-3xl border border-mist bg-paper p-5 sm:p-6 grid gap-4">
          <h2 className="font-display text-2xl">
            Join or start {requestedSchool.name} first
          </h2>
          <p className="text-ink-muted leading-relaxed">
            Family tools for this school opens after you join its parent
            WhatsApp group, or start one and send the invite. We cannot see who
            is in WhatsApp — this is just the next step on this website.
          </p>
          <p>
            <Link
              href={`/schools/${requestedSchool.slug}`}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-teal px-6 font-bold text-cream hover:bg-teal-dark"
            >
              Go to {requestedSchool.name}
            </Link>
          </p>
        </section>
      ) : (
        <section className="rounded-3xl border border-mist bg-paper p-5 sm:p-6 grid gap-4">
          <h2 className="font-display text-2xl">Find your school first</h2>
          <p className="text-ink-muted leading-relaxed">
            Family tools is for parents who have found their school and joined
            its WhatsApp group — or started one if it was not there yet.
          </p>
          <ol className="grid gap-2 text-ink-muted leading-relaxed list-decimal pl-5">
            <li>Find your child&apos;s school.</li>
            <li>Join a ready group, or start one and paste the invite.</li>
            <li>Then come back here to draft a letter or ask a question.</li>
          </ol>
          <p className="text-sm text-ink-muted leading-relaxed">
            We cannot see who is in a WhatsApp group. This check happens on
            this website after you join or start.
          </p>
          <p>
            <Link
              href="/schools"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-teal px-6 font-bold text-cream hover:bg-teal-dark"
            >
              Find your school
            </Link>
          </p>
        </section>
      )}
    </div>
  );
}
