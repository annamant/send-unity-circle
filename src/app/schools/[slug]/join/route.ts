import { NextRequest, NextResponse } from "next/server";
import { publicUrl } from "@/lib/public-origin";
import { getSchoolBySlug } from "@/lib/schools";
import {
  TOOLS_UNLOCK_COOKIE,
  TOOLS_UNLOCK_MAX_AGE_SEC,
  createToolsUnlockToken,
  mergeUnlockedSlugs,
  parseToolsUnlockToken,
} from "@/lib/tools-unlock";

type RouteContext = { params: Promise<{ slug: string }> };

function cookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: TOOLS_UNLOCK_MAX_AGE_SEC,
  };
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const school = await getSchoolBySlug(slug);
  const schoolPath = `/schools/${slug}`;
  const back = publicUrl(request, schoolPath);
  const joined = publicUrl(request, `${schoolPath}?joined=1`);

  if (!school || school.group?.status !== "LIVE" || !school.group.inviteUrl) {
    return NextResponse.redirect(back);
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
    return NextResponse.redirect(back);
  }

  const response = NextResponse.redirect(joined, 303);
  response.cookies.set(
    TOOLS_UNLOCK_COOKIE,
    token,
    cookieOptions(joined.protocol === "https:"),
  );
  return response;
}
