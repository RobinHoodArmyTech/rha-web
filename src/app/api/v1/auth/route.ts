import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiResponse } from "@/core/apiResponse";
import { AUTH_COOKIE } from "@/core/config/constants";

/**
 * DELETE /api/v1/auth — logout (public)
 */
export const DELETE = withApiHandler(async () => {
  const response = ApiResponse.success();
  response.cookies.delete(AUTH_COOKIE);
  return response;
});
