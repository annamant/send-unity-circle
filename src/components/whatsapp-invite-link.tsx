import { CopyButton } from "@/components/copy-button";

export function WhatsAppInviteLink({ url }: { url: string }) {
  return (
    <div className="grid gap-3">
      <p className="text-sm font-bold">WhatsApp invite</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all font-bold text-teal-dark underline decoration-gold underline-offset-4 leading-relaxed"
      >
        {url}
      </a>
      <CopyButton
        value={url}
        label="Copy link"
        className="min-h-12 w-fit rounded-full border border-ink/15 px-5 font-bold"
      />
    </div>
  );
}
