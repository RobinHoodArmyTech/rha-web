/**
 * Shared constants used across both frontend and backend.
 * For runtime/environment configuration, see domains.ts and other config files.
 * This file is for static values that rarely change.
 */

export const AUTH_COOKIE = "rha-auth-token";

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
