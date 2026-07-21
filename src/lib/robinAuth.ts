import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import { cookies } from "next/headers";
import { ROBIN_AUTH_COOKIE } from "@/core/config/constants";

/**
 * Robin (volunteer) session — a self-contained JWT layer that mirrors the staff
 * one in `jwt.ts`/`session.ts` but is kept entirely separate: its own cookie
 * (ROBIN_AUTH_COOKIE) and its own payload shape. Reuses the same jose HS256
 * secret. Staff auth is untouched.
 */

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const EXPIRY_DAYS = process.env.JWT_EXPIRY_DAYS || "7";

const RobinJwtPayloadSchema = z.object({
  robinId: z.number().int().positive(),
  email: z.email(),
  fullName: z.string(),
  avatarUrl: z.string().nullable(),
});

export type RobinJwtPayload = z.infer<typeof RobinJwtPayloadSchema>;

export async function signRobinToken(payload: RobinJwtPayload): Promise<string> {
  return new SignJWT({
    robinId: payload.robinId,
    email: payload.email,
    fullName: payload.fullName,
    avatarUrl: payload.avatarUrl,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRY_DAYS}d`)
    .sign(SECRET);
}

export async function verifyRobinToken(token: string): Promise<RobinJwtPayload> {
  const { payload } = await jwtVerify(token, SECRET, { algorithms: ["HS256"] });
  return RobinJwtPayloadSchema.parse(payload);
}

/**
 * Reads and verifies the Robin cookie for use in server components. Returns the
 * decoded session, or null if missing / invalid / expired. Mirrors getSession().
 */
export async function getRobinSession(): Promise<RobinJwtPayload | null> {
  const token = (await cookies()).get(ROBIN_AUTH_COOKIE)?.value;
  if (!token) return null;

  try {
    return await verifyRobinToken(token);
  } catch {
    return null;
  }
}
