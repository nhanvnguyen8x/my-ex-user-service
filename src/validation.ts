import { VALID_STATUSES, VALID_ROLES } from './model/user.model';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: unknown): email is string {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim());
}

export function isValidStatus(status: unknown): status is import('./types').UserStatus {
  return typeof status === 'string' && (VALID_STATUSES as readonly string[]).includes(status);
}

export function isValidRole(role: unknown): role is import('./types').UserRole {
  return typeof role === 'string' && (VALID_ROLES as readonly string[]).includes(role);
}

export function sanitizeString(value: unknown, maxLength: number): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  return s.length === 0 ? null : s.slice(0, maxLength);
}
