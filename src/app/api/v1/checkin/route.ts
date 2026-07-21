import type { NextRequest } from "next/server";
import { withApiHandler, withRobinAuth } from "@/middleware/apiMiddlewares";
import { ApiResponse, ApiError } from "@/core/apiResponse";
import {
  CreateCheckinSchema,
  CreateCheckinDirectSchema,
  isAllowedSelfieType,
  MAX_SELFIE_BYTES,
} from "@/core/validators/checkinValidation";
import { createCheckin, listRecentCheckins } from "@/core/services/backend/checkin/checkinService";
import { getCityNameById } from "@/core/services/backend/city/cityService";
import { uploadCheckinSelfie } from "@/core/services/backend/checkin/checkinStorage";
import { objectExists, publicUrlForKey } from "@/core/storage";

// The whole multipart request is a bit larger than the file (fields + boundaries);
// allow modest overhead so a legit ~10MB photo isn't rejected at the request gate.
const MAX_REQUEST_BYTES = MAX_SELFIE_BYTES + 512 * 1024;

// A presigned selfie must land under our own prefix with a safe filename — never
// trust a client-supplied key to point anywhere else in the bucket.
const CHECKIN_KEY_RE = /^checkins\/[a-f0-9-]+\.[a-z0-9]+$/i;

/**
 * GET  /api/v1/checkin — recent check-ins (public feed).
 * POST /api/v1/checkin — submit a check-in. Requires a Robin (volunteer) session
 *   via `withRobinAuth`; the check-in is attributed to that Robin. Two shapes:
 *   • multipart/form-data (dev/local) — fields + a `selfie` file, proxied upload.
 *   • application/json     (prod/S3)   — fields + `photoKey` of a file already
 *     uploaded directly to S3 via a presigned POST (see /checkin/presign).
 */
export const GET = withApiHandler(async () => {
  const data = await listRecentCheckins(12);
  return ApiResponse.success({ data });
});

export const POST = withRobinAuth(async (request) => {
  const robinId = request.robin.robinId;
  const contentType = request.headers.get("content-type") ?? "";
  return contentType.includes("multipart/form-data")
    ? handleProxyUpload(request, robinId)
    : handleDirectUpload(request, robinId);
});

/** dev/local: the file rides in the multipart body; we validate + store it. */
async function handleProxyUpload(request: NextRequest, robinId: number) {
  // Hard gate: reject oversized requests up front, before buffering the whole
  // multipart body into memory. (Browsers always send Content-Length for uploads.)
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    throw new ApiError(413, "The selfie must be under 10MB.");
  }

  const form = await request.formData();
  const fields = CreateCheckinSchema.parse({
    cityId: form.get("cityId") ?? undefined,
    peopleServed: form.get("peopleServed") ?? undefined,
    studentsTaught: form.get("studentsTaught") ?? undefined,
  });

  const selfie = form.get("selfie");
  if (!(selfie instanceof File) || selfie.size === 0) {
    throw new ApiError(400, "A selfie photo is required.");
  }
  if (!isAllowedSelfieType(selfie.type)) {
    throw new ApiError(400, "Please upload a JPG, PNG, WebP or HEIC image.");
  }
  if (selfie.size > MAX_SELFIE_BYTES) {
    throw new ApiError(413, "The selfie must be under 10MB.");
  }

  const cityName = await getCityNameById(fields.cityId);
  if (!cityName) throw new ApiError(400, "Invalid city.");

  const bytes = Buffer.from(await selfie.arrayBuffer());
  const photoUrl = await uploadCheckinSelfie(bytes, selfie.type);

  return persist(fields, photoUrl, robinId);
}

/** prod/S3: the file was already uploaded via presigned POST; we verify + record it. */
async function handleDirectUpload(request: NextRequest, robinId: number) {
  const data = CreateCheckinDirectSchema.parse(await request.json());

  if (!CHECKIN_KEY_RE.test(data.photoKey)) {
    throw new ApiError(400, "Invalid photo reference.");
  }
  // Confirm the client actually uploaded to S3 before we store a dangling URL.
  if (!(await objectExists(data.photoKey))) {
    throw new ApiError(400, "Selfie upload not found. Please try again.");
  }

  const cityName = await getCityNameById(data.cityId);
  if (!cityName) throw new ApiError(400, "Invalid city.");

  return persist(data, publicUrlForKey(data.photoKey), robinId);
}

/** Shared tail: attribute the check-in to the signed-in Robin and insert the row. */
async function persist(
  fields: { cityId: number; peopleServed: number; studentsTaught: number },
  photoUrl: string,
  robinId: number,
) {
  const checkin = await createCheckin({
    cityId: fields.cityId,
    peopleServed: fields.peopleServed,
    studentsTaught: fields.studentsTaught,
    photoUrl,
    robinId,
  });
  return ApiResponse.success({ data: checkin, message: "Check-in recorded." });
}
