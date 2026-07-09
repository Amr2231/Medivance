"use server";

import * as analyticsApi from "../api/analytics.api";

// get heatmap action
export async function getHeatmapAction(
  filters?: Parameters<typeof analyticsApi.fetchHeatmap>[0],
) {
  return analyticsApi.fetchHeatmap(filters);
}

// get file access logs action
export async function getFileAccessLogsAction(
  filters?: Parameters<typeof analyticsApi.fetchFileAccessLogs>[0],
) {
  return analyticsApi.fetchFileAccessLogs(filters);
}

// get geo logins action
export async function getGeoLoginsAction(
  filters?: Parameters<typeof analyticsApi.fetchGeoLogins>[0],
) {
  return analyticsApi.fetchGeoLogins(filters);
}
