import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiResponse } from "@/core/apiResponse";
import { AUTH_COOKIE } from "@/core/config/constants";
import { loginSchema } from "@/core/validators/auth";

/**
 * POST /api/v1/auth/login — user login (public)
 */
export const POST = withApiHandler(async (request) => {
  const body = await request.json().catch(() => ({}));
  const data = loginSchema.parse(body);

  const { email, password } = data;

  // TODO: verify credentials against DB.
  const token = crypto.randomUUID();

  const response = ApiResponse.success({ message: "Successfully logged in" });

  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
});
