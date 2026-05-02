import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiResponse } from "@/core/apiResponse";
import { listCities } from "@/core/services/backend/city/cityService";

/**
 * GET /api/v1/public/city — fetch all cities (public, used by join-us form etc.)
 */
export const GET = withApiHandler(async () => {
  const cities = await listCities();
  return ApiResponse.success({ data: cities });
});
