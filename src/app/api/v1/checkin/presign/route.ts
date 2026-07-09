import { withApiHandler } from "@/middleware/apiMiddlewares";
import { ApiResponse } from "@/core/apiResponse";
import { PresignRequestSchema, MAX_SELFIE_BYTES } from "@/core/validators/checkinValidation";
import { isLocalStorage, createPresignedUpload } from "@/core/storage";

/**
 * POST /api/v1/checkin/presign — tell the client how to upload the selfie.
 *
 *   • dev (local storage) → { strategy: "proxy" } — the client just multipart-POSTs
 *     the file to /api/v1/checkin (server writes it to the local filesystem).
 *   • prod (S3)          → { strategy: "s3", url, fields, key } — the client POSTs
 *     the file DIRECTLY to S3 (policy enforces ≤10MB + image/*), then calls
 *     /api/v1/checkin with the returned photoKey. Bytes never touch our server.
 */
export const POST = withApiHandler(async (request) => {
  const { contentType } = PresignRequestSchema.parse(await request.json());

  if (isLocalStorage()) {
    return ApiResponse.success({ data: { strategy: "proxy" as const } });
  }

  const { url, fields, key } = await createPresignedUpload({
    prefix: "checkins",
    contentType,
    maxBytes: MAX_SELFIE_BYTES,
  });

  return ApiResponse.success({ data: { strategy: "s3" as const, url, fields, key } });
});
