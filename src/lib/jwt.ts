import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import { Role } from "@/core/config/constants";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const EXPIRY_DAYS = process.env.JWT_EXPIRY_DAYS || "7";

const JwtPayloadSchema = z.object({
  userId: z.number().int().positive(),
  roleId: z.number().int().positive(),
  roleName: z.enum(Role),
  email: z.email(),
  cityId: z.number().int().positive().nullable(),
  cityName: z.string().nullable(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    roleId: payload.roleId,
    roleName: payload.roleName,
    email: payload.email,
    cityId: payload.cityId,
    cityName: payload.cityName,
  })
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
