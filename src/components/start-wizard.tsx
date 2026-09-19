"use client";

import { useActionState, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { submitSchoolGroup } from "@/app/schools/[slug]/start/actions";

const steps = [
  "Name the group",
  "Create it in WhatsApp",
  "Copy the invite link",
  "Paste it here",
];

export function StartWizard({
  schoolName,
  localAuthority,
  groupName,
  founderLabel,
  founderE164,
  slug,
}: {
  schoolName: string;
  localAuthority: string;
  groupName: string;
  founderLabel: string;
  founderE164: string | null;
  slug: string;
}) {
  const [step, setStep] = useState(0);
  const [state, formAction, pending] = useActionState(submitSchoolGroup, {
    error: "",
  });

  return (
    <div className="grid gap-6">
      <ol className="flex flex-wrap gap-2" aria-label="Wizard steps">
        {steps.map((label, index) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => setStep(index)}
              className={`rounded-full px-3 py-2 text-sm font-bold min-h-11 ${
                index === step
                  ? "bg-teal text-cream"
                  : index < step
                    ? "bg-sage text-teal-dark"
                    : "bg-mist text-ink-muted"
              }`}
            >
              {index + 1}. {label}
            </button>
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <section className="rounded-3xl bg-paper p-5 shadow-sm border border-mist grid gap-4">
          <h2 className="font-display text-2xl">Use this exact group name</h2>
          <p className="text-ink-muted leading-relaxed">
            WhatsApp groups for SEND Unity Circle use the official school name so
            other parents can recognise them. Copy this and paste it when WhatsApp
            asks for a group name.
          </p>
          <p className="rounded-2xl bg-cream px-4 py-3 font-bold text-lg leading-snug">
            {groupName}
          </p>
          <CopyButton value={groupName} label="Copy group name" />
          <p className="text-sm text-ink-muted">
            {schoolName} is listed under {localAuthority}.
          </p>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="rounded-3xl bg-paper p-5 shadow-sm border border-mist grid gap-3">
          <h2 className="font-display text-2xl">Create the WhatsApp group</h2>
          <ol className="grid gap-2 text-ink-muted leading-relaxed list-decimal pl-5">
            <li>Open WhatsApp on your phone.</li>
            <li>Tap New chat, then New group.</li>
            <li>You can create the group with only yourself — no extra contacts needed.</li>
            <li>Paste the exact group name, then create the group.</li>
          </ol>
          <p className="rounded-2xl bg-sage/70 px-4 py-3 text-sm leading-relaxed">
            You do <strong>not</strong> need to add {founderLabel} as a contact.
            We join later using the invite link.
          </p>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="rounded-3xl bg-paper p-5 shadow-sm border border-mist grid gap-3">
          <h2 className="font-display text-2xl">Copy the invite link</h2>
          <ol className="grid gap-2 text-ink-muted leading-relaxed list-decimal pl-5">
            <li>Open the new group, then open group info.</li>
            <li>Choose Invite to group via link.</li>
            <li>Copy the link. It should start with chat.whatsapp.com.</li>
          </ol>
          <p className="text-sm text-ink-muted leading-relaxed">
            {founderLabel} will use this link to enter the group. You never have
            to share your address book.
          </p>
          {founderE164 ? (
            <div className="rounded-2xl border border-mist bg-cream px-4 py-3 grid gap-2">
              <p className="text-sm leading-relaxed">
                Optional backup only — if a WhatsApp screen asks for a number,
                you can copy {founderLabel}&apos;s number. You still should not
                need to add a contact.
              </p>
              <CopyButton
                value={founderE164}
                label="Copy backup number"
                className="min-h-11 rounded-full bg-teal-dark px-4 font-bold text-cream"
              />
            </div>
          ) : null}
        </section>
      ) : null}

      {step === 3 ? (
        <section className="rounded-3xl bg-paper p-5 shadow-sm border border-mist grid gap-4">
          <h2 className="font-display text-2xl">Paste the link and submit</h2>
          <p className="text-ink-muted leading-relaxed">
            After you send the link, the school is waiting for {founderLabel} to
            join. Once they have joined, other parents can join from this
            website.
          </p>
          <p className="rounded-2xl bg-sage/70 px-4 py-3 text-sm leading-relaxed">
            Later, we add the school group to the {localAuthority} WhatsApp
            Community in WhatsApp. That is our job — you do not need to add the
            group to a Community yourself.
          </p>
          <form action={formAction} className="grid gap-3">
            <input type="hidden" name="slug" value={slug} />
            <label className="grid gap-1.5 text-sm font-bold">
              WhatsApp invite link
              <input
                type="url"
                name="inviteUrl"
                required
                placeholder="https://chat.whatsapp.com/..."
                className="min-h-12 rounded-2xl border border-mist bg-cream px-4 text-base font-normal"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-bold">
              Optional note for admin
              <input
                type="text"
                name="note"
                maxLength={200}
                placeholder="e.g. I am a parent at this school"
                className="min-h-12 rounded-2xl border border-mist bg-cream px-4 text-base font-normal"
              />
            </label>
            {state.error ? (
              <p className="text-coral font-bold" role="alert">
                {state.error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={pending}
              className="min-h-12 rounded-full bg-coral px-6 font-bold text-cream hover:bg-coral/90 disabled:opacity-60"
            >
              {pending ? "Submitting…" : "Submit invite link"}
            </button>
          </form>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((value) => value - 1)}
            className="min-h-12 rounded-full border border-ink/15 px-5 font-bold"
          >
            Back
          </button>
        ) : null}
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((value) => value + 1)}
            className="min-h-12 rounded-full bg-teal px-5 font-bold text-cream hover:bg-teal-dark"
          >
            Next
          </button>
        ) : null}
      </div>
    </div>
  );
}
