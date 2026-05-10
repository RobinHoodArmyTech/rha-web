import type { Knex } from "knex";
import { hashPassword } from "../../../lib/password";

const DEV_ADMIN_EMAIL = "admin@robinhoodarmy.com";
const DEV_ADMIN_PASSWORD = "admin1234";

export async function seed(knex: Knex): Promise<void> {
  const existing = await knex("users").where({ email: DEV_ADMIN_EMAIL }).first();
  if (existing) return;

  const hashedPassword = await hashPassword(DEV_ADMIN_PASSWORD);

  const [user] = await knex("users")
    .insert({
      fullName: "Dev Admin",
      email: DEV_ADMIN_EMAIL,
      password: hashedPassword,
    })
    .returning("id");

  const sysAdminRole = await knex("roles").where({ roleName: "SysAdmin" }).first();
  if (sysAdminRole) {
    await knex("user_roles").insert({ userId: user.id, roleId: sysAdminRole.id });
  }
}
