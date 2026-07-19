import { serverFetch } from "@/lib/shared/api/server-client";

export const receptionFetch = serverFetch;
export const receptionBase = "/api/reception";
export function queryString(
  params: Record<string, string | number | undefined>,
) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const value = search.toString();
  return value ? `?${value}` : "";
}
