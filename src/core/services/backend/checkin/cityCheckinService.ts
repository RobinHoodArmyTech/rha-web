/**
 * City check-in page data — powers /sites/checkin/{cityName}.
 *
 * DUMMY DATA (temporary): this reads from `cityCheckinData.json` so the page can
 * be built and demoed before the backend endpoints exist. The exported types are
 * the real API contract — when the DB-backed version lands, keep the return
 * shapes identical and only swap the body of `getCityCheckinPage` for real
 * queries (recent check-ins, distinct-robin counts, badge holders per city).
 */
import rawData from "./cityCheckinData.json";

// ---------------------------------------------------------------------------
// API contract (stable) — what the client receives
// ---------------------------------------------------------------------------

/** Achievement badge a Robin can hold. `most_active` is a leaderboard title, the rest are drive milestones. */
export type RobinBadge = "cadet" | "ninja" | "gladiator" | "centurion" | "most_active";

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

// ---------------------------------------------------------------------------
// Dummy data shapes (JSON on disk)
// ---------------------------------------------------------------------------

interface RawCity {
  cityId: number;
  cityName: string;
  countryName: string;
  uniqueRobins: number;
  totalCheckins: number;
  recentCheckins: { id: number; robinName: string; photoSeed: string; hoursAgo: number }[];
  activeRobins: { id: number; name: string; avatarSeed: string; badge: string; title: string; drives: number }[];
}

interface RawData {
  windowDays: number;
  cities: Record<string, RawCity>;
  default: RawCity;
}

