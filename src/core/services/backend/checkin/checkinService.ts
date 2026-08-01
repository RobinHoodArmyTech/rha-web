import { db } from "@/core/db";

// The API contract shape (what the client receives). Standalone by design.
export interface CheckinWithCity {
  id: number;
  cityId: number;
  cityName: string;
  peopleServed: number;
  studentsTaught: number;
  photoUrl: string;
  /** ISO timestamp — serialized from the DB `createdAt`. */
  createdAt: string;
}

export interface CheckinTotals {
  /**
   * Distinct Robins who checked in over the last `days`. Legacy anonymous
   * check-ins (null robinId, pre-login) are not counted.
   */
  robins: number;
}

export interface CityCheckinCount {
  cityId: number;
  cityName: string;
  checkins: number;
}

export interface CreateCheckinInput {
  cityId: number;
  peopleServed: number;
  studentsTaught: number;
  photoUrl: string;
  /** The signed-in Robin this check-in is attributed to. */
  robinId: number;
}

const SELECT_FIELDS = [
  "checkins.id as id",
  "checkins.cityId as cityId",
  "cities.cityName as cityName",
  "checkins.peopleServed as peopleServed",
  "checkins.studentsTaught as studentsTaught",
  "checkins.photoUrl as photoUrl",
  "checkins.createdAt as createdAt",
] as const;

export async function createCheckin(input: CreateCheckinInput): Promise<CheckinWithCity> {
  const [id] = await db("checkins").insert({
    cityId: input.cityId,
    peopleServed: input.peopleServed,
    studentsTaught: input.studentsTaught,
    photoUrl: input.photoUrl,
    robinId: input.robinId,
  });
  return (await getCheckinById(id))!;
}

export async function getCheckinById(id: number): Promise<CheckinWithCity | undefined> {
  return db("checkins")
    .join("cities", "checkins.cityId", "cities.id")
    .select(...SELECT_FIELDS)
    .where("checkins.id", id)
    .first();
}

/** Most recent check-ins (newest first) — powers the public feed. */
export async function listRecentCheckins(limit = 12): Promise<CheckinWithCity[]> {
  return db("checkins")
    .join("cities", "checkins.cityId", "cities.id")
    .select(...SELECT_FIELDS)
    .orderBy("checkins.createdAt", "desc")
    .limit(limit);
}

/**
 * Every city with its check-in count over the last `days` (default 60), highest
 * first — powers the highlights chart (top N) + the "look up any city" widget.
 * Cities with no check-ins in the window are included with a count of 0.
 */
export async function getCheckinCountsByCity(days = 60): Promise<CityCheckinCount[]> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  // LEFT JOIN from cities so every city appears. The date filter lives in the
  // JOIN condition (not WHERE) — otherwise it would drop the 0-count cities.
  const rows = await db("cities")
    .leftJoin("checkins", (join) => {
      join.on("checkins.cityId", "=", "cities.id").andOnVal("checkins.createdAt", ">=", since);
    })
    .select("cities.id as cityId", "cities.cityName as cityName")
    .count({ checkins: "checkins.id" })
    .groupBy("cities.id", "cities.cityName")
    .orderBy("checkins", "desc")
    .orderBy("cities.cityName", "asc");
  return (rows as Array<{ cityId: number; cityName: string; checkins: number | string }>).map(
    (r) => ({ cityId: Number(r.cityId), cityName: String(r.cityName), checkins: Number(r.checkins) }),
  );
}

export interface TopActiveRobin {
  id: number;
  name: string;
  /** Avatar URL — null when the Robin has no photo; the UI renders an initial fallback. */
  imageUrl: string | null;
  cityName: string;
  /** Check-in count within the window. */
  drives: number;
}

const TOP_ACTIVE_ROBIN_FIELDS = [
  "robins.id as id",
  "robins.fullName as name",
  "robins.avatarUrl as imageUrl",
  "cities.cityName as cityName",
] as const;

/**
 * Top active Robins ranked by check-ins over the last `days` window.
 * Pass `cityId` to scope to one city; omit for a global ranking.
 * Anonymous check-ins (null robinId) are excluded by the inner join.
 */
export async function getTopActiveRobins(opts: {
  cityId?: number;
  limit?: number;
  days?: number;
} = {}): Promise<TopActiveRobin[]> {
  const { cityId, limit = 5, days = 60 } = opts;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const query = db("checkins")
    .join("robins", "checkins.robinId", "robins.id")
    .join("cities", "checkins.cityId", "cities.id")
    .where("checkins.createdAt", ">=", since)
    .select(...TOP_ACTIVE_ROBIN_FIELDS)
    .count({ drives: "checkins.id" })
    .groupBy("robins.id", "robins.fullName", "robins.avatarUrl", "cities.cityName")
    .orderBy("drives", "desc")
    .orderBy("robins.fullName", "asc")
    .limit(limit);

  if (cityId !== undefined) {
    query.where("checkins.cityId", cityId);
  }

  const rows = await query;

  return (
    rows as Array<{ id: number; name: string; imageUrl: string | null; cityName: string; drives: number | string }>
  ).map((r) => ({
    id: Number(r.id),
    name: r.name.trim(),
    imageUrl: typeof r.imageUrl === "string" && r.imageUrl.trim() ? r.imageUrl.trim() : null,
    cityName: r.cityName,
    drives: Number(r.drives),
  }));
}

/** Rolling counters for the last `days` (default 7, includes today) — home page. */
export async function getCheckinTotals(days = 7): Promise<CheckinTotals> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  // COUNT(DISTINCT robinId) — ignores null (legacy anonymous) check-ins.
  const row = await db("checkins")
    .where("createdAt", ">=", since)
    .countDistinct({ robins: "robinId" })
    .first();
  return { robins: Number((row as { robins?: number | string } | undefined)?.robins ?? 0) };
}
