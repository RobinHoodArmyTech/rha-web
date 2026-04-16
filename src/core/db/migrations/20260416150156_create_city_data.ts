import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("cityData", (table) => {
    table.increments("id").primary();
    table.integer("cityId").unsigned().notNullable().unique();
    table.string("foodCadetsLink", 256).nullable();
    table.string("teachCadetsLink", 256).nullable();
    table.string("facebookLink", 256).nullable();
    table.string("sharefoodLink", 256).nullable();
    table.string("dashboardLink", 256).nullable();
    table.boolean("isFoodCity").notNullable().defaultTo(false);
    table.boolean("isAcademyCity").notNullable().defaultTo(false);
    table.boolean("isDeleted").notNullable().defaultTo(false);
    table.integer("academyZoneId").unsigned().nullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updatedAt").defaultTo(knex.fn.now()).notNullable();

    // Foreign keys
    table.foreign("cityId").references("cities.id").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("cityData");
}
