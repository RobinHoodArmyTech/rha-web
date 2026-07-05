import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiResponse } from "@/core/apiResponse";
import { getCheckinCountsByCity } from "@/core/services/backend/checkin/checkinService";

/** GET /api/v1/checkin/highlights — cities ranked by check-ins over the last 60 days. */
export const GET = withApiHandler(async () => {
  const cities = await getCheckinCountsByCity(60);
  return ApiResponse.success({ data: cities });
});
