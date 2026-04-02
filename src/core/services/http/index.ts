/**
 * Base HTTP client — wraps fetch with common headers, error handling,
 * and base URL resolution. Extend per-domain in src/domains/<domain>/services/
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function http<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body != null ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message ?? "Request failed");
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    http<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    http<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    http<T>(path, { ...options, method: "PUT", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    http<T>(path, { ...options, method: "DELETE" }),
};
