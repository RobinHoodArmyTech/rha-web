import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { withApiHandler } from "@/middleware/apiMiddlewares";
import { getAuthUrl } from "@/lib/googleOAuth";

const STATE_COOKIE = "rha-oauth-state";

/**
 * GET /api/v1/auth/google — start Robin sign-in. Mints a random `state`, stashes
 * it in a short-lived httpOnly cookie for CSRF protection, then redirects the
 * browser to Google's consent screen. The callback always lands the Robin on
 * the check-in form, so there's no return-path to carry.
 */
export const GET = withApiHandler(async (request) => {
  const state = randomUUID();
  const response = NextResponse.redirect(getAuthUrl(request.nextUrl.origin, state));
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600, // 10 minutes to complete the round-trip
  });
  return response;
});
