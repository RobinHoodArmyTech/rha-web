import type { Knex } from "knex";

/**
 * Dev-only dummy signups so the admin Signups page shows realistic stats,
 * per-city breakdowns and date-range filtering.
 *
 * Idempotent: rows are tagged with the SEED_DOMAIN email suffix and skipped
 * if already present, so this never duplicates or touches real signups.
 */
const SEED_DOMAIN = "seed.rha.test";

const FIRST = [
  "Aarav", "Vivaan", "Aditya", "Diya", "Ananya", "Ishaan", "Kabir", "Meera",
  "Rohan", "Saanvi", "Arjun", "Priya", "Nikhil", "Riya", "Karan", "Neha",
  "Aditi", "Vikram", "Sneha", "Rahul",
];
const LAST = [
  "Sharma", "Verma", "Patel", "Reddy", "Nair", "Iyer", "Gupta", "Singh",
  "Das", "Bose", "Mehta", "Rao", "Kaur", "Khan", "Joshi",
];

const DAY_MS = 24 * 60 * 60 * 1000;

export async function seed(knex: Knex): Promise<void> {
  const already = await knex("signups").where("email", "like", `%@${SEED_DOMAIN}`).first();
  if (already) return; // already seeded — keep this idempotent

  const cities = await knex("cities").select("id").orderBy("id");
  if (cities.length === 0) return;

  const now = Date.now();
  const rows: Record<string, unknown>[] = [];
  let n = 0;

  cities.forEach((city, ci) => {
    // Vary volume per city (5–25) so the "by city" breakdown looks interesting.
    const count = 5 + ((ci * 7) % 21);
    for (let i = 0; i < count; i++) {
      const first = FIRST[n % FIRST.length];
      const last = LAST[(n * 3) % LAST.length];
      // Spread signups across the last ~5 months for date-range filtering.
      const daysAgo = (n * 13) % 150;
      const createdAt = new Date(now - daysAgo * DAY_MS);
      const mobile = `9${100000000 + ((n * 37) % 899999999)}`;

      rows.push({
        fullName: `${first} ${last}`,
        email: `${first}.${last}.${n}@${SEED_DOMAIN}`.toLowerCase(),
        mobileNumber: mobile,
        age: 16 + ((n * 5) % 30),
        cityId: city.id,
        createdAt,
        updatedAt: createdAt,
      });
      n++;
    }
  });

  await knex("signups").insert(rows);
}
