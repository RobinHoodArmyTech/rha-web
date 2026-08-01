import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiResponse, ApiError } from "@/core/apiResponse";
import { getCityCheckinPage } from "@/core/services/backend/checkin/cityCheckinService";

/**
 * GET /api/v1/checkin/city/[cityName]
 * Check-in overview for one city: headline counters (last 60 days), recent
 * check-ins, and featured active Robins with badges. Returns an empty shell
 * for unknown cities so every city link resolves to a valid page.
 */
export const GET = withApiHandler(async (_request, context) => {
  const { cityName } = (await context!.params) as { cityName: string };
  if (!cityName?.trim()) throw new ApiError(400, "City is required.");

  const data = await getCityCheckinPage(cityName);
  return ApiResponse.success({ data });
});
