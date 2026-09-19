import Link from "next/link";
import { logoutAdmin } from "@/app/admin/login/actions";
import {
  markGroupLive,
  rejectGroup,
  updateInviteLink,
} from "@/app/admin/actions";
import { isAdminSession } from "@/lib/auth";
import { getFounderDisplayName } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import { suggestedGroupName } from "@/lib/group-name";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function firstString(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  if (!(await isAdminSession())) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const tab = firstString(params.tab) || "pending";
  const founder = getFounderDisplayName();

  const [pending, live, missing, counts] = await Promise.all([
    prisma.whatsAppGroup.findMany({
      where: { status: "PENDING" },
      include: { school: true },
      orderBy: { submittedAt: "asc" },
    }),
    prisma.whatsAppGroup.findMany({
      where: { status: "LIVE" },
      include: { school: true },
      orderBy: { liveAt: "desc" },
      take: 100,
    }),
    prisma.school.findMany({
      where: {
        OR: [{ group: null }, { group: { status: "REJECTED" } }],
      },
      include: { group: true },
      orderBy: [{ localAuthority: "asc" }, { name: "asc" }],
      take: 80,
    }),
    prisma.$transaction([
      prisma.whatsAppGroup.count({ where: { status: "PENDING" } }),
      prisma.whatsAppGroup.count({ where: { status: "LIVE" } }),
      prisma.school.count({
        where: { OR: [{ group: null }, { group: { status: "REJECTED" } }] },
      }),
    ]),
  ]);

  const tabs = [
    { id: "pending", label: `Pending (${counts[0]})` },
    { id: "live", label: `Live (${counts[1]})` },
    { id: "missing", label: `Missing groups (${counts[2]})` },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 grid gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-2 max-w-2xl">
          <h1 className="font-display text-4xl">Admin</h1>
          <p className="text-ink-muted leading-relaxed">
            Sign in as {founder}. Open each invite, join the group, then mark it
            as live after you have joined. After that, add the group to the
            borough WhatsApp Community in WhatsApp — this site does not do that
            for you.
          </p>
        </div>
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="min-h-11 rounded-full border border-ink/15 px-4 font-bold"
          >
            Sign out
          </button>
        </form>
      </div>

      <ul className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <li key={item.id}>
            <Link
              href={`/admin?tab=${item.id}`}
              className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold ${
                tab === item.id ? "bg-teal text-cream" : "bg-paper border border-mist"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {tab === "pending" ? (
        <section className="grid gap-4">
          <h2 className="font-display text-2xl">Pending queue</h2>
          {pending.length === 0 ? (
            <p className="rounded-3xl bg-paper border border-mist p-5 text-ink-muted">
              Nothing waiting. When a parent submits a chat.whatsapp.com link, it
              will appear here.
            </p>
          ) : (
            <ul className="grid gap-4">
              {pending.map((group) => (
                <li
                  key={group.id}
                  className="rounded-3xl bg-paper border border-mist p-5 grid gap-4"
                >
                  <div>
                    <h3 className="font-display text-xl">{group.school.name}</h3>
                    <p className="text-sm text-ink-muted">
                      {group.school.localAuthority} · {group.school.postcode} ·
                      submitted {group.submittedAt.toLocaleString("en-GB")}
                    </p>
                    <p className="mt-2 text-sm">
                      Group name to expect:{" "}
                      <span className="font-bold">
                        {suggestedGroupName(group.school.name)}
                      </span>
                    </p>
                    {group.submitterNote ? (
                      <p className="mt-1 text-sm">Parent note: {group.submitterNote}</p>
                    ) : null}
                  </div>
                  <a
                    href={group.inviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 w-fit items-center rounded-full bg-teal px-4 font-bold text-cream"
                  >
                    Open invite
                  </a>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    After the group is ready for parents, add it to the{" "}
                    {group.school.localAuthority} WhatsApp Community in WhatsApp
                    (Communities → Add group). This website will not add it for
                    you.
                  </p>
                  <form action={updateInviteLink} className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
                    <input type="hidden" name="groupId" value={group.id} />
                    <label className="grid gap-1 text-sm font-bold">
                      Edit invite link
                      <input
                        name="inviteUrl"
                        defaultValue={group.inviteUrl}
                        className="min-h-11 rounded-2xl border border-mist bg-cream px-3 font-normal"
                      />
                    </label>
                    <button className="min-h-11 rounded-full border border-ink/15 px-4 font-bold">
                      Save link
                    </button>
                  </form>
                  <form action={markGroupLive} className="grid gap-2 rounded-2xl bg-sage/50 p-3">
                    <input type="hidden" name="groupId" value={group.id} />
                    <label className="flex gap-2 items-start text-sm">
                      <input type="checkbox" name="joined" className="mt-1" required />
                      I have joined this group as {founder} via the invite link.
                    </label>
                    <button className="min-h-11 w-fit rounded-full bg-teal-dark px-4 font-bold text-cream">
                      Mark as live after you’ve joined
                    </button>
                  </form>
                  <form action={rejectGroup} className="grid gap-2">
                    <input type="hidden" name="groupId" value={group.id} />
                    <label className="grid gap-1 text-sm font-bold">
                      Reject with a note
                      <input
                        name="adminNote"
                        placeholder="Link expired, wrong school, …"
                        className="min-h-11 rounded-2xl border border-mist bg-cream px-3 font-normal"
                      />
                    </label>
                    <button className="min-h-11 w-fit rounded-full border border-coral px-4 font-bold text-coral">
                      Reject link
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {tab === "live" ? (
        <section className="grid gap-4">
          <h2 className="font-display text-2xl">Live groups</h2>
          {live.length === 0 ? (
            <p className="rounded-3xl bg-paper border border-mist p-5 text-ink-muted">
              No live groups yet.
            </p>
          ) : (
            <ul className="grid gap-3">
              {live.map((group) => (
                <li key={group.id} className="rounded-3xl bg-paper border border-mist p-5 grid gap-3">
                  <div>
                    <Link
                      href={`/schools/${group.school.slug}`}
                      className="font-display text-xl underline decoration-gold underline-offset-4"
                    >
                      {group.school.name}
                    </Link>
                    <p className="text-sm text-ink-muted">
                      {group.school.localAuthority}
                      {group.liveAt
                        ? ` · live since ${group.liveAt.toLocaleDateString("en-GB")}`
                        : ""}
                    </p>
                  </div>
                  <form action={updateInviteLink} className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
                    <input type="hidden" name="groupId" value={group.id} />
                    <label className="grid gap-1 text-sm font-bold">
                      Invite link
                      <input
                        name="inviteUrl"
                        defaultValue={group.inviteUrl}
                        className="min-h-11 rounded-2xl border border-mist bg-cream px-3 font-normal"
                      />
                    </label>
                    <button className="min-h-11 rounded-full border border-ink/15 px-4 font-bold">
                      Save link
                    </button>
                  </form>
                  <form action={rejectGroup}>
                    <input type="hidden" name="groupId" value={group.id} />
                    <input type="hidden" name="adminNote" value="Taken down by admin." />
                    <button className="text-sm font-bold text-coral underline">
                      Take down
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {tab === "missing" ? (
        <section className="grid gap-4">
          <h2 className="font-display text-2xl">Schools missing a live group</h2>
          <p className="text-sm text-ink-muted">
            Showing the first 80. Use public search for a specific school. Rejected
            links appear here so a parent can start again.
          </p>
          <ul className="grid gap-2">
            {missing.map((school) => (
              <li
                key={school.id}
                className="rounded-2xl bg-paper border border-mist px-4 py-3 flex flex-wrap items-center justify-between gap-2"
              >
                <div>
                  <Link
                    href={`/schools/${school.slug}`}
                    className="font-bold underline decoration-gold underline-offset-4"
                  >
                    {school.name}
                  </Link>
                  <p className="text-sm text-ink-muted">
                    {school.localAuthority} · {school.postcode}
                    {school.group?.status === "REJECTED" ? " · last link rejected" : ""}
                  </p>
                </div>
                <Link
                  href={`/schools/${school.slug}/start`}
                  className="text-sm font-bold text-teal-dark"
                >
                  Open start steps
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
