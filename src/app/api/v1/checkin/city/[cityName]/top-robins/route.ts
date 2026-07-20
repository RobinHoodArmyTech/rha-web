import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiResponse, ApiError } from "@/core/apiResponse";
import { getCityTopRobins } from "@/core/services/backend/checkin/cityCheckinService";

/**
 * GET /api/v1/checkin/city/[cityName]/top-robins — the city leaderboard:
 * top Robins ranked by drives over the window, each with a milestone badge.
 * The page renders this server-side; the route exposes the same data as a
 * public contract for the real backend and any other consumer.
 */
export const GET = withApiHandler(async (_request, context) => {
  const { cityName } = (await context!.params) as { cityName: string };
  if (!cityName?.trim()) throw new ApiError(400, "City is required.");

  const data = getCityTopRobins(cityName);
  return ApiResponse.success({ data });
});
