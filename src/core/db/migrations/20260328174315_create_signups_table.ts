import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {

  await knex.schema.createTable("countries", (table) => {
    table.increments("id").primary();
    table.string("countryName", 50).notNullable();
    table.string("countryEmail", 255).notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updatedAt").defaultTo(knex.fn.now()).notNullable();
  });

  await knex.schema.createTable("cities", (table) => {
    table.increments("id").primary();
    table.string("countryId", 255).notNullable();
    table.foreign('countryId').references('countries.id').onDelete('CASCADE');
    table.string("cityName", 255).notNullable();
    table.string("cityEmail", 255).notNullable();
    table.string("cadetWaGroupLink", 200).notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updatedAt").defaultTo(knex.fn.now()).notNullable();
  });

  await knex.schema.createTable("signups", (table) => {
    table.increments("id").primary();
    table.string("fullName", 255).notNullable();
    table.string("email", 255).notNullable();
    table.string("mobileNumber", 20).notNullable();
    table.string("city", 255).notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updatedAt").defaultTo(knex.fn.now()).notNullable();
  });

  await knex.schema.createTable("drives", (table) => {
    table.increments("id").primary();
    table.string("cityId", 255).notNullable();
    table.foreign('cityId').references('cities.id');
    table.string("driveLoci", 255).notNullable();
    table.string("driveDesc", 250).notNullable();
    table.string("drivePocName", 50).notNullable();
    table.string("drivePocMobile", 50).notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updatedAt").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("signups");
}
