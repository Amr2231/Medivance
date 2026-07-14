"use server";

import * as dashboardApi from "../api/dashboard.api";

// get the doctor's dashboard data
export async function getDoctorDashboardAction() {
  return dashboardApi.fetchDoctorDashboard();
}

// get the doctor's performance metrics
export async function getDoctorPerformanceAction(period?: string) {
  return dashboardApi.fetchDoctorPerformance(period);
}
