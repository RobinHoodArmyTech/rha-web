import { withApiAuth } from "@/middleware/apiMiddlewares";
import { ApiResponse, ApiError } from "@/core/apiResponse";
import { CreateCitySchema } from "@/core/validators/cityValidation";
import { listCities, createCity, getCityByName } from "@/core/services/backend/city/cityService";
import { getCountryById } from "@/core/services/backend/country/countryService";

/**
 * GET  /api/v1/admin/city — list all cities
 * POST /api/v1/admin/city — create a new city
 */

export const GET = withApiAuth(async () => {
  const cities = await listCities();
  return ApiResponse.success({ data: cities });
});

export const POST = withApiAuth(async (request) => {
  const body = await request.json();
  const data = CreateCitySchema.parse(body);

  const existing = await getCityByName(data.cityName);
  if (existing) {
    throw new ApiError(409, `City "${data.cityName}" already exists`);
  }

  const country = await getCountryById(data.countryId);
  if (!country) {
    throw new ApiError(400, "Invalid country");
  }

  const city = await createCity(data);
  return ApiResponse.success({ data: city, message: "City created successfully" });
});
