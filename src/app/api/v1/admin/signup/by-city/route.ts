import { withApiRole } from "@/middleware/apiMiddlewares";
import { ADMIN_ROLES } from "@/core/config/constants";
import { ApiResponse } from "@/core/apiResponse";
import { SignupByCityQuerySchema } from "@/core/validators/signupValidation";
import { listSignupsByCity } from "@/core/services/backend/signup/signupService";

/**
 * GET /api/v1/admin/signup/by-city — signups grouped by city (aggregate view).
 *
 * Admin-only: the grouping spans all cities, so it's meaningless for a
 * city-scoped (non-admin) user. Shares the `from`/`to` date range with the
 * main list. Returns the full list; the client paginates it (few cities).
 */
export const GET = withApiRole(...ADMIN_ROLES)(async (request) => {
  const { searchParams } = new URL(request.url);
  const { from, to } = SignupByCityQuerySchema.parse({
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
  });

  const rows = await listSignupsByCity({ from, to });
  return ApiResponse.success({ data: rows });
});
