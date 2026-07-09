"use server";

import * as sessionsApi from "../api/sessions.api";

// get active sessions
export async function getActiveSessionsAction(
  filters?: Parameters<typeof sessionsApi.fetchActiveSessions>[0],
) {
  return sessionsApi.fetchActiveSessions(filters);
}

// get session stats
export async function getSessionStatsAction() {
  return sessionsApi.fetchSessionStats();
}

// force logout user
export async function forceLogoutUserAction(userId: number) {
  return sessionsApi.forceLogoutUser(userId);
}

// force logout all
export async function forceLogoutAllAction() {
  return sessionsApi.forceLogoutAll();
}
