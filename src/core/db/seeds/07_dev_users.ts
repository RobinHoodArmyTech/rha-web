import type { Knex } from "knex";
import { hashPassword } from "../../../lib/password";

interface DevUser {
  fullName: string;
  email: string;
  password: string;
  roleName: string;
}

const DEV_USERS: DevUser[] = [
  {
    fullName: "Dev Founder",
    email: "founder@rha.com",
    password: "founder1234",
    roleName: "Founder",
  },
  {
    fullName: "Dev City Rep",
    email: "cityrep@rha.com",
    password: "cityrep1234",
    roleName: "City_Rep",
  },
  {
    fullName: "Dev Librarian",
    email: "librarian@rha.com",
    password: "librarian1234",
    roleName: "Librarian",
  },
  {
    fullName: "Dev Growth Rep",
    email: "growthrep@rha.com",
    password: "growthrep1234",
    roleName: "Growth_Rep",
  },
];

export async function seed(knex: Knex): Promise<void> {
  for (const user of DEV_USERS) {
    const existing = await knex("users")
      .where({ email: user.email })
      .first();

    if (existing) continue;

    const hashedPassword = await hashPassword(user.password);

    const [userId] = await knex("users").insert({
      fullName: user.fullName,
      email: user.email,
      password: hashedPassword,
    });

    const role = await knex("roles")
      .where({ roleName: user.roleName })
      .first();

    if (role) {
      await knex("user_roles").insert({ userId, roleId: role.id });
    }
  }
}