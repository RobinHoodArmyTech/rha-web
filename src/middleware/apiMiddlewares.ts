/**
 * API route middlewares — composable wrappers for Next.js API route handlers.
 *
 * withApiHandler — base layer, provides consistent error handling.
 * withApiAuth    — auth layer, composes on top of withApiHandler.
 *
 * Usage:
 *   export const GET = withApiHandler(async (req) => { ... });            // public
 *   export const POST = withApiAuth(async (req) => { req.user; ... });    // authenticated
 */
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { ApiError } from "@/core/apiResponse";
import { AUTH_COOKIE } from "@/core/config/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// TODO: dummy type — will be replaced with a proper User model once auth is implemented
interface User {
  id: string;
  fullName: string;
  email: string;
  city: string;
}

type ApiHandler = (request: NextRequest) => Promise<NextResponse>;

export interface AuthenticatedRequest extends NextRequest {
  user: User;
}

type AuthenticatedHandler = (
  request: AuthenticatedRequest,
) => Promise<NextResponse>;

// ---------------------------------------------------------------------------
// withApiHandler — base error handling wrapper
// ---------------------------------------------------------------------------

export function withApiHandler(handler: ApiHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request);
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
  return withApiHandler(async (request: NextRequest) => {
    const token = request.cookies.get(AUTH_COOKIE);
    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    // TODO: validate token and resolve user from session/JWT
    const user: User = {
      id: "stub",
      fullName: "Stub User",
      email: "stub@robinhoodarmy.com",
      city: "Delhi",
    };

    (request as AuthenticatedRequest).user = user;

    return handler(request as AuthenticatedRequest);
  });
}
