"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 grid gap-4">
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <p className="text-ink-muted">Please try again, or go back to the school list.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="min-h-11 w-fit rounded-full bg-teal px-5 font-bold text-cream"
      >
        Try again
      </button>
    </div>
  );
}
