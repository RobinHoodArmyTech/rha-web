import { db } from "@/core/db";
import type { JoinUsValues } from "@/core/validators/joinUsValidation";

export interface SignupRow extends JoinUsValues {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function createSignup(data: JoinUsValues): Promise<SignupRow> {
  const [id] = await db("signups").insert(data);
  const row = await db("signups").where({ id }).first();
  return row;
}
