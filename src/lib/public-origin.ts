type HeaderReader = {
  get(name: string): string | null;
};

export type OriginRequest = {
  url: string;
  headers: HeaderReader;
};

function firstCsvValue(value: string): string {
  return value.split(",")[0]?.trim() ?? "";
}

function sanitiseHost(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const host = firstCsvValue(raw).replace(/^"/, "").replace(/"$/, "");
  if (!host || /[\s/\\]/.test(host)) return null;
  if (/^\[.*\](?::\d+)?$/.test(host)) return host;
  if (/^[A-Za-z0-9.-]+(?::\d+)?$/.test(host)) return host;
  return null;
}

function sanitiseProto(raw: string | null | undefined): "http" | "https" | null {
  if (!raw) return null;
  const proto = firstCsvValue(raw).replace(/^"/, "").replace(/"$/, "").toLowerCase();
  if (proto === "http" || proto === "https") return proto;
  return null;
}

function originFromConfiguredUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname) return null;
    return url.origin;
  } catch {
    return null;
  }
}

function parseForwarded(value: string | null): { host: string | null; proto: "http" | "https" | null } {
  if (!value) return { host: null, proto: null };
  const first = firstCsvValue(value);
  const protoMatch = /(?:^|;)\s*proto=([^;]+)/i.exec(first);
  const hostMatch = /(?:^|;)\s*host=([^;]+)/i.exec(first);
  return {
    host: sanitiseHost(hostMatch?.[1]),
    proto: sanitiseProto(protoMatch?.[1]),
  };
}

export function getPublicOrigin(request: OriginRequest): string {
  const configured =
    process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) {
    const origin = originFromConfiguredUrl(configured);
    if (origin) return origin;
  }

  const forwarded = parseForwarded(request.headers.get("forwarded"));
  const host =
    sanitiseHost(request.headers.get("x-forwarded-host")) ?? forwarded.host;
  const proto =
    sanitiseProto(request.headers.get("x-forwarded-proto")) ?? forwarded.proto;

  if (host) {
    return `${proto ?? "https"}://${host}`;
  }

  const railway = process.env.RAILWAY_PUBLIC_DOMAIN?.trim();
  if (railway) {
    const hostOnly = sanitiseHost(railway.replace(/^https?:\/\//i, ""));
    if (hostOnly) return `https://${hostOnly}`;
  }

  try {
    return new URL(request.url).origin;
  } catch {
    return "http://127.0.0.1:3000";
  }
}

export function publicUrl(request: OriginRequest, path: string): URL {
  return new URL(path, `${getPublicOrigin(request)}/`);
}
