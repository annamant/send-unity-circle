export const metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 grid gap-6">
      <h1 className="font-display text-4xl">Privacy</h1>
      <p className="text-ink-muted leading-relaxed">
        SEND Unity Circle is a parent-led school index. We store official school
        records from the Department for Education, and — if you start a group —
        the WhatsApp invite link you paste, an optional note, and the status of
        that group (pending, live, or rejected).
      </p>
      <p className="text-ink-muted leading-relaxed">
        Parents do not create accounts on this website. You do not have to add
        anyone as a contact. Joining is via chat.whatsapp.com links.
      </p>
      <p className="text-ink-muted leading-relaxed">
        Admin sign-in uses a shared password held in the server environment. It
        is for SEND Unity Circle operators only.
      </p>
      <p className="text-ink-muted leading-relaxed">
        Invite links can let someone into a WhatsApp group. Only submit a link
        for a group you have created for this purpose. If a link is wrong or
        expired, admin can reject it and a parent can submit a new one.
      </p>
    </div>
  );
}
