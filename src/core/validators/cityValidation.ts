import { z } from "zod";

export const CreateCitySchema = z.object({
  cityName: z
    .string()
    .min(1, "City name is required.")
    .max(255, "City name must be under 255 characters."),
  countryId: z.number({ message: "Country is required." }).int().positive(),
  cityEmail: z.email({ message: "Enter a valid email address." }),
  cadetWaGroupLink: z.string().max(256).optional(),
  foodCadetsLink: z.string().max(256).optional(),
  teachCadetsLink: z.string().max(256).optional(),
  facebookLink: z.string().max(256).optional(),
  sharefoodLink: z.string().max(256).optional(),
  dashboardLink: z.string().max(256).optional(),
  isFoodCity: z.boolean().optional(),
  isAcademyCity: z.boolean().optional(),
});

export const PatchCitySchema = z.object({
  cityName: z.string().min(1).max(255).optional(),
  countryId: z.number().int().positive().optional(),
  cityEmail: z.email({ message: "Enter a valid email address." }).optional(),
  cadetWaGroupLink: z.string().max(256).optional(),
  foodCadetsLink: z.string().max(256).optional(),
  teachCadetsLink: z.string().max(256).optional(),
  facebookLink: z.string().max(256).optional(),
  sharefoodLink: z.string().max(256).optional(),
  dashboardLink: z.string().max(256).optional(),
  isFoodCity: z.boolean().optional(),
  isAcademyCity: z.boolean().optional(),
});

export const DeleteCitySchema = z.object({
  id: z.number({ message: "City ID is required." }).int().positive(),
});
