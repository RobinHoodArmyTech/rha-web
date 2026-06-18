import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/core/config/constants";
import { verifyToken, type JwtPayload } from "@/lib/jwt";

/**
 * Reads and verifies the auth cookie for use in server components.
 * Returns the decoded session (incl. roleName for RBAC), or null if the
 * cookie is missing / invalid / expired.
 */
export async function getSession(): Promise<JwtPayload | null> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return null;

  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}
