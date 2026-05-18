import { withApiRole } from "@/middleware/apiMiddlewares";
import { Role } from "@/core/config/constants";
import { ApiResponse } from "@/core/apiResponse";
import { getSignups, type SignupFilters } from "@/core/services/backend/joinus/joinusService";

/**
 * GET /api/v1/admin/signups — list signups (read-only)
 *
 * Query params:
 *   cityId — filter by city (forced for non-higher roles, optional for SysAdmin/Founder)
 *   from   — filter createdAt >= value (ISO date string)
 *   to     — filter createdAt <= value (ISO date string)
 */
export const GET = withApiRole(
  Role.SysAdmin,
  Role.Founder,
  Role.Librarian,
  Role.GrowthRep,
  Role.CityRep,
)(async (request) => {
  const { searchParams } = new URL(request.url);
  const { roleName, cityId: sessionCityId } = request.session;

  const filters: SignupFilters = {};

  const isHigherRole = roleName === Role.SysAdmin || roleName === Role.Founder;

  if (isHigherRole) {
    const cityIdParam = searchParams.get("cityId");
    if (cityIdParam) {
      filters.cityId = Number(cityIdParam);
    }
  } else {
    filters.cityId = sessionCityId;
  }

  const from = searchParams.get("from");
  if (from) filters.from = from;

  const to = searchParams.get("to");
  if (to) filters.to = to;

  const page = searchParams.get("page");
  if (page) filters.page = Number(page);

  const limit = searchParams.get("limit");
  if (limit) filters.limit = Number(limit);

  const signups = await getSignups(filters);
  return ApiResponse.success({ data: signups });
});
