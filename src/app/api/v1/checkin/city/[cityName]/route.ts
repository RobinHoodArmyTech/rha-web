import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiResponse, ApiError } from "@/core/apiResponse";
import { getCityCheckinPage } from "@/core/services/backend/checkin/cityCheckinService";

/**
 * GET /api/v1/checkin/city/[cityName] — check-in overview for one city:
 * headline counters, recent check-ins, and featured active Robins with badges.
 *
 * Currently backed by dummy data (see cityCheckinService); the response shape is
 * the final contract, so the client does not change when the DB version ships.
 */
export const GET = withApiHandler(async (_request, context) => {
  const { cityName } = (await context!.params) as { cityName: string };
  if (!cityName?.trim()) throw new ApiError(400, "City is required.");

  const data = getCityCheckinPage(cityName);
  return ApiResponse.success({ data });
});
