import { z } from "zod";

// Plain calendar day (YYYY-MM-DD); the service widens `to` to end-of-day.
const dateField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected a YYYY-MM-DD date.")
  .optional();

// Query params for the admin signups list. `page`/`limit` drive server-side
// pagination.
export const SignupQuerySchema = z.object({
  from: dateField,
  to: dateField,
  q: z.string().trim().max(255).optional(),
  cityId: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type SignupQuery = z.infer<typeof SignupQuerySchema>;

// Query params for the by-city grouping. Shares the date range; the full list
// is returned and paginated client-side (the number of cities is small).
export const SignupByCityQuerySchema = z.object({
  from: dateField,
  to: dateField,
});

export type SignupByCityQuery = z.infer<typeof SignupByCityQuerySchema>;
