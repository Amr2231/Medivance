// Utility functions for formatting dates in the doctor dashboard
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = Date.now();
  const diff = now - date.getTime();

  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;

  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year:
      date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

// Formats a date string into a full timestamp format like "12 Mar 2024, 03:45 PM"
export function formatFullTimestamp(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Formats a date string down to just the clock time, e.g. "09:30 AM".
// Used for compact timeline-style schedule views where the date itself
// is already implied by the section (e.g. "Today's Schedule").
export function formatTimeOnly(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
