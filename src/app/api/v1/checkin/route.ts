import { withApiHandler, withApiAuth } from "@/middleware/apiMiddlewares";
import { ApiResponse, ApiError } from "@/core/apiResponse";

/**
 * GET  /api/v1/checkin  — list recent check-ins (public)
 * POST /api/v1/checkin  — submit a new check-in (authenticated)
 */
export const GET = withApiHandler(async () => {
  // TODO: fetch paginated check-ins from DB
  return ApiResponse.success({ data: [] });
});

export const POST = withApiAuth(async () => {
  // TODO: parse multipart form-data, upload photo to storage, save record
  throw new ApiError(501, "Check-in submission not yet implemented");
});
