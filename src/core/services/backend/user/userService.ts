import { db } from "@/core/db";

export interface UserRow {
  id: number;
  userName: string;
  fullName: string;
  email: string;
  accessKey: string;
  cityId: number | null;
  createdAt: Date;
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
