import {
  FAMILY_TOOLS_UNAVAILABLE,
  buildSystemPrompt,
  isSchoolSlug,
  sanitiseMessages,
  type SchoolChatContext,
} from "@/lib/family-tools";
import {
  getFamilyToolsModel,
  getOpenAIApiKey,
  getOpenAIBaseUrl,
} from "@/lib/config";
import { getSchoolBySlug } from "@/lib/schools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type OpenAiChunk = {
  choices?: Array<{
    delta?: { content?: string | null };
  }>;
};

async function resolveSchoolContext(
  slug: unknown,
): Promise<SchoolChatContext | null> {
  if (typeof slug !== "string" || !isSchoolSlug(slug)) return null;
  const school = await getSchoolBySlug(slug);
  if (!school) return null;
  return {
    slug: school.slug,
    name: school.name,
    localAuthority: school.localAuthority,
  };
}

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    return jsonError(FAMILY_TOOLS_UNAVAILABLE, 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Please send a message and try again.", 400);
  }

  if (!body || typeof body !== "object") {
    return jsonError("Please send a message and try again.", 400);
  }

  const messages = sanitiseMessages(
    "messages" in body ? body.messages : undefined,
  );
  if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
    return jsonError("Please type a question first.", 400);
  }

  const school = await resolveSchoolContext(
    "schoolSlug" in body ? body.schoolSlug : undefined,
  );

  const upstream = await fetch(`${getOpenAIBaseUrl()}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getFamilyToolsModel(),
      stream: true,
      temperature: 0.6,
      max_tokens: 1200,
      messages: [
        { role: "system", content: buildSystemPrompt(school) },
        ...messages,
      ],
    }),
    signal: request.signal,
  }).catch(() => null);

  if (!upstream) {
    return jsonError(
      "We could not reach Family tools just now. Please try again in a moment.",
      502,
    );
  }

  if (!upstream.ok || !upstream.body) {
    return jsonError(
      "Family tools could not reply just now. Please try again in a moment.",
      502,
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = "";
      const send = (payload: Record<string, unknown>) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
        );
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (!data || data === "[DONE]") continue;
            try {
              const chunk = JSON.parse(data) as OpenAiChunk;
              const delta = chunk.choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta) {
                send({ delta });
              }
            } catch {
              // Ignore a partial SSE line; the next chunk may complete it.
            }
          }
        }
        send({ done: true });
      } catch (error) {
        if ((error as { name?: string }).name !== "AbortError") {
          send({
            error:
              "The reply stopped unexpectedly. Please try sending your message again.",
          });
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      reader.cancel().catch(() => undefined);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
