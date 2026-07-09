import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiResponse } from "@/core/apiResponse";
import { getCheckinTotals } from "@/core/services/backend/checkin/checkinService";

/** GET /api/v1/checkin/stats — last-7-days counters for the public home page. */
export const GET = withApiHandler(async () => {
  const stats = await getCheckinTotals();
  return ApiResponse.success({ data: stats });
});
