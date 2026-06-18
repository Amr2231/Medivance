/**
 * Uses an explicit backend expiry when available, otherwise reads the standard
 * `exp` claim from a JWT access token. This claim is used only to schedule a
 * refresh; the backend still verifies the token on every protected request.
 */
export function getAccessTokenExpiry(
  accessToken: string,
  explicitExpiry?: string | number,
): number | undefined {
  if (explicitExpiry !== undefined) {
    const value = typeof explicitExpiry === "number" ? explicitExpiry : Date.parse(explicitExpiry);
    if (Number.isFinite(value)) return value;
  }

  const payload = accessToken.split(".")[1];
  if (!payload) return undefined;
  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(normalized, "base64").toString("utf8");
    const parsed = JSON.parse(json) as { exp?: unknown };
    return typeof parsed.exp === "number" && Number.isFinite(parsed.exp)
      ? parsed.exp * 1_000
      : undefined;
  } catch {
    return undefined;
  }
}
