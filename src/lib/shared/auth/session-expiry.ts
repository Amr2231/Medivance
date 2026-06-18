/**
 * Single source of truth for the "session expires after N ms unless the user
 * checked remember-me" rule. Used by both src/proxy.ts (route-level guard)
 * and src/auth.ts (jwt callback). Keep this the only place that owns the
 * limit — duplicating it risks the middleware and the token callback
 * disagreeing about when a session is expired.
 */
export const SESSION_AGE_LIMIT_MS = 60 * 60 * 1000; // 1 hour

export function isSessionExpiredByAge(token: {
  rememberMe?: unknown;
  loginAt?: unknown;
}): boolean {
  if (token.rememberMe) return false;

  const loginAt = token.loginAt as number | undefined;
  if (!loginAt) return false;

  return Date.now() - loginAt > SESSION_AGE_LIMIT_MS;
}
