import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { createPresignedPost, type PresignedPost } from "@aws-sdk/s3-presigned-post";
import { ApiError } from "@/core/apiResponse";

/**
 * Generic file storage — shared by every upload domain (check-in selfies today,
 * other file types later). Domain wrappers call uploadFile() with their prefix.
 *
 * Driver follows NODE_ENV: `development` writes to the local filesystem under
 * public/ (served directly by Next.js); every other environment uploads to S3.
 * The object key is identical across drivers, so a file lives at the same
 * relative path locally (public/<key>) and in S3 (bucket/<key>).
 */

// ===========================================================================
// Shared — keys, content types, options (driver-agnostic)
// ===========================================================================

export interface UploadOptions {
  /** Logical folder / key prefix, e.g. "checkins" (a bucket policy can scope to it). */
  prefix: string;
  contentType: string;
  /** Extension override; otherwise derived from contentType. */
  ext?: string;
  /** Filename without extension; defaults to a random, unguessable uuid. */
  fileName?: string;
}

// Normalizes common content types to friendly extensions; anything else falls
// back to the MIME subtype (e.g. application/pdf -> pdf).
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

function extFor(contentType: string, override?: string): string {
  if (override) return override.replace(/^\./, "");
  const ct = contentType.toLowerCase();
  if (EXT_BY_TYPE[ct]) return EXT_BY_TYPE[ct];
  const sub = ct.split("/")[1]?.split(";")[0]?.replace(/[^a-z0-9]/g, "");
  return sub || "bin";
}

/** `<prefix>/<name>.<ext>` — the key both drivers store at, verbatim. */
function buildObjectKey(opts: UploadOptions): string {
  const prefix = opts.prefix.replace(/^\/+|\/+$/g, "");
  const name = opts.fileName ?? randomUUID();
  return `${prefix}/${name}.${extFor(opts.contentType, opts.ext)}`;
}

/**
 * True when uploads use the local filesystem (dev) instead of S3. In this mode
 * there is no presigning — the client uploads through our API (proxied).
 */
export function isLocalStorage(): boolean {
  return process.env.NODE_ENV === "development";
}

// ===========================================================================
// S3 driver (production) — includes presigned direct uploads
// ===========================================================================

const S3_REGION = process.env.S3_REGION ?? "ap-south-1";
let s3Client: S3Client | null = null;

function s3(): S3Client {
  if (!s3Client) {
    // S3 operations use ONLY these dedicated credentials — no fallback to the
    // default AWS chain / SES creds.
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
    if (!accessKeyId || !secretAccessKey) {
      throw new ApiError(
        500,
        "S3 storage is not configured (missing S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY).",
      );
    }
    s3Client = new S3Client({ region: S3_REGION, credentials: { accessKeyId, secretAccessKey } });
  }
  return s3Client;
}

function requireBucket(): string {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) throw new ApiError(500, "S3 storage is not configured (missing S3_BUCKET).");
  return bucket;
}

/** Public URL for an S3 object key (respects an optional CDN base URL). */
export function publicUrlForKey(key: string): string {
  const base =
    process.env.S3_PUBLIC_BASE_URL ?? `https://${requireBucket()}.s3.${S3_REGION}.amazonaws.com`;
  return `${base.replace(/\/+$/, "")}/${key}`;
}

async function uploadToS3(key: string, bytes: Buffer, contentType: string): Promise<string> {
  await s3().send(
    new PutObjectCommand({ Bucket: requireBucket(), Key: key, Body: bytes, ContentType: contentType }),
  );
  return publicUrlForKey(key);
}

/** True if an object exists in the bucket — used to confirm a direct upload landed. */
export async function objectExists(key: string): Promise<boolean> {
  try {
    await s3().send(new HeadObjectCommand({ Bucket: requireBucket(), Key: key }));
    return true;
  } catch {
    return false;
  }
}

export interface PresignedUpload {
  /** Form action URL to POST the file to (the S3 bucket endpoint). */
  url: string;
  /** Policy fields to include in the multipart POST, before the `file` field. */
  fields: Record<string, string>;
  /** The object key the file will land at. */
  key: string;
  /** Public URL to persist once the upload succeeds. */
  publicUrl: string;
}

/**
 * Creates a browser-uploadable presigned POST (S3 only). The policy enforces the
 * exact key, an allowed content-type, and a max byte size — so S3 itself rejects
 * oversized or wrong-type uploads without the bytes ever touching our server.
 */
export async function createPresignedUpload(opts: {
  prefix: string;
  contentType: string;
  ext?: string;
  maxBytes: number;
}): Promise<PresignedUpload> {
  const key = buildObjectKey(opts);
  const presigned: PresignedPost = await createPresignedPost(s3(), {
    Bucket: requireBucket(),
    Key: key,
    Conditions: [
      ["content-length-range", 1, opts.maxBytes],
      ["eq", "$Content-Type", opts.contentType],
    ],
    Fields: { "Content-Type": opts.contentType },
    Expires: 120,
  });
  return { url: presigned.url, fields: presigned.fields, key, publicUrl: publicUrlForKey(key) };
}

// ===========================================================================
// Local filesystem driver (development)
// ===========================================================================

async function uploadToLocal(key: string, bytes: Buffer): Promise<string> {
  // Served by Next.js from /public — the key IS the web path (public/<key>).
  const absPath = path.join(process.cwd(), "public", key);
  await mkdir(path.dirname(absPath), { recursive: true });
  await writeFile(absPath, bytes);
  return `/${key}`;
}

// ===========================================================================
// Public API — dispatches to the active driver
// ===========================================================================

/**
 * Server-side upload: persists a file at `<prefix>/<name>.<ext>` and returns its
 * web-accessible URL/path. Used by the local (dev) driver and any server-owned
 * writes. Same key on both drivers.
 */
export async function uploadFile(bytes: Buffer, opts: UploadOptions): Promise<string> {
  const key = buildObjectKey(opts);
  return isLocalStorage() ? uploadToLocal(key, bytes) : uploadToS3(key, bytes, opts.contentType);
}
