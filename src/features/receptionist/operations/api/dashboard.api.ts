import type {
  ApiResponse,
  DashboardData,
  DoctorAvailability,
} from "@/lib/types/receptionist-operations";
import { receptionBase, receptionFetch } from "./client";
export const fetchDashboard = () =>
  receptionFetch<ApiResponse<DashboardData>>(`${receptionBase}/dashboard`);
export const fetchDoctorsAvailability = () =>
  receptionFetch<ApiResponse<DoctorAvailability[]>>(
    `${receptionBase}/doctors/availability`,
  );
