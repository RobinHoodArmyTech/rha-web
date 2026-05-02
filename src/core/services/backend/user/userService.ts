import { db } from "@/core/db";

export interface UserRow {
  id: number;
  fullName: string;
  email: string;
  password: string;
  cityId: number | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRoleRow {
  id: number;
  userId: number;
  roleId: number;
  createdAt: Date;
}

export async function getUserByEmail(email: string): Promise<UserRow | undefined> {
  return db("users").where({ email }).first();
}

export async function getUserRoleByUserId(userId: number): Promise<UserRoleRow | undefined> {
  return db("user_roles").where({ userId }).first();
}

export async function updateLastLogin(userId: number): Promise<void> {
  await db("users").where({ id: userId }).update({ lastLoginAt: db.fn.now() });
}
