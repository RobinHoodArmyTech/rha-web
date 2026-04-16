import type { Knex } from "knex";
import cityData from "./data/cities.json";

export async function seed(knex: Knex): Promise<void> {
  for (const city of cityData) {
    const country = await knex("countries").where({ countryName: city.country }).first();
    if (!country) continue;

    const exists = await knex("cities").where({ cityName: city.cityName, countryId: country.id }).first();
    if (!exists) {
      await knex("cities").insert({
        countryId: country.id,
        cityName: city.cityName,
        cityEmail: city.cityEmail?.trim() || "",
      });
    }
  }
}
