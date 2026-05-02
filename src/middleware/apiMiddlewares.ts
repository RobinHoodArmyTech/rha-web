/**
 * API route middlewares — composable wrappers for Next.js API route handlers.
 *
 * withApiHandler — base layer, provides consistent error handling.
 * withApiAuth    — auth layer, composes on top of withApiHandler.
 *
 * Usage:
 *   export const GET = withApiHandler(async (req) => { ... });            // public
 *   export const POST = withApiAuth(async (req) => { req.session; ... });  // authenticated
 *   export const DELETE = withApiRole(Role.SysAdmin)(async (req) => { ... }); // role-gated
 */
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { ApiError } from "@/core/apiResponse";
import { AUTH_COOKIE, Role } from "@/core/config/constants";
import { verifyToken, type JwtPayload } from "@/lib/jwt";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RouteContext = { params: Promise<any> };

type ApiHandler = (request: NextRequest, context?: RouteContext) => Promise<NextResponse>;

export interface AuthenticatedRequest extends NextRequest {
  session: JwtPayload;
}

type AuthenticatedHandler = (
  request: AuthenticatedRequest,
  context?: RouteContext,
) => Promise<NextResponse>;

// ---------------------------------------------------------------------------
// withApiHandler — base error handling wrapper
// ---------------------------------------------------------------------------

export function withApiHandler(handler: ApiHandler) {
  return async (request: NextRequest, context?: RouteContext): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        const { formErrors, fieldErrors } = z.flattenError(error);
        return NextResponse.json(
          { success: false, message: "Validation failed", errors: { formErrors, fieldErrors } },
          { status: 400 },
        );
      }

      if (error instanceof ApiError) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: error.statusCode },
        );
      }

      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 },
      );
    }
  };
}

// ---------------------------------------------------------------------------
// withApiAuth — authentication wrapper (composes on top of withApiHandler)
// ---------------------------------------------------------------------------

export function withApiAuth(handler: AuthenticatedHandler) {
  return withApiHandler(async (request: NextRequest, context?: RouteContext) => {
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    let session: JwtPayload;
    try {
      session = await verifyToken(token);
    } catch {
      throw new ApiError(401, "Invalid or expired token");
    }

    (request as AuthenticatedRequest).session = session;

    return handler(request as AuthenticatedRequest, context);
  });
}

// ---------------------------------------------------------------------------
// withApiRole — role-based authorization (composes on top of withApiAuth)
// ---------------------------------------------------------------------------

export function withApiRole(...roles: Role[]) {
  return (handler: AuthenticatedHandler) => {
    return withApiAuth(async (request, context) => {
      if (!roles.includes(request.session.roleName)) {
        throw new ApiError(403, "Forbidden");
      }
      return handler(request, context);
    });
  };
}
