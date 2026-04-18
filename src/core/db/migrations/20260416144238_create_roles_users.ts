import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("roles", (table) => {
    table.increments("id").primary();
    table.string("roleName", 128).notNullable().unique();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
  });

  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("userName", 128).notNullable().unique();
    table.string("fullName", 128).notNullable();
    table.string("email", 128).notNullable();
    table.string("accessKey", 128).notNullable();
    table.integer("cityId").unsigned().nullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();

    // Foreign keys
    table.foreign("cityId").references("cities.id");
  });

  await knex.schema.createTable("user_roles", (table) => {
    table.increments("id").primary();
    table.integer("userId").unsigned().notNullable();
    table.integer("roleId").unsigned().notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();

    // Unique constraint — one role per user
    table.unique(["userId", "roleId"]);

    // Foreign keys
    table.foreign("userId").references("users.id").onDelete("CASCADE");
    table.foreign("roleId").references("roles.id").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("user_roles");
  await knex.schema.dropTable("users");
  await knex.schema.dropTable("roles");
}
