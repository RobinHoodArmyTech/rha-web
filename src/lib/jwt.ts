import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const EXPIRY_DAYS = process.env.JWT_EXPIRY_DAYS || "7";

const JwtPayloadSchema = z.object({
  userId: z.number().int().positive(),
  roleId: z.number().int().positive(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRY_DAYS}d`)
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, SECRET, {
    algorithms: ["HS256"],
  });
  return JwtPayloadSchema.parse(payload);
}
