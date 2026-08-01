import { z } from "zod";
import { CHECKIN_FEED_MAX_LIMIT, TOP_ROBINS_DEFAULT_LIMIT } from "@/core/services/backend/checkin/cityCheckinService";

/** Query params for GET /api/v1/checkin/city/[cityName]/checkins */
export const CityFeedQuerySchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(CHECKIN_FEED_MAX_LIMIT, { message: `limit must be between 1 and ${CHECKIN_FEED_MAX_LIMIT}.` })
    .optional(),
});
export type CityFeedQuery = z.infer<typeof CityFeedQuerySchema>;

/** Query params for GET /api/v1/checkin/city/[cityName]/top-robins */
export const TopRobinsQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(TOP_ROBINS_DEFAULT_LIMIT, { message: `limit must be between 1 and ${TOP_ROBINS_DEFAULT_LIMIT}.` })
    .optional(),
});
export type TopRobinsQuery = z.infer<typeof TopRobinsQuerySchema>;
