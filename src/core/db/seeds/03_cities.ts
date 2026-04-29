import type { Knex } from "knex";
import cityData from "./data/cities.json" with {type: "json"};

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

    const city_data =await knex("city_data").where({cityId: exists.id, foodCadetsLink: city.foodCadetsLink}).first();
    if(!city_data){
      await knex("city_data").insert({
        cityId: exists.id,
        foodCadetsLink: city.foodCadetsLink
      })
    }
  }
}
