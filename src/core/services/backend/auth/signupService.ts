import { db } from "@/core/db";
import { SignupInput } from "@/core/validators/auth";

export interface SignupRow {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  created_at: Date;
  updated_at: Date;
}

export async function createSignup(data: SignupInput): Promise<SignupRow> {
  const [row] = await db("signups").insert(data).returning("*");
  return row;
}
