import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/core/config/constants";

/**
 * Protects sub-routes that require authentication.
 * Unauthenticated users are redirected to the relevant login page
 * with a `redirect` query param so they can be sent back after login.
 *
 * Note: this guard only checks for the presence of an auth cookie.
 * Fine-grained role checks (e.g. admin = SysAdmin/Founder) are enforced
 * server-side in the admin panel layout and at the API layer.
 */

const CHECKIN_PROTECTED_PATHS = ["/sites/checkin/dashboard", "/sites/checkin/profile"];

const ADMIN_PREFIX = "/sites/admin";
const ADMIN_LOGIN = "/sites/admin/login";

export function authGuard(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(request.cookies.get(AUTH_COOKIE));

  // Admin panel — everything except the login page requires authentication
  if (pathname.startsWith(ADMIN_PREFIX) && !pathname.startsWith(ADMIN_LOGIN)) {
    if (isAuthenticated) return null;
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = ADMIN_LOGIN;
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Checkin protected routes
  const isProtected = CHECKIN_PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (!isProtected) return null;
  if (isAuthenticated) return null;

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/sites/checkin";
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}
