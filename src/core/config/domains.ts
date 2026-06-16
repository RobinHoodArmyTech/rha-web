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
  admin: {
    hostname: process.env.NEXT_PUBLIC_ADMIN_DOMAIN ?? "admin.robinhoodarmy.com",
    basePath: "/sites/admin",
  },
} as const;

export type DomainKey = keyof typeof DOMAINS;
