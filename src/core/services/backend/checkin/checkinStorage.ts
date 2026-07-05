import { uploadFile } from "@/core/storage";

/** Persists a check-in selfie under `checkins/` and returns its public URL/path. */
export async function uploadCheckinSelfie(bytes: Buffer, contentType: string): Promise<string> {
  return uploadFile(bytes, { prefix: "checkins", contentType });
}
