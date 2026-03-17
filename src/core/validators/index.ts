/**
 * Shared validation utilities used across domains.
 */

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s\-()]{8,15}$/.test(phone);
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 8;
}
