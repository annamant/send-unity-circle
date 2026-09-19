import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { StartWizard } from "@/components/start-wizard";
import { getFounderDisplayName, getFounderWhatsAppE164 } from "@/lib/config";
import { suggestedGroupName } from "@/lib/group-name";
import { getSchoolBySlug } from "@/lib/schools";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const school = await getSchoolBySlug(slug);
  return { title: school ? `Start a group · ${school.name}` : "Start a group" };
}

export default async function StartGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const school = await getSchoolBySlug(slug);
  if (!school) notFound();
  if (school.group?.status === "LIVE" || school.group?.status === "PENDING") {
    redirect(`/schools/${school.slug}`);
  }

  const founderLabel = getFounderDisplayName();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 grid gap-6">
      <p>
        <Link
          href={`/schools/${school.slug}`}
          className="text-sm font-bold text-teal-dark underline decoration-gold underline-offset-4"
        >
          Back to {school.name}
        </Link>
      </p>
      <div className="grid gap-2">
        <h1 className="font-display text-4xl leading-tight">
          Start the {school.name} group
        </h1>
        <p className="text-ink-muted leading-relaxed">
          Four short steps. The important one: {founderLabel} joins through the
          invite link you paste. You do not need to add a contact.
        </p>
      </div>
      <StartWizard
        schoolName={school.name}
        localAuthority={school.localAuthority}
        groupName={suggestedGroupName(school.name)}
        founderLabel={founderLabel}
        founderE164={getFounderWhatsAppE164()}
        slug={school.slug}
      />
    </div>
  );
}
