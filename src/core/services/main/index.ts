/**
 * Main domain service stubs.
 * Expand when backend endpoints are ready.
 */
import { api } from "@/core/services/http";

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export async function submitContactForm(payload: ContactPayload): Promise<void> {
  // TODO: POST /api/v1/contact
  return api.post("/contact", payload);
}