const data = rawData as RawData;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** URL/lookup slug: lowercase, spaces & separators collapsed to single hyphens. */
export function toCitySlug(cityName: string): string {
  return decodeURIComponent(cityName)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "new delhi" -> "New Delhi" — presentable fallback name for unknown cities. */
function titleCase(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const VALID_BADGES: RobinBadge[] = ["cadet", "ninja", "gladiator", "centurion", "most_active"];
function toBadge(value: string): RobinBadge {
  return (VALID_BADGES as string[]).includes(value) ? (value as RobinBadge) : "cadet";
}

// Deterministic, dependency-free placeholder imagery (picsum is already allowed
// in next.config image domains). Swap for real photo/avatar URLs with the DB version.
const photoUrl = (seed: string) => `https://picsum.photos/seed/${seed}/1200/1200`;
const avatarUrl = (seed: string) => `https://picsum.photos/seed/${seed}/240/240`;

type RawRecent = { id: number; robinName: string; photoSeed: string; hoursAgo: number };

function mapRecent(list: RawRecent[], now: number): CityRecentCheckin[] {
  return list.map((c) => ({
    id: c.id,
    robinName: c.robinName,
    photoUrl: photoUrl(c.photoSeed),
    createdAt: new Date(now - c.hoursAgo * 60 * 60 * 1000).toISOString(),
  }));
}

function shape(raw: RawCity): CityCheckinPage {
  const now = Date.now();
  return {
    cityId: raw.cityId,
    cityName: raw.cityName,
    countryName: raw.countryName,
    uniqueRobins: raw.uniqueRobins,
    totalCheckins: raw.totalCheckins,
    windowDays: data.windowDays,
    recentCheckins: mapRecent(raw.recentCheckins, now),
    activeRobins: raw.activeRobins.map((r) => ({
      id: r.id,
      name: r.name.trim(),
      imageUrl: avatarUrl(r.avatarSeed),
      badge: toBadge(r.badge),
      title: r.title,
      drives: r.drives,
    })),
  };
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

/**
 * Resolve the check-in page payload for a city. Known cities come from the dummy
 * dataset; any other name falls back to a template so every city link resolves
 * to a populated page while the real data source is being wired up.
 */
export function getCityCheckinPage(cityName: string): CityCheckinPage {
  const slug = toCitySlug(cityName);
  const known = data.cities[slug];
  if (known) return shape(known);
  return { ...shape(data.default), cityId: 0, cityName: titleCase(slug) || "City" };
}

/** Canonical display name for a city segment (known city's name, else title-cased). */
export function resolveCityName(cityName: string): string {
  const slug = toCitySlug(cityName);
  return data.cities[slug]?.cityName ?? titleCase(slug) ?? "City";
}

// ---------------------------------------------------------------------------
// Paginated check-in feed — powers /sites/checkin/{city}/checkins (infinite scroll)
// ---------------------------------------------------------------------------

/** One page of the city check-in feed. `nextCursor` is null when the list is exhausted. */
export interface CityCheckinFeedPage {
  items: CityRecentCheckin[];
  /** Opaque cursor for the next page (pass back as `?cursor=`); null = no more. */
  nextCursor: string | null;
  /** Total available in the window (for a header count / progress hint). */
  total: number;
}

export const CHECKIN_FEED_DEFAULT_LIMIT = 24;
export const CHECKIN_FEED_MAX_LIMIT = 48;

// Dummy-only: a name pool used to synthesize a realistic backlog beyond the 12
// featured check-ins, so infinite scroll spans several pages during the demo.
const FEED_NAME_POOL = [
  "Yashashvi S.", "Deepak A.", "Amit K.", "Aadit G.", "Ishaan S.", "Aditi A.",
  "Anisha K.", "Ayush C.", "Samardeep", "Arnav B.", "Shailesh J.", "Divesh J.",
  "Preeti K.", "Vinit K.", "Jasroop S.", "Pomi S.", "Connor H.", "Anuj K.",
  "Naina", "Shruti M.", "Shivani", "Aditya S.", "Deepali M.", "Aman B.",
  "Samarth A.", "Aman R.", "Kamal H.", "Pooja M.", "Nidhi", "Dipti R.",
  "Devender M.", "Akash G.", "Ramandeep K.", "Deepankar S.", "Rohit K.", "Abhishek D.",
  "Daksh S.", "PALAK P.", "Prateeksha S.", "Sayan B.", "Tanisha K.", "Khushi T.",
  "Keshav G.", "Sonu K.", "Prem S.", "Bhumika P.", "Gaurav G.", "Ashish",
];

/**
 * The full (dummy) check-in list for a city, newest first: the featured 12 up
 * front, then a synthesized backlog. Deterministic per city so paging is stable.
 */
function buildFeed(raw: RawCity, slug: string, now: number): CityRecentCheckin[] {
  const featured = mapRecent(raw.recentCheckins, now);
  const lastHours = raw.recentCheckins.at(-1)?.hoursAgo ?? 18;
  const backlog = mapRecent(
    FEED_NAME_POOL.map((robinName, i) => ({
      id: 100000 + raw.cityId * 1000 + i, // stable, collision-free per city
      robinName,
      photoSeed: `${slug}-feed-${i}`,
      hoursAgo: lastHours + 2 + i * 2,
    })),
    now,
  );
  return [...featured, ...backlog];
}

/** Decode `?cursor=` (opaque offset today) into a non-negative integer offset. */
function decodeCursor(cursor: string | null | undefined): number {
  if (!cursor) return 0;
  const n = Number(cursor);
  return Number.isInteger(n) && n >= 0 ? n : 0;
}

/**
 * One page of a city's check-in feed. Cursor-based by contract: the client only
 * echoes back `nextCursor` and never constructs offsets itself, so the DB version
 * can switch to keyset pagination (createdAt,id) without any client change.
 */
export function getCityCheckinFeed(
  cityName: string,
  opts: { cursor?: string | null; limit?: number } = {},
): CityCheckinFeedPage {
  const slug = toCitySlug(cityName);
  const raw = data.cities[slug] ?? data.default;
  const now = Date.now();

  const all = buildFeed(raw, slug, now);
  const limit = Math.min(Math.max(1, opts.limit ?? CHECKIN_FEED_DEFAULT_LIMIT), CHECKIN_FEED_MAX_LIMIT);
  const offset = decodeCursor(opts.cursor);

  const items = all.slice(offset, offset + limit);
  const nextOffset = offset + items.length;
  const nextCursor = nextOffset < all.length ? String(nextOffset) : null;

  return { items, nextCursor, total: all.length };
}

// ---------------------------------------------------------------------------
// Top active Robins — powers /sites/checkin/{city}/top-robins (leaderboard)
// ---------------------------------------------------------------------------

export interface CityTopRobin {
  rank: number;
  id: number;
  name: string;
  cityName: string;
  /** Null when the Robin has no photo — the UI renders an initial fallback. */
  imageUrl: string | null;
  /** Drives checked in within the window; the leaderboard is sorted by this. */
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

export const TOP_ROBINS_DEFAULT_LIMIT = 100;

/**
 * Milestone badge a Robin has earned from their drive count. Thresholds match
 * the hero badges on /sites/checkin (cadet 1 → ninja 10 → gladiator 50 → centurion 100).
 */
export function badgeForDrives(drives: number): RobinBadge {
  if (drives >= 100) return "centurion";
  if (drives >= 50) return "gladiator";
  if (drives >= 10) return "ninja";
  return "cadet";
}

// Dummy-only name pool; repeats down the list are realistic for a leaderboard.
const TOP_ROBIN_NAMES = [
  "Amit", "Kunal", "Shubh", "Kavya", "Aashi", "Riya", "Anika", "Mannat", "Anil", "Urvi",
  "Sanskriti", "Avni", "Preeti", "Deepak", "Aman", "Naina", "Shailesh", "Divya", "Kiran", "Shagun",
  "Manas", "Ayush", "Jatin", "Rupesh", "Arsh", "Pranshi", "Vatsal", "Tejal", "Arvin", "Manish",
  "Shreyan", "Sneha", "Aarav", "Viraj", "Adi", "Anshul", "Anuj", "Arnav", "Kamal", "Sparsh",
  "Shubham", "Neil", "Ananya", "Dipti", "Suhaani", "Gaurav", "Keshav", "Rajni", "Rahul", "Shyam",
  "Siya", "Chirag", "Sunita", "Aditya", "Akash", "Bhumika", "Prem", "Deepali", "Connor", "Kavita",
  "Parvathi", "Prachi", "Saketh", "Sanjana", "Akshita", "Ankita", "Abid", "Syed", "Mehr", "Divi",
  "Dilpreet", "Sahej", "Mehul", "Nikhil", "Ritesh", "Sushmita", "Vineet", "Vinit", "Abu", "Aadit",
  "Aditi", "Anubhav", "Ranni", "Jass", "Ishaan", "Naman",
];

/**
 * Top Robins for a city, ranked by drives (desc) over the window. Deterministic
 * so ranks are stable. Some Robins have no photo (imageUrl null) to exercise the
 * initial-fallback avatar the real data will need.
 */
export function getCityTopRobins(
  cityName: string,
  limit: number = TOP_ROBINS_DEFAULT_LIMIT,
): CityTopRobinsResult {
  const slug = toCitySlug(cityName);
  const raw = data.cities[slug] ?? data.default;
  const displayName = data.cities[slug]?.cityName || titleCase(slug) || "City";
  const n = Math.min(Math.max(1, limit), 100);

  const robins: CityTopRobin[] = Array.from({ length: n }, (_, i) => {
    // Smooth descending curve with natural ties toward the tail; floor at 5.
    const drives = Math.max(5, Math.round(54 * Math.pow(0.966, i)));
    const hasPhoto = i % 10 < 7; // ~70% have a photo
    return {
      rank: i + 1,
      id: 200000 + raw.cityId * 1000 + i,
      name: TOP_ROBIN_NAMES[i % TOP_ROBIN_NAMES.length],
      cityName: displayName,
      imageUrl: hasPhoto ? avatarUrl(`${slug}-robin-${i}`) : null,
      drives,
      badge: badgeForDrives(drives),
    };
  });

  return { cityName: displayName, windowDays: data.windowDays, total: robins.length, robins };
}
