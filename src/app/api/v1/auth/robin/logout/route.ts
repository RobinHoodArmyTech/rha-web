import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiResponse } from "@/core/apiResponse";
import { ROBIN_AUTH_COOKIE } from "@/core/config/constants";

/**
 * POST /api/v1/auth/robin/logout — clear the Robin (volunteer) session cookie.
 * No auth wrapper: clearing a cookie is safe to call unauthenticated.
 */
export const POST = withApiHandler(async () => {
  const response = ApiResponse.success({ message: "Logged out successfully" });
  response.cookies.delete(ROBIN_AUTH_COOKIE);
  return response;
});
