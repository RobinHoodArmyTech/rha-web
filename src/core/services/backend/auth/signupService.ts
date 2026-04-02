import { db } from "@/core/db";
import type { JoinUsValues } from "@/core/validators/joinUsValidation";

export interface SignupRow extends JoinUsValues {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function createSignup(data: JoinUsValues): Promise<SignupRow> {
  const [row] = await db("signups").insert(data).returning("*");
  return row;
}
