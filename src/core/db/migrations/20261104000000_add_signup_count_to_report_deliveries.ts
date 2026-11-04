import type { Knex } from "knex";

const TABLE_NAME = "signup_report_deliveries";

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasColumn(TABLE_NAME, "signupCount"))) {
    await knex.schema.alterTable(TABLE_NAME, (table) => {
      table.integer("signupCount").unsigned().nullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasColumn(TABLE_NAME, "signupCount")) {
    await knex.schema.alterTable(TABLE_NAME, (table) => {
      table.dropColumn("signupCount");
    });
  }
}
