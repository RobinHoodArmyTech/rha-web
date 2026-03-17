import { NextRequest, NextResponse } from "next/server";

/**
 * Protects checkin sub-routes that require authentication.
 * Unauthenticated users are redirected to the checkin home page
 * with a `redirect` query param so they can be sent back after login.
 */

const PROTECTED_PATHS = ["/sites/checkin/dashboard", "/sites/checkin/profile"];
const AUTH_COOKIE = "rha-auth-token";

export function authGuard(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (!isProtected) return null;

  const isAuthenticated = request.cookies.get(AUTH_COOKIE);
  if (isAuthenticated) return null;

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/sites/checkin";
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}
