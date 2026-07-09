import { z } from "zod";

/**
 * Selfie image types we accept. An explicit raster allowlist — deliberately
 * excludes image/svg+xml (SVGs can carry scripts → XSS from a public bucket) and
 * any non-image type.
 */
export const ALLOWED_SELFIE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"] as const;

export function isAllowedSelfieType(type: string): boolean {
  return (ALLOWED_SELFIE_TYPES as readonly string[]).includes(type);
}

/** Hard cap on a selfie file — enforced client-side, in the API, and by the S3 policy. */
export const MAX_SELFIE_BYTES = 10 * 1024 * 1024; // 10MB

// Shared fields of a check-in. Numbers are coerced from multipart/JSON strings.
const baseFields = {
  cityId: z.coerce.number().int().positive({ message: "Please select your city." }),
  peopleServed: z.coerce.number().int().min(0).default(0),
  studentsTaught: z.coerce.number().int().min(0).default(0),
};

const atLeastOne = (d: { peopleServed: number; studentsTaught: number }) =>
  d.peopleServed + d.studentsTaught > 0;
const atLeastOneError = {
  message: "Enter at least one person served or student taught.",
  path: ["peopleServed"],
};

/** Proxied (dev/local) submission — the selfie file is validated separately. */
export const CreateCheckinSchema = z.object(baseFields).refine(atLeastOne, atLeastOneError);
export type CreateCheckinValues = z.infer<typeof CreateCheckinSchema>;

/** Direct (S3 presigned) submission — the selfie is already uploaded at `photoKey`. */
export const CreateCheckinDirectSchema = z
  .object({ ...baseFields, photoKey: z.string().min(1) })
  .refine(atLeastOne, atLeastOneError);
export type CreateCheckinDirectValues = z.infer<typeof CreateCheckinDirectSchema>;

/** Body of the presign request — the client sends the file's content type. */
export const PresignRequestSchema = z.object({
  contentType: z
    .string()
    .refine(isAllowedSelfieType, "Please upload a JPG, PNG, WebP or HEIC image."),
});
