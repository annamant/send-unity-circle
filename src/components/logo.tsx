export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <rect width="40" height="40" rx="12" className="fill-teal" />
      <circle cx="20" cy="20" r="11" className="stroke-cream" strokeWidth="2.2" />
      <circle cx="20" cy="20" r="5.5" className="stroke-gold" strokeWidth="2.2" />
      <circle cx="20" cy="13.5" r="2" className="fill-cream" />
      <circle cx="14.8" cy="23.2" r="2" className="fill-cream" />
      <circle cx="25.2" cy="23.2" r="2" className="fill-cream" />
    </svg>
  );
}
