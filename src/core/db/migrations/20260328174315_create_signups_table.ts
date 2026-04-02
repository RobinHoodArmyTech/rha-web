import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("signups", (table) => {
    table.increments("id").primary();
    table.string("fullName", 255).notNullable();
    table.string("email", 255).notNullable();
    table.string("mobileNumber", 20).notNullable();
    table.string("city", 255).notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updatedAt").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("signups");
}
