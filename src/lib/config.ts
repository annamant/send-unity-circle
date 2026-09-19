const DEFAULT_FOUNDER_LABEL = "SEND Unity Circle admin";

export function getFounderDisplayName(): string {
  const value = process.env.FOUNDER_WHATSAPP_DISPLAY?.trim();
  return value || DEFAULT_FOUNDER_LABEL;
}

export function getFounderWhatsAppE164(): string | null {
  const value = process.env.FOUNDER_WHATSAPP_E164?.trim();
  if (!value) return null;
  if (!/^\+[1-9]\d{7,14}$/.test(value)) return null;
  return value;
}

export function getAdminPassword(): string {
  const value = process.env.ADMIN_PASSWORD?.trim();
  if (!value) {
    throw new Error("ADMIN_PASSWORD is not set");
  }
  return value;
}

const DEFAULT_FAMILY_TOOLS_MODEL = "gpt-4o-mini";
const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";

export function getOpenAIApiKey(): string | null {
  const value = process.env.OPENAI_API_KEY?.trim();
  return value || null;
}

export function isFamilyToolsAvailable(): boolean {
  return Boolean(getOpenAIApiKey());
}

export function getFamilyToolsModel(): string {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_FAMILY_TOOLS_MODEL;
}

export function getOpenAIBaseUrl(): string {
  const value = process.env.OPENAI_BASE_URL?.trim() || DEFAULT_OPENAI_BASE_URL;
  return value.replace(/\/+$/, "");
}
