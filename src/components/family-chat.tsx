"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  FAMILY_TOOLS_UNAVAILABLE,
  STARTER_CHIPS,
  type ChatMessage,
  type SchoolChatContext,
} from "@/lib/family-tools";

type Props = {
  available: boolean;
  school: SchoolChatContext | null;
};

type StoredThreads = {
  version: 1;
  threads: Record<string, ChatMessage[]>;
};

const STORAGE_KEY = "suc-family-tools-v1";
const EMPTY: ChatMessage[] = [];
const listeners = new Set<() => void>();
const memoryThreads: Record<string, ChatMessage[]> = {};
let sessionRaw = "";

function threadKey(school: SchoolChatContext | null) {
  return school?.slug ?? "_";
}

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readSessionThreads(): Record<string, ChatMessage[]> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw === sessionRaw) return memoryThreads;
    sessionRaw = raw ?? "";
    if (!raw) return memoryThreads;
    const parsed = JSON.parse(raw) as StoredThreads;
    if (parsed?.version !== 1 || !parsed.threads) return memoryThreads;
    for (const [key, value] of Object.entries(parsed.threads)) {
      if (!(key in memoryThreads) && Array.isArray(value)) {
        memoryThreads[key] = value;
      }
    }
  } catch {
    // Private browsing or blocked storage — memory still works.
  }
  return memoryThreads;
}

function snapshotFor(key: string): ChatMessage[] {
  return readSessionThreads()[key] ?? EMPTY;
}

function writeThread(key: string, messages: ChatMessage[], persist = true) {
  memoryThreads[key] = messages;
  if (persist) {
    try {
      const threads = { ...readSessionThreads(), [key]: messages };
      const raw = JSON.stringify({ version: 1, threads });
      sessionStorage.setItem(STORAGE_KEY, raw);
      sessionRaw = raw;
    } catch {
      // Chat still works in memory for this visit.
    }
  }
  notify();
}

async function readSseStream(
  response: Response,
  onDelta: (text: string) => void,
) {
  if (!response.body) {
    throw new Error("empty");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let sawError = "";

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
      if (!data) continue;
      try {
        const payload = JSON.parse(data) as {
          delta?: string;
          error?: string;
          done?: boolean;
        };
        if (payload.error) {
          sawError = payload.error;
        } else if (typeof payload.delta === "string") {
          onDelta(payload.delta);
        }
      } catch {
        // Wait for the rest of the event.
      }
    }
  }

  if (sawError) throw new Error(sawError);
}

export function FamilyChat({ available, school }: Props) {
  const key = threadKey(school);
  const messages = useSyncExternalStore(
    subscribe,
    () => snapshotFor(key),
    () => EMPTY,
  );
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const showStarters = messages.length === 0 && !busy;
  const composerDisabled = !available || busy;

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy || !available) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content },
    ];
    writeThread(key, nextMessages);
    setDraft("");
    setError(null);
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/tools/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          schoolSlug: school?.slug ?? null,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error || FAMILY_TOOLS_UNAVAILABLE);
      }

      let assistant = "";
      writeThread(
        key,
        [...nextMessages, { role: "assistant", content: "" }],
        false,
      );

      await readSseStream(response, (delta) => {
        assistant += delta;
        writeThread(
          key,
          [...nextMessages, { role: "assistant", content: assistant }],
          false,
        );
      });

      if (!assistant.trim()) {
        throw new Error(
          "Family tools did not send a reply. Please try again.",
        );
      }
      writeThread(key, [
        ...nextMessages,
        { role: "assistant", content: assistant },
      ]);
    } catch (caught) {
      if ((caught as { name?: string }).name === "AbortError") return;
      const message =
        caught instanceof Error && caught.message
          ? caught.message
          : "Something went wrong. Please try again.";
      setError(message);
      writeThread(key, nextMessages);
    } finally {
      setBusy(false);
      abortRef.current = null;
      inputRef.current?.focus();
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(draft);
  }

  function onComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send(draft);
    }
  }

  function onChip(prompt: string | null) {
    if (prompt === null) {
      inputRef.current?.focus();
      return;
    }
    void send(prompt);
  }

  function clearChat() {
    abortRef.current?.abort();
    writeThread(key, []);
    setError(null);
    setDraft("");
    setBusy(false);
    inputRef.current?.focus();
  }

  if (!available) {
    return (
      <div className="rounded-3xl border border-mist bg-paper p-5 sm:p-6 grid gap-3">
        <p className="font-display text-2xl">Tools temporarily unavailable</p>
        <p className="text-ink-muted leading-relaxed">
          {FAMILY_TOOLS_UNAVAILABLE}
        </p>
        <p>
          <Link
            href="/schools"
            className="font-bold text-teal-dark underline decoration-gold underline-offset-4"
          >
            Find your school
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {showStarters ? (
        <div className="grid gap-2">
          <p className="text-sm font-bold">Try asking</p>
          <ul className="flex flex-wrap gap-2">
            {STARTER_CHIPS.map((chip) => (
              <li key={chip.id}>
                <button
                  type="button"
                  onClick={() => onChip(chip.prompt)}
                  className="inline-flex min-h-11 items-center rounded-full border border-mist bg-paper px-4 py-2 text-left text-sm font-bold leading-snug hover:border-teal/40"
                >
                  {chip.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {messages.length > 0 || busy ? (
        <div
          ref={listRef}
          className="grid gap-3 max-h-[min(28rem,55dvh)] overflow-y-auto pr-1"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label={
            school
              ? `Family tools chat for ${school.name}`
              : "Family tools chat"
          }
        >
          {messages.map((message, index) => {
            const emptyAssistant =
              message.role === "assistant" && !message.content && busy;
            return (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "justify-self-end max-w-[92%]"
                    : "max-w-[92%]"
                }
              >
                <p className="sr-only">
                  {message.role === "user" ? "You" : "Family tools"}
                </p>
                <div
                  className={
                    message.role === "user"
                      ? "rounded-3xl rounded-br-lg bg-teal px-4 py-3 text-cream whitespace-pre-wrap leading-relaxed"
                      : "rounded-3xl rounded-bl-lg border border-mist bg-paper px-4 py-3 whitespace-pre-wrap leading-relaxed"
                  }
                >
                  {emptyAssistant ? (
                    <span className="text-ink-muted">Thinking…</span>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {error ? (
        <p className="rounded-2xl bg-sage px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1.5 text-sm font-bold">
          Your question
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onComposerKeyDown}
            rows={3}
            disabled={composerDisabled}
            placeholder="Ask in your own words…"
            className="min-h-24 rounded-2xl border border-mist bg-paper px-4 py-3 text-base font-normal text-ink placeholder:text-ink-muted/70 disabled:opacity-70"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={composerDisabled || !draft.trim()}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-teal px-6 font-bold text-cream hover:bg-teal-dark disabled:opacity-50"
          >
            {busy ? "Sending…" : "Send"}
          </button>
          {messages.length > 0 ? (
            <button
              type="button"
              onClick={clearChat}
              className="inline-flex min-h-12 items-center rounded-full border border-ink/15 px-5 font-bold"
            >
              New chat
            </button>
          ) : null}
        </div>
        <p className="text-xs text-ink-muted leading-relaxed">
          This chat stays on your device for this visit. We do not keep a copy.{" "}
          <Link
            href="/privacy"
            className="underline decoration-gold underline-offset-4 hover:text-ink"
          >
            Privacy
          </Link>
        </p>
      </form>
    </div>
  );
}
