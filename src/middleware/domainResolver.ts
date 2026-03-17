import { NextRequest, NextResponse } from "next/server";
import { DOMAINS } from "@/core/config/domains";

/**
 * Rewrites request paths based on hostname.
 *
 * All site pages live under src/app/sites/:
 *   src/app/sites/main/     → main site
 *   src/app/sites/checkin/  → checkin app
 *
 * In production:
 *   robinhoodarmy.com/*          → /sites/main/*
 *   checkin.robinhoodarmy.com/*  → /sites/checkin/*
 *
 * In local dev both trees are also directly accessible:
 *   localhost:3000/sites/main/*    (no rewrite)
 *   localhost:3000/sites/checkin/* (no rewrite)
 *   localhost:3000/*               → /sites/main/*  (middleware rewrite)
 */

const SKIP_PREFIXES = ["/sites", "/api", "/_next", "/favicon"];

export function domainResolver(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") ?? "";

  // Already routed to a known path — let it pass through
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  // Checkin subdomain — rewrite to /sites/checkin tree
  if (
    hostname === DOMAINS.checkin.hostname ||
    hostname.startsWith("checkin.")
  ) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/sites/checkin${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  // Main domain — rewrite to /sites/main tree
  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = `/sites/main${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(rewriteUrl);
}
