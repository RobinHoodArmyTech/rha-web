/**
 * API response utilities — standardizes all API responses and errors.
 *
 * ApiResponse — helper to build consistent JSON responses.
 * ApiError    — throwable error caught by withApiHandler.
 *
 * Usage:
 *   return ApiResponse.success({ data });
 *   return ApiResponse.success({ data, message: "Created successfully" });
 *   return ApiResponse.success({ message: "Deleted" });
 *   return ApiResponse.success();
 *   throw new ApiError(404, "Not found");
 */
import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// ApiResponse
// ---------------------------------------------------------------------------

export const ApiResponse = {
  success<T>(options?: { data?: T; message?: string }) {
    const { data = null, message = "Success" } = options ?? {};
    return NextResponse.json({ success: true, data, message });
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
