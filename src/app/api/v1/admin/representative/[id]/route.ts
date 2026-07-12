import { withApiRole } from "@/middleware/apiMiddlewares";
import { ADMIN_ROLES } from "@/core/config/constants";
import { ApiResponse, ApiError } from "@/core/apiResponse";
import { getRepresentativeById, updateRepresentative, deleteRepresentative } from "@/core/services/backend/city/cityRepresentativeService";
import { z } from "zod";

export const GET = withApiRole(...ADMIN_ROLES)(async (_request, context) => {
  if (!context) throw new ApiError(400, "Missing Representative ID");
  const { id } = await context.params;
  const repId = parseInt(id, 10);
  if (isNaN(repId)) throw new ApiError(400, "Invalid ID");
  const rep = await getRepresentativeById(repId);
  if (!rep) throw new ApiError(404, "Representative not found");
  return ApiResponse.success({ data: rep });
});

export const PATCH = withApiRole(...ADMIN_ROLES)(async (request, context) => {
  if (!context) throw new ApiError(400, "Missing Representative ID");
  const { id } = await context.params;
  const repId = parseInt(id, 10);
  if (isNaN(repId)) throw new ApiError(400, "Invalid ID");
  const body = await request.json().catch(() => ({}));
  const updateSchema = z.object({
    fullName: z.string().min(1).optional(),
    email: z.string().email().optional(),
    mobileNumber: z.string().optional(),
    cityId: z.number().int().positive().optional(),
  });
  const data = updateSchema.parse(body);
  const updated = await updateRepresentative(repId, data);
  if (!updated) throw new ApiError(404, "Representative not found");
  return ApiResponse.success({ data: updated, message: "Representative updated" });
});

export const DELETE = withApiRole(...ADMIN_ROLES)(async (_request, context) => {
  if (!context) throw new ApiError(400, "Missing Representative ID");
  const { id } = await context.params;
  const repId = parseInt(id, 10);
  if (isNaN(repId)) throw new ApiError(400, "Invalid ID");
  const deleted = await deleteRepresentative(repId);
  if (!deleted) throw new ApiError(404, "Representative not found");
  return ApiResponse.success({ message: "Representative deleted" });
});