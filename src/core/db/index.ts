/**
 * Singleton Knex instance — shared across all API handlers.
 * Import `db` anywhere on the backend to run queries.
 *
 * Usage:
 *   import { db } from "@/core/db";
 *   const users = await db("users").where({ id: "123" });
 */
import knex from "knex";
import config from "../../../knexfile";

export const db = knex(config);
