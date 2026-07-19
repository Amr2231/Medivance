/** Normalize datetime-local or date strings to YYYY-MM-DD for scheduling APIs. */
export function normalizeAppointmentDate(value: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (trimmed.includes("T")) return trimmed.slice(0, 10);
  return trimmed.length >= 10 ? trimmed.slice(0, 10) : trimmed;
}
