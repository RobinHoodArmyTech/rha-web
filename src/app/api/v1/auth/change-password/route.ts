import { withApiAuth } from "@/middleware/apiMiddlewares";
import { ApiError, ApiResponse } from "@/core/apiResponse";
import { AUTH_COOKIE } from "@/core/config/constants";
import { changePasswordSchema } from "@/core/validators/auth";
import { verifyPassword, hashPassword } from "@/lib/password";
import { getUserById, updateUserPassword } from "@/core/services/backend/user/userService";

/**
 * POST /api/v1/auth/change-password — change own password (authenticated, any role).
 *
 * Requires the current password (re-auth) even within a logged-in session.
 * On success the auth cookie is cleared so the user must sign in again.
 */
export const POST = withApiAuth(async (request) => {
  const body = await request.json().catch(() => ({}));
  const { currentPassword, newPassword } = changePasswordSchema.parse(body);

  const user = await getUserById(request.session.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const valid = await verifyPassword(currentPassword, user.password);
  if (!valid) {
    throw new ApiError(400, "Current password is incorrect");
  }

  if (currentPassword === newPassword) {
    throw new ApiError(400, "New password must be different from your current password");
  }

  const hashed = await hashPassword(newPassword);
  await updateUserPassword(user.id, hashed);

  // Invalidate the session — force re-authentication with the new password.
  const response = ApiResponse.success({ message: "Password changed. Please log in again." });
  response.cookies.delete(AUTH_COOKIE);
  return response;
});
