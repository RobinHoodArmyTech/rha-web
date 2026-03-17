/**
 * DOMAIN SOURCE OF TRUTH
 * All hostname and base-path configuration lives here.
 * Consumed by middleware/domainResolver and anywhere domain logic is needed.
 */
export const DOMAINS = {
  main: {
    hostname: process.env.NEXT_PUBLIC_MAIN_DOMAIN ?? "robinhoodarmy.com",
    basePath: "/sites/main",
  },
  checkin: {
    hostname: process.env.NEXT_PUBLIC_CHECKIN_DOMAIN ?? "checkin.robinhoodarmy.com",
    basePath: "/sites/checkin",
  },
} as const;

export type DomainKey = keyof typeof DOMAINS;
