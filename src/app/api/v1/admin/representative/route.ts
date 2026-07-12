import { withApiRole } from "@/middleware/apiMiddlewares";
import { ADMIN_ROLES } from "@/core/config/constants";
import { ApiResponse, ApiError } from "@/core/apiResponse";
import { listAllRepresentatives, createRepresentative } from "@/core/services/backend/city/cityRepresentativeService";
import { z } from "zod";

const CreateRepSchema = z.object({
  cityId: z.number().int().positive(),
  fullName: z.string().min(1),
  email: z.string().email().optional(),
  mobileNumber: z.string().optional(),
});

export const GET = withApiRole(...ADMIN_ROLES)(async () => {
  const rows = await listAllRepresentatives();
  return ApiResponse.success({ data: rows });
});

export const POST = withApiRole(...ADMIN_ROLES)(async (request) => {
  const body = await request.json().catch(() => ({}));
  const data = CreateRepSchema.parse(body);
  const created = await createRepresentative(data);
  if (!created) throw new ApiError(500, "Failed to create representative");
  return ApiResponse.success({ data: created, message: "Representative created" });
});