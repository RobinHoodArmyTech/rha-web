/** Achievement badge a Robin can hold. Safe to import in both client and server code. */
export type RobinBadge = "cadet" | "ninja" | "gladiator" | "centurion" | "most_active";

/**
 * Milestone badge derived from a Robin's drive count.
 * Thresholds: cadet → ninja (10) → gladiator (50) → centurion (100).
 */
export function badgeForDrives(drives: number): RobinBadge {
  if (drives >= 100) return "centurion";
  if (drives >= 50) return "gladiator";
  if (drives >= 10) return "ninja";
  return "cadet";
}
