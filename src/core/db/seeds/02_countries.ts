import type { Knex } from "knex";

const countries = [
  { countryName: "India", countryEmail: "robinhoodarmy@gmail.com" },
  { countryName: "Nepal", countryEmail: "robinhoodarmynepal@gmail.com" },
  { countryName: "Bangladesh", countryEmail: "robinhoodarmydhaka@gmail.com" },
  { countryName: "Sri Lanka", countryEmail: "robinhoodarmycolombo@gmail.com" },
  { countryName: "Bahrain", countryEmail: "robinhoodarmybahrain@gmail.com" },
  { countryName: "Malaysia", countryEmail: "robinhoodarmy.kl@gmail.com" },
  { countryName: "Indonesia", countryEmail: "robinhoodarmymedan@gmail.com" },
  { countryName: "Guinea", countryEmail: "robinhoodarmyconakry@gmail.com" },
  { countryName: "Nigeria", countryEmail: "robinhoodarmylagos@gmail.com" },
  { countryName: "Botswana", countryEmail: "robinhoodarmygaborene@gmail.com" },
  { countryName: "Uganda", countryEmail: "robinhoodarmykampala@gmail.com" },
  { countryName: "Zambia", countryEmail: "robinhoodarmylusaka@gmail.com" },
  { countryName: "Egypt", countryEmail: "robinhoodarmycairo@gmail.com" },
];

export async function seed(knex: Knex): Promise<void> {
  for (const country of countries) {
    const exists = await knex("countries").where({ countryName: country.countryName }).first();
    if (!exists) {
      await knex("countries").insert(country);
    }
  }
}
