import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("signups", (table) => {
    table.integer("age").unsigned().nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("signups", (table) => {
    table.dropColumn("age");
  });
}
