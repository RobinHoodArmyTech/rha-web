import type { Knex } from "knex";

const roles = ["SysAdmin", "Founder", "Librarian", "Growth_Rep", "City_Rep"];

export async function seed(knex: Knex): Promise<void> {
  for (const roleName of roles) {
    const exists = await knex("roles").where({ roleName }).first();
    if (!exists) {
      await knex("roles").insert({ roleName });
    }
  }
}
