import { withApiAuth } from "@/middleware/apiMiddlewares";
import { ApiResponse } from "@/core/apiResponse";
import { AUTH_COOKIE } from "@/core/config/constants";

/**
 * POST /api/v1/auth/logout — logout (authenticated)
 */
export const POST = withApiAuth(async () => {
  const response = ApiResponse.success({ message: "Logged out successfully" });
  response.cookies.delete(AUTH_COOKIE);
  return response;
});
