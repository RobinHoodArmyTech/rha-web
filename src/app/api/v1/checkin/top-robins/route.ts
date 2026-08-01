import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiResponse } from "@/core/apiResponse";
import { getTopActiveRobins } from "@/core/services/backend/checkin/checkinService";

/** GET /api/v1/checkin/top-robins — globally top active Robins over the last 60 days. */
export const GET = withApiHandler(async () => {
  const data = await getTopActiveRobins({ limit: 5 });
  return ApiResponse.success({ data });
});
