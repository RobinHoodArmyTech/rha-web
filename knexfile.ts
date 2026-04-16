import "dotenv/config";
import type { Knex } from "knex";

const config: Knex.Config = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: "./src/core/db/migrations",
    extension: "ts",
  },
  seeds: {
    directory: "./src/core/db/seeds",
    extension: "ts",
  },
};

export default config;
