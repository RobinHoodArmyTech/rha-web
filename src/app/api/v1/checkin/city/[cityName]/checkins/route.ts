import type { NextRequest } from "next/server";
import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiResponse, ApiError } from "@/core/apiResponse";
import { CityFeedQuerySchema } from "@/core/validators/cityCheckinValidation";
import { getCityCheckinFeed } from "@/core/services/backend/checkin/cityCheckinService";

/**
 * GET /api/v1/checkin/city/[cityName]/checkins?cursor=&limit=
 * Paginated check-in feed for one city (newest first), for infinite scroll.
 * Returns { items, nextCursor, total }; keep calling with the returned
 * `nextCursor` until it is null.
 */
export const GET = withApiHandler(async (request: NextRequest, context) => {
  const { cityName } = (await context!.params) as { cityName: string };
  if (!cityName?.trim()) throw new ApiError(400, "City is required.");

  const { searchParams } = new URL(request.url);
  const { cursor, limit } = CityFeedQuerySchema.parse({
    cursor: searchParams.get("cursor") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });

  const data = await getCityCheckinFeed(cityName, { cursor, limit });
  return ApiResponse.success({ data });
});
