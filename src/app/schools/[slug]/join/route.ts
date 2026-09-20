import { NextRequest, NextResponse } from "next/server";
import { getSchoolBySlug } from "@/lib/schools";
import {
  TOOLS_UNLOCK_COOKIE,
  TOOLS_UNLOCK_MAX_AGE_SEC,
  createToolsUnlockToken,
  mergeUnlockedSlugs,
  parseToolsUnlockToken,
} from "@/lib/tools-unlock";

type RouteContext = { params: Promise<{ slug: string }> };

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TOOLS_UNLOCK_MAX_AGE_SEC,
  };
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const school = await getSchoolBySlug(slug);
  const schoolPath = `/schools/${slug}`;

  if (!school || school.group?.status !== "LIVE" || !school.group.inviteUrl) {
    return NextResponse.redirect(new URL(schoolPath, request.url));
  }

  const current = parseToolsUnlockToken(
    request.cookies.get(TOOLS_UNLOCK_COOKIE)?.value,
  );
  let token: string;
  try {
    token = createToolsUnlockToken(
      mergeUnlockedSlugs(current, school.slug),
    );
  } catch {
    return NextResponse.redirect(new URL(schoolPath, request.url));
  }

  const response = NextResponse.redirect(
    new URL(`${schoolPath}?joined=1`, request.url),
    303,
  );
  response.cookies.set(TOOLS_UNLOCK_COOKIE, token, cookieOptions());
  return response;
}
