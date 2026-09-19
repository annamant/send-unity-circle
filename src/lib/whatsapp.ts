const INVITE_RE = /^https:\/\/chat\.whatsapp\.com\/([A-Za-z0-9_-]{10,40})\/?$/i;

export function normaliseInviteUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== "https:") return null;
  if (url.hostname !== "chat.whatsapp.com") return null;
  if (url.username || url.password) return null;

  const match = `https://chat.whatsapp.com${url.pathname}`.match(INVITE_RE);
  if (!match) return null;

  return `https://chat.whatsapp.com/${match[1]}`;
}

export function isWhatsAppInviteUrl(raw: string): boolean {
  return normaliseInviteUrl(raw) !== null;
}
