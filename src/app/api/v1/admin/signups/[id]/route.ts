import { withApiRole } from "@/middleware/apiMiddlewares";
import { Role } from "@/core/config/constants";
import { ApiResponse, ApiError } from "@/core/apiResponse";
import { deleteSignup } from "@/core/services/backend/joinus/joinusService";

/**
 * DELETE /api/v1/admin/signups/:id — delete a signup (SysAdmin / Founder only)
 */
export const DELETE = withApiRole(
  Role.SysAdmin,
  Role.Founder,
)(async (_request, context) => {
  const { id } = await context!.params;
  const signupId = Number(id);

  if (!signupId || isNaN(signupId)) {
    throw new ApiError(400, "Invalid signup ID");
  }

  const deleted = await deleteSignup(signupId);
  if (!deleted) {
    throw new ApiError(404, "Signup not found");
  }

  return ApiResponse.success({ message: "Signup deleted" });
});
