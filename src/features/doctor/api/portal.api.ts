import { serverFetch } from "@/lib/shared/api/server-client";
import type {
  WatchlistResponse,
  CreateFollowUpPayload,
  FollowUpResponse,
} from "@/lib/types/doctor-portal";
import type { MutationResponse } from "@/lib/types/doctor";

// fetch watchlist
export async function fetchWatchlist(): Promise<WatchlistResponse> {
  return serverFetch<WatchlistResponse>("/api/watchlist");
}

// add to watchlist
export async function addToWatchlist(payload: {
  national_id: string;
  note?: string;
  priority?: string;
}): Promise<MutationResponse> {
  return serverFetch<MutationResponse>("/api/watchlist", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// remove from watchlist
export async function removeFromWatchlist(
  nationalId: string,
): Promise<MutationResponse> {
  return serverFetch<MutationResponse>(`/api/watchlist/${nationalId}`, {
    method: "DELETE",
  });
}

// update watchlist
export async function updateWatchlistItem(
  nationalId: string,
  payload: { note?: string; priority?: string },
): Promise<MutationResponse> {
  return serverFetch<MutationResponse>(`/api/watchlist/${nationalId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// fetch followups
export async function fetchFollowUps(
  filter?: string,
): Promise<FollowUpResponse> {
  const qs = filter && filter !== "all" ? `?filter=${filter}` : "";
  return serverFetch<FollowUpResponse>(`/api/followup${qs}`);
}

// create followup
export async function createFollowUp(
  payload: CreateFollowUpPayload,
): Promise<MutationResponse & { reminder_id?: number; due_date?: string }> {
  return serverFetch("/api/followup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// mark followup done
export async function markFollowUpDone(
  reminderId: number,
): Promise<MutationResponse> {
  return serverFetch<MutationResponse>(`/api/followup/${reminderId}/done`, {
    method: "PATCH",
  });
}

// delete followup
export async function deleteFollowUp(
  reminderId: number,
): Promise<MutationResponse> {
  return serverFetch<MutationResponse>(`/api/followup/${reminderId}`, {
    method: "DELETE",
  });
}
