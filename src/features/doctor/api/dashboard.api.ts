import { serverFetch } from "@/lib/shared/api/server-client";
import type {
  DoctorDashboardResponse,
  DoctorPerformanceResponse,
} from "@/lib/types/doctor-portal";

// API function to fetch the doctor's dashboard data from the server
export async function fetchDoctorDashboard(): Promise<DoctorDashboardResponse> {
  return serverFetch<DoctorDashboardResponse>("/api/dashboard");
}

// API function to fetch the doctor's performance metrics for a given period from the server
export async function fetchDoctorPerformance(
  period?: string,
): Promise<DoctorPerformanceResponse> {
  const qs = period ? `?period=${encodeURIComponent(period)}` : "";
  return serverFetch<DoctorPerformanceResponse>(
    `/api/dashboard/performance${qs}`,
  );
}
