import { NextRequest, NextResponse } from "next/server";
import { domainResolver } from "./domainResolver";
import { authGuard } from "./authGuard";

/**
 * Composed middleware — runs guards in order, returns on first match.
 * Add new middleware modules here and keep each module focused on one concern.
 */
export function middleware(request: NextRequest): NextResponse {
  // 1. Domain resolver — must run first to rewrite to correct site tree
  const domainResponse = domainResolver(request);
  if (domainResponse) return domainResponse;

  // 2. Auth guard — protect authenticated checkin routes
  const authResponse = authGuard(request);
  if (authResponse) return authResponse;

  return NextResponse.next();
}

