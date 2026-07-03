import { withApiAuth } from "@/middleware/apiMiddlewares";
import { ADMIN_ROLES } from "@/core/config/constants";
import { ApiResponse } from "@/core/apiResponse";
import { SignupQuerySchema } from "@/core/validators/signupValidation";
import { listSignups, getSignupStats } from "@/core/services/backend/signup/signupService";

/**
 * GET /api/v1/admin/signup — list volunteer signups (read-only).
 *
 * Visibility is enforced here, not on the client:
 *   • Admin roles (ADMIN_ROLES) see aggregated stats + every city's signups.
 *   • All other roles are scoped to their own `session.cityId`.
 *
 * Supports `from`/`to` (YYYY-MM-DD) date-range filtering, `q` free-text search,
 * and `page`/`limit` server-side pagination.
 */
export const GET = withApiAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const query = SignupQuerySchema.parse({
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    q: searchParams.get("q") ?? undefined,
    cityId: searchParams.get("cityId") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });

  const isAdmin = ADMIN_ROLES.includes(request.session.roleName);
  // Admins may filter by any city (or none). Non-admins are locked to their own
  // city — a `cityId` in the query is ignored for them.
  const cityId = isAdmin ? query.cityId : request.session.cityId;

  // A non-admin with no city assignment has nothing to see.
  if (!isAdmin && cityId == null) {
    return ApiResponse.success({ data: { rows: [], total: 0, stats: { total: 0, cityCount: 0 } } });
  }

  const filters = { cityId, from: query.from, to: query.to, q: query.q };

  const [list, stats] = await Promise.all([
    listSignups({ ...filters, page: query.page, limit: query.limit }),
    getSignupStats(filters),
  ]);

  return ApiResponse.success({ data: { rows: list.rows, total: list.total, stats } });
});
