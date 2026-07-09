export type SessionStatus = "active" | "expiring_soon" | "expired";

export function getSessionStatus(expiresAt: string): SessionStatus {
  const msLeft = new Date(expiresAt).getTime() - Date.now();
  if (msLeft <= 0) return "expired";
  if (msLeft <= 15 * 60_000) return "expiring_soon"; // <= 15 min left
  return "active";
}

export function formatTimeRemaining(expiresAt: string): string {
  const msLeft = new Date(expiresAt).getTime() - Date.now();
  if (msLeft <= 0) return "Expired";

  const mins = Math.round(msLeft / 60_000);
  if (mins < 60) return `${mins}m remaining`;

  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (hrs < 24) return `${hrs}h ${remMins}m remaining`;

  const days = Math.floor(hrs / 24);
  return `${days}d remaining`;
}
