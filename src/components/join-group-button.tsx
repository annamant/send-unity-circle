"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  joinLiveGroup,
  unlockLiveSchoolTools,
} from "@/app/schools/[slug]/join-actions";

export function JoinGroupButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={joinLiveGroup}
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        startTransition(async () => {
          const result = await unlockLiveSchoolTools(slug);
          if (result.error) {
            setError(result.error);
            return;
          }
          if (result.inviteUrl) {
            window.open(result.inviteUrl, "_blank", "noopener,noreferrer");
          }
          router.refresh();
        });
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-teal px-6 font-bold text-cream hover:bg-teal-dark disabled:opacity-70"
      >
        {pending ? "Opening WhatsApp…" : "Join on WhatsApp"}
      </button>
      {error ? (
        <p className="mt-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
