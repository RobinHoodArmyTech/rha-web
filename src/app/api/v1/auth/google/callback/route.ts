import { NextResponse } from "next/server";
import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ROBIN_AUTH_COOKIE } from "@/core/config/constants";
import { verifyCode } from "@/lib/googleOAuth";
import { findOrCreateRobin } from "@/core/services/backend/robin/robinService";
import { signRobinToken } from "@/lib/robinAuth";

const STATE_COOKIE = "rha-oauth-state";
const CHECKIN_FORM = "/sites/checkin/submit";
const EXPIRY_DAYS = parseInt(process.env.JWT_EXPIRY_DAYS || "7");

/**
 * GET /api/v1/auth/google/callback — Google redirects here after consent. We
 * verify the `state` (CSRF) against our cookie, exchange the code for the
 * verified Google profile, upsert the Robin, set our own session cookie, and
 * land them on the check-in form. Google's tokens never leave verifyCode(); we
 * persist none of them.
 *
 * This is a browser navigation, so failures redirect back to the check-in page
 * with an ?error flag rather than returning JSON.
 */
export const GET = withApiHandler(async (request) => {
  const origin = request.nextUrl.origin;
  const params = request.nextUrl.searchParams;

  const fail = (reason: string) => {
    const url = new URL(CHECKIN_FORM, origin);
    url.searchParams.set("error", reason);
    const res = NextResponse.redirect(url);
    res.cookies.delete(STATE_COOKIE);
    return res;
  };

  // CSRF: the state returned by Google must match the one we issued.
  const storedState = request.cookies.get(STATE_COOKIE)?.value;
  const state = params.get("state");
  const code = params.get("code");
  if (params.get("error") || !code || !state || !storedState || state !== storedState) {
    return fail("auth");
  }

  const profile = await verifyCode(origin, code);
  if (!profile.emailVerified) {
    return fail("email_unverified");
  }

  const robin = await findOrCreateRobin({
    email: profile.email,
    fullName: profile.name,
    avatarUrl: profile.picture,
  });

  const token = await signRobinToken({
    robinId: robin.id,
    email: robin.email,
    fullName: robin.fullName,
    avatarUrl: robin.avatarUrl,
  });

  const response = NextResponse.redirect(new URL(CHECKIN_FORM, origin));
  response.cookies.set(ROBIN_AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * EXPIRY_DAYS,
  });
  response.cookies.delete(STATE_COOKIE);
  return response;
});
