import { withApiHandler, withApiAuth } from "@/middleware/apiMiddlewares";
import { ApiResponse, ApiError } from "@/core/apiResponse";

/**
 * GET /api/v1/city/{cityName} — fetch city details(public)
 * POST /api/v1/city/{cityName} — add a new city (authenticated)
 * PATCH /api/v1/city/{cityName} — update city details (authenticated)
 * DELETE /api/v1/city/{cityName} — delete city details (authenticated)
 */

export const GET = withApiHandler(async () => {
  // TODO: get city specific details
  return ApiResponse.success({ data: [] });
});

export const POST = withApiAuth(async () => {
  // TODO: parse multipart form-data, create new city in DB and associated pages
  return ApiResponse.success({ data: [] });
});

export const PATCH = withApiAuth(async () => {
  // TODO: parse multipart form-data, update record
  throw new ApiError(501, "Unable to update city details. Try again later");
});

export const DELETE = withApiAuth(async () => {
  // TODO: delete record
  throw new ApiError(501, "Unable to delete city. Try again later");
});
