/**
 * Auth service — cross-domain authentication logic.
 * Replace stubs with real implementation when backend is ready.
 */

export async function signIn(_email: string, _password: string): Promise<void> {
  // TODO: POST /api/v1/auth/login
  throw new Error("Not implemented");
}

export async function signUp(_payload: {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  password: string;
}): Promise<void> {
  // TODO: POST /api/v1/auth/register
  throw new Error("Not implemented");
}

export async function signOut(): Promise<void> {
  // TODO: DELETE /api/v1/auth/session
  throw new Error("Not implemented");
}

export function getAuthToken(): string | null {
  if (typeof document === "undefined") return null;
  return document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("rha-auth-token="))
    ?.split("=")[1] ?? null;
}
