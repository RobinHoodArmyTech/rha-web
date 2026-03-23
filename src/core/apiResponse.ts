/**
 * API response utilities — standardizes all API responses and errors.
 *
 * ApiResponse — helper to build consistent JSON responses.
 * ApiError    — throwable error caught by withApiHandler.
 *
 * Usage:
 *   return ApiResponse.success(data);
 *   return ApiResponse.success(data, 201);
 *   throw new ApiError(404, "Not found");
 */
import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// ApiResponse
// ---------------------------------------------------------------------------

export const ApiResponse = {
  success<T>(data: T, status: number = 200) {
    return NextResponse.json({ success: true, data }, { status });
  },
};

// ---------------------------------------------------------------------------
// ApiError
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
