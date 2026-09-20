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
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        ok = true;
      }
    } catch {
      ok = false;
    }

    if (!ok) {
      const field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.setAttribute("aria-hidden", "true");
      field.style.position = "fixed";
      field.style.top = "0";
      field.style.left = "0";
      field.style.width = "1px";
      field.style.height = "1px";
      field.style.padding = "0";
      field.style.opacity = "0.01";
      field.style.fontSize = "16px";
      document.body.appendChild(field);
      field.focus();
      field.select();
      field.setSelectionRange(0, value.length);
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      field.remove();
    }

    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
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
