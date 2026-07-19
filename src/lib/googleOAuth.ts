import { OAuth2Client } from "google-auth-library";
import { ApiError } from "@/core/apiResponse";

/**
 * Minimal Google OAuth 2.0 helper for Robin (volunteer) sign-in. We use it only
 * to authenticate identity — exchange the auth code, verify the id_token, and
 * read the verified email/name/picture. Google's own tokens are used inside
 * verifyCode() and then discarded: nothing from Google is persisted or put in
 * our session cookie. Scopes are limited to `openid email profile`.
 */

export const GOOGLE_SCOPES = ["openid", "email", "profile"];

function redirectUri(origin: string): string {
  return process.env.GOOGLE_REDIRECT_URI ?? `${origin}/api/v1/auth/google/callback`;
}

function client(origin: string): OAuth2Client {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new ApiError(
      500,
      "Google sign-in is not configured (missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET).",
    );
  }
  return new OAuth2Client({ clientId, clientSecret, redirectUri: redirectUri(origin) });
}

/** Consent-screen URL to send the user to. `origin` is the current request origin. */
export function getAuthUrl(origin: string, state: string): string {
  return client(origin).generateAuthUrl({
    scope: GOOGLE_SCOPES,
    state,
    // No offline access / refresh token — we never call Google again after login.
    access_type: "online",
    prompt: "select_account",
  });
}

export interface GoogleProfile {
  email: string;
  emailVerified: boolean;
  name: string;
  picture: string | null;
}

/**
 * Exchange the auth code for tokens, verify the id_token, and return the profile.
 * The exchanged Google tokens live only in this function's scope and are dropped
 * on return — we keep none of them.
 */
export async function verifyCode(origin: string, code: string): Promise<GoogleProfile> {
  const oauth = client(origin);
  const { tokens } = await oauth.getToken(code);
  if (!tokens.id_token) {
    throw new ApiError(401, "Google sign-in failed (no id_token).");
  }

  const ticket = await oauth.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new ApiError(401, "Google sign-in failed (no email).");
  }

  return {
    email: payload.email,
    emailVerified: payload.email_verified ?? false,
    name: payload.name ?? payload.email,
    picture: payload.picture ?? null,
  };
}
