import Link from "next/link";
import { FamilyChat } from "@/components/family-chat";
import { isFamilyToolsAvailable } from "@/lib/config";
import { getSchoolBySlug } from "@/lib/schools";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Family tools",
  description:
    "Plain-English help with letters, rights questions, and next steps — from a SEND parent advocate, not a solicitor.",
};

function firstString(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const schoolSlug = firstString(params.school);
  const schoolRecord = schoolSlug ? await getSchoolBySlug(schoolSlug) : null;
  const school = schoolRecord
    ? {
        slug: schoolRecord.slug,
        name: schoolRecord.name,
        localAuthority: schoolRecord.localAuthority,
      }
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 grid gap-6">
      <header className="grid gap-3">
        <h1 className="font-display text-4xl leading-tight">Family tools</h1>
        <p className="text-lg text-ink-muted leading-relaxed">
          Draft a message, check what your child may be entitled to, or ask a
          question in plain English. This is parent support, not legal advice.
        </p>
      </header>
      {school ? (
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
      ) : (
        <p className="text-sm text-ink-muted leading-relaxed">
          For a letter about a particular school, open Family tools from that
          school&apos;s page — or{" "}
          <Link
            href="/schools"
            className="font-bold text-teal-dark underline decoration-gold underline-offset-4"
          >
            find your school
          </Link>{" "}
          first.
        </p>
      )}
      <FamilyChat available={isFamilyToolsAvailable()} school={school} />
    </div>
  );
}
