import { db } from "@/core/db";

export interface CountryRow {
  id: number;
  countryName: string;
  countryEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getCountryById(id: number): Promise<CountryRow | undefined> {
  return db("countries").where("id", id).first();
}

export async function listCountries(): Promise<CountryRow[]> {
  return db("countries").orderBy("countryName", "asc");
}
