import { z } from "zod";

function stripToDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function normalizeMobileNumber(value: string) {
  const digits = stripToDigits(value);
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  return digits;
}

function isValidMobileNumber(value: string) {
  return /^[6-9]\d{9}$/.test(normalizeMobileNumber(value));
}

function isValidEmailAddress(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());
}

export const JoinUsSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required.")
    .refine((v) => v.trim().length >= 2, "Your name must have at least two characters."),

  mobileNumber: z
    .string()
    .min(1, "Mobile number is required.")
    .refine((v) => isValidMobileNumber(v), "Enter a valid 10-digit Indian mobile number."),

  email: z
    .string()
    .min(1, "Email address is required.")
    .refine((v) => isValidEmailAddress(v), "Enter a valid email address (e.g. you@example.com)."),

  city: z.string().min(1, "Please select your city."),
});

export type JoinUsValues = z.infer<typeof JoinUsSchema>;

export type JoinUsFieldErrors = Partial<Record<keyof JoinUsValues, string>>;
