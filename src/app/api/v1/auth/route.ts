import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/v1/auth/login  — stub
 * POST /api/v1/auth/register — stub
 * Replace with real DB + session logic.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { action } = body as { action?: string };

  if (action === "login") {
    // TODO: validate credentials against DB, issue session cookie
    return NextResponse.json({ success: false, message: "Auth not yet implemented" }, { status: 501 });
  }

  if (action === "register") {
    // TODO: create user in DB, issue session cookie
    return NextResponse.json({ success: false, message: "Registration not yet implemented" }, { status: 501 });
  }

  return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
}

export async function DELETE() {
  // TODO: invalidate session cookie
  const response = NextResponse.json({ success: true });
  response.cookies.delete("rha-auth-token");
  return response;
}
