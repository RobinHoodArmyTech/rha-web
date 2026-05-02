import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiError, ApiResponse } from "@/core/apiResponse";
import { AUTH_COOKIE } from "@/core/config/constants";
import { loginSchema } from "@/core/validators/auth";
import { signToken } from "@/lib/jwt";
import { verifyPassword } from "@/lib/password";
import { getUserByEmail, getUserRoleByUserId, updateLastLogin } from "@/core/services/backend/user/userService";

/**
 * POST /api/v1/auth/login — user login (public)
 */
export const POST = withApiHandler(async (request) => {
  const body = await request.json().catch(() => ({}));
  const { email, password } = loginSchema.parse(body);

  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const userRole = await getUserRoleByUserId(user.id);
  if (!userRole) {
    throw new ApiError(403, "No role assigned to this user");
  }

  await updateLastLogin(user.id);

  const token = await signToken({ userId: user.id, roleId: userRole.roleId });

  const response = ApiResponse.success({ message: "Successfully logged in" });

  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * parseInt(process.env.JWT_EXPIRY_DAYS || "7"),
  });

  return response;
});
