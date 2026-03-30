import { z } from "zod";

// ─── Helpers (still exported for direct use in the form) ──────────────────────

function stripToDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function normalizeMobileNumber(value: string) {
  const digits = stripToDigits(value);
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  return digits;
}

export function isValidMobileNumber(value: string) {
  return /^[6-9]\d{9}$/.test(normalizeMobileNumber(value));
}

export function isValidEmailAddress(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());
}

// ─── Zod schema ───────────────────────────────────────────────────────────────

export const SignupSchema = z.object({
  helpType: z.string().min(1, "Please choose how you would like to help."),

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

  // Optional: empty string is fine; if non-empty must be a valid age
  age: z.string().refine((v) => {
    if (!v) return true;
    const n = Number(v);
    return Number.isInteger(n) && n >= 16 && n <= 120;
  }, "Age must be between 16 and 120."),

  // Optional: empty string is fine; if non-empty must be a valid https URL
  facebookProfile: z.string().refine((v) => {
    if (!v) return true;
    try {
      const url = new URL(v);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Enter a valid Facebook profile URL."),

  city: z.string().min(1, "Please select your city."),

  locality: z
    .string()
    .min(1, "Locality is required.")
    .refine((v) => v.trim().length >= 2, "Please enter your locality."),

  thoughts: z.string(),

  agreedToPrinciples: z
    .boolean()
    .refine((v) => v === true, "Please agree to the core principles."),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type SignupValues = z.infer<typeof SignupSchema>;

export type SignupFieldErrors = Partial<Record<keyof SignupValues | "general", string>>;

export type SignupFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors: SignupFieldErrors;
};

export const initialSignupState: SignupFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

// ─── Server-side validation helper ───────────────────────────────────────────

export function validateSignupValues(values: SignupValues): SignupFieldErrors {
  const result = SignupSchema.safeParse(values);
  if (result.success) return {};

  const errors: SignupFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof SignupFieldErrors;
    if (!errors[field]) errors[field] = issue.message;
  }
  return errors;
}
