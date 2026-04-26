import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiResponse } from "@/core/apiResponse";
import { db } from "@/core/db";

/**
 * GET /api/v1/master/cities — fetch all cities
 */
export const GET = withApiHandler(async () => {
  const cities = await db("cities")
    .join("countries", "cities.countryId", "countries.id")
    .select("cities.id", "cities.cityName", "countries.countryName")
    .orderBy("countries.countryName", "asc")
    .orderBy("cities.cityName", "asc");

  return ApiResponse.success({ data: cities });
});
