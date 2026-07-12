import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("city_representatives", (table) => {
    table.increments("id").primary();
    table.integer("cityId").unsigned().notNullable();
    table.string("fullName", 255).notNullable();
    table.string("email", 255).nullable();
    table.string("mobileNumber", 20).nullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updatedAt").defaultTo(knex.fn.now()).notNullable();

    table.foreign("cityId").references("cities.id").onDelete("CASCADE");
  });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("city_representatives");
}

