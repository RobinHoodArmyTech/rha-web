/**
 * Shared constants used across both frontend and backend.
 * For runtime/environment configuration, see domains.ts and other config files.
 * This file is for static values that rarely change.
 */

/** Staff (admin panel) session cookie — email/password login. */
export const AUTH_COOKIE = "rha-auth-token";

/**
 * Robin (volunteer) session cookie — Google OAuth login on the check-in site.
 * Separate from AUTH_COOKIE so a staff member can hold both sessions at once
 * (admin panel in one tab, check-in in another). Robins are a wholly separate
 * population from staff `users` — see the `robins` table.
 */
export const ROBIN_AUTH_COOKIE = "rha-robin-token";

export enum Role {
  SysAdmin = "SysAdmin",
  Founder = "Founder",
  Librarian = "Librarian",
  GrowthRep = "Growth_Rep",
  CityRep = "City_Rep",
}

/**
 * Full-access platform admins (e.g. they manage the city master list, UI + APIs).
 * Single source of truth for admin-level authorization — reuse instead of inlining
 * [Role.SysAdmin, Role.Founder].
 */
export const ADMIN_ROLES: Role[] = [Role.SysAdmin, Role.Founder];
