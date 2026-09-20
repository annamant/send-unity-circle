const SUFFIX = " | SEND Unity Circle";
const WHATSAPP_SUBJECT_LIMIT = 100;

export function suggestedGroupName(schoolName: string): string {
  const full = `${schoolName}${SUFFIX}`;
  if (full.length <= WHATSAPP_SUBJECT_LIMIT) return full;

  const maxName = WHATSAPP_SUBJECT_LIMIT - SUFFIX.length;
  const trimmed = schoolName.slice(0, Math.max(0, maxName - 1)).trimEnd();
  return `${trimmed}…${SUFFIX}`.slice(0, WHATSAPP_SUBJECT_LIMIT);
}

export const WHATSAPP_GROUP_NAME_LIMIT = WHATSAPP_SUBJECT_LIMIT;
