/**
 * City check-in page data — powers /sites/checkin/{cityName}.
 *
 * A Robin's "drives" is their check-in count: every check-in records attending
 * a drive, so counting check-ins per Robin is the drive tally leaderboards rank
 * by. Stats use a rolling CHECKIN_WINDOW_DAYS window and ignore anonymous
 * (null robinId) check-ins where a Robin identity is required.
 */
import { db } from "@/core/db";
import { listCities } from "@/core/services/backend/city/cityService";
import { getTopActiveRobins } from "@/core/services/backend/checkin/checkinService";
import { type RobinBadge, badgeForDrives } from "@/lib/checkinBadges";

// ---------------------------------------------------------------------------
// API contract (stable) — what the client receives
// ---------------------------------------------------------------------------

export type { RobinBadge } from "@/lib/checkinBadges";

export interface CityRecentCheckin {
  id: number;
  robinName: string;
  photoUrl: string;
  /** ISO timestamp — the UI renders this as a relative "x hours ago". */
  createdAt: string;
}

export interface CityActiveRobin {
  id: number;
  name: string;
  imageUrl: string;
  badge: RobinBadge;
  /** Human label shown under the name, e.g. "Latest Ninja", "Most Active". */
  title: string;
  drives: number;
}

export interface CityCheckinPage {
  cityId: number;
  cityName: string;
  countryName: string;
  /** Distinct Robins who checked in within `windowDays`. */
  uniqueRobins: number;
  /** Total check-ins within `windowDays`. */
  totalCheckins: number;
  windowDays: number;
  recentCheckins: CityRecentCheckin[];
  activeRobins: CityActiveRobin[];
}

/** One page of the city check-in feed. `nextCursor` is null when the list is exhausted. */
export interface CityCheckinFeedPage {
  items: CityRecentCheckin[];
  /** Opaque cursor for the next page (pass back as `?cursor=`); null = no more. */
  nextCursor: string | null;
  /** Total check-ins in the city (for a header count / progress hint). */
  total: number;
}

export interface CityTopRobin {
  rank: number;
  id: number;
  name: string;
  cityName: string;
  /** Null when the Robin has no photo — the UI renders an initial fallback. */
  imageUrl: string | null;
  /** Drives (check-ins) within the window; the leaderboard is sorted by this. */
  drives: number;
  /** Milestone badge implied by the drive count. */
  badge: RobinBadge;
}

