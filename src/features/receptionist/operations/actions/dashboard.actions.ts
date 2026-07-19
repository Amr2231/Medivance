"use server";
import * as api from "../api/dashboard.api";
export async function fetchDashboard() {
  return api.fetchDashboard();
}
export async function fetchDoctorsAvailability() {
  return api.fetchDoctorsAvailability();
}
