import { db } from "@/core/db";

/**
 * Robins — volunteers who authenticate via Google OAuth on the check-in site.
 * Separate from staff `users`: no password, no roles, identified by email.
 */
export interface RobinRow {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getRobinByEmail(email: string): Promise<RobinRow | undefined> {
  return db("robins").where({ email }).first();
}

export async function getRobinById(id: number): Promise<RobinRow | undefined> {
  return db("robins").where({ id }).first();
}

/**
 * Resolve a Google-authenticated Robin to a row, creating it on first sign-in.
 * Matched by email; on return sign-ins we just refresh the avatar + lastLoginAt.
 */
export async function findOrCreateRobin(input: {
  email: string;
  fullName: string;
  avatarUrl: string | null;
}): Promise<RobinRow> {
  const existing = await getRobinByEmail(input.email);
  if (existing) {
    await db("robins").where({ id: existing.id }).update({
      avatarUrl: input.avatarUrl,
      lastLoginAt: db.fn.now(),
      updatedAt: db.fn.now(),
    });
    return (await getRobinById(existing.id))!;
  }

  const [id] = await db("robins").insert({
    fullName: input.fullName,
    email: input.email,
    avatarUrl: input.avatarUrl,
    lastLoginAt: db.fn.now(),
  });
  return (await getRobinById(id))!;
}
