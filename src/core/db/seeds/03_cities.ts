import type { Knex } from "knex";
import cityData from "./data/cities.json" with {type: "json"};

export async function seed(knex: Knex): Promise<void> {
  for (const city of cityData) {
    const country = await knex("countries").where({ countryName: city.country }).first();
    if (!country) continue;

    let cityRow = await knex("cities").where({ cityName: city.cityName, countryId: country.id }).first();
    if (!cityRow) {
      const [id] = await knex("cities").insert({
        countryId: country.id,
        cityName: city.cityName,
        cityEmail: city.cityEmail?.trim() || "",
      });
      cityRow = { id };
    }

    const cityDataExists = await knex("city_data").where({ cityId: cityRow.id }).first();
    if (!cityDataExists) {
      await knex("city_data").insert({
        cityId: cityRow.id,
        foodCadetsLink: city.foodCadetsLink,
      });
    }
  }
}
