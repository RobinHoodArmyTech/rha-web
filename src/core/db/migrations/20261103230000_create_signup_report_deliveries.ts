import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("signup_report_deliveries", (table) => {
    table.increments("id").primary();
    table.integer("cityId").unsigned().notNullable();
    table.date("periodStart").notNullable();
    table.date("periodEnd").notNullable();
    table.integer("signupCount").unsigned().nullable();
    table.string("status", 16).notNullable().defaultTo("pending");
    table.integer("attempts").unsigned().notNullable().defaultTo(0);
    table.timestamp("sentAt").nullable();
    table.text("lastError").nullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updatedAt").defaultTo(knex.fn.now()).notNullable();

    table.foreign("cityId").references("cities.id").onDelete("CASCADE");
    table.unique(["cityId", "periodStart", "periodEnd"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("signup_report_deliveries");
}
