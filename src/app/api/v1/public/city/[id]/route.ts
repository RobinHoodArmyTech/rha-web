import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiResponse, ApiError } from "@/core/apiResponse";
import { getCityById } from "@/core/services/backend/city/cityService";

/**
 * GET    /api/v1/public/city/:id — get city details
 */

async function parseCityId(context?: { params: Promise<{ id: string }> }): Promise<number> {
  if (!context) throw new ApiError(400, "Missing city ID");
  const { id } = await context.params;
  const cityId = parseInt(id, 10);
  if (isNaN(cityId)) throw new ApiError(400, "Invalid city ID");
  return cityId;
}

export const GET = withApiHandler(async (_request, context) => {
  const cityId = await parseCityId(context);

  const city = await getCityById(cityId);
  if (!city) throw new ApiError(404, "City not found");

  return ApiResponse.success({ data: city });
});