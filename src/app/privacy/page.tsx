export const metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 grid gap-6">
      <h1 className="font-display text-4xl">Privacy</h1>
      <p className="text-ink-muted leading-relaxed">
        SEND Unity Circle helps families find the right school WhatsApp group.
        We keep official school names from the Department for Education. If you
        start a group, we also keep the invite link you paste, an optional note,
        and whether the group is waiting for SEND Unity Circle admin to join,
        ready for other parents, or needs a new link.
      </p>
      <p className="text-ink-muted leading-relaxed">
        Parents do not create accounts on this website. You do not have to add
        anyone as a contact. You join through a WhatsApp invite link.
      </p>
      <p className="text-ink-muted leading-relaxed">
        Only SEND Unity Circle admin can sign in to look after groups. That
        sign-in is not for parents.
      </p>
      <p className="text-ink-muted leading-relaxed">
        An invite link can let someone into a WhatsApp group. Only submit a link
        for a group you have created for this purpose. If a link is wrong or
        out of date, admin can ask for a new one and a parent can send it again.
      </p>
    </div>
  );
}
