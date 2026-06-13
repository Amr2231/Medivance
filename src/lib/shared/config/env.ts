/**
 * Centralized environment access for deployment.
 * Import from here instead of reading process.env directly in features.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/** Server-side API base URL */
export function getServerApiUrl(): string {
  return (
    process.env.API ??
    process.env.NEXT_PUBLIC_API ??
    "http://localhost:3001"
  );
}

/** Client-safe API base URL */
export function getPublicApiUrl(): string {
  return process.env.NEXT_PUBLIC_API ?? "http://localhost:3001";
}

export const env = {
  serverApiUrl: getServerApiUrl(),
  publicApiUrl: getPublicApiUrl(),
  nextAuthUrl: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
} as const;

/** Call from server-only code (e.g. auth config) */
export function getNextAuthSecret(): string {
  return required("NEXTAUTH_SECRET", process.env.NEXTAUTH_SECRET);
}