export interface CityTopRobinsResult {
  cityName: string;
  windowDays: number;
  /** How many Robins the leaderboard covers. */
  total: number;
  robins: CityTopRobin[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Rolling window (days) the city stats and leaderboards are computed over. */
export const CHECKIN_WINDOW_DAYS = 60;

export const CHECKIN_FEED_DEFAULT_LIMIT = 24;
export const CHECKIN_FEED_MAX_LIMIT = 48;
export const TOP_ROBINS_DEFAULT_LIMIT = 100;

/** How many recent check-ins the city overview features. */
const CITY_RECENT_LIMIT = 12;
/** How many featured "active Robin" cards the city overview shows. */
const CITY_ACTIVE_ROBINS_LIMIT = 6;

// ---------------------------------------------------------------------------
// Field lists
// ---------------------------------------------------------------------------

const RECENT_CHECKIN_FIELDS = [
  "checkins.id as id",
  "robins.fullName as robinName",
  "checkins.photoUrl as photoUrl",
  "checkins.createdAt as createdAt",
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** URL/lookup slug: lowercase, spaces & separators collapsed to single hyphens. */
export function toCitySlug(cityName: string): string {
  return cityName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Coerce a DB numeric/string result to a JS number. */
const num = (v: unknown): number => Number((v as number | string | null) ?? 0);

/** Null-safe photo URL — empty string becomes null. */
const photoOrNull = (url: unknown): string | null => {
  const s = typeof url === "string" ? url.trim() : "";
  return s || null;
};

function windowStart(): Date {
  return new Date(Date.now() - CHECKIN_WINDOW_DAYS * 24 * 60 * 60 * 1000);
}

/**
 * Map a URL slug to a city row. Slugifies stored cityNames in JS — the cities
 * table is a small reference set so a full load is negligible here.
 */
async function findCityBySlug(slug: string) {
  const cities = await listCities();
  return cities.find((c) => toCitySlug(c.cityName) === slug);
}

function mapRecentRow(r: {
  id: number;
  robinName: string | null;
  photoUrl: string;
  createdAt: Date | string;
}): CityRecentCheckin {
  return {
    id: Number(r.id),
    robinName: r.robinName?.trim() || "A Robin",
    photoUrl: r.photoUrl,
    createdAt: new Date(r.createdAt).toISOString(),
  };
}

function activeRobinTitle(index: number, badge: RobinBadge): string {
  if (index === 0) return "Most Active";
  const labels: Record<RobinBadge, string> = {
    centurion: "Centurion",
    gladiator: "Gladiator",
    ninja: "Ninja",
    cadet: "Cadet",
    most_active: "Most Active",
  };
  return labels[badge];
}

// ---------------------------------------------------------------------------
// Cursor helpers (keyset over createdAt desc, id desc)
// ---------------------------------------------------------------------------

function encodeCursor(createdAt: Date | string, id: number): string {
  return Buffer.from(`${new Date(createdAt).getTime()}.${id}`).toString("base64url");
}

function decodeCursor(cursor: string | null | undefined): { createdAt: Date; id: number } | null {
  if (!cursor) return null;
  try {
    const [msStr, idStr] = Buffer.from(cursor, "base64url").toString("utf8").split(".");
    const ms = Number(msStr);
    const id = Number(idStr);
    if (!Number.isFinite(ms) || !Number.isInteger(id) || id < 0) return null;
    return { createdAt: new Date(ms), id };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

/**
 * Check-in overview for a city: headline counters (within CHECKIN_WINDOW_DAYS),
 * the latest check-ins, and the most active Robins (with a photo) as feature
 * cards. Unknown cities resolve to an empty, presentable shell.
 */
export async function getCityCheckinPage(cityName: string): Promise<CityCheckinPage> {
  const slug = toCitySlug(cityName);
  const city = await findCityBySlug(slug);

  if (!city) {
    return {
      cityId: 0,
      cityName: titleCase(slug) || "City",
      countryName: "",
      uniqueRobins: 0,
      totalCheckins: 0,
      windowDays: CHECKIN_WINDOW_DAYS,
      recentCheckins: [],
      activeRobins: [],
    };
  }

  const since = windowStart();

  const [counts, recentRows, topRobins] = await Promise.all([
    db("checkins")
      .where("cityId", city.id)
      .andWhere("createdAt", ">=", since)
      .countDistinct({ uniqueRobins: "robinId" })
      .count({ totalCheckins: "id" })
      .first(),

    db("checkins")
      .leftJoin("robins", "checkins.robinId", "robins.id")
      .where("checkins.cityId", city.id)
      .select(...RECENT_CHECKIN_FIELDS)
      .orderBy("checkins.createdAt", "desc")
      .orderBy("checkins.id", "desc")
      .limit(CITY_RECENT_LIMIT),

    getTopActiveRobins({ cityId: city.id, limit: CITY_ACTIVE_ROBINS_LIMIT, days: CHECKIN_WINDOW_DAYS }),
  ]);

  const activeRobins: CityActiveRobin[] = topRobins.map((r, i) => {
    const badge = badgeForDrives(r.drives);
    return {
      id: r.id,
      name: r.name,
      imageUrl: r.imageUrl ?? "",
      badge,
      title: activeRobinTitle(i, badge),
      drives: r.drives,
    };
  });

  return {
    cityId: city.id,
    cityName: city.cityName,
    countryName: city.countryName,
    uniqueRobins: num((counts as { uniqueRobins?: number | string } | undefined)?.uniqueRobins),
    totalCheckins: num((counts as { totalCheckins?: number | string } | undefined)?.totalCheckins),
    windowDays: CHECKIN_WINDOW_DAYS,
    recentCheckins: (
      recentRows as Array<{
        id: number;
        robinName: string | null;
        photoUrl: string;
        createdAt: Date | string;
      }>
    ).map(mapRecentRow),
    activeRobins,
  };
}

/** Canonical display name for a city slug — used for page metadata. */
export async function resolveCityName(cityName: string): Promise<string> {
  const slug = toCitySlug(cityName);
  const city = await findCityBySlug(slug);
  return city?.cityName || titleCase(slug) || "City";
}

/**
 * One page of a city's check-in feed (newest first). The client echoes back
 * `nextCursor` opaquely, so the keyset (createdAt, id) stays an implementation
 * detail and can change without any client update.
 */
export async function getCityCheckinFeed(
  cityName: string,
  opts: { cursor?: string | null; limit?: number } = {},
): Promise<CityCheckinFeedPage> {
  const city = await findCityBySlug(toCitySlug(cityName));
  if (!city) return { items: [], nextCursor: null, total: 0 };

  const limit = Math.min(
    Math.max(1, opts.limit ?? CHECKIN_FEED_DEFAULT_LIMIT),
    CHECKIN_FEED_MAX_LIMIT,
  );
  const after = decodeCursor(opts.cursor);

  const feedQuery = db("checkins")
    .leftJoin("robins", "checkins.robinId", "robins.id")
    .where("checkins.cityId", city.id)
    .select(...RECENT_CHECKIN_FIELDS)
    .orderBy("checkins.createdAt", "desc")
    .orderBy("checkins.id", "desc")
    .limit(limit + 1); // fetch one extra to detect whether more pages exist

  if (after) {
    feedQuery.where(function () {
      this.where("checkins.createdAt", "<", after.createdAt).orWhere(function () {
        this.where("checkins.createdAt", "=", after.createdAt).andWhere(
          "checkins.id",
          "<",
          after.id,
        );
      });
    });
  }

  const [rows, totalRow] = await Promise.all([
    feedQuery,
    db("checkins").where("cityId", city.id).count({ total: "id" }).first(),
  ]);

  const hasMore = rows.length > limit;
  const page = rows.slice(0, limit) as Array<{
    id: number;
    robinName: string | null;
    photoUrl: string;
    createdAt: Date | string;
  }>;
  const last = page.at(-1);
  const nextCursor = hasMore && last ? encodeCursor(last.createdAt, Number(last.id)) : null;

  return {
    items: page.map(mapRecentRow),
    nextCursor,
    total: num((totalRow as { total?: number | string } | undefined)?.total),
  };
}

/**
 * Top Robins for a city ranked by drives (check-ins) within CHECKIN_WINDOW_DAYS.
 * Anonymous check-ins (null robinId) are excluded by the inner join.
 */
export async function getCityTopRobins(
  cityName: string,
  limit: number = TOP_ROBINS_DEFAULT_LIMIT,
): Promise<CityTopRobinsResult> {
  const slug = toCitySlug(cityName);
  const city = await findCityBySlug(slug);
  const displayName = city?.cityName || titleCase(slug) || "City";

  if (!city) {
    return { cityName: displayName, windowDays: CHECKIN_WINDOW_DAYS, total: 0, robins: [] };
  }

  const n = Math.min(Math.max(1, limit), TOP_ROBINS_DEFAULT_LIMIT);

  const rows = await db("checkins")
    .join("robins", "checkins.robinId", "robins.id")
    .where("checkins.cityId", city.id)
    .andWhere("checkins.createdAt", ">=", windowStart())
    .select("robins.id as id", "robins.fullName as name", "robins.avatarUrl as imageUrl")
    .count({ drives: "checkins.id" })
    .groupBy("robins.id", "robins.fullName", "robins.avatarUrl")
    .orderBy("drives", "desc")
    .orderBy("robins.fullName", "asc")
    .limit(n);

  const robins: CityTopRobin[] = (
    rows as Array<{ id: number; name: string; imageUrl: string | null; drives: number | string }>
  ).map((r, i) => {
    const drives = num(r.drives);
    return {
      rank: i + 1,
      id: Number(r.id),
      name: r.name.trim(),
      cityName: displayName,
      imageUrl: photoOrNull(r.imageUrl),
      drives,
      badge: badgeForDrives(drives),
    };
  });

  return { cityName: displayName, windowDays: CHECKIN_WINDOW_DAYS, total: robins.length, robins };
}

export { badgeForDrives } from "@/lib/checkinBadges";
