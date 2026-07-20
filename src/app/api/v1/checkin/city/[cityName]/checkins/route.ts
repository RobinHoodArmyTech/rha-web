import type { NextRequest } from "next/server";
import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiResponse, ApiError } from "@/core/apiResponse";
import {
  getCityCheckinFeed,
  CHECKIN_FEED_DEFAULT_LIMIT,
  CHECKIN_FEED_MAX_LIMIT,
} from "@/core/services/backend/checkin/cityCheckinService";

/**
 * GET /api/v1/checkin/city/[cityName]/checkins?cursor=&limit=
 * Paginated check-in feed for one city (newest first), for infinite scroll.
 * Returns { items, nextCursor, total }; keep calling with the returned
 * `nextCursor` until it is null. Currently dummy-backed — see cityCheckinService.
 */
export const GET = withApiHandler(async (request: NextRequest, context) => {
  const { cityName } = (await context!.params) as { cityName: string };
  if (!cityName?.trim()) throw new ApiError(400, "City is required.");

  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");

  const limitParam = searchParams.get("limit");
  let limit = CHECKIN_FEED_DEFAULT_LIMIT;
  if (limitParam !== null) {
    const parsed = Number(limitParam);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > CHECKIN_FEED_MAX_LIMIT) {
      throw new ApiError(400, `limit must be an integer between 1 and ${CHECKIN_FEED_MAX_LIMIT}.`);
    }
    limit = parsed;
  }

  const data = getCityCheckinFeed(cityName, { cursor, limit });
  return ApiResponse.success({ data });
});
