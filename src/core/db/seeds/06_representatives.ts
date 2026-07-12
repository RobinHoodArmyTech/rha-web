import type { Knex } from "knex";

/**
 * Dev seed: 100 representative rows distributed across existing cities.
 * Idempotent: each row is keyed by email <first>.<last>.<n>@seed.rha.test and
 * skipped if that email already exists (so re-running the seed won't duplicate).
 */

const SEED_DOMAIN = "seed.rha.test";

const FIRST = [
  "Aarav","Vivaan","Aditya","Diya","Ananya","Ishaan","Kabir","Meera","Rohan","Saanvi",
  "Arjun","Priya","Nikhil","Riya","Karan","Neha","Aditi","Vikram","Sneha","Rahul",
  "Alice","Bob","Carlos","Diana","Ethan","Fiona","George","Hannah","Isaac","Jasmine",
  "Kevin","Lina","Marcus","Nora","Owen","Paula","Quentin","Rhea","Sam","Tara",
  "Uma","Violet","Will","Xavier","Yara","Zane","Luca","Maya","Noah","Olivia"
];

const LAST = [
  "Sharma","Verma","Patel","Reddy","Nair","Iyer","Gupta","Singh","Das","Bose",
  "Mehta","Rao","Kaur","Khan","Joshi","Gomez","Lopez","Silva","Nguyen","Kim",
  "Brown","Wilson","Johnson","Taylor","Anderson","Thomas","Jackson","White","Hughes","Wright"
];

const DAY_MS = 24 * 60 * 60 * 1000;

export async function seed(knex: Knex): Promise<void> {
  // Ensure we have cities to attach representatives to.
  const cities = await knex("cities").select("id").orderBy("id");
  if (!cities || cities.length === 0) {
    // Nothing to do if no cities exist.
    return;
  }

  // Prepare 100 distinct rows.
  const rows: Record<string, unknown>[] = [];
  for (let i = 0; i < 100; i++) {
    const first = FIRST[i % FIRST.length];
    const last = LAST[i % LAST.length];
    const fullName = `${first} ${last}`;
    // Unique-ish email per seeded row
    const email = `${first.toLowerCase()}.${last.toLowerCase()}.${i}@${SEED_DOMAIN}`;
    // Mobile: make a 10-digit number starting with 9 (pattern used in other seeds)
    const mobileNumber = `9${100000000 + ((i * 37) % 899999999)}`;
    // Distribute evenly across existing cities
    const city = cities[i % cities.length];
    // Spread createdAt across the last ~90 days
    const daysAgo = (i * 3) % 90;
    const createdAt = new Date(Date.now() - daysAgo * DAY_MS);

    rows.push({
      cityId: city.id,
      fullName,
      email,
      mobileNumber,
      createdAt,
      updatedAt: createdAt,
    });
  }

  // Insert idempotently: skip rows whose email already exists
  for (const row of rows) {
    const exists = await knex("city_representatives").where("email", row.email as string).first();
    if (!exists) {
      await knex("city_representatives").insert(row);
    }
  }
}