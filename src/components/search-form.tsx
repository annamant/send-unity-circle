import { LONDON_AUTHORITIES } from "@/lib/london-authorities";

export function SearchForm({
  q = "",
  la = "",
  compact = false,
}: {
  q?: string;
  la?: string;
  compact?: boolean;
}) {
  return (
    <form
      action="/schools"
      method="get"
      className={compact ? "grid gap-3" : "grid gap-4"}
      role="search"
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_14rem_auto] sm:items-end">
        <label className="grid gap-1.5 text-sm font-bold">
          School name or postcode
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="e.g. Elmgreen, Kingsdale, SE27"
            className="min-h-12 rounded-2xl border border-mist bg-paper px-4 text-base font-normal text-ink placeholder:text-ink-muted/70"
            autoComplete="off"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-bold">
          Local authority
          <select
            name="la"
            defaultValue={la}
            className="min-h-12 rounded-2xl border border-mist bg-paper px-3 text-base font-normal text-ink"
          >
            <option value="">All listed areas</option>
            {LONDON_AUTHORITIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="min-h-12 rounded-full bg-teal px-6 text-base font-bold text-cream hover:bg-teal-dark"
        >
          Search
        </button>
      </div>
    </form>
  );
}
