import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiError, ApiResponse } from "@/core/apiResponse";
import { AUTH_COOKIE } from "@/core/config/constants";
import { signupSchema } from "@/core/validators/auth";

/**
 * POST /api/v1/auth/signup — user registration (public)
 */
export const POST = withApiHandler(async (request) => {
  const body = await request.json().catch(() => ({}));
  const data = signupSchema.parse(body);

  const { fullName, email, phone, city } = data;

  // TODO: create user in DB and persist hashed password.
  const token = crypto.randomUUID();

  const response = ApiResponse.success(
    {
      user: {
        fullName,
        email,
        phone,
        city,
      },
    },
    201,
  );

  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
});
