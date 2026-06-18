import "server-only";

import { cookies } from "next/headers";
import { decode, encode } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";
import { z } from "zod";
import { getServerApiUrl, getNextAuthSecret } from "@/lib/shared/config/env";
import { isSessionExpiredByAge } from "./session-expiry";
import { getAccessTokenExpiry } from "./access-token-expiry";

const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
const REFRESH_SKEW_MS = 60_000;

export const AUTH_ERROR_CODES = {
  unauthenticated: "AUTH_UNAUTHENTICATED",
  refreshRevoked: "AUTH_REFRESH_REVOKED",
} as const;

export class BackendCredentialError extends Error {
  constructor(public readonly code: (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES]) {
    super("Your session has expired. Please sign in again.");
    this.name = "BackendCredentialError";
  }
}

const refreshResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  accessTokenExpiresAt: z.string().datetime().or(z.number().int().positive()).optional(),
});

function secureCookie() {
  return process.env.NEXTAUTH_URL?.startsWith("https://") || process.env.VERCEL === "1";
}

function sessionCookieName() {
  return secureCookie() ? "__Secure-next-auth.session-token" : "next-auth.session-token";
}

async function clearSession() {
  const store = await cookies();
  store.delete("next-auth.session-token");
  store.delete("__Secure-next-auth.session-token");
}

async function readJwt(): Promise<JWT | null> {
  const store = await cookies();
  const raw = store.get(sessionCookieName())?.value;
  if (!raw) return null;
  return decode({ token: raw, secret: getNextAuthSecret() }) as Promise<JWT | null>;
}

async function persistJwt(token: JWT) {
  const value = await encode({ token, secret: getNextAuthSecret(), maxAge: SESSION_MAX_AGE_SECONDS });
  const store = await cookies();
  store.set(sessionCookieName(), value, {
    httpOnly: true, sameSite: "lax", secure: secureCookie(), path: "/", maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/** Server-only bridge; credentials never enter the serialized NextAuth session. */
export async function getBackendAccessToken(): Promise<string> {
  let token: JWT | null;
  try {
    token = await readJwt();
  } catch {
    await clearSession();
    throw new BackendCredentialError(AUTH_ERROR_CODES.unauthenticated);
  }

  if (!token?.accessToken || !token.refreshToken || isSessionExpiredByAge(token)) {
    await clearSession();
    throw new BackendCredentialError(AUTH_ERROR_CODES.unauthenticated);
  }

  const expiresAt = Number(token.accessTokenExpiresAt);
  if (Number.isFinite(expiresAt) && Date.now() + REFRESH_SKEW_MS < expiresAt) return token.accessToken;

  try {
    const response = await fetch(`${getServerApiUrl()}/auth/refresh-token`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }), cache: "no-store",
    });
    const payload = refreshResponseSchema.safeParse(await response.json().catch(() => null));
    if (!response.ok || !payload.success) throw new Error("Refresh rejected");
    token.accessToken = payload.data.accessToken;
    token.refreshToken = payload.data.refreshToken;
    const accessTokenExpiresAt = getAccessTokenExpiry(payload.data.accessToken, payload.data.accessTokenExpiresAt);
    if (!accessTokenExpiresAt) throw new Error("Refresh response has no usable access-token expiry");
    token.accessTokenExpiresAt = accessTokenExpiresAt;
    token.error = undefined;
    await persistJwt(token);
    return token.accessToken;
  } catch {
    await clearSession();
    throw new BackendCredentialError(AUTH_ERROR_CODES.refreshRevoked);
  }
}
