"use client";

import { useState } from "react";

export function CopyButton({
  value,
  label,
  copiedLabel = "Copied",
  className,
}: {
  value: string;
  label: string;
  copiedLabel?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const field = document.createElement("textarea");
      field.value = value;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={
        className ??
        "min-h-12 rounded-full bg-teal px-5 font-bold text-cream hover:bg-teal-dark"
      }
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
