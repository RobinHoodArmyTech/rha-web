import type { Knex } from "knex";

/**
 * Robins are volunteers who log in via Google OAuth on the check-in site. They
 * are a wholly separate population from staff `users` (no password, no roles) —
 * so they get their own table. A check-in is attributed to a Robin via
 * `checkins.robinId` (repointed here from the old, always-null `userId`).
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("robins", (table) => {
    table.increments("id").primary();
    table.string("fullName", 128).notNullable();
    table.string("email", 128).notNullable().unique();
    table.string("avatarUrl", 512).nullable();
    table.timestamp("lastLoginAt").nullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updatedAt").defaultTo(knex.fn.now()).notNullable();
  });

  // Re-attribute check-ins from staff users to robins. All existing check-ins
  // are anonymous (userId null), so no rows are orphaned by the FK swap.
  await knex.schema.alterTable("checkins", (table) => {
    table.dropForeign(["userId"]);
    table.renameColumn("userId", "robinId");
  });
  await knex.schema.alterTable("checkins", (table) => {
    table.foreign("robinId").references("robins.id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("checkins", (table) => {
    table.dropForeign(["robinId"]);
    table.renameColumn("robinId", "userId");
  });
  await knex.schema.alterTable("checkins", (table) => {
    table.foreign("userId").references("users.id");
  });

  await knex.schema.dropTableIfExists("robins");
}
