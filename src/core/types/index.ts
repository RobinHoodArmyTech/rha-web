/**
 * Global shared types used across both main and checkin domains.
 * Domain-specific types live in src/domains/<domain>/types/
 */

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  city: string;
  phone?: string;
}
