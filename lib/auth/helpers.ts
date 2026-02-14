/**
 * Auth helper functions for username-based authentication
 * Converts username to email format for Supabase compatibility
 */

const DOMAIN = '@mashaail.school';

/**
 * Convert username to email format for Supabase
 * Example: "admin" -> "admin@mashaail.school"
 */
export function usernameToEmail(username: string): string {
  return `${username.toLowerCase().trim()}${DOMAIN}`;
}

/**
 * Extract username from email format
 * Example: "admin@mashaail.school" -> "admin"
 */
export function emailToUsername(email: string): string {
  return email.replace(DOMAIN, '');
}

/**
 * Validate username format
 * Rules: 3-20 chars, alphanumeric and underscore only, starts with letter
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
  return usernameRegex.test(username);
}
