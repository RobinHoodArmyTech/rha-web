import { withApiAuth, AuthenticatedRequest } from "@/middleware/apiMiddlewares";
import { ApiResponse, ApiError } from "@/core/apiResponse";
import { PatchCitySchema } from "@/core/validators/cityValidation";
import { getCityById, patchCity, deleteCity } from "@/core/services/backend/city/cityService";

/**
 * GET    /api/v1/admin/city/:id — get city details
 * PATCH  /api/v1/admin/city/:id — patch city and city_data
 * DELETE /api/v1/admin/city/:id — delete a city
 */

async function parseCityId(context?: { params: Promise<{ id: string }> }): Promise<number> {
  if (!context) throw new ApiError(400, "Missing city ID");
  const { id } = await context.params;
  const cityId = parseInt(id, 10);
  if (isNaN(cityId)) throw new ApiError(400, "Invalid city ID");
  return cityId;
}

export const GET = withApiAuth(async (_request, context) => {
  const cityId = await parseCityId(context);

  const city = await getCityById(cityId);
  if (!city) throw new ApiError(404, "City not found");

  return ApiResponse.success({ data: city });
});

export const PATCH = withApiAuth(async (request, context) => {
  const cityId = await parseCityId(context);

  const body = await request.json();
  const data = PatchCitySchema.parse(body);

  if (Object.keys(data).length === 0) {
    throw new ApiError(400, "No fields to update");
  }

  const city = await patchCity(cityId, data);
  if (!city) throw new ApiError(404, "City not found");

  return ApiResponse.success({ data: city, message: "City updated successfully" });
});

export const DELETE = withApiAuth(async (_request, context) => {
  const cityId = await parseCityId(context);

  const deleted = await deleteCity(cityId);
  if (!deleted) throw new ApiError(404, "City not found");

  return ApiResponse.success({ message: "City deleted successfully" });
});
