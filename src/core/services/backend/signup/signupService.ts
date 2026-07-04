import type { Knex } from "knex";
import { db } from "@/core/db";

// ---------------------------------------------------------------------------
// Types — the API contract shape (what the client receives). Standalone by
// design; not composed from the insert/Zod types.
// ---------------------------------------------------------------------------

export interface SignupWithCity {
  id: number;
  fullName: string;
  email: string;
  mobileNumber: string;
  age: number | null;
  cityId: number;
  cityName: string;
  /** ISO timestamp — serialized from the DB `createdAt` over the wire. */
  createdAt: string;
}

export interface SignupStats {
  total: number;
  /** Distinct cities with signups in the current filters (caller's visibility). */
  cityCount: number;
}

/** One row of the by-city grouping table (paginated client-side — the list is small). */
export interface SignupCityGroup {
  cityId: number;
  cityName: string;
  countryName: string;
  count: number;
}

/** Shared filter inputs. `cityId` scopes to a single city (non-admin callers). */
export interface SignupFilters {
  cityId?: number | null;
  from?: string;
  to?: string;
  q?: string;
}

export interface SignupListParams extends SignupFilters {
  page: number;
  limit: number;
}

export interface SignupListResult {
  rows: SignupWithCity[];
  total: number;
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

/** Applies the visibility + date-range + search filters to any signups query. */
function applyFilters<T extends Knex.QueryBuilder>(query: T, { cityId, from, to, q }: SignupFilters): T {
  if (cityId != null) query.where("signups.cityId", cityId);
  if (from) query.where("signups.createdAt", ">=", `${from} 00:00:00`);
  if (to) query.where("signups.createdAt", "<=", `${to} 23:59:59`);
  if (q) {
    query.where((builder) => {
      builder
        .where("signups.fullName", "like", `%${q}%`)
        .orWhere("signups.email", "like", `%${q}%`)
        .orWhere("signups.mobileNumber", "like", `%${q}%`);
    });
  }
  return query;
}

// ---------------------------------------------------------------------------
// Service functions (read-only)
// ---------------------------------------------------------------------------

/** One page of signups (newest first) plus the total count for the same filters. */
export async function listSignups(params: SignupListParams): Promise<SignupListResult> {
  const { page, limit } = params;

  const rows = (await applyFilters(
    db("signups").join("cities", "signups.cityId", "cities.id"),
    params,
  )
    .select(
      "signups.id as id",
      "signups.fullName as fullName",
      "signups.email as email",
      "signups.mobileNumber as mobileNumber",
      "signups.age as age",
      "signups.cityId as cityId",
      "cities.cityName as cityName",
      "signups.createdAt as createdAt",
    )
    .orderBy("signups.createdAt", "desc")
    .limit(limit)
    .offset((page - 1) * limit)) as SignupWithCity[];

  const countRow = await applyFilters(db("signups"), params).count({ total: "*" }).first();
  const total = Number((countRow as { total?: number | string } | undefined)?.total ?? 0);

  return { rows, total };
}

/** Aggregate stats for the given filters: overall total and distinct-city count. */
export async function getSignupStats(filters: SignupFilters): Promise<SignupStats> {
  const countRow = await applyFilters(db("signups"), filters).count({ total: "*" }).first();
  const total = Number((countRow as { total?: number | string } | undefined)?.total ?? 0);

  const cityRow = await applyFilters(db("signups"), filters)
    .countDistinct({ cities: "signups.cityId" })
    .first();
  const cityCount = Number((cityRow as { cities?: number | string } | undefined)?.cities ?? 0);

  return { total, cityCount };
}

/**
 * Signups grouped by city (highest first). Returns the full list — the caller
 * paginates it client-side, since the number of cities is small.
 */
export async function listSignupsByCity(filters: SignupFilters): Promise<SignupCityGroup[]> {
  const rows = (await applyFilters(
    db("signups")
      .join("cities", "signups.cityId", "cities.id")
      .join("countries", "cities.countryId", "countries.id"),
    filters,
  )
    .select(
      "signups.cityId as cityId",
      "cities.cityName as cityName",
      "countries.countryName as countryName",
    )
    .count({ count: "*" })
    .groupBy("signups.cityId", "cities.cityName", "countries.countryName")
    .orderBy("count", "desc")
    .orderBy("cities.cityName", "asc")) as Array<{
    cityId: number;
    cityName: string;
    countryName: string;
    count: number | string;
  }>;

  return rows.map((r) => ({
    cityId: Number(r.cityId),
    cityName: String(r.cityName),
    countryName: String(r.countryName),
    count: Number(r.count),
  }));
}
