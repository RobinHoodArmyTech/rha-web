import type { Knex } from "knex";
import { hashPassword } from "../../../lib/password";

const DEV_ADMIN_EMAIL = "admin@robinhoodarmy.com";
const DEV_ADMIN_PASSWORD = "admin1234";

export async function seed(knex: Knex): Promise<void> {
  let user = await knex("users").where({ email: DEV_ADMIN_EMAIL }).first();

  if (!user) {
    const hashedPassword = await hashPassword(DEV_ADMIN_PASSWORD);
    const [userId] = await knex("users").insert({
      fullName: "Dev Admin",
      email: DEV_ADMIN_EMAIL,
      password: hashedPassword,
    });
    user = { id: userId };
  }

  const sysAdminRole = await knex("roles").where({ roleName: "SysAdmin" }).first();
  if (sysAdminRole) {
    const existingRole = await knex("user_roles").where({ userId: user.id, roleId: sysAdminRole.id }).first();
    if (!existingRole) {
      await knex("user_roles").insert({ userId: user.id, roleId: sysAdminRole.id });
    }
  }
}
