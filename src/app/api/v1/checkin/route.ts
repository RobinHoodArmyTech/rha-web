import { NextRequest, NextResponse } from "next/server";

/**
 * GET  /api/v1/checkin  — list recent check-ins (stub)
 * POST /api/v1/checkin  — submit a new check-in (stub)
 */
export async function GET() {
  // TODO: fetch paginated check-ins from DB
  return NextResponse.json({ success: true, data: [] });
}

export async function POST(request: NextRequest) {
  // TODO: parse multipart form-data, upload photo to storage, save record
  const _body = await request.text();
  return NextResponse.json(
    { success: false, message: "Check-in submission not yet implemented" },
    { status: 501 }
  );
}
