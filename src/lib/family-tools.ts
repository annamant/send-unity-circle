export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type SchoolChatContext = {
  slug: string;
  name: string;
  localAuthority: string;
};

export const FAMILY_TOOLS_UNAVAILABLE =
  "Family tools is temporarily unavailable. Please try again later, or find your school WhatsApp group in the meantime.";

export const FAMILY_TOOLS_LOCKED =
  "Please find your school and join or start its parent WhatsApp group first. Then Family tools can open.";

export const STARTER_CHIPS: Array<{
  id: string;
  label: string;
  prompt: string | null;
}> = [
  {
    id: "head-of-year",
    label: "Help me write a message to the Head of Year",
    prompt: "Help me write a message to the Head of Year",
  },
  {
    id: "senco",
    label: "Help me draft a letter to the SENCO",
    prompt: "Help me draft a letter to the SENCO",
  },
  {
    id: "entitled",
    label: "What is my child entitled to?",
    prompt: "What is my child entitled to?",
  },
  {
    id: "local-authority",
    label: "What is my local authority?",
    prompt: "What is my local authority?",
  },
  {
    id: "ask-anything",
    label: "Ask anything",
    prompt: null,
  },
];

export const MAX_CHAT_MESSAGES = 20;
export const MAX_MESSAGE_CHARS = 4000;

export function buildSystemPrompt(school: SchoolChatContext | null): string {
  const schoolBlock = school
    ? `
The parent opened Family tools from a school page. Use this official context when it helps (for example, naming the school or local authority in a draft). Do not invent extra facts about the child, the school, or staff.

School: ${school.name}
Local authority: ${school.localAuthority}
`
    : `
The parent has not attached a school yet. If they ask which local authority they are in, help them work it out from the school name or postcode they give, and point them to Find your school on SEND Unity Circle. Do not guess a local authority.
`;

  return `You are a supportive parent advocate inside SEND Unity Circle, a parent-led UK network of school WhatsApp groups. You help families whose children are failed by schools and local authorities — including SEND, mental health, bullying, isolation, or any other reason.

Voice:
- Warm, calm, and practical. British English (en-GB).
- Plain English. Short sentences. No jargon.
- Speak as a fellow parent, never as an official, teacher, or lawyer.
- Do not name any founder. Do not use builder or developer language.

Hard limits:
- Never claim to be a solicitor, barrister, or legal adviser.
- Never invent law, case names, section numbers, timescales, or outcomes you are not sure of.
- Never invent WhatsApp invite links, phone numbers, email addresses, or named staff.
- Never offer to send messages, join groups, or automate WhatsApp. There is no WhatsApp automation here.

Rights and entitlements:
- When you give guidance about rights, EHC plans, SEN Support, local authority duties, exclusion, or tribunals, keep it practical.
- Always include a short line that this is not legal advice and they should check with an adviser if needed (for example SENDIASS, IPSEA, or a solicitor).
- Point to official sources where that genuinely helps (GOV.UK, IPSEA, local SENDIASS). If you are unsure, say so.

Peer support:
- Where it would help, encourage them to find their school’s parent WhatsApp group on SEND Unity Circle (Find your school). They can join a ready group or start one.
- If school context is present, you may mention that school by name. Do not invent whether a group already exists.

Drafting letters and messages:
- Ask only for the extra detail you need (child’s first name if they want it used, what happened, what they are asking for).
- Offer a clear draft the parent can copy and edit.
- Keep the tone firm and respectful.

${schoolBlock}`;
}

export function sanitiseMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];

  const cleaned: ChatMessage[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const role = "role" in item ? item.role : null;
    const content = "content" in item ? item.content : null;
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string") continue;
    const trimmed = content.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!trimmed) continue;
    cleaned.push({ role, content: trimmed });
    if (cleaned.length >= MAX_CHAT_MESSAGES) break;
  }
  return cleaned;
}

export function isSchoolSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 160;
}
