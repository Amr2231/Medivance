"use server";

import * as portalApi from "../api/portal.api";
import type { CreateFollowUpPayload } from "@/lib/types/doctor-portal";

// get watchlist
export async function getWatchlistAction() {
  return portalApi.fetchWatchlist();
}

// add to watchlist
export async function addToWatchlistAction(payload: {
  national_id: string;
  note?: string;
  priority?: string;
}) {
  return portalApi.addToWatchlist(payload);
}

// remove from watchlist
export async function removeFromWatchlistAction(nationalId: string) {
  return portalApi.removeFromWatchlist(nationalId);
}

// get followups
export async function getFollowUpsAction(filter?: string) {
  return portalApi.fetchFollowUps(filter);
}

// create followup
export async function createFollowUpAction(payload: CreateFollowUpPayload) {
  return portalApi.createFollowUp(payload);
}

// mark followup done
export async function markFollowUpDoneAction(reminderId: number) {
  return portalApi.markFollowUpDone(reminderId);
}

// delete followup
export async function deleteFollowUpAction(reminderId: number) {
  return portalApi.deleteFollowUp(reminderId);
}
