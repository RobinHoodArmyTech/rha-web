import { z } from "zod";
import { db } from "@/core/db";
import { CreateCitySchema, PatchCitySchema } from "@/core/validators/cityValidation";

// ---------------------------------------------------------------------------
// Types — internal, for DB query results
// ---------------------------------------------------------------------------

export interface CityWithCountry {
  id: number;
  cityName: string;
  cityEmail: string;
  countryId: number;
  countryName: string;
}

export interface CityDetail extends CityWithCountry {
  cadetWaGroupLink: string | null;
  foodCadetsLink: string | null;
  teachCadetsLink: string | null;
  facebookLink: string | null;
  sharefoodLink: string | null;
  dashboardLink: string | null;
  isFoodCity: boolean;
  isAcademyCity: boolean;
}

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export async function listCities(): Promise<CityWithCountry[]> {
  return db("cities")
    .join("countries", "cities.countryId", "countries.id")
    .select(
      "cities.id",
      "cities.cityName",
      "cities.cityEmail",
      "cities.countryId",
      "countries.countryName",
    )
    .orderBy("countries.countryName", "asc")
    .orderBy("cities.cityName", "asc");
}

export async function getCityById(id: number): Promise<CityDetail | undefined> {
  return db("cities")
    .join("countries", "cities.countryId", "countries.id")
    .leftJoin("city_data", "city_data.cityId", "cities.id")
    .select(
      "cities.id",
      "cities.cityName",
      "cities.cityEmail",
      "cities.countryId",
      "countries.countryName",
      "city_data.cadetWaGroupLink",
      "city_data.foodCadetsLink",
      "city_data.teachCadetsLink",
      "city_data.facebookLink",
      "city_data.sharefoodLink",
      "city_data.dashboardLink",
      "city_data.isFoodCity",
      "city_data.isAcademyCity",
    )
    .where("cities.id", id)
    .first();
}

export async function getCityByName(cityName: string) {
  return db("cities").where("cityName", cityName).first();
}

export async function createCity(
  data: z.infer<typeof CreateCitySchema>,
): Promise<CityDetail> {
  const { cityName, countryId, cityEmail, ...cityData } = data;

  const [city] = await db("cities")
    .insert({ cityName, countryId, cityEmail })
    .returning("*");

  await db("city_data").insert({ cityId: city.id, ...cityData });

  return (await getCityById(city.id))!;
}

export async function patchCity(
  id: number,
  data: z.infer<typeof PatchCitySchema>,
): Promise<CityDetail | undefined> {
  const { cityName, countryId, cityEmail, ...cityData } = data;

  const cityUpdates = Object.fromEntries(
    Object.entries({ cityName, countryId, cityEmail }).filter(
      ([, v]) => v !== undefined,
    ),
  );
  const cityDataUpdates = Object.fromEntries(
    Object.entries(cityData).filter(([, v]) => v !== undefined),
  );

  if (Object.keys(cityUpdates).length > 0) {
    const updated = await db("cities")
      .where("id", id)
      .update({ ...cityUpdates, updatedAt: db.fn.now() });
    if (updated === 0) return undefined;
  } else {
    const exists = await db("cities").where("id", id).first();
    if (!exists) return undefined;
  }

  if (Object.keys(cityDataUpdates).length > 0) {
    await db("city_data")
      .where("cityId", id)
      .update({ ...cityDataUpdates, updatedAt: db.fn.now() });
  }

  return getCityById(id);
}

export async function deleteCity(id: number): Promise<boolean> {
  const deleted = await db("cities").where("id", id).del();
  return deleted > 0;
}
