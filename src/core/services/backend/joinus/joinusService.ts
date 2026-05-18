import { db } from "@/core/db";
import type { JoinUsValues } from "@/core/validators/joinUsValidation";

export interface SignupRow extends JoinUsValues {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SignupFilters {
  cityId?: number | null;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export async function createSignup(data: JoinUsValues): Promise<SignupRow> {
  const [id] = await db("signups").insert(data);
  const row = await db("signups").where({ id }).first();
  return row;
}

export async function getSignups(filters: SignupFilters = {}) {
  const query = db("signups")
    .join("cities", "signups.cityId", "cities.id")
    .select("signups.*", "cities.cityName", "cities.cityEmail");

  if (filters.cityId) {
    query.where("signups.cityId", filters.cityId);
  }

  if (filters.from) {
    query.where("signups.createdAt", ">=", filters.from);
  }

  if (filters.to) {
    query.where("signups.createdAt", "<=", filters.to);
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const offset = (page - 1) * limit;

  return query.orderBy("signups.createdAt", "desc").limit(limit).offset(offset);
}
