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
