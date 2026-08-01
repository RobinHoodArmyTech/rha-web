import type { NextRequest } from "next/server";
import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiResponse, ApiError } from "@/core/apiResponse";
import { TopRobinsQuerySchema } from "@/core/validators/cityCheckinValidation";
import { getCityTopRobins } from "@/core/services/backend/checkin/cityCheckinService";

/**
 * GET /api/v1/checkin/city/[cityName]/top-robins?limit=
 * Top Robins for one city ranked by drives over the last 60 days.
 */
export const GET = withApiHandler(async (request: NextRequest, context) => {
  const { cityName } = (await context!.params) as { cityName: string };
  if (!cityName?.trim()) throw new ApiError(400, "City is required.");

  const { searchParams } = new URL(request.url);
  const { limit } = TopRobinsQuerySchema.parse({
    limit: searchParams.get("limit") ?? undefined,
  });

  const data = await getCityTopRobins(cityName, limit);
  return ApiResponse.success({ data });
});
