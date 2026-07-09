import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("checkins", (table) => {
    table.increments("id").primary();
    // Nullable for now — public submissions have no account. Populated once
    // Robin logins land.
    table.integer("userId").unsigned().nullable();
    table.integer("cityId").unsigned().notNullable();
    table.integer("peopleServed").unsigned().notNullable().defaultTo(0);
    table.integer("studentsTaught").unsigned().notNullable().defaultTo(0);
    table.string("photoUrl", 512).notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updatedAt").defaultTo(knex.fn.now()).notNullable();
    table.foreign("cityId").references("cities.id");
    table.foreign("userId").references("users.id");
    table.index("createdAt");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("checkins");
}
