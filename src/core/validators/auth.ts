import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  accessKey: z.string().min(1, "Access key is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
