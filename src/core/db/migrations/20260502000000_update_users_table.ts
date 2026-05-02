import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.dropUnique(["userName"]);
    table.dropColumn("userName");
    table.dropColumn("accessKey");
    table.string("password", 256).notNullable().defaultTo("");
    table.unique(["email"]);
    table.timestamp("lastLoginAt").nullable();
    table.timestamp("updatedAt").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("password");
    table.dropColumn("lastLoginAt");
    table.dropColumn("updatedAt");
    table.dropUnique(["email"]);
    table.string("userName", 128).notNullable().unique();
    table.string("accessKey", 128).notNullable().defaultTo("");
  });
}
