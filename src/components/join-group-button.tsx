export function JoinGroupButton({ slug }: { slug: string }) {
  return (
    <form action={`/schools/${slug}/join`} method="post">
      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-teal px-6 font-bold text-cream hover:bg-teal-dark"
      >
        Join on WhatsApp
      </button>
    </form>
  );
}
