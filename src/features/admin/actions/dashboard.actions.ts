"use server";

import * as dashboardApi from "../api/dashboard.api";

// dashboard action to fetch dashboard data
export async function getDashboardAction() {
  return dashboardApi.fetchDashboard();
}
