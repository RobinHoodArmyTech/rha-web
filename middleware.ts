/**
 * Thin entry point — delegates all logic to src/middleware/index.ts
 * config must be defined here directly (Next.js static analysis requirement).
 */
import { NextRequest, NextResponse } from "next/server";
import { middleware as middlewareImpl } from "@/middleware/index";

export function middleware(request: NextRequest): NextResponse {
  return middlewareImpl(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
